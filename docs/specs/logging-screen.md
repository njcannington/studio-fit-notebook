# Screen Spec — Today's Program / Logging

**Status:** v0.1
**Last updated:** 2026-04-27
**Surfaces:** Client mobile (iOS, Android) + Admin iPad (live-edit mode)
**Priority:** Highest. This is the single most-used surface in the app. Everything else is secondary.
**Companion docs:** [`design-tokens.md`](../design-tokens.md), [`prd.md`](../prd.md) §6.4

---

## 1. What this screen is

The screen a client opens when they're at the gym and ready to work out. It shows today's prescribed program and lets them log what they actually did.

The same screen, with edit access added, is what the trainer sees on his iPad when he pulls up a client's program to make on-the-fly adjustments. **One screen, two permission modes — not two parallel UIs.** (PRD §6.6.)

This screen is the heart of the app. If it's slower or more cognitively expensive than picking up a pencil and a notebook, the app fails its core promise. Bar to beat: a pencil strike-through plus rewrite is ~4 seconds, zero thinking.

---

## 2. Anatomy

```
┌──────────────────────────────────────────────┐
│  ◀  Wed Apr 27                          ✎    │  ← iron top bar
│ ─────────────────────────────────────────── │
│                                              │
│  ┌────────────────────────────────────────┐ │
│  │                                        │ │
│  │   Press      35 lb    1/27             │ │  ← paper card
│  │   ●  7   ●  7   ○  7   ○  7   ○  7    │ │     (program content)
│  │                                        │ │
│  │   Squat 16"  +25 lb                   │ │
│  │   ●  10   ●  10   ○  10   ○  10        │ │
│  │     ○  10                              │ │
│  │                                        │ │
│  │   DL    85 lb                          │ │
│  │   ●  5   ○  5   ○  ~~5~~ 4   ○  5     │ │
│  │                                        │ │
│  │   Pulldown   60 lb                     │ │
│  │   ○  12   ○  12   ○  12                │ │
│  │                                        │ │
│  │   Plank   BW   20 sec                  │ │
│  │   ○ ○ ○ ○ ○                            │ │
│  │                                        │ │
│  └────────────────────────────────────────┘ │
│                                              │
│ ─────────────────────────────────────────── │
│  📓 Today    📚 History    👤 Me      ✎(p) │  ← iron tab bar
└──────────────────────────────────────────────┘
```

**Top bar (iron chrome):**
- Back chevron (◀) — left edge, 44pt tap zone. Returns to roster (admin) or home (client).
- Date — display script font, "Wed Apr 27" (or longer "Wednesday — April 27" on iPad). Tappable to jump to a different date (history scroll).
- Sync indicator — right edge. Pencil icon when local-only writes are queued; pen icon when synced. Tap shows "Last synced 2 min ago" tooltip. (Color follows `status-pending-sync` / `status-synced` from tokens.)

**Paper card (content):**
- One paper-cream card filling the available width with `space-7` margin against the iron frame.
- Optional: faint blue ruled lines behind the content (`paper-rule` color, 24px apart) — defer for v1 unless cheap to add.
- Optional: a thin red `paper-margin` vertical line at the left edge of the card — adds notebook authenticity. Include in v1; it's just a 1px SVG.
- Inner padding: `space-5` on all sides.

**Lift entries (one per prescribed lift):**
- Lift name + weight on a single line, in handwriting font (`type-pencil-lg`).
- Sets render in a row directly below: a check circle followed by the rep number. Wrap to next line if the row overflows (typical at 5+ sets on a phone).
- `space-5` between lifts. `space-3` between sets within a row.

**Tab bar (iron chrome):**
- Three tabs for clients: Today, History, Me.
- Admin sees a fourth tab marked `(p)` — see §8 for admin-mode differences.

---

## 3. The interaction model (the part that matters)

Two gestures. That's it.

### 3.1 Tap the circle → mark set complete

- Empty circle (`○`) is the "not done yet" state.
- Tap fills it: a hand-drawn pencil-tick draws diagonally across the circle in `ink-tally` color, ~200ms animated, with a light haptic on iPhone.
- Tap again to uncheck (the tick fades out, ~150ms).
- The rep number to the right of the circle is unaffected by checking — checking only marks completion, not editing.

