# media/

The pressure valve for footage too big to commit. **Git-ignored.**

Most page assets — images, and video once compressed — live in `assets/` and **are** committed. That is
deliberate: the deployed Storybook is what the designers use as a reference, so it has to render on
every branch and every preview with no configuration. External hosting would be one more thing that
can be misconfigured or forgotten, and when it breaks every page looks broken.

This folder is for the exceptions: a raw export you are still iterating on, or footage that will not
come down to a sensible size. `pnpm assets:check` fails the build at **4MB per file** in `assets/`, and
this is where anything over that goes instead.

## How it works

Storybook serves this folder at `/media` (`staticDirs` in `.storybook/main.ts`). Files are copied into
the build as-is — they never go through the bundler — and are referenced by **URL**:

```ts
import { mediaUrl } from '../templates/media'

media: { src: mediaUrl('some-raw-export.webm'), poster: still, alt: '' }
```

A missing file costs a 404 and falls back to `poster`, rather than a build that will not compile —
which matters because a fresh clone has an empty `media/` by definition.

`VITE_MEDIA_BASE` points the base at real hosting for a deployed build; it defaults to `/media`.

## Compressing

Do this *before* reaching for this folder — most things do not need it. The hero animation went
**14.76MB to 2.10MB, SSIM 0.995**, at the same 1200×800, 30fps and 28.5s, and now lives in `assets/`
like everything else:

```sh
ffmpeg -c:v libvpx-vp9 -i in.webm \
  -c:v libvpx-vp9 -pix_fmt yuva420p -crf 33 -b:v 0 -row-mt 1 -cpu-used 2 -an \
  out.webm
```

Every flag is load-bearing:

| Flag | Why |
| --- | --- |
| `-c:v libvpx-vp9` **before `-i`** | Forces the libvpx *decoder*. The native VP9 decoder does not expose the alpha plane, and without this the transparency is silently dropped — the output looks fine until it is over a background |
| `-pix_fmt yuva420p` | The `a` is the alpha. `yuv420p` encodes happily and throws it away |
| `-crf 33 -b:v 0` | Constant quality. CRF 40 gives 1.41MB at SSIM 0.992, also fine — 33 was chosen because this clip is full of small UI text, where artefacts show first |
| `-an` | These autoplay muted, so an audio track is bytes nobody will ever hear |

**Check the alpha survived, do not assume it.** ffmpeg writes `ALPHA_MODE=1` into the container even
when the pixels are opaque, so the tag proves nothing. Draw a frame to a canvas and read a corner
pixel's alpha — it should be `0`.

## The line, in one sentence

`assets/` is everything the deployed Storybook needs to render, committed and under 4MB a file;
`media/` is what will not fit that rule.
