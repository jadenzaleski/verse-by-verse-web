# Verse by Verse — website

Landing and privacy pages for the [Verse by Verse](https://github.com/jadenzaleski) iOS app.
Plain HTML with Tailwind CSS and daisyUI. No templating, no framework, no router.

Whatever is on `master` is live.

## Develop

Requires Node 22.

```sh
npm install          # once
npm run dev          # watches src/input.css -> dist/style.css
```

In a second terminal, serve the folder and open <http://localhost:8000>:

```sh
python3 -m http.server 8000
```

Then edit the `.html` files directly and refresh. `npm run dev` must be running,
or the compiled CSS will be stale — Tailwind only emits the classes it can see
in the HTML, so a class you just typed does not exist until it rebuilds.

Opening `index.html` straight from Finder works too — every path is relative —
but the server matches how the site is actually served.

## Layout

```
index.html          landing page (contact lives in the footer, at #contact)
privacy.html        privacy policy
src/input.css       accent palettes, theme tokens, the few custom classes
js/main.js          appearance menu, scroll reveal, footer year
assets/             app icon, App Store badges
dist/style.css      compiled — gitignored, built in CI
```

The landing page is deliberately short: hero, three features, one look at a
graded recitation, a closing call to action. It exists to get someone to the
App Store, so anything that reads as documentation belongs in the app or in
the policy page, not here.

## Styling

Style with Tailwind utility classes in the HTML. Reach for `src/input.css` only
for theme tokens and for the few things utilities cannot express.

The tokens at the top of `src/input.css` mirror the iOS app's design system, so
the two stay in step:

| Site token | From the app |
| --- | --- |
| `--font-sans` (Montserrat) | `Font.app()` |
| `--font-serif` | `Font.bible()` — used for scripture only |
| `--color-brand-green`, `--color-brand-violet` | the icon gradient in `logo.icon/icon.json` |
| `--radius-selector` / `-field` / `-box` | `AppRadius.sm` / `.md` / `.lg` |

daisyUI supplies `btn`, `card` and `menu`. `.btn-outlined` is the app's
`OutlinedButtonStyle` ported over, and `.btn-outlined-invert` is the same
button reversed for the dark closing band.

## Appearance

Two independent choices, both restored before first paint by a small inline
script in each page's `<head>`, and both persisted in `localStorage`:

| Attribute on `<html>` | Stored as | Values |
| --- | --- | --- |
| `data-theme` | `theme-mode` | `vbv` / `vbv-dark`, chosen from system, light, or dark |
| `data-accent` | `theme-accent` | one of the seven palettes at the top of `src/input.css` |

`theme-mode` is stored separately from `data-theme` because "system" is a third
state the attribute cannot express.

The accents are named after the app's `MeshTheme` cases, so the site and the
app use one vocabulary. Each palette declares four raw values and nothing
else — an accent and its gradient partner, in a light and a dark version — and
the rest of the stylesheet only ever reads `--brand` and `--brand-alt`. That is
what lets a color choice and a light/dark choice compose without either knowing
about the other.

Two things to keep in mind when adding a palette:

- The accent is used for text, so it needs 4.5:1 against `--color-paper` in its
  light version and against the dark `--color-paper` in its dark one. The `-alt`
  value is decorative and has no such bar.
- The selector must stay a bare `[data-accent="…"]`. Those same rules scope a
  palette to one swatch button in the picker, which is how each swatch paints
  itself. Anything below the palettes that touches `--brand-*` on a plain
  `:root` will override every accent at once.

## Deploy

Pushing to `master` triggers `.github/workflows/deploy.yml`, which installs
dependencies, runs `npm run build`, copies the site into `_site/`, and publishes
it to GitHub Pages. There is nothing to run locally to deploy, and `dist/` is
deliberately not committed — CI rebuilds it every time.

**If you add a new top-level file or folder, add it to the "Assemble site" step
in that workflow.** It copies an explicit list, so anything not named there is
silently missing from the published site.

To watch a deploy, or to re-run one without pushing, use the Actions tab
(the workflow also accepts a manual `workflow_dispatch` run).

## TODO

- **Open Graph image.** `og:image` in `index.html` currently points at
  `assets/app-logo.png`, the square app icon, which crops oddly in a link
  preview. A purpose-built 1200x630 card would be better.