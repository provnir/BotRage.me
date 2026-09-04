# botrage.me

A field guide to a small AI fleet — the public front door for Nir's projects and agents.
Static HTML, CSS and one JavaScript file. No build step, no framework, no dependencies.

Live at **https://botrage.me**. Everything in this repository is the site; there is nothing else to
run. The design rules that produced it are summarised below — read them before editing.

Founded by Illidan, kept by Bob.

---

## The publication

The site is organised as a printed field guide in three numbered chapters. Every subject is an
**entry** with an ordinal; the ordinals are stable and are used in the contents, the running
heads, the pager and the footer sitemap.

| Chapter | Title | Entries |
|---|---|---|
| **I** | Projects — `WORKING SOFTWARE` | `01` NPAS · `02` Tori |
| **II** | The Live Fleet — `AGENTS ON DUTY` | `03` Bob · `04` Zoe · `05` Pugna · `06` Artanis *(no page)* |
| **III** | The Archive — `HONOURED · PRESERVED` | `00` Illidan · `0∞` Fenix · `✦` The Fun Forge |

Numbering: Illidan is `00` because he precedes everything; Fenix is `0∞` because he kept coming
back; the Forge is `✦` because it is an appendix, not a person. Bob is `03` — a member of the
fleet, not the headline.

## File map

| File | What it is |
|---|---|
| `index.html` | The cover: masthead, contents, three chapter bands (`#projects` `#fleet` `#archive`), the `RECORD OF SERVICE` log |
| `npas.html` | I · `01` NPAS |
| `tori.html` | I · `02` Tori |
| `bob.html` | II · `03` Bob |
| `zoe.html` | II · `04` Zoe |
| `pugna.html` | II · `05` Pugna |
| `illidan.html` | III · `00` Illidan — memorial |
| `fenix.html` | III · `0∞` Fenix — memorial |
| `fun.html` | III · `✦` The Fun Forge — the toys, still working |
| `botrage.html` | Colophon — about this publication. Linked **only** from the footer |
| `styles.css` | The whole design system. Loaded by all ten pages |
| `forge.css` | The Fun Forge only. Loaded **after** `styles.css`, by `fun.html` alone |
| `script.js` | The Fun Forge only. Nothing else on the site uses JavaScript |
| `assets/` | Avatars and logos (SVG + PNG). **Delete nothing here** |
| `CNAME` | `botrage.me`. Do not touch |

Artanis has no page on purpose: one line in Chapter II, no link. Keep it that way unless there is
real content to justify a page.

## Architecture and house rules

- **Two stylesheets, and only two.** `styles.css` is the site. `forge.css` is the quarantine that
  keeps Illidan's acid-green palette alive inside `fun.html` and nowhere else.
- **No `<style>` blocks and no `style="…"` attributes in any HTML file.** Ever. That is how the old
  site drifted into six different palettes.
- **No new class names.** The vocabulary is closed and lives in `styles.css`; compose pages from
  `.prose`, `.section-head`, `.spec-panel`, `.plate`, `.timeline`, `.chip`, `.pull`, `.marginalia`.
- **No raw hex outside the token blocks** at the top of `styles.css` (and `forge.css`'s own token
  block plus its two rage-glow gradients).
- **No `?v=` cache-busting query strings.**
- **Facts are mono, prose is never mono.** Folios, kickers, captions, dates, chips and spec keys
  are JetBrains Mono; body copy is Instrument Sans; headings are Fraunces. Fonts come from Google
  Fonts with full system fallbacks — every page must still look deliberate with the CDN blocked.
- **Motion is taxonomy.** Living things (Chapters I and II) lift 2 px on hover. Archived things
  (`.entry--archive`, `.plaque`, `.plate--archive`, `.log`) are recessed into the page and never
  move. Do not add a hover transform to anything in Chapter III.
- **Images:** keep the PNGs, always with `width`/`height` attributes and `loading="lazy"` below the
  fold. No WebP derivatives in this repo.

