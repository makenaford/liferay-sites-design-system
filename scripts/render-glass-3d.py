"""
Renders one extracted glass silhouette as a raytraced 3D icon.

Run through Blender, never as plain Python:

    blender --background --python scripts/render-glass-3d.py -- <silhouette.svg> <out.png>

Input is a file from `export-glass-silhouettes.mjs` — flat paths, two flat fills, no filters. The two
fills are labels rather than colours: `#0B5FFF` is the opaque backplate, `#70A1FF` the glass. All the
actual shading happens here.

## The rig is the deliverable

For a *set*, the scene matters more than any one icon. Camera, lights, materials and depth are all
fixed constants below, and every icon is dropped into the identical rig — which is what stops 165
icons looking like 165 unrelated icons. Nothing here is derived per icon except the normalising
scale, so an icon cannot drift in framing, thickness, or where its highlight sits.

The key stays upper-left, matching the SVG pipeline in `build-3d-glass-icons.mjs`, so the two sets
agree about where the light is coming from.

## Why the world is lit even though the background is transparent

Glass has no colour of its own — it only shows what is around it. `film_transparent` makes camera
rays that miss the geometry transparent, but refraction rays still sample the world, so the world
has to stay lit or the glass renders near-black on an empty background.
"""

import sys
import math

import bpy
from mathutils import Euler, Vector

# ------------------------------------------------------------------ look ----

EXTRUDE = 0.085          # Half-depth, in normalised units where the icon spans 2.0.
BEVEL = 0.011            # Chamfer radius. This is the edge that catches the key light.
                         # Kept small deliberately: the chamfer eats into the silhouette from every
                         # side at once, and at 0.02 it rounded the points clean off `General/ai`'s
                         # sparkle and turned it into a blob.
NORMALISED_SPAN = 2.0

GLASS_TINT = (0.62, 0.80, 1.0, 1.0)
GLASS_ROUGHNESS = 0.045
GLASS_IOR = 1.45
GLASS_DISPERSION = 0.03  # A touch. More reads as a diamond advert, not an icon.

SOLID_COLOR = (0.043, 0.37, 1.0, 1.0)
SOLID_ROUGHNESS = 0.26

# Gap between the backplate and the glass in front of it, in normalised units. The source artwork is
# flat, so both land on z=0 and interpenetrate — which renders as a speckled seam of z-fighting right
# where the two shapes overlap. Separating them is also what lets the glass actually refract the
# solid behind it, which is the whole point of rendering rather than compositing.
STAGGER = 0.23

CAMERA_DISTANCE = 5.8

SAMPLES = 128
RESOLUTION = 1024


def socket(node, names, value):
    """Set the first input that exists, since Principled renamed several between versions."""
    for name in names:
        if name in node.inputs:
            node.inputs[name].default_value = value
            return True
    return False


def aim(obj, target=Vector((0.0, 0.0, 0.0))):
    obj.rotation_euler = (target - obj.location).to_track_quat("-Z", "Y").to_euler()


def import_svg(path):
    """
    Import the silhouette, whichever importer this build has.

    `hasattr(bpy.ops.wm, "svg_import")` is not a usable test: `bpy.ops` resolves lazily, so the
    attribute exists for any plausible name and only fails at call time. The operators are therefore
    attempted rather than probed, and the SVG importer is enabled first because a factory-reset,
    background Blender does not necessarily have it loaded.
    """
    try:
        bpy.ops.preferences.addon_enable(module="io_curve_svg")
    except Exception:  # noqa: BLE001 - already enabled, or built in on this version
        pass

    errors = []
    for call in (
        lambda: bpy.ops.import_curve.svg(filepath=path),
        lambda: bpy.ops.wm.svg_import(filepath=path),
    ):
        try:
            call()
            break
        except Exception as exc:  # noqa: BLE001
            errors.append(str(exc))
    else:
        raise SystemExit(f"[render-glass-3d] no usable SVG importer: {' / '.join(errors)}")

    return [o for o in bpy.context.scene.objects if o.type == "CURVE"]


