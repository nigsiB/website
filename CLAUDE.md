# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

`nigsib-portfolio` — Nigel Burt's personal design portfolio (nigsib.com). Next.js 16 App Router, React 19, Tailwind CSS v4, TypeScript strict. Deployed on Vercel.

## Commands

```bash
npm run dev                    # dev server on :3000
npm run build                  # production build
npm run lint                   # eslint (flat config)
npm run screenshots            # regenerate live-site screenshots (Playwright, falls back to service)
npm run screenshots:playwright # force Playwright
npm run screenshots:service    # force thum.io remote capture
node scripts/extract-pdf-pages.mjs   # re-render selected PDF pages to public/portfolio-pdf/
```

`npm test` runs `tsx --test` over `*.test.ts` files; the only suite today is [src/app/api/contact/route.test.ts](src/app/api/contact/route.test.ts). `@playwright/test` is present only as the screenshot driver, not as a test runner.

## Local dev on this machine

The repo lives on a WSL filesystem reached from Windows over a UNC path (`\wsl.localhost\ubuntu\...`). Two consequences:

- **Anything that shells out through `cmd.exe` fails.** It rejects UNC working directories, silently falls back to `C:\Windows`, and npm then dies with `ENOENT: C:\Windows\package.json`. So `npm`/`npx` cannot be run from the Windows side at all.
- **`node` is not on `PATH` in a non-interactive WSL shell.** It is nvm-managed and `~/.bashrc` returns early when non-interactive, so `bash -lc` alone does not find it.

Run every npm/node command through WSL with the working directory and `PATH` both set explicitly:

```bash
wsl.exe -d Ubuntu --cd /home/nigsib/projects/website -- bash -lc 'export PATH="$HOME/.nvm/versions/node/v22.13.0/bin:$PATH"; npm run build'
```

`.claude/launch.json` uses exactly this form to start the dev server (on port 3001, since 3000 is often taken by another project). Note it pins the node version in that path — bump it after an nvm upgrade.

When invoking `wsl.exe` from Git Bash, prefix with `MSYS_NO_PATHCONV=1`, or the Linux paths get rewritten into Windows ones.

`git` run from Windows rejects the path with "dubious ownership". Either fix it once:

```bash
git config --global --add safe.directory '%(prefix)///wsl.localhost/ubuntu/home/nigsib/projects/website'
```

or pass it per-command with `git -c safe.directory='%(prefix)///wsl.localhost/ubuntu/home/nigsib/projects/website' ...`.

## Content architecture

All portfolio content lives in two hand-edited TypeScript modules under `src/data/` — there is no CMS or database. Adding or changing a project means editing these files, not the page components.

- [src/data/projects.ts](src/data/projects.ts) — the list of **live client sites**. This is the single source of truth for the homepage grid, the derived web-interactive work items, and the screenshot script.
- [src/data/workSections.ts](src/data/workSections.ts) — the four `/work/*` discipline sections (`branding`, `web-interactive`, `print-packaging`, `exhibition`), each with an intro, an accent colour, and its items.

Three coupling points matter:

1. **Screenshots are keyed by slugified URL.** Both `workSections.ts` and `ProjectGrid` build `imagePath` as `/screenshots/${slugifyUrl(project.url)}.png`, and `scripts/capture-screenshots.ts` writes to exactly that path. The script duplicates the slugify logic inline rather than importing [src/lib/slugify.ts](src/lib/slugify.ts) — keep the two in sync. Adding a project to `projects.ts` requires re-running `npm run screenshots` or the card renders a broken image.
2. **`web-interactive` reorders live items by title.** `workSections.ts` pulls "True Canna Genetics" out of the derived list and re-appends it last so archive projects sit above it. This match is on the literal title string.
3. **The homepage "Latest Work" strip is driven by the `latest` flag.** `page.tsx` renders `<ProjectGrid latestOnly limit={4} compact />`, which filters `projects` on `latest === true` and then slices to 4 — so a fifth project marked `latest` silently never appears.

Each `WorkItem` carries `source: "pdf" | "live" | "archived"`, which drives both the "ARCHIVE PROJECT" / "LIVE PROJECT" label and which lightbox component renders: `slideshowImages` → `ImageSlideshowLightbox`, any non-`live` source → `PdfImageLightbox` (a generic image lightbox despite the name), and `live` → a plain `next/image` with a "LAUNCH SITE" hover overlay.

**Dead client sites** are marked `archived: true` in `projects.ts`, which cascades: the derived work item drops its `url` and becomes `source: "archived"`, the homepage card swaps its outbound link for a "VIEW PROJECT" link through to `/work/web-interactive#<slugified-title>`, and `capture-screenshots.ts` skips the project so its last good screenshot is never overwritten with a placeholder. `slideshowImages[0]` is both the card thumbnail and the first slide, so the site screenshot belongs at index 0. As of August 2026 this covers WRA Official (DNS failing) and KDC Exclusive (domain lapsed, NXDOMAIN); neither has any usable Wayback capture, so their case-study imagery came from local PSDs.

Archive imagery under `public/portfolio-pdf/` is generated from `pdf_portfolio_1920x1080_04_150dpi.pdf` (gitignored, ~40MB, kept locally) by `scripts/extract-pdf-pages.mjs`; the page numbers to render are hardcoded in `selectedPages`.

## Routing and layout

`src/app/work/<section>/page.tsx` are four near-identical pages that each pick one key out of `workSections` and render `WorkSubnav` + an accent rule + `WorkSectionGrid`. Changing the shared work-page shell means changing all four.

SEO is generated, not static: `sitemap.ts`, `robots.ts`, `manifest.ts`, `opengraph-image.tsx`, and `twitter-image.tsx` are all App Router file conventions. Site URL resolution lives in [src/lib/site.ts](src/lib/site.ts), which falls back through `NEXT_PUBLIC_SITE_URL` → `SITE_URL` → Vercel-provided vars → `localhost:3000`. Never hardcode the domain; import `siteConfig`. `next.config.ts` handles the `www.nigsib.com` → apex redirect.

## Styling

Tailwind v4 via PostCSS only — no `tailwind.config`. Design tokens and the global utility classes (`display-hero`, `display-title`, `invert-panel`, `invert-dots`) are defined in [src/app/globals.css](src/app/globals.css). The site is black-background with a radial dot grid, Anton for headings, IBM Plex Mono for body. Section accent colours are data, not CSS — they come from `workSectionAccents` and are applied as inline styles.

## Contact form

[src/app/api/contact/route.ts](src/app/api/contact/route.ts) posts directly to the Resend REST API (no SDK dependency). Requires `RESEND_API_KEY`; returns 500 when unset. It has a `_contact_hp` honeypot field that silently returns `ok` for bots. The name matters: it was once called `company`, which browser autofill filled in for real visitors, so genuine enquiries were silently discarded. Do not rename it to anything autofill recognises. See `.env.example`.

## Repo notes

- `boilerplate/` is a gitignored, vendored copy of the original `create-next-app` scaffold, excluded from ESLint. Ignore it.
- `src/app/experiments/grid/` and `PortfolioGridPrototype` are a **dead experiment**, already merged to `master` and unlinked from the nav. Do not treat it as current work or extend it without being asked.
