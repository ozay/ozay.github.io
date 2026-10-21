# ozay.in

A static, bilingual (EN/TR) personal site. Plain HTML, CSS and vanilla JavaScript —
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

## How the bilingual setup works

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
  img/favicon.svg
content/posts/      the Markdown posts

CNAME               serves the site at ozay.in
.nojekyll           stops GitHub Pages running Jekyll over the folder
.github/workflows/  the Pages deploy job
.claude/            local preview config for Claude Code; gitignored, never published
```

This folder is the whole repository. It sits inside `Assets/Website/`, which is
free to hold anything else you like — drafts, source images, the old Google Sites
export — none of which is tracked or published.

The navigation and footer are repeated in each HTML file, since there is no build
step. If you change a nav link, change it in all eight pages.

## Publishing (GitHub Pages)

This repository deploys itself. `.github/workflows/deploy.yml` uploads the whole
folder to GitHub Pages on every push to `main` — there is no build step, because
the site is already static.

Three files make that work, and none of them should be deleted:

| File | Why it is there |
|---|---|
| `CNAME` | Tells Pages to serve the site at `ozay.in`. |
| `.nojekyll` | Stops Pages running the site through Jekyll, which would otherwise ignore files and folders beginning with `_`. |
| `.github/workflows/deploy.yml` | The deploy job itself. |

### First-time setup

1. **Create an empty repository** on GitHub named exactly **`ozay.github.io`**.
   The name matters: a repository called `<username>.github.io` is a *user site*,
   which publishes at the root of the domain rather than under a `/project/`
   path. Do not let GitHub add a README, licence or `.gitignore`; this folder
   already has what it needs. (An account can have only one user site.)
2. **Push this folder to it:**

   ```bash
   git remote add origin git@github.com:ozay/ozay.github.io.git && git push -u origin main
   ```

3. **Turn Pages on:** repository → *Settings* → *Pages* → under *Build and
   deployment*, set **Source** to **GitHub Actions**. (Not "Deploy from a branch"
   — the workflow does the publishing.)
4. **Watch the first deploy** on the *Actions* tab. It takes about a minute, and
   ends with the live URL.
5. **Add the custom domain:** *Settings* → *Pages* → *Custom domain* → enter
   `ozay.in` and save. Leave **Enforce HTTPS** ticked once it becomes available —
   the certificate can take up to an hour to issue.

### DNS

At whoever manages `ozay.in`, replace the Google Sites records with these:

| Type | Name | Value |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `ozay.github.io.` |

Use the four A records together — they are GitHub's load-balanced set, not
alternatives. If you prefer IPv6, GitHub also publishes AAAA records; the A
records alone are enough. Propagation usually takes minutes but can take a day.

Until DNS has moved, the site is also reachable at `https://ozay.github.io/` —
handy for checking everything works before you touch the domain.

### Afterwards

Every later change is just:

```bash
git add -A && git commit -m "Add autumn 2027 courses" && git push
```

### Old Google Sites links

These will not resolve on the new site. Set up redirects at your DNS or host if
you want to preserve them:

| Old | New |
|---|---|
| `/home` | `index.html` |
| `/about-me` | `about.html` |
| `/courses` | `teaching.html` |
| `/publications` | `research.html` |
| `/contact` | `contact.html` |

`sitemap.xml` and `robots.txt` both assume `https://ozay.in`. Add new posts to the
sitemap as you publish them.

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