def is_glass(obj):
    """Classify by the flat fill the extractor wrote, not by any name the importer invents."""
    for slot in obj.material_slots:
        if not slot.material:
            continue
        r, g, b = slot.material.diffuse_color[:3]
        # #0B5FFF is far more saturated in red-vs-blue terms than #70A1FF.
        if r < 0.12 and g < 0.35:
            return False
    return True


def normalise(curves):
    """
    Centre the artwork on the origin and scale it to a fixed span, so framing never drifts.

    Bounds come from the spline control points rather than `Object.bound_box`. Straight after an
    import the bound box has not been evaluated and every one of its eight corners is the same
    point — measuring it yields a zero span, which silently collapses the scale and puts the camera
    inside the geometry. Control points are already correct at this stage and need no depsgraph.

    Returns the scale, which the caller needs: the icons are scaled by a parent, so anything measured
    in normalised units has to be divided by it to survive the trip back down to curve-local space.
    """
    lo = Vector((1e9, 1e9, 1e9))
    hi = Vector((-1e9, -1e9, -1e9))
    for obj in curves:
        for spline in obj.data.splines:
            points = (
                [p.co for p in spline.bezier_points]
                if spline.type == "BEZIER"
                else [p.co.to_3d() for p in spline.points]
            )
            for co in points:
                world = obj.matrix_world @ Vector(co[:3])
                lo = Vector(map(min, lo, world))
                hi = Vector(map(max, hi, world))

    centre = (lo + hi) / 2.0
    span = max(hi.x - lo.x, hi.y - lo.y)
    if span <= 0:
        raise SystemExit("[render-glass-3d] artwork has no extent — nothing to frame")
    scale = NORMALISED_SPAN / span

    pivot = bpy.data.objects.new("pivot", None)
    bpy.context.scene.collection.objects.link(pivot)
    for obj in curves:
        obj.parent = pivot
    pivot.scale = (scale, scale, scale)
    pivot.location = -centre * scale
    return scale


def solidify(curves, scale):
    """
    Give the flat curves thickness and a chamfered edge.

    `extrude` and `bevel_depth` are curve-local, and the icons are scaled by a parent — so the
    normalised constants have to be divided back down by that scale, or the depth is multiplied by it
    and a 2-unit icon ends up tens of units deep.
    """
    for obj in curves:
        data = obj.data
        data.dimensions = "2D"
        data.fill_mode = "BOTH"
        data.extrude = EXTRUDE / scale
        data.bevel_depth = BEVEL / scale
        data.bevel_resolution = 4
        data.resolution_u = 12


def glass_material():
    mat = bpy.data.materials.new("IconGlass")
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    socket(bsdf, ["Base Color"], GLASS_TINT)
    socket(bsdf, ["Roughness"], GLASS_ROUGHNESS)
    socket(bsdf, ["IOR"], GLASS_IOR)
    socket(bsdf, ["Transmission Weight", "Transmission"], 1.0)
    socket(bsdf, ["Dispersion"], GLASS_DISPERSION)
    return mat


def solid_material():
    mat = bpy.data.materials.new("IconSolid")
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    socket(bsdf, ["Base Color"], SOLID_COLOR)
    socket(bsdf, ["Roughness"], SOLID_ROUGHNESS)
    socket(bsdf, ["Coat Weight", "Clearcoat"], 0.35)
    return mat


def assign(curves, scale):
    """Material per element, and pull the glass in front of the backplate so the two do not intersect."""
    glass, solid = glass_material(), solid_material()
    for obj in curves:
        front = is_glass(obj)
        obj.data.materials.clear()
        obj.data.materials.append(glass if front else solid)
        # `location` is in the pivot's space, which the normalising scale already multiplies.
        obj.location.z = (STAGGER if front else -STAGGER) / scale


