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
index.html          landing page (contact section at #contact)
privacy.html        privacy policy
src/input.css       theme tokens + the handful of custom classes
js/main.js          mobile nav toggle + footer year
assets/             app icon, App Store badge
dist/style.css      compiled — gitignored, built in CI
```

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

daisyUI supplies `btn` and the FAQ `collapse`. `.btn-outlined` is the app's
`OutlinedButtonStyle` ported over.

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

## One-time setup

Not done yet:

1. **Settings → Pages → Source: GitHub Actions.** Without this the workflow
   builds but cannot publish.
2. **Custom domain.** Add a `CNAME` file at the repo root containing the domain,
   then point an apex `A` record set at GitHub's Pages IPs and a `www` `CNAME`
   at `<username>.github.io`. Turn on "Enforce HTTPS" once DNS resolves.
3. **Real links.** The App Store and TestFlight URLs are `href="#"` placeholders,
   marked with `TODO` comments in `index.html`.