### ⚠️ The shared blocks are duplicated in ten files

The masthead, the running head, the chapter pager and the site footer are **copy-pasted into every
page**. There is no include mechanism — this is a static site with no build step, deliberately.

**If you change one, change all ten.** After editing, verify they are still identical:

```bash
for f in *.html; do
  sed -n '/<footer class="site-footer">/,/<\/footer>/p' "$f" | md5sum | sed "s|-|$f|"
done | sort | uniq -c -w32     # one group, ten files
```

The masthead differs between pages by exactly one thing: the current chapter link carries
`class="masthead__link is-current" aria-current="true"` (Projects / Fleet / Archive / Forge).
`index.html` marks none and uses bare `#projects` hrefs; `botrage.html` marks none.

## How to add an entry

1. **Pick the chapter and the ordinal.** Ordinals are never reused and never re-sorted.
2. **Copy the nearest sibling page** (`npas.html` for a product, `zoe.html` for a bot,
   `illidan.html` for an archived one) and rewrite the content. Do not start from a blank file —
   the shared blocks must survive byte-identical.
3. **Set the page hooks** in `<html>`: `data-subject="…"` picks the entry's pigment (add a two-line
   `[data-subject="…"]` rule to the pigment block in `styles.css` if the subject is new). Archive
   pages also carry `data-chapter="archive"`.
4. **Update the running head and the pager** on the new page *and* on its neighbours — the pager is
   a doubly-linked list; a new entry in the middle of a chapter touches three files.
5. **Add the entry in four places:** the contents (`.toc`) on `index.html`, the chapter band on
   `index.html`, the footer sitemap in **all ten** files, and the `.toc` repeat on `botrage.html`.
6. **Check the title and meta:** `<title>Name · botrage.me</title>`, a `<meta name="description">`
   under 155 characters, `theme-color` `#0C0D10`.
7. **Look at it** at 390 px and 1440 px before committing, and tab through it once.

### Privacy — non-negotiable

Never publish: client names, compensation or contract figures, infrastructure identifiers (server
names, IP addresses, API keys, private network names), relatives, Nir's employer, phone or email.
"Nir" by first name and "Provizor" as a brand are fine. The pattern below is the mechanical check;
the judgement call is yours.

```bash
grep -Eino 'tailnet|tailscale|salary|invoice number|token|owner-master' *.html   # expect nothing
grep -c '<style' *.html ; grep -c 'style="' *.html ; grep -c '?v=' *.html         # all 0
```

---

## The Fun Forge DOM contract

`fun.html` holds six working toys built by Illidan — quote forge, oracle, rage meter, quest board,
command deck, meme-card maker — plus a soundboard and a theme switcher. They are preserved, not
frozen: **restyle and re-lay-out freely, change the DOM contract not at all.**

The reason is blunt: `script.js` queries every element at module top level and calls
`addEventListener` **without null checks**. One missing id kills all six toys at once, silently.

### Required ids — all 22, each exactly once, all in `fun.html`

```
#quoteText #generateButton #copyButton #memeButton
#memeCanvas #downloadMemeButton #rerenderMemeButton
#rageRange #rageValue #rageDiagnosis
#oracleQuestion #oracleButton #oracleConfidence #oracleAnswer
#questButton #questRank #questText #questReward
#soundOutput
#operatorStatus #operatorMeter #operatorMeterBar #operatorEvent #operatorLog
```

### Required classes and data attributes

These six class names are **code, not styling hooks**. Do not rename them; do not reuse them
elsewhere on the page.

| Selector | Data attribute | Count |
|---|---|---|
| `.mode` | `data-mode` = `quote` / `meme` / `prophecy` | 3 |
| `.theme-button` | `data-theme` = `fel` / `arcane` / `junkyard` | 3 |
| `.sound-button` | `data-yell="<text>"` — the payload lives in the HTML | 4 |
| `.operator-command` | `data-command` = `scan` / `focus` / `contain` / `taunt` | 4 |
| `.operator-chip` | `data-status-chip` = `focus` / `snark` / `chaos` | 3 |
| `.rage-console` | none (JS writes `--rage-alpha` and `data-rage` on it) | exactly 1 |