def build_rig():
    scene = bpy.context.scene

    # Three large soft panels. Glass shows the shape of its lights, so they are broad, not point-like.
    #
    # The SVG lands in the X-Y plane facing +Z, so "in front of the icon" is +Z and "up" is +Y. Key
    # sits upper-left and in front, matching the fixed light direction the SVG pipeline uses; rim
    # goes behind, which for transmissive material is what puts light *through* the solid.
    for name, location, size, energy in (
        ("key", (-3.4, 2.8, 4.6), 7.0, 420.0),
        ("fill", (3.6, -1.6, 3.2), 9.0, 90.0),
        ("rim", (1.4, 2.2, -3.4), 5.0, 240.0),
    ):
        light = bpy.data.lights.new(name, type="AREA")
        light.size = size
        light.energy = energy
        obj = bpy.data.objects.new(name, light)
        obj.location = location
        scene.collection.objects.link(obj)
        aim(obj)

    world = bpy.data.worlds.new("studio")
    world.use_nodes = True
    bg = world.node_tree.nodes["Background"]
    bg.inputs["Color"].default_value = (0.86, 0.90, 0.96, 1.0)
    bg.inputs["Strength"].default_value = 0.65
    scene.world = world

    camera_data = bpy.data.cameras.new("camera")
    camera_data.lens = 85  # Long, so the icon is barely foreshortened.
    camera = bpy.data.objects.new("camera", camera_data)

    # The camera's orientation is set explicitly and its position derived from it — deliberately not
    # via `aim()`.
    #
    # `to_track_quat` has to choose a roll, and for a direction that is almost exactly -Z (which a
    # head-on icon camera is, by definition) that choice is unstable: it silently landed on a
    # 180-degree roll, which transposed every icon's composition corner to corner. It looked exactly
    # like the glass and solid materials had been swapped, and cost a detour to prove they had not.
    #
    # Tilting down-and-left puts the viewer above and to the left, which is where the key light is,
    # so the extruded edge shows along the lower-right — the same read as the SVG pipeline.
    tilt = Euler((-math.radians(7.0), -math.radians(6.0), 0.0), "XYZ")
    camera.rotation_euler = tilt
    camera.location = tilt.to_matrix() @ Vector((0.0, 0.0, CAMERA_DISTANCE))
    scene.collection.objects.link(camera)
    scene.camera = camera


def configure_render(out_path):
    scene = bpy.context.scene
    scene.render.engine = "CYCLES"
    scene.cycles.samples = SAMPLES
    scene.cycles.use_denoising = True
    # Glass needs the light to survive several surfaces; the defaults clip it and go grey.
    scene.cycles.max_bounces = 16
    scene.cycles.transmission_bounces = 16
    scene.cycles.transparent_max_bounces = 16

    try:
        prefs = bpy.context.preferences.addons["cycles"].preferences
        prefs.compute_device_type = "METAL"
        prefs.get_devices()
        for device in prefs.devices:
            device.use = True
        scene.cycles.device = "GPU"
    except Exception as exc:  # noqa: BLE001 - a CPU render is a fine fallback, not a failure
        print(f"[render-glass-3d] GPU unavailable, using CPU: {exc}")

    # AgX, the default since 4.0, is built for photographic latitude and rolls saturated colour
    # heavily toward grey — it turns the brand blue into a dull slate. Icons want the colour that was
    # specified, so the view transform is Standard and the exposure is carried by the lights instead.
    scene.view_settings.view_transform = "Standard"

    scene.render.resolution_x = RESOLUTION
    scene.render.resolution_y = RESOLUTION
    scene.render.film_transparent = True
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.render.filepath = out_path


def main():
    argv = sys.argv[sys.argv.index("--") + 1 :]
    svg_path, out_path = argv[0], argv[1]

    bpy.ops.wm.read_factory_settings(use_empty=True)

    curves = import_svg(svg_path)
    if not curves:
        raise SystemExit(f"[render-glass-3d] no curves imported from {svg_path}")
    print(f"[render-glass-3d] {len(curves)} curves from {svg_path}")

    scale = normalise(curves)
    solidify(curves, scale)
    assign(curves, scale)
    build_rig()
    configure_render(out_path)

    bpy.ops.render.render(write_still=True)
    print(f"[render-glass-3d] wrote {out_path}")


main()