**Five-set grouping:** when a lift has 5+ sets, the 5th tick renders as a diagonal slash across the previous four ticks (matching the trainer's notation in [`references/tally.jpg`](../references/tally.jpg)). Implementation: the 5th and subsequent sets render in a new visual group of up-to-4 ticks plus a slash. This is a polish item; ship v1 with simple individual ticks if grouping is hard.

### 3.2 Tap the number → edit inline

Every prescribed number on screen is directly tappable. Three kinds:

- **Reps per set** (the "7" after a circle)
- **Weight** (the "35 lb" next to the lift name)
- **Duration** for time-based sets (the "20 sec" on Plank)

Tap behavior:

1. Tap the number. The number stays in place visually but its color shifts to `rust` to indicate it's the active edit target.
2. A custom **number pad keypad slides up from the bottom** of the screen (~280px tall). The lift row stays visible above it. The keypad has digits 0–9, decimal, backspace, and a "Done" button. No other keys.
3. The current value is pre-selected, so the first digit typed replaces it entirely (matches iOS number-input convention).
4. Type the new value. The number on screen updates live as you type.
5. Tap "Done" or tap outside the keypad. Keypad slides down. The value is committed.

**No save button. No confirmation. No undo prompt.** (PRD §6.4.)

### 3.3 Strikethrough rendering when actual ≠ prescribed

When the user edits a prescribed value to an actual value that differs, render both:

```
○  ~~5~~ 4
```

- The struck-through `5` is the prescription. Color: `ink-pencil-faded`. Strikethrough is a hand-drawn SVG line laid over the digit, **not** a CSS `text-decoration: line-through`. Slight wave; ~1.5px stroke; `ink-pencil-light` color.
- The `4` to the right is the logged actual. Color: `ink-pencil` (full).
- This applies the same way to weight: `~~80 lb~~ 70 lb`.

**The prescription stays visible forever.** Even after the session is complete. Looking back at history, the client sees both what was asked and what they did, side by side, the same way they would in a paper notebook.

### 3.4 Per-set weight override

By default, weight is shown once per lift (next to the lift name). All sets inherit it.

If the client edits weight on a *single set* (e.g., dropped from 80 to 70 only on set 4), that set expands to show its own weight inline:

```
DL    80 lb
○  5   ○  5   ○  ~~5~~ 4   ○  ~~80 lb~~ 70 lb · ~~5~~ 2
```

The dot separator (`·`, color `ink-pencil-faded`) groups weight and reps for that single set. This is a rare case; it should be visually distinct without being shouty.

### 3.5 Auto-save and sync

- Every edit (tick, untick, value change) writes to local storage **immediately** on commit. No "save" affordance exists or is needed.
- Local writes queue for sync; the sync indicator in the top-right shows pencil (queued) → pen (synced).
- The user never sees "offline" errors. Mid-workout connectivity loss is invisible.

---

## 4. States

### 4.1 No program published yet

Client opens the app, today's program hasn't been published by the trainer. Show:

```
┌────────────────────────────────────────────┐
│                                            │
│                                            │
│                                            │
│         ✎                                  │
│                                            │
│         Your program isn't                 │
│         ready yet.                         │
│                                            │
│         Hang tight — your trainer          │
│         will share it soon.                │
│                                            │
│                                            │
└────────────────────────────────────────────┘
```

- Centered, on the same iron frame (no paper card — the empty state lives directly on iron).
- Pencil glyph (large, `iron-light` color) above the message.
- Headline in display script (`type-display-md`), body in handwriting (`type-pencil-md`), both in `iron-stencil`.
- No call-to-action. The client doesn't need to *do* anything; the trainer publishes when ready.

### 4.2 Program published, not yet started

The default state. The screen as drawn in §2. All circles empty.

### 4.3 Program in progress

Some sets checked, some not. No visual change in chrome — the in-progress state is just "some ticks are filled."

### 4.4 All sets complete

When the last circle is ticked:
- A subtle banner appears at the bottom of the paper card: a wavy hand-drawn divider, then `Nice work — Wed Apr 27` in display script.
- A "Mark session complete" block-style button appears below. Tapping it sets the program status to `completed`, which triggers the autofill engine to draft the next session.
- The button is *not* required to log values — they're already saved. It's a deliberate "I'm done" signal so the trainer's roster shows the right status.

### 4.5 Session complete (read-only history)

After the trainer or client marks the session complete:
- The paper card stays visible, fully populated with the session's results.
- All numbers and circles are still tappable for **corrective edits** (PRD §6.2 — programs remain editable in `completed` state).
- A small `COMPLETED · Wed Apr 27` block-label appears top-right of the card.
- The "Mark session complete" button is gone.

### 4.6 Trainer edited a published program (live update)

If the trainer edits a published program while the client has it open (PRD §6.2 — edits propagate live):
- The affected lift row briefly highlights with a rust-tinted background fade (~600ms).
- A small toast appears at the bottom: `Trainer updated Press: 35 → 40 lb`.
- The new value is used; the client's existing logs (if any) are preserved as the actual.

### 4.7 Offline (no connectivity)

- The sync indicator in the top-right shows the pencil glyph in `status-pending-sync` (rust).
- All other interactions work identically to online.
- No "offline" banner, no "you're offline" warning. The PRD is explicit: never block the client mid-workout.

---

## 5. Layout — phone vs iPad

### Phone (iOS, Android — primary client surface)

- Width-constrained. Everything in a single column.
- Paper card has `space-4` (16px) horizontal margin against iron frame on a 390px iPhone.
- Sets per row: 4 typical, wraps to next line beyond that.
- Top bar height: 56pt. Tab bar height: 64pt (with safe-area inset on devices with home indicator).

### iPad portrait (admin primary, also for loaner iPad clients)

- Paper card max-width 720px, centered with `space-7` (48px) margin.
- Sets per row: 6+ comfortably without wrapping.
- Top bar height: 64pt. Side margins more generous.
- Same components, same interactions — just more breathing room.

### iPad landscape (admin, usually)

- Two-column option becomes possible: today's program on the left, a small read-only "previous session" reference card on the right (showing what the client did last A-day, etc.). **v2 idea — defer for v1.**
- For v1, stay single-column max-width 720px even in landscape. Don't add a second column until we know the trainer wants it.

---

## 6. The number pad keypad (custom component)

This is its own component, used on every numeric edit across the app. Worth investing care.

```
┌────────────────────────────────────────┐
│                                        │
│   1     2     3                        │
│                                        │
│   4     5     6                        │
│                                        │
│   7     8     9                        │
│                                        │
│   .     0     ⌫                        │
│                                        │
│   ──────────────────                   │
│            DONE                        │
│                                        │
└────────────────────────────────────────┘
```

- Background: `iron-deep`. Buttons: `iron`, with `iron-stencil` text in block font (`type-block-lg`, 22px).
- Slides up from the bottom of the screen with a 200ms ease-out animation.
- Tap outside the keypad area dismisses it (commits the current value).
- Tap "DONE" commits the current value.
- Backspace (⌫) deletes the rightmost digit. Hold to clear all.
- The decimal key is shown only for weight inputs (not rep counts). Toggle from the calling component.
- iPad: same component, sized larger (~360pt tall).

**Why custom and not native iOS/Android numeric keyboards?** The native keyboards are visually generic and break the iron-and-paper aesthetic completely. The custom keypad is also faster to build with for v1 because we control everything — sizing, theme, decimal-toggle behavior.

---

## 7. Accessibility

- Tap targets: 44pt minimum on all interactive elements (PRD §6.6). Visual elements may be smaller, but their padded touch zones must hit 44pt.
- Color contrast: `ink-pencil` on `paper-cream` is ~7:1 (AA at body, AAA at large). `iron-stencil` on `iron` is ~9:1 (AAA). The lightest acceptable text color for any non-decorative text is `ink-pencil-light`.
- Screen reader labels for every check circle: e.g., `aria-label="Set 3 of 5, 5 reps prescribed, not yet completed"`. After completion: `"Set 3 of 5, 5 reps prescribed, completed at 4 reps"`.
- Honor `prefers-reduced-motion`: skip the pencil-tick draw animation, just toggle the state instantly.
- Honor system font size scaling, especially on iPhone where older clients may have set "Larger Text." Test with the trainer's actual older clients during the pilot.

---

## 8. Admin mode (trainer on iPad)

The same screen, with three additions:

### 8.1 Mode indicator

Top-right of the iron top bar (replacing the sync indicator's position; sync moves slightly left): a small `EDITING` block-style pill in `rust` color. Visible whenever an admin user is viewing this screen. The trainer never confuses "looking" with "editing" — every page he opens is editable.

### 8.2 Long-press on a lift row

Long-press (or right-click on iPad with mouse) opens an action sheet:
- Add set
- Remove set
- Swap lift (opens lift picker)
- Convert to ramp day (opens ramp builder — defer to program-builder spec)
- Add note
- Remove lift

These are admin-only. Clients never see this menu.

### 8.3 Publish state controls

If the program is in `draft` state, the bottom of the card shows a `PUBLISH` button (block font, full-width on phone, fixed-width 200pt on iPad, `rust` background, `paper-cream` text).

If `published`, the button is replaced by a smaller `Unpublish` link in `ink-pencil-light`.

If `completed`, no publish controls — the program is in the past.

---

## 9. Edge cases

- **Bodyweight lifts** (`BW`, `BW+15`): weight column shows the literal string. No special parsing in the UI. The lift name + weight rendering is just `Plank   BW` or `Squat 16"  +25 lb` (where the `+25` indicates added weight, the `BW` is implicit).
- **Time-based sets** (Plank, Cable Row holds): the rep number is replaced by `20 sec` (or whatever unit). Tap-to-edit opens the same number pad with seconds as the unit. Five circles for "5 sets of 20 sec."
- **Variable reps per set** (Inc DB 30×12,10,8): each set shows its own rep count: `○ 12   ○ 10   ○ 8`. No special UI.
- **Ramp day** (DL 95×5  135×5  160×3 ...): each set shows its own weight inline, dot-separated: `○ 95 · 5   ○ 135 · 5   ○ 160 · 3`. The lift's "default" weight column is omitted (each set carries its own).
- **Logged a set, then changed the prescription:** the old log stays attached to the set's stable ID. Strikethrough rendering of the new prescribed value is shown next to the logged actual.
- **Logged more reps than prescribed:** if the client edits `5` (prescribed) up to `7` (actual), the strikethrough still applies — `~~5~~ 7`. The strikethrough means "deviated from prescription," not specifically "fell short."

---

## 10. What this screen is NOT

To keep scope tight:

- **Not a program-creation surface.** The trainer creates programs in the program-builder screen. This screen only edits existing programs.
- **Not a video player.** Lift demonstrations are v2.
- **Not a timer.** Rest timers and stopwatches are not in v1. The trainer doesn't program them; the client doesn't ask for them.
- **Not a notes-heavy surface.** A single notes field exists per program (collapsed by default) and per lift (long-press → "Add note"). They are short-form, not journals.
- **Not a chat.** Trainer-to-client messages live elsewhere (or not at all in v1). If the client wants to ping the trainer, they text him.

---

## 11. Build order suggestion

When you build this screen in code, build in this order. Each step is independently testable.

1. **Static layout with mock data.** Just render a hardcoded program from a JSON object. No interaction. Verify the iron + paper aesthetic feels right on a real device. Check colors against the splash. **This is the moment to course-correct on tokens.**
2. **Tap-to-check.** Add the tick interaction with the pencil-tick animation. No backend, just local state.
3. **Custom number pad component.** Build it standalone first. Verify it slides up cleanly, dismisses correctly, handles decimal toggle.
4. **Tap-to-edit values.** Wire the keypad to value entry. Render strikethrough when actual ≠ prescribed. Local state only.
5. **Local persistence.** Wire to local SQLite (or WatermelonDB / PowerSync local store). Verify edits survive an app reload.
6. **Sync indicator + sync.** Connect to PowerSync. Verify pencil/pen state changes correctly. Test offline → online transition.
7. **Empty / completed / live-update states.** §4 above.
8. **Admin mode.** §8 additions.

---

## 12. Open questions surfaced by writing this spec

These weren't resolved in the PRD and may need a quick decision when implementing:

1. **Five-set tally grouping (slash on the 5th).** Authentic but adds complexity. Worth shipping in v1 or defer to polish?
2. **Per-set weight override visual** (the dot separator). Is this clear enough, or do we need a different layout when a single set diverges in weight? Decide by seeing it in code.
3. **"Mark session complete" button placement.** Bottom of the card is fine when sets are few; might be far below the fold on a long program. Float a smaller "I'm done" affordance at the bottom of the screen instead?
4. **Live-update toast wording.** `Trainer updated Press: 35 → 40 lb` is one option; could also be quieter (`Press updated`) or louder (modal). Probably toast is right; verify in pilot.
5. **iPad landscape two-column.** v2, but worth confirming during the pilot whether the trainer wants it sooner.
