
/**
 * FIGMA GLASS, MADE PORTABLE — shared by every import of Figma glass artwork:
 * the glass icon set (scripts/build-glass-icons.ts), the built-in graphics
 * (scripts/build-graphics.ts), and graphics uploaded to the Marketing Assets
 * site. Pure string work, so it runs in Node and in the browser alike.
 *
 * See `portableBackdropBlur` and `normaliseFigmaSvg` for what is fixed.
 */

import { invert, isIdentity, matrixString, multiply, parseTransform } from './svgMatrix.ts';

export interface GlassOptions {
  /**
   * Also treat as glass any group straight after Figma's `foreignObject`
   * blur, whatever its filter is called. The icon set's glass is always a
   * `_dii_` group (drop shadow and two inner shadows); larger graphics carry
   * glass with only inner shadows (`_i_`, `_ii_`), which this catches. Off
   * for the icon set, whose output must not move.
   */
  anyBlurredGroup?: boolean;
  /**
   * Leave a `BACKDROP_SLOT` inside each glass shape, under its blurred
   * artwork, where the renderer puts a blurred copy of the ILLUSTRATION
   * behind the graphic — the part a self-contained SVG cannot reach. Off for
   * the icon set, whose output must not move.
   */
  backdropSlot?: boolean;
}

/** Where a graphic's glass takes the page behind it. See `GlassOptions.backdropSlot`. */
export const BACKDROP_SLOT = '<g data-backdrop=""/>';

export interface Processed {
  viewBox: [number, number, number, number];
  body: string;
}

/**
 * Round a number to what a 64px icon can show: two decimals above 10, three
 * above 1, four significant figures below — small values are gradient
 * matrix terms, where two decimals would flatten them to zero.
 */
export function trim(n: string): string {
  const v = Number(n);
  if (!Number.isFinite(v)) return n;
  const a = Math.abs(v);
  const r = a >= 10 ? v.toFixed(2) : a >= 1 ? v.toFixed(3) : v.toPrecision(4);
  return String(Number(r));
}

/**
 * Every glass shape's background blur: Figma's 6. Figma's value is twice the
 * blur radius — its own export writes a background blur of 6 as CSS
 * `blur(3px)` — so 6 is a 3px Gaussian here, the `stdDeviation` CSS and SVG
 * share. The exports carry 4 on most icons and odd values on a few; the
 * glass is meant to be one material, so they are all set to this.
 */
const FIGMA_BG_BLUR = 6;
const GLASS_BACKDROP_BLUR = FIGMA_BG_BLUR / 2;

/* ---- a minimal SVG tree, for the two fixes that need structure ---------- */

interface XNode {
  /** Raw opening tag, e.g. `<g filter="url(#f)">`; empty for text. */
  open: string;
  tag: string;
  children: XNode[];
  selfClosing: boolean;
  text?: string;
}

/** Parse Figma's well-formed export: tags, attributes, no CDATA. */
function parse(src: string): XNode {
  const root: XNode = { open: '', tag: '#root', children: [], selfClosing: false };
  const stack = [root];
  for (const m of src.matchAll(/<!--[\s\S]*?-->|<\/?[a-zA-Z][^>]*>|[^<]+/g)) {
    const t = m[0];
    const top = stack[stack.length - 1];
    if (t.startsWith('<!--')) continue;
    if (t.startsWith('</')) {
      stack.pop();
      continue;
    }
    if (!t.startsWith('<')) {
      top.children.push({ open: '', tag: '#text', children: [], selfClosing: false, text: t });
      continue;
    }
    const tag = t.match(/^<([a-zA-Z][\w:-]*)/)![1];
    const node: XNode = { open: t, tag, children: [], selfClosing: t.endsWith('/>') };
    top.children.push(node);
    if (!node.selfClosing) stack.push(node);
  }
  return root;
}

function serialise(n: XNode): string {
  if (n.tag === '#text') return n.text ?? '';
  if (n.tag === '#root') return n.children.map(serialise).join('');
  if (n.selfClosing) return n.open;
  return `${n.open}${n.children.map(serialise).join('')}</${n.tag}>`;
}

const attr = (n: XNode, name: string) => n.open.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];

