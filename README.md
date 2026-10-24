# ozay.github.io

The personal site of Özay Özaydın, live at <https://ozay.github.io>.
Static and bilingual (EN/TR). Plain HTML, CSS and vanilla JavaScript —
no build step, no framework, no package manager, no trackers, no cookies.

## Running it locally

The blog loads posts with `fetch`, which browsers block for pages opened straight
from disk (`file://`). So serve the folder over HTTP:

```bash
python3 -m http.server 4321
```

Then open <http://localhost:4321>. Everything except the blog also works by
double-clicking the HTML files.

## Updating the content

All the content lives in four files. You should never need to touch the HTML to
add a paper, a course or a post.

| What | File |
|---|---|
| Publications + research themes | `assets/data/publications.js` |
| Courses, themes, universities, active term | `assets/data/courses.js` |
| Bio, links, supervised theses, career timeline | `assets/data/profile.js` |
| Blog index | `assets/data/posts.js` |

Each file starts with a comment explaining its fields. The pages derive their
figures and headline numbers from these files, so the charts, counts and filters
update themselves.

### Each semester

1. In `assets/data/courses.js`, set `SITE_ACTIVE_TERM` to the new term, e.g.
   `"2027-2028 Fall"`. This drives the "Active this term" badge.
2. Add that term to the front of the `terms` array of every course you are
   teaching. For a brand-new course, copy an existing entry.

That is the whole job. The teaching load chart, the per-course sparklines, the
term counts and the four headline numbers all follow from `terms`.

### A new publication

Add an entry at the **top** of `SITE_PUBLICATIONS`. Set `topic` to one of the keys
in `SITE_TOPICS` at the top of the same file. Fill in `doi` when you have one — the
card then shows a DOI button instead of a Google Scholar search link.

### A new blog post

1. Write `content/posts/<slug>.en.md`, and `content/posts/<slug>.tr.md` if you are
   translating it. Standard Markdown: headings, bold, italics, links, lists,
   blockquotes, code, tables, images.
2. Add an entry at the top of `SITE_POSTS` in `assets/data/posts.js` with the same
   `slug`. Set `hasTr: false` if there is no Turkish version — readers on the
   Turkish setting then see the English text with a short note.

The two posts currently published are starters written to get the blog going.
Edit or delete them as you like; delete both the `.md` files and the entry in
`posts.js`.

## Presentations

Talks and lectures are HTML slide decks that share one engine,
`assets/deck/deck.js` and `deck.css`. A deck supplies its slides and its look;
the engine supplies everything else, the same way in every deck.

### A new deck

1. Copy `talks/_template/` to `talks/<year>-<event>-<topic>/`, for example
   `talks/2027-icors-sdg-network/`. For a lecture, copy it to
   `courses/<code>/week-NN/` instead, and add one more `../` to the asset paths
   in its `<head>` and at the end of `<body>`.
2. Set the `<title>` and the canonical link to the deck's new address. The QR
   codes point at that address.
3. Write the slides, one `<section class="slide" data-title="…">` each. The
   `data-title` is what the overview and the presenter view show.

The template's comments explain the rest. Useful pieces inside a slide:

| Markup | What it does |
|---|---|
| `<aside class="notes">…</aside>` | Speaker notes. Shown only in the presenter view. |
| `<div class="deck-qr"></div>` | A QR code to the deck's own address. |
| `<div class="deck-brand"></div>` | Your logo and name. |
| `<button data-go="7">` | Jumps to slide 7. |
| `data-steps="3"` on a slide | Four states (0–3) inside the slide. `→` walks through them before moving on; the slide's script follows along with `Deck.onStep(n, k => …)`. |
| `data-notes="…"` on a slide | Speaker notes as plain text, instead of an `aside`. |
| `\( … \)` and `\[ … \]` | Maths, if the deck loads MathJax (the template does). |

And on the `<main data-deck>` element: `data-back` / `data-back-label` for the
link at the left of the bar, `data-label` for a context line such as
"ENMU2050 · Week 1", and `data-themes="light dark"` to offer a dark mode.
A deck designed at a fixed size, with every measurement in pixels, adds
`data-size="1600x900"`: its slides are laid out at that size and scaled to the
screen. The YAEM 2026 deck works this way; the other two reflow instead.

A deck's own script goes after `deck.js` and can react to slides with
`Deck.onEnter(5, () => { … })`. The Kapıkule deck uses this to animate its charts.

### Presenting

| Key | |
|---|---|
| `→` `←` (or Space) | next / previous slide |
| `O` | overview of all slides |
| `F` | full screen |
| `P` | presenter view: current and next slide, your notes, a timer and a clock |
| `B` | black screen, for discussion; press again to return |
| digits, then `Enter` | jump to that slide, e.g. `1` `2` `Enter` |
| `⌘P` / `Ctrl+P` | print, or save as PDF (see below) |

**Presenter view.** Press `P` and allow the pop-up. Put the presenter window on
your laptop screen and the deck on the projector. Moving in either window moves
both.

**Without internet.** Fonts, maths and the QR library are part of the site, so a
deck needs nothing from the internet. To present at a venue with bad Wi-Fi, open
the deck's `index.html` straight from this folder. **Try that once with Wi-Fi off
before the day:** some browsers refuse web fonts on pages opened from disk, in
which case the slides fall back to a system font. Maths and everything else keep
working.

**A PDF for organisers.** Press `⌘P` (or `Ctrl+P`), or use the PDF button in
the overview, and choose "Save as PDF". Before the print dialog opens, the deck
takes every slide to its finished state behind a black screen: charts drawn,
counters complete, every step revealed. That is why the dialog takes a
couple of seconds to appear. Each slide becomes one page at the deck's own
proportions, in the light theme, without the controls or your notes, and the
deck returns to the slide you were on. The browser's own File → Print skips the
preparation and prints the slides as they currently look.



