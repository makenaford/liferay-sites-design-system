# media/

Mockup footage — the webms that play inside hero and section media slots.

**Everything in this folder except this file is git-ignored.** A single 1200×800 alpha webm runs to
15MB, and a library that accumulates one per mockup would put hundreds of megabytes into every clone,
permanently: git keeps every version of a binary it has ever seen, so a file committed once is a file
carried forever, even after it is deleted.

## How it works

Storybook serves this folder at `/media` (`staticDirs` in `.storybook/main.ts`). Files are copied into
the build as-is — they never go through the bundler — and are referenced by **URL**, not by `import`:

```ts
import { mediaUrl } from '../templates/media'

media: { src: mediaUrl('hero-animation.webm'), alt: '' }
```

That indirection is the point. A missing file costs a 404 and an empty media slot, rather than a build
that will not compile — which matters when the files are deliberately absent from a fresh clone.

## Getting the files

They are not in the repo, so a fresh clone has an empty `media/`. Drop the webms in by hand, or point
the build at wherever they are actually hosted:

```sh
VITE_MEDIA_BASE=https://cdn.example.com/liferay-media pnpm build-storybook
```

`VITE_MEDIA_BASE` defaults to `/media`, so local development needs no configuration.

**The deployed Storybook has no footage unless one of those two things happens.** CI builds from a
clean checkout, so unless `VITE_MEDIA_BASE` points somewhere real, every media slot on the deployed
site is empty. That is a deliberate trade: an empty slot on a demo site is cheaper than a repo nobody
can clone.

## Compressing

Export what the design tool gives you, then bring it down before using it. This is what the hero
animation was put through — **14.76MB to 2.10MB, SSIM 0.995** at the same 1200×800, 30fps and 28.5s:

```sh
ffmpeg -c:v libvpx-vp9 -i in.webm \
  -c:v libvpx-vp9 -pix_fmt yuva420p -crf 33 -b:v 0 -row-mt 1 -cpu-used 2 -an \
  out.webm
```

Every flag there is load-bearing:

| Flag | Why |
| --- | --- |
| `-c:v libvpx-vp9` **before `-i`** | Forces the libvpx *decoder*. The native VP9 decoder does not expose the alpha plane, and without this the transparency is silently dropped — the output looks fine until it is over a background |
| `-pix_fmt yuva420p` | The `a` is the alpha. `yuv420p` encodes happily and throws it away |
| `-crf 33 -b:v 0` | Constant quality. CRF 40 gives 1.41MB at SSIM 0.992, which is also fine — 33 was chosen because this clip is full of small UI text, where artefacts show first |
| `-an` | These autoplay muted, so an audio track is bytes nobody will ever hear |

**Check the alpha survived, do not assume it.** ffmpeg writes `ALPHA_MODE=1` into the container even
when the pixels are opaque, so the tag proves nothing:

```sh
ffprobe -v error -show_streams -of default=noprint_wrappers=1 out.webm | grep -i alpha
```

The reliable test is to draw a frame to a canvas and read a corner pixel's alpha — it should be `0`.

## What does not belong here

`assets/` is for things that are part of the **design system** — the bubble animations, the glass icon
set, the product screenshots the Figma file itself supplies. Those are small, versioned deliberately,
and imported through the bundler so a missing one breaks the build, which is what you want for a
dependency. This folder is for page *content*, which is heavy, changes often, and is nobody's
dependency.
