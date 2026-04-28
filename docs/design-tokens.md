# The Studio Fit Notebook — Design Tokens

**Status:** v0.1
**Last updated:** 2026-04-27
**Anchor reference:** [`references/splash.png`](references/splash.png) — the hand-painted wordmark establishes the canonical palette and tone.

This doc defines the design tokens (colors, typography, spacing, motifs) used across the Studio Fit Notebook app. Build to these tokens; do not hand-pick colors or fonts in screen specs or code. If a token doesn't exist for what you need, add it here first.

---

## 1. Aesthetic principle

> **Paper inside an iron frame.**
>
> Program content surfaces (the program itself, the logging interaction) feel like a composition notebook page — off-white paper, ruled lines, pencil-grey ink, hand-drawn marks.
>
> Chrome surrounding the content (status bars, tab bars, navigation, splash, login, empty states) feels like a 1970s iron gym — dim warm-black surfaces, cream stenciled labels, a single rust-red accent.
>
> The splash screen is the one place we go full iron. Everything else is paper-dominant with iron framing.

---

## 2. Color palette

All colors are derived from the splash wordmark or from the trainer's actual notebook photographs. Hex values are starting points and may be tuned ±5 in implementation against real device displays.

### Paper surfaces (content)

| Token | Hex | Use |
|---|---|---|
| `paper-cream` | `#EFE6D2` | Primary content background. Matches the splash lettering color. |
| `paper-cream-deep` | `#E5DBC2` | Subtle inset surfaces (a card-on-card layer, the inside of a "page"). |
| `paper-rule` | `#A8B5C4` | Horizontal rule lines on program pages. Soft blue-grey, like real notebook ruling. |
| `paper-margin` | `#C44E3D` | Vertical red margin line. Used sparingly — only on actual page surfaces. |

### Ink (writing on paper)

| Token | Hex | Use |
|---|---|---|
| `ink-pencil` | `#3A332C` | Default text color on paper surfaces. Warm near-black, with a graphite feel — never pure `#000`. |
| `ink-pencil-light` | `#6B6258` | Secondary text on paper (labels, hints, prior-session "was X" annotations). |
| `ink-pencil-faded` | `#9A9087` | Tertiary text, struck-through values, placeholder text. |
| `ink-tally` | `#3A332C` | Tally marks and check-circles. Same as default ink. |

### Iron (chrome and frame)

| Token | Hex | Use |
|---|---|---|
| `iron-deep` | `#1A1410` | Splash background, deepest navigation surfaces, app icon background. Warm near-black. |
| `iron` | `#2D2823` | Tab bars, top navigation bars, modals' backdrop. |
| `iron-light` | `#4A433C` | Secondary chrome, dividers within iron surfaces, inactive tab icons. |
| `iron-stencil` | `#EFE6D2` | Cream/paper-color text on iron surfaces. Same value as `paper-cream` — intentional, ties splash to chrome. |

### Rust accent (the one accent color)

Used sparingly — for emphasis, status, brand moments. Never for backgrounds of large surfaces.

| Token | Hex | Use |
|---|---|---|
| `rust` | `#A8341E` | Primary accent. Drop shadows on display type, active state highlights, "publish" button background. |
| `rust-deep` | `#7C2412` | Pressed state of rust elements; fine outlines on rust-shadowed text. |

### Semantic colors (status)

These map to existing palette entries. Don't introduce new colors for status — reuse what's here.

| Token | Resolves to | Use |
|---|---|---|
| `status-draft` | `ink-pencil-faded` (`#9A9087`) | Program status: draft (admin-only). |
| `status-published` | `ink-pencil` (`#3A332C`) | Program status: published. |
| `status-completed` | `ink-pencil-light` (`#6B6258`) | Program status: completed (past). |
| `status-attention` | `rust` (`#A8341E`) | Items on the needs-attention dashboard, missed-rep flags. |
| `status-synced` | `ink-pencil-light` (`#6B6258`) | "Saved to server" indicator. Subtle. |
| `status-pending-sync` | `paper-margin` (`#C44E3D`) | "Saved locally, not yet synced" indicator. Slightly louder than synced. |

