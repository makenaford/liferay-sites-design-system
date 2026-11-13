# Vendored from liferay-illustration-system

`figmaGlass.ts` and `svgMatrix.ts` are copied unchanged from `src/` in
[makenaford/liferay-illustration-system](https://github.com/makenaford/liferay-illustration-system), the
source of the Marketing Assets library. `build-glass-icons.mjs` uses them so every glass icon's background
blur is rebuilt exactly as the library renders it. `pnpm glass-icons:sync` refreshes them with the icons,
and `--check` fails when they drift.