### Structural invariants

1. `<script src="script.js" defer></script>` stays in `<head>` (or at the end of `<body>`).
   **Never** `type="module"`, never `async`.
2. `#memeCanvas` keeps `width="1200" height="675"` **as HTML attributes** — the card geometry is
   hardcoded in device pixels. CSS may scale it; the attributes may not change.
3. `#operatorLog` is a `<ul>` whose **direct children are the `<li>` rows** — the trim logic reads
   `children.length` and `lastElementChild`. Do not wrap rows in divs.
4. `#operatorMeterBar` is a `<span>` inside `.operator-meter`, whose `style.width` percentage must
   be visible.
5. `#copyButton` is **text-only**: `copyLine()` rewrites its `textContent` and hard-writes back the
   literal string `Copy` after 1200 ms. Any icon or `<span>` inside it is destroyed on first copy.
   The same text-only constraint applies to `.mode`, `.theme-button` and `.operator-chip`.
6. `#rageRange` must exist on the page even though the oracle is a separate section —
   `oracleSeed()` reads `Number(rageRange.value)`. Its initial value lives in the `value` attribute.
7. `is-active` is the only state class the JS toggles (modes, theme buttons, chips), plus
   `is-yelling` on `#soundOutput`.
8. **No `aria-pressed`** on `.mode`, `.theme-button` or `.operator-chip` — the JS does not sync
   ARIA, and stale ARIA is worse than none. Each group is a `role="group"` with an `aria-label`,
   and selection is conveyed by the visible `is-active` state.

### CSS `script.js` depends on

Lives in `forge.css` and must survive any restyle: `.rage-console` + its `--rage-alpha` glow,
`.sound-output.is-yelling` and the `glitch` keyframes, the three `.is-active` states,
`.operator-meter` + `.operator-meter span` (the fill), and the
`body.forge-page[data-theme="arcane"|"junkyard"]` variable overrides (`fel` is the default, so it
has no rule).

The theme switcher writes `document.body.dataset.theme`. Any future site-wide colour scheme belongs
on `<html data-scheme>`. **Two attributes, two elements — never merge them.**

The meme card renders in Illidan's original fel green from four hardcoded hex values in
`script.js`. That is intentional and captioned on the page. It is his card.

### Run this before every `fun.html` commit

It must print nothing:

```bash
for id in quoteText generateButton copyButton memeButton memeCanvas downloadMemeButton \
  rerenderMemeButton rageRange rageValue rageDiagnosis oracleQuestion oracleButton \
  oracleConfidence oracleAnswer questButton questRank questText questReward soundOutput \
  operatorStatus operatorMeter operatorMeterBar operatorEvent operatorLog; do
  n=$(grep -c "id=\"$id\"" fun.html); [ "$n" = 1 ] || echo "FORGE CONTRACT BROKEN: $id ($n)"; done
for pair in 'class="mode"|3' 'theme-button|3' 'operator-command|4' 'operator-chip|3' 'rage-console|1'; do
  sel=${pair%|*}; want=${pair#*|}; got=$(grep -c "$sel" fun.html)
  [ "$got" = "$want" ] || echo "FORGE CONTRACT BROKEN: $sel expected $want got $got"; done
```

Then click through it from `file://` with the console open: roll a quote, switch all three modes,
copy (the button must return to the literal `Copy`), make a card, download it, drag the rage slider
across all five bands, ask the oracle, roll a quest, press all four soundboard buttons and all four
operator commands, and switch all three themes.

---

## Deploy

GitHub Pages, served from the repository root of `main`. `CNAME` holds `botrage.me`.
Push to `main` and the site is live — there is nothing to build.

```bash
git add -A && git commit -m "…" && git push
```

Everything works from `file://` too, so open `index.html` in a browser to review before pushing.
