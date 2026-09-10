# Verse by Verse — GitHub Pages Site Design

## Purpose

Turn this currently-empty repo into the public website for the Verse by
Verse app, hosted on GitHub Pages under a custom domain. Whatever is on
`master` is live — there is no separate staging branch or environment.

## Scope

Three static pages at launch:

- `index.html` — app landing page (hero, screenshots, features, App
  Store link)
- `support.html` — support / FAQ page
- `privacy.html` — privacy policy (required for App Store listing)

Out of scope for this pass: blog/updates page (mentioned as a
maybe-later; not built now), any server-side logic, any JS framework
or SPA behavior, any build tooling beyond CSS compilation.

## Stack decision

Plain HTML per page (no templating/includes) + Tailwind CSS + DaisyUI,
compiled via the Tailwind CLI in a GitHub Actions workflow. No
JavaScript framework — a single small `js/main.js` for a mobile nav
toggle only. FAQ accordion behavior is handled by DaisyUI's `collapse`
component (pure CSS, no JS).

Two options were considered:

- **Tailwind via CDN (zero build tooling)** — no npm/build step at
  all, but ships Tailwind's full JIT compiler as browser JS and logs a
  "should not be used in production" console warning. Rejected: not
  production-quality for a public site.
- **Tailwind CLI compiled to a static CSS file (chosen)** — final CSS
  is a few KB containing only the classes actually used, no console
  warning, no runtime JS cost. Requires a GitHub Actions build step,
  which is invisible to day-to-day editing (you still just edit HTML
  and refresh locally via `npm run dev` watch mode).

DaisyUI was chosen over building custom components or using Flowbite's
full library, to get ready-made `btn`, `navbar`, `hero`, `card`,
`footer`, and `collapse` classes without writing custom CSS or pulling
in Flowbite's JS bundle.

## Repo structure

```
verse-by-verse-web/
├── .github/workflows/deploy.yml   # builds CSS + deploys to Pages on push to master
├── src/
│   └── input.css                  # Tailwind directives + any custom CSS
├── index.html                     # landing page
├── support.html                   # support/FAQ
├── privacy.html                   # privacy policy
├── js/
│   └── main.js                    # mobile nav toggle only
├── assets/
│   ├── screenshots/                # app screenshots
│   └── icons/                      # favicon, app icon
├── CNAME                          # custom domain
├── package.json
├── tailwind.config.js
└── .gitignore                     # extend existing Jekyll-oriented file with node_modules/, dist/
```

Each HTML page is self-contained (no shared header/footer include
mechanism) so it can be opened and edited directly without a local
server or templating step.

## GitHub Pages + custom domain

- Repo Settings → Pages → Source: **GitHub Actions** (not "deploy from
  branch"), since the build step is required before the site is
  servable.
- `CNAME` file in the repo root containing the custom domain — GitHub
  Pages reads this automatically on each deploy.
- At the domain registrar: an apex `A` record set (GitHub Pages' IPs)
  for the root domain, plus a `CNAME` record for `www` pointing to
  `<username>.github.io`. Exact values to be supplied when the domain
  name is provided during implementation.
- Enable "Enforce HTTPS" in Pages settings once DNS propagates (GitHub
  auto-provisions the certificate).

## Build & deploy (GitHub Actions)

On every push to `master`:

1. `npm ci`
2. `npx tailwindcss -i src/input.css -o dist/style.css --minify`
3. Upload the repo root (including generated `dist/style.css`) as the
   Pages artifact and deploy via `actions/deploy-pages`.

There is no local deploy step — pushing to `master` is the only
trigger, matching the "whatever's on master is live" requirement.
Locally, `npm run dev` runs the Tailwind CLI in watch mode for live
editing.

## Content inputs needed during implementation

The design above is content-agnostic. Actual page content requires,
from the user, at implementation time:

- Custom domain name (for `CNAME` + DNS instructions)
- App Store link and any app screenshots/icon assets
- Support/FAQ content (actual questions and answers)
- Privacy policy text (or confirmation to draft a standard template)

## Testing

No automated tests — this is a static content site. Verification is:
manual review of each page in a browser (including mobile width) after
`npm run dev`, and confirming the GitHub Actions workflow succeeds and
the live site renders correctly after each push to `master`.