---

## 3. Typography

Three roles, three font families. No more.

### Role 1 — Display (script): brand and major headings

**Use for:** the wordmark on splash and login, page titles like "Wednesday — April 27," any "feels like a flourish" moment.
**Use sparingly.** Script type is for emphasis, not body.

**Font choice:** [**Caveat**](https://fonts.google.com/specimen/Caveat) (Google Fonts, free) — the closest free font to the splash script that's also actually readable at small sizes. Use weight 400 default, 700 for the wordmark itself.

**Alternative if Caveat feels too casual:** [**Yellowtail**](https://fonts.google.com/specimen/Yellowtail) — leans more "vintage signage" and matches the splash style better, but only comes in one weight.

**Pair with a subtle rust drop shadow** (`rust` color, offset 2px down, 2px right, no blur) on the wordmark and any app-bar logo lockup, to echo the splash. Drop shadow only on display type — never on body or block headers.

### Role 2 — Block (sans, uppercase): labels, buttons, status

**Use for:** all-caps labels ("FIT" in the splash), button text, tab bar labels, status indicators, table column headers.

**Font choice:** [**Oswald**](https://fonts.google.com/specimen/Oswald) (Google Fonts, free) — condensed sans, vintage athletic feel, pairs well with Caveat.

**Always set in `letter-spacing: 0.05em`** when used as labels. Always uppercase via CSS/style, never via the input string (so that screen readers read "Press" not "P-R-E-S-S").

### Role 3 — Handwriting (pencil): program content and logged values

**Use for:** lift names, set numbers, weights, reps — everything that lives on a paper surface.

**Font choice:** [**Architects Daughter**](https://fonts.google.com/specimen/Architects+Daughter) (Google Fonts, free) — the closest free match to the photographed handwriting in [`references/handwriting.jpeg`](references/handwriting.jpeg). Even, legible, pencil-feel.

**Backup option:** [**Patrick Hand**](https://fonts.google.com/specimen/Patrick+Hand) — slightly more rounded, also free. Easier on the eyes at small sizes if Architects Daughter feels too cramped on iPhone.

**Numbers must be tabular.** Workout values stack into columns (`5  5  5  4`); proportional digits look ragged. Either:
- Use the font's built-in `font-variant-numeric: tabular-nums` if supported, or
- Substitute a monospace handwriting alternative for numeric values only — [**Special Elite**](https://fonts.google.com/specimen/Special+Elite) (typewriter feel) is a good fallback.

### Type scale

iPad-first, but the same scale works for phone. Sizes are body-relative.

| Token | Size | Line height | Font role | Example use |
|---|---|---|---|---|
| `type-display-xl` | 64px | 1.0 | Display | Splash wordmark only |
| `type-display-lg` | 40px | 1.1 | Display | Page titles ("Wednesday — April 27") |
| `type-display-md` | 28px | 1.2 | Display | Section flourishes, empty-state headlines |
| `type-block-lg` | 18px | 1.2 | Block | Primary buttons ("PUBLISH"), tab labels |
| `type-block-md` | 14px | 1.3 | Block | Status pills, table headers |
| `type-block-sm` | 11px | 1.3 | Block | Micro-labels, axis labels on charts |
| `type-pencil-xl` | 32px | 1.3 | Handwriting | Logged weight values, tap targets |
| `type-pencil-lg` | 22px | 1.4 | Handwriting | Lift names, prescribed weights |
| `type-pencil-md` | 18px | 1.5 | Handwriting | Body text on paper, set values, reps |
| `type-pencil-sm` | 14px | 1.5 | Handwriting | "Was 30" annotations, secondary notes |

**Body default on paper:** `type-pencil-md` in `ink-pencil`.
**Body default on iron:** `type-block-md` in `iron-stencil`.

### A note on accessibility

The handwriting font + pencil-grey ink contrast (~7:1 on cream) clears WCAG AA at the body size. Smaller annotations (`type-pencil-sm` and below) approach the contrast floor — keep `ink-pencil-light` as the lightest acceptable color for any body text. `ink-pencil-faded` is for non-essential text only (struck-through values, placeholders). Test with the trainer's older clients during the pilot.

---

## 4. Spacing scale

8-point base, with a few in-between half-steps for tight notebook-style layouts.

| Token | px | Use |
|---|---|---|
| `space-0` | 0 | Reset |
| `space-1` | 4 | Inline gaps between marks (tally cluster spacing) |
| `space-2` | 8 | Tight padding inside small components |
| `space-3` | 12 | Between adjacent set entries on a row |
| `space-4` | 16 | Default padding inside cards, between body lines |
| `space-5` | 24 | Between lifts in a program list |
| `space-6` | 32 | Between top-level sections of a screen |
| `space-7` | 48 | Around major page surfaces (paper card on iron frame) |
| `space-8` | 64 | Splash margins, large empty states |

### Tap target floors

Per PRD §6.6 design rules, **44pt minimum tap targets.** Visual elements can be smaller (a check circle can render at 28px), but the *touchable* area must be padded to 44pt. This will come up constantly on the logging screen — small numbers, big tap zones.

---

## 5. Surface treatments

### Paper card

The default content container. Where program content lives.

- Background: `paper-cream`
- Subtle paper-grain texture overlay (optional, a faint tiled noise PNG at ~5% opacity). Skip for v1 if it complicates rendering on Android — solid color is acceptable.
- Border-radius: `8px` (slight, not pill-shaped)
- Drop shadow: `0 2px 8px rgba(26, 20, 16, 0.12)` — soft, warm shadow simulating paper lifted slightly off the iron frame
- Inner padding: `space-5` (24px) on all sides
- Optional: ruled horizontal lines using `paper-rule` color, 24px apart, behind the content

### Iron surface

Tab bars, top nav, splash, modal backdrops.

- Background: `iron` for normal chrome, `iron-deep` for splash and modal backdrops
- Text on iron: always `iron-stencil` (cream)
- No drop shadows; iron is the *bottom* of the visual stack

### Hand-drawn dividers

Replace the default `border-bottom: 1px solid` with hand-drawn-style horizontal rules between program sessions, list items, etc. Two options:

- **SVG asset:** `assets/divider-wave.svg` — a single ~600px wavy ink line that tiles or stretches. Inherits `currentColor`.
- **Canvas/path:** for cases needing variable width, draw a slightly wavy path programmatically. Skip for v1; SVG is simpler.

Use color `ink-pencil-light` at 60% opacity. Always a single line, never doubled.

---

## 6. Motif vocabulary

Recurring visual elements that aren't standard UI controls but appear across screens. Build each as a reusable component.

### Tally check (set-complete indicator)

Reference: [`references/tally.jpg`](references/tally.jpg).

The most important interactive element in the app. Two states:

- **Unchecked:** an empty hand-drawn circle, ~28px, stroke `ink-pencil-light` 1.5px, hand-drawn (not perfect circle — slight wobble in the SVG path).
- **Checked:** the circle fills slightly with `paper-cream-deep`, and a hand-drawn pencil-tick crosses through it diagonally, in `ink-tally` color, 2px stroke. The tick is animated drawing in over ~200ms when the user taps.

**Sets group in fives** when there are many. After 4 ticks, the 5th is the diagonal slash through the previous four. This matches the trainer's notation in the photographs.

### Pencil strikethrough (edited value)

When a prescribed value is overridden by an actual logged value, render both:

```
~~5~~ 4
```

- The struck-through value uses `ink-pencil-faded` color and a hand-drawn strikethrough line — not a CSS `text-decoration: line-through`. Use an inline SVG of a slightly wavy horizontal stroke laid over the text. ~1.5px, color `ink-pencil-light`.
- The replacement value sits to the right with normal `ink-pencil` color.

This is the single most distinctive visual element. Get it right.

### Speed lines

Small horizontal cream strokes flanking display type, echoing the splash. Reference: the white slashes around "STUDIO" and "Notebook" in [`references/splash.png`](references/splash.png).

Use sparingly:
- App-bar logo lockup
- Major page titles
- Empty-state illustrations

Implement as inline SVG. 2–3 strokes, varying lengths, color `iron-stencil` or `paper-cream` depending on background.

### Sync state pencil/pen

A small icon in the corner of the logging screen indicating sync state.

- **Unsynced (local only):** pencil glyph, color `status-pending-sync` (rust)
- **Synced:** ink pen glyph, color `status-synced` (`ink-pencil-light`)

Subtle; never blocks interaction. Tap reveals "Last synced 3 minutes ago" tooltip.

### Drop shadow on display type

Echoes the splash treatment. Apply only to:
- The wordmark on splash and login
- Major brand moments (any future logo lockup, a "welcome back" banner)

Specs: `text-shadow: 2px 2px 0 rgb(168, 52, 30)` (=`rust`, no blur, sharp offset). Never on body type, never on block type, never inside paper cards.

---

## 7. Implementation notes

### Fonts

All four recommended fonts (Caveat, Oswald, Architects Daughter, Special Elite) are on Google Fonts and have permissive licenses for both web and React Native bundling.

For React Native + Expo: bundle the .ttf files via `expo-font`. Don't load over the network — the gym has poor signal. Bundled fonts ship with the app and work offline immediately.

For Next.js admin: use `next/font/google` with `display: 'swap'` for fast first paint.

### Theme storage

Implement these tokens as a single TypeScript object exported from `packages/design-tokens/index.ts` (or wherever the shared workspace ends up). Both apps consume the same module. Never hardcode a hex value in component code — always reference the token.

```ts
export const colors = {
  paper: { cream: '#EFE6D2', creamDeep: '#E5DBC2', rule: '#A8B5C4', margin: '#C44E3D' },
  ink: { pencil: '#3A332C', pencilLight: '#6B6258', pencilFaded: '#9A9087' },
  iron: { deep: '#1A1410', base: '#2D2823', light: '#4A433C', stencil: '#EFE6D2' },
  rust: { base: '#A8341E', deep: '#7C2412' },
  status: { /* … */ },
};
```

### Dark mode

Out of scope for v1. The light-only paper aesthetic is intentional. If a v2 dark mode is requested, the token structure above will accommodate it — `paper-*` tokens flip to dark variants, `iron-*` tokens stay roughly where they are (already dark), `ink-*` tokens flip to cream values. But don't pre-build it.

### Texture overlays

The splash uses a real brushed-paint texture. We can mimic this in the app for *display* type only by overlaying a faint texture PNG at ~10% opacity, masked to the text shape. Optional polish; skip for v1 unless time allows.

---

## 8. Open token decisions

Things I've left unspecified and want to revisit when designing real screens:

- **Exact tally-mark stroke style.** Should it be a literal pencil-stroke SVG asset (warmer, more authentic) or a programmatically-drawn line (faster, cleaner)? Decide while building the logging screen.
- **Paper grain texture.** Worth shipping in v1, or skip until pilot feedback? Defer decision; build without first, add if it's missing.
- **Animation timing.** Pencil-tick draw-in animation duration (200ms is a starting guess), set-complete haptic feedback intensity. Dial in on real device.
- **Iron tab bar treatment.** Solid `iron` background, or a subtle photographic background (e.g., low-opacity barbell shape)? Probably solid in v1; photographic in v2 if it doesn't muddy the chrome.