/**
 * MASKED FILLS, UNMASKED.
 *
 * Figma exports a filled icon as a square of paint — the back icon's
 * gradient, the glass's tint — masked to the icon's outline: a `<mask>` of
 * the shapes, and a group drawing one `<rect>` through it. It draws right,
 * but every export carries the mask, and anything that reads the SVG (Figma
 * itself, an editor) gets a mask group round a rectangle instead of the
 * icon. So each such pair becomes what it means: the mask's shapes, painted
 * with the rect's fill.
 *
 * Only where that is exact: the rect covers the mask's whole region (so
 * nothing the mask let through is lost), the mask's shapes are opaque (an
 * alpha mask's any colour; a luminance mask's white), and each shape's own
 * transform can be read — a gradient is then given that transform inverted,
 * so it lies across the shapes where it lay across the square. Anything
 * else keeps its mask.
 */
export function unmaskFills(svg: string): string {
  const root = parse(svg);
  const byId = new Map<string, XNode>();
  const index = (node: XNode) => {
    const id = attr(node, 'id');
    if (id) byId.set(id, node);
    node.children.forEach(index);
  };
  index(root);
  const SHAPES = ['path', 'rect', 'circle', 'ellipse', 'polygon', 'polyline'];
  const num = (node: XNode, name: string) => Number(attr(node, name) ?? NaN);
  const newDefs: string[] = [];
  const unmasked = new Set<string>();
  let copies = 0;

  /** The shapes a mask is made of, if it is one this can undo. */
  const shapesOf = (mask: XNode): XNode[] | null => {
    const kids = mask.children.filter((c) => c.tag !== '#text');
    if (!kids.length || !kids.every((c) => SHAPES.includes(c.tag) && c.selfClosing)) return null;
    const alpha = /mask-type:\s*alpha/.test(attr(mask, 'style') ?? '');
    const opaque = kids.every((c) => {
      if (/\s(?:opacity|fill-opacity|stroke-opacity|mask|filter|clip-path)="/.test(c.open)) return false;
      const fill = (attr(c, 'fill') ?? 'black').toLowerCase();
      const stroke = attr(c, 'stroke');
      if (stroke && stroke !== 'none') return false;
      return alpha ? fill !== 'none' : fill === 'white' || fill === '#fff' || fill === '#ffffff';
    });
    return opaque ? kids : null;
  };

  /** The paint as each shape takes it: the colour as it is, a gradient carried into the shape's own space. */
  const paintFor = (fill: string, shape: XNode): string | null => {
    const ref = fill.match(/^url\(#([^)]+)\)$/)?.[1];
    if (!ref) return fill;
    const t = parseTransform(attr(shape, 'transform'));
    if (!t) return null;
    if (isIdentity(t)) return fill;
    const grad = byId.get(ref);
    const inv = invert(t);
    if (!grad || !inv || !/Gradient$/.test(grad.tag) || attr(grad, 'gradientUnits') !== 'userSpaceOnUse') return null;
    const g0 = parseTransform(attr(grad, 'gradientTransform'));
    if (!g0) return null;
    const id = `${ref}-u${copies++}`;
    const open = grad.open
      .replace(/\sid="[^"]*"/, ` id="${id}"`)
      .replace(/\sgradientTransform="[^"]*"/, '')
      .replace(/^<(\w+)/, `<$1 gradientTransform="${matrixString(multiply(inv, g0))}"`);
    newDefs.push(serialise({ ...grad, open }));
    return `url(#${id})`;
  };

  const visit = (node: XNode) => {
    node.children.forEach(visit);
    if (node.tag !== 'g') return;
    const maskId = attr(node, 'mask')?.match(/^url\(#([^)]+)\)$/)?.[1];
    const mask = maskId ? byId.get(maskId) : undefined;
    const painted = node.children.filter((c) => c.tag !== '#text');
    if (!mask || painted.length !== 1 || painted[0].tag !== 'rect' || !painted[0].selfClosing) return;
    const rect = painted[0];
    const [rx, ry, rw, rh] = ['x', 'y', 'width', 'height'].map((k) => num(rect, k) || 0);
    const [mx, my, mw, mh] = ['x', 'y', 'width', 'height'].map((k) => num(mask, k));
    if (attr(mask, 'maskUnits') !== 'userSpaceOnUse' || [mx, my, mw, mh].some(Number.isNaN)) return;
    if (attr(rect, 'transform') || attr(rect, 'rx') || rx > mx || ry > my || rx + rw < mx + mw || ry + rh < my + mh) return;
    const shapes = shapesOf(mask);
    const fill = attr(rect, 'fill');
    if (!shapes || !fill || fill === 'none') return;
    const extra = ['fill-opacity', 'opacity'].map((k) => (attr(rect, k) ? ` ${k}="${attr(rect, k)}"` : '')).join('');
    const out: XNode[] = [];
    for (const sh of shapes) {
      const paint = paintFor(fill, sh);
      if (!paint) return; // one shape it cannot carry the paint into: leave the whole mask be
      const open = sh.open
        .replace(/\s(?:fill|style|id)="[^"]*"/g, '')
        .replace(/^<([\w:-]+)/, `<$1 fill="${paint}"${extra}`);
      out.push({ ...sh, open });
    }
    node.open = node.open.replace(/\smask="[^"]*"/, '');
    node.children = out;
    unmasked.add(maskId!);
  };
  visit(root);

  // A mask nothing uses any more goes, wherever it was defined.
  const prune = (node: XNode) => {
    node.children = node.children.filter((c) => !(c.tag === 'mask' && unmasked.has(attr(c, 'id') ?? '') && !stillUsed(attr(c, 'id')!)));
    node.children.forEach(prune);
  };
  let out = serialise(root);
  const stillUsed = (id: string) => out.includes(`url(#${id})`);
  prune(root);
  out = serialise(root);
  if (newDefs.length) {
    out = out.includes('<defs>') ? out.replace('<defs>', `<defs>${newDefs.join('')}`) : out.replace(/(<svg[^>]*>)/, `$1<defs>${newDefs.join('')}</defs>`);
  }
  return out;
}

/**
 * BACKGROUND BLUR, made portable.
 *
 * A glass shape's background blur means: inside the shape, whatever is
 * behind it is seen blurred — and ONLY blurred. Figma exports it as a
 * `<foreignObject>` carrying CSS `backdrop-filter`, which only a browser
 * renders; for some glass (notably masked shapes) it exports nothing at all.
 *
 * Both become the same plain-SVG construction, for every glass shape — a
 * group carrying Figma's glass effect (drop shadow and two inner shadows,
 * which it names `_dii_`):
 *
 *   1. everything drawn before the glass is wrapped in a mask that cuts the
 *      glass's outline OUT of it, so the sharp artwork is gone from under the
 *      glass — without this, a blurred copy laid on top lets the sharp
 *      original show through wherever the blur thins, at every edge, and the
 *      glass reads as clear;
 *   2. the same artwork is re-drawn by reference under an feGaussianBlur and
 *      confined to the glass's outline — its mask when it is masked, the
 *      foreignObject's clip when Figma exported one, otherwise its shapes;
 *   3. then the glass itself.
 *
 * Glass after glass composes: a later shape's cut and blur take in the
 * earlier ones. The page behind an icon is not reachable from inside an SVG,
 * so what blurs is the icon's own artwork, which is what sits behind its
 * glass.
 */
export function portableBackdropBlur(svg: string, opts: GlassOptions = {}): string {
  const root = parse(svg);
  const defs: string[] = [];
  const clipFixes: string[] = [];
  let n = 0;

  // Every node by id, for finding a foreignObject's clip path.
  const byId = new Map<string, XNode>();
  const index = (node: XNode) => {
    const id = attr(node, 'id');
    if (id) byId.set(id, node);
    node.children.forEach(index);
  };
  index(root);

  const isPainted = (c: XNode) => !['#text', 'defs', 'clipPath', 'filter', 'foreignObject', 'mask'].includes(c.tag);
  const SHAPES = ['path', 'rect', 'circle', 'ellipse', 'polygon', 'polyline', 'line'];
  const ensureId = (node: XNode, base: string) => {
    let id = attr(node, 'id');
    if (!id) {
      id = base;
      node.open = node.open.replace(/^<([\w:-]+)/, `<$1 id="${id}"`);
    }
    return id;
  };
  const text = (t: string): XNode => ({ open: '', tag: '#text', children: [], selfClosing: false, text: t });
  const group = (openAttrs: string, children: XNode[]): XNode => ({ open: `<g ${openAttrs}>`, tag: 'g', selfClosing: false, children });

  /** The glass outline as black shapes, for cutting it out of a mask. */
  const blackCopies = (shapes: XNode[]) =>
    shapes
      .map((sh) =>
        serialise(sh)
          .replace(/\s(?:fill|fill-opacity|opacity|style|id)="[^"]*"/g, '')
          .replace(/^<([\w:-]+)/, '<$1 fill="black"'),
      )
      .join('');

  /** The glass's outline: its shape nodes, and how to confine a layer to it. */
  const outlineOf = (glass: XNode, foClip?: string): { shapes: XNode[]; confine: string } | null => {
    if (foClip) {
      const cp = byId.get(foClip);
      if (cp) return { shapes: cp.children.filter((c) => SHAPES.includes(c.tag)), confine: `clip-path="url(#${foClip})"` };
    }
    const kids = glass.children.filter((c) => c.tag !== '#text');
    const mask = kids.find((c) => c.tag === 'mask');
    if (mask && attr(mask, 'id')) {
      return { shapes: mask.children.filter((c) => SHAPES.includes(c.tag)), confine: `mask="url(#${attr(mask, 'id')})"` };
    }
    let shapes = kids.filter((c) => SHAPES.includes(c.tag));
    // Some icons wrap the glass one group deeper — Figma's blur and the glass
    // shape inside an outer drop-shadow group — so the outline is found in
    // the groups within, not beside the blur. Without this their glass was a
    // thin tint over a sharp gradient: no frost, the back icon swamping it.
    if (!shapes.length) {
      const nested = (node: XNode): XNode[] =>
        node.children.flatMap((c) =>
          SHAPES.includes(c.tag) ? [c] : c.tag === 'g' ? nested(c) : [],
        );
      shapes = nested(glass);
    }
    if (!shapes.length) return null;
    const clipId = `bdclip${n}`;
    const refs = shapes.map((sh, k) => `<use href="#${ensureId(sh, `bdshape${n}-${k}`)}"/>`).join('');
    defs.push(`<clipPath id="${clipId}">${refs}</clipPath>`);
    return { shapes, confine: `clip-path="url(#${clipId})"` };
  };

  const visit = (parent: XNode) => {
    const out: XNode[] = [];
    let pendingClip: string | undefined;
    for (const child of parent.children) {
      if (child.tag === 'foreignObject') {
        // Figma's exported blur: keep only its clip, for the glass that follows.
        const style = child.children.find((c) => c.tag === 'div')?.open ?? '';
        pendingClip = style.match(/clip-path:url\(#([^)]+)\)/)?.[1];
        continue;
      }
      // A group holding Figma's blur itself is glass whatever its filter is
      // called — some icons wrap blur and glass in a `_d` group over `_ii`.
      const wrapsBlur = child.tag === 'g' && child.children.some((c) => c.tag === 'foreignObject');
      visit(child);
      // …unless the glass inside it was rebuilt already, which would frost twice.
      const rebuiltWithin = (node: XNode): boolean =>
        /mask="url\(#bdcut/.test(node.open) || node.children.some(rebuiltWithin);
      const isGlass =
        child.tag === 'g' &&
        (/_dii/.test(attr(child, 'filter') ?? '') ||
          (wrapsBlur && !rebuiltWithin(child)) ||
          (!!opts.anyBlurredGroup && !!pendingClip && !!attr(child, 'filter')));
      if (!isGlass) {
        if (child.tag !== '#text') pendingClip = undefined;
        out.push(child);
        continue;
      }
      const behind = out.filter(isPainted);
      const outline = behind.length ? outlineOf(child, pendingClip) : null;
      if (pendingClip) clipFixes.push(pendingClip);
      pendingClip = undefined;
      if (!outline || !outline.shapes.length) {
        out.push(child);
        continue;
      }
      const k = n++;
      // 1. The glass's outline cut out of what is behind it.
      const inv = `bdcut${k}`;
      defs.push(
        `<mask id="${inv}" maskUnits="userSpaceOnUse" x="-200" y="-200" width="600" height="600">` +
          `<rect x="-200" y="-200" width="600" height="600" fill="white"/>${blackCopies(outline.shapes)}</mask>`,
      );
      // 2. What is behind it, blurred, inside the outline.
      const blur = `bdblur${k}`;
      defs.push(
        `<filter id="${blur}" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="sRGB">` +
          `<feGaussianBlur stdDeviation="${GLASS_BACKDROP_BLUR}"/></filter>`,
      );
      const refs = behind.map((b, j) => `<use href="#${ensureId(b, `bdsrc${k}-${j}`)}"/>`).join('');
      const rest = out.splice(0, out.length);
      out.push(
        group(`mask="url(#${inv})"`, rest),
        group(outline.confine, [
          text(`${opts.backdropSlot ? BACKDROP_SLOT : ''}<g filter="url(#${blur})">${refs}</g>`),
        ]),
        child,
      );
    }
    parent.children = out;
  };
  visit(root);

  let out = serialise(root);
  // A foreignObject's clip was drawn in the foreignObject's own coordinates —
  // Figma offsets it with a translate(-x -y). Used from the SVG's space, that
  // offset goes.
  for (const clip of clipFixes) {
    out = out.replace(new RegExp(`(<clipPath id="${clip}")\\s+transform="[^"]*"`), '$1');
  }
  if (defs.length) {
    out = out.includes('<defs>')
      ? out.replace('<defs>', `<defs>${defs.join('')}`)
      : out.replace(/(<svg[^>]*>)/, `$1<defs>${defs.join('')}</defs>`);
  }
  return out;
}

/**
 * BACKGROUND BLUR, given back to Figma — `portableBackdropBlur` undone, for
 * an export pasted into Figma (see `RenderOptions.figma` in src/render.ts).
 *
 * Figma turns the portable construction into masks: the cut round what is
 * behind the glass, and the clip round its blurred copy, each a mask group.
 * But the glass group itself still carries Figma's own marker,
 * `data-figma-bg-blur-radius`, which is all Figma's import needs to give it
 * a real background blur. So the cut is unwrapped — what it held is drawn
 * as it was — and the blurred copy (a group whose only content is a
 * filtered group of `<use>`s, and the backdrop slot) is dropped. Masks that
 * belong to the artwork itself, the back glyph cut from its gradient, stay.
 */
export function figmaNativeGlass(body: string): string {
  const root = parse(`<g>${body}</g>`);
  const painted = (n: XNode) => n.children.filter((c) => c.tag !== '#text');
  const cuts = new Set<string>();
  const findCuts = (n: XNode) => {
    if (n.tag === 'mask') {
      const first = painted(n)[0];
      if (first?.tag === 'rect' && attr(first, 'x') === '-200' && attr(first, 'fill') === 'white') cuts.add(attr(n, 'id') ?? '');
    }
    n.children.forEach(findCuts);
  };
  findCuts(root);
  const isBlurredCopy = (n: XNode) =>
    n.tag === 'g' &&
    painted(n).length > 0 &&
    painted(n).every(
      (c) =>
        (c.tag === 'g' && attr(c, 'data-backdrop') !== undefined) ||
        (c.tag === 'g' && !!attr(c, 'filter') && painted(c).length > 0 && painted(c).every((u) => u.tag === 'use')),
    );
  const visit = (n: XNode) => {
    const out: XNode[] = [];
    // The group after a blurred copy is the glass it was frosting. Some
    // icons' exports lost Figma's marker; without it the glass would land in
    // Figma clear, so it gets the one blur every glass shape has.
    let glassNext = false;
    for (const c of n.children) {
      if (c.tag === 'mask' && cuts.has(attr(c, 'id') ?? '')) continue;
      const m = c.tag === 'g' ? attr(c, 'mask')?.match(/^url\(#(.+)\)$/)?.[1] : undefined;
      if (m && cuts.has(m)) {
        visit(c);
        out.push(...c.children);
        continue;
      }
      if (isBlurredCopy(c)) {
        glassNext = true;
        continue;
      }
      if (glassNext && c.tag === 'g') {
        glassNext = false;
        if (attr(c, 'data-figma-bg-blur-radius') === undefined) {
          c.open = c.open.replace(/^<g/, `<g data-figma-bg-blur-radius="${FIGMA_BG_BLUR}"`);
        }
      }
      visit(c);
      out.push(c);
    }
    n.children = out;
  };
  visit(root);
  const g = root.children[0];
  return dropUnused(g.children.map(serialise).join(''));
}

/**
 * The clip paths and filters nothing refers to any more — the blurred
 * copy's, once `figmaNativeGlass` has dropped it — so a file opened in Figma
 * or an editor carries only what it draws.
 */
function dropUnused(s: string): string {
  let out = s;
  for (const [whole, id] of s.matchAll(/<(?:clipPath|filter) id="([^"]+)"[\s\S]*?<\/(?:clipPath|filter)>/g)) {
    const esc = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (!new RegExp(`url\\(#${esc}\\)`).test(out)) out = out.replace(whole, '');
  }
  return out.replace(/<defs><\/defs>/g, '');
}

/**
 * A glass icon as a file to hand over — a download, a zip. The site keeps
 * glass in its portable form, where the gradient icon behind is masked so
 * the glass's outline is cut out of it and a blurred copy shows instead. In
 * a file that is a mask round the gradient, which Figma and any editor show
 * as a mask group. So the gradient icon is given back as its own shapes,
 * filled with its gradient, and the glass keeps Figma's background blur.
 * Anything not in the portable form comes back as it was.
 */
export function glassIconFile(svg: string): string {
  const open = svg.match(/^\s*<svg[^>]*>/)?.[0];
  if (!open || !/<mask[^>]*>\s*<rect x="-200"/.test(svg)) return svg;
  const body = svg.slice(open.length).replace(/<\/svg>\s*$/, '');
  return `${open}${figmaNativeGlass(body)}</svg>`;
}

/**
 * The frame clip, removed where it cuts artwork. Figma exports each icon
 * inside a `clip-path` the size of its frame, and 28 icons draw past it —
 * a coin, a handle, a pin, cut flat. Those have a measured viewBox in
 * `viewboxes.json` that holds the whole artwork; for them the frame clip (a
 * clipPath holding a single frame-sized rect) is dropped. Other icons keep
 * theirs.
 */
export function unclipFrame(svg: string): string {
  const frames = [...svg.matchAll(/<clipPath id="([^"]+)"[^>]*>\s*<rect([^>]*)\/>\s*<\/clipPath>/g)]
    .filter((m) => {
      const w = Number(m[2].match(/width="([\d.]+)"/)?.[1] ?? 0);
      const h = Number(m[2].match(/height="([\d.]+)"/)?.[1] ?? 0);
      return w >= 56 && h >= 56;
    })
    .map((m) => m[1]);
  let s = svg;
  for (const id of frames) {
    const esc = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    s = s.replace(new RegExp(`\\sclip-path="url\\(#${esc}\\)"`, 'g'), '');
    s = s.replace(new RegExp(`<clipPath id="${esc}"[^>]*>[\\s\\S]*?<\\/clipPath>`), '');
  }
  return s;
}

export function normaliseFigmaSvg(
  svg: string,
  ns: string,
  fix?: { viewBox?: [number, number, number, number] },
  opts: GlassOptions = {},
): Processed {
  let s = svg;

  // 0. Masked fills — a square of paint seen through the icon's outline — drawn as the outline itself.
  s = unmaskFills(s);

  // 1. The background blur, rebuilt portably; then anything left of the hack.
  s = portableBackdropBlur(s, opts);
  s = s.replace(/<foreignObject[\s\S]*?<\/foreignObject>/g, '');
  if (fix?.viewBox) s = unclipFrame(s);

  const vbMatch = s.match(/viewBox="([^"]+)"/);
  const viewBox = fix?.viewBox ??
    ((vbMatch ? vbMatch[1].trim().split(/\s+/).map(Number) : [0, 0, 64, 64]) as [number, number, number, number]);

  // 2. Keep only the inner markup.
  s = s.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');

  // 3. Namespace every id, and every reference to one. Collect first so a
  //    reference is never rewritten before its definition is known.
  const ids = [...new Set([...s.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]))];
  ids.forEach((id, i) => {
    const next = `__NS__${ns}${i}`;
    const esc = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    s = s.replace(new RegExp(`(\\sid=")${esc}(")`, 'g'), `$1${next}$2`);
    s = s.replace(new RegExp(`url\\(#${esc}\\)`, 'g'), `url(#${next})`);
    s = s.replace(new RegExp(`((?:xlink:)?href=")#${esc}(")`, 'g'), `$1#${next}$2`);
  });

  // `shape-rendering="crispEdges"` is a Figma export artifact that makes
  // scaled-down artwork look chewed; the icons are always scaled here.
  s = s.replace(/\s*shape-rendering="crispEdges"/g, '');

  // The glass edge stays as Figma draws it: a full-white inner shadow. It was
  // once dimmed to 0.45, when the backdrop blur could not survive export and
  // a bare white rim read as an outline; with the blur rebuilt above, the rim
  // reads as glass catching light, as in the Figma files.

  // Size: long decimals rounded, whitespace between tags dropped.
  s = s.replace(/-?\d*\.\d{4,}(?:e-?\d+)?/g, trim);
  s = s.replace(/>\s+</g, '><');

  return { viewBox, body: s.trim() };
}