Two mechanisms, deliberately:

- **Short UI strings** (navigation, buttons, filter labels, chart titles) live in
  `assets/js/i18n.js` and are applied to elements carrying `data-i18n="key"`.
- **Long prose** sits directly in the HTML, in paired blocks:
  `<p data-lang="en">…</p><p data-lang="tr">…</p>`. CSS hides whichever does not
  match `<html lang>`. Both versions are in the page source, which search engines
  like, and you edit the text where you can see it.

The language is remembered in `localStorage` and can be forced with `?lang=tr`.
The theme works the same way, defaulting to the visitor's system preference.

## Layout

```
index.html  about.html  research.html  teaching.html
writing.html  post.html  contact.html  404.html
assets/
  css/base.css      design tokens, layout, shared components
  css/pages.css     hero, timeline, charts, cards, blog
  js/site.js        theme, language, nav, reveals, counters
  js/i18n.js        UI string dictionary
  js/charts.js      SVG chart builders (no dependencies)
  js/home.js  about.js  research.js  teaching.js  blog.js  post.js
  js/vendor/marked.min.js   Markdown parser, v12.0.2, vendored on purpose
  data/             the four content files
  img/logo.svg  favicon.svg
  deck/             the shared slide engine (see "Presentations")
    deck.css  deck.js
    fonts/          Archivo, Overpass and STIX Two Text, served locally
    vendor/         MathJax 3.2.2 and qrcode-generator 1.4.4
content/posts/      the Markdown posts
talks/<slug>/       one folder per talk; talks/_template/ is the starter
courses/<code>/<week>/   lecture decks, e.g. courses/enmu2050/week-01/

kapikule.html  multivariate-week1-trial.html
content/yaem2026-chemdecision.html  content/multivariate-week1-trial.html
                    old addresses that now forward to the new ones

.nojekyll           stops GitHub Pages running Jekyll over the folder
.github/workflows/  the Pages deploy job
```

This folder is the whole repository. It sits inside `Assets/Website/`, which is
free to hold anything else you like — drafts, source images, the old Google Sites
export — none of which is tracked or published.

The navigation and footer are repeated in each HTML file, since there is no build
step. If you change a nav link, change it in all eight pages.

## Publishing (GitHub Pages)

The site lives at **<https://ozay.github.io>**.

This repository deploys itself. `.github/workflows/deploy.yml` uploads the whole
folder to GitHub Pages on every push to `main` — there is no build step, because
the site is already static.

Two files make that work, and neither should be deleted:

| File | Why it is there |
|---|---|
| `.nojekyll` | Stops Pages running the site through Jekyll, which would otherwise ignore files and folders beginning with `_`. |
| `.github/workflows/deploy.yml` | The deploy job itself. |

Because the repository is named `ozay.github.io`, it is a GitHub *user site*: it
publishes at the root of the domain, so every relative path in the HTML resolves
without a base-path prefix.

### Settings this repository depends on

These are configured once, in the GitHub web UI:

1. **Default branch is `main`** — *Settings → General → Default branch*. The
   workflow only triggers on pushes to `main`.
2. **Pages source is GitHub Actions** — *Settings → Pages → Build and deployment
   → Source*. Not "Deploy from a branch"; the workflow does the publishing.
3. **The `github-pages` environment allows `main`** — *Settings → Environments →
   github-pages → Deployment branches and tags*. This repository previously
   deployed from `master`, so the environment may still be pinned to it. A run
   that fails with *"Branch main is not allowed to deploy to github-pages due to
   environment protection rules"* means this needs fixing.

### Everyday use

```bash
git add -A && git commit -m "Add autumn 2027 courses" && git push
```

Watch the run on the *Actions* tab; it takes about a minute.

### Using a custom domain later

Nothing here is locked to `ozay.github.io`. To move the site to your own domain:

1. Add a file named `CNAME` at the root of this repository containing just the
   domain, e.g. `ozay.in`.
2. Point the domain's DNS at GitHub — four A records on the apex
   (`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`)
   and a `CNAME` record for `www` pointing at `ozay.github.io.`.
3. Update the absolute URLs that refer to the site by name: the
   `<link rel="canonical">` and `<meta property="og:url">` tags in each HTML
   file, the `Sitemap:` line in `robots.txt`, and every `<loc>` in `sitemap.xml`.

Do the DNS before adding `CNAME`. Pages sets the custom domain the moment a
deploy sees that file, and immediately starts redirecting `ozay.github.io` to it —
which goes nowhere until DNS has propagated.

### Old Google Sites links

The previous site was on Google Sites. These paths will not resolve here:

| Old | New |
|---|---|
| `/home` | `index.html` |
| `/about-me` | `about.html` |
| `/courses` | `teaching.html` |
| `/publications` | `research.html` |
| `/contact` | `contact.html` |

### A caution about Dropbox

This repository lives inside Dropbox, and Dropbox syncs `.git/` along with
everything else. That is usually fine on one machine, but if you ever edit the
site from two machines at once, Dropbox can sync Git's internal files mid-write
and corrupt the repository. If that worries you, move this `ozay.github.io`
folder somewhere outside Dropbox and let GitHub be the backup instead — the repo
is then the single source of truth.

## Notes on the data

- Publication **themes** and course **themes** are editorial judgements, assigned
  by hand in the data files. Change any you disagree with; the charts follow.
- The chart colours come from a colourblind-safe palette validated for both light
  and dark surfaces. If you change them, keep the categorical order fixed rather
  than cycling hues, and keep the "show data table" toggles — they are what makes
  the figures readable without relying on colour.
- Co-author counts, course totals and every headline number are computed from the
  data files at page load, so they cannot drift out of sync with the lists.
