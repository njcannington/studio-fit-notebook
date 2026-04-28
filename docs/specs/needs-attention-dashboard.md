# Screen Spec — Needs Attention Dashboard

**Status:** v0.1
**Last updated:** 2026-04-27
**Surface:** Admin iPad (primary), desktop web (secondary)
**Priority:** Medium. The autofill engine handles 90% of program prep silently; this screen is the trainer's view into the 10% that needs his judgment.
**Companion docs:** [`design-tokens.md`](../design-tokens.md), [`program-builder.md`](./program-builder.md), [`prd.md`](../prd.md) §6.3, §6.6

---

## 1. What this screen is

A focused list of clients (and specific lifts) where the autofill engine wants the trainer to look before publishing. Not alerts in a notification sense — more like a triage queue. The trainer opens this once a day during prep and acts on whatever's there.

The dashboard surfaces decisions that need human judgment:

- A client missed reps two sessions in a row on the same lift → consider deload, rep progression, or form check
- A client exceeded their prescription multiple sessions → consider pushing harder
- A client has no log on the prior session → confirm whether they missed entirely or just forgot to log
- An existing progression-phase candidate (e.g., linear → rep_progression transition) is ready

The trainer should be able to clear the dashboard in under 5 minutes on a typical day. If it's overflowing, the rules are too noisy and we tune them.

---

## 2. Anatomy

```
┌──────────────────────────────────────────────────┐
│  ◀  Attention            Wed Apr 27         ✎   │  ← iron top bar
│ ─────────────────────────────────────────────── │
│                                                  │
│  3 ITEMS                              CLEAR ALL  │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │  ⚠  Marcus  ·  DL                          │ │
│  │     Missed reps 2 sessions in a row        │ │
│  │     at 95 lb × 5.                          │ │
│  │                                            │ │
│  │     Last 4 sessions:                       │ │
│  │     90 ✓   95 ✗   95 ✗                     │ │
│  │                                            │ │
│  │     [HOLD WEIGHT]   [DELOAD]   [REP PROG]  │ │
│  │     [SNOOZE 1 WK]                          │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │  ⚠  Nic  ·  Bench                          │ │
│  │     Exceeded prescription 3 sessions       │ │
│  │     in a row.                              │ │
│  │                                            │ │
│  │     Last 4 sessions:                       │ │
│  │     85→90  90→95  95→100                   │ │
│  │                                            │ │
│  │     [BUMP +10]   [BUMP +5]   [SNOOZE]      │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │  ⚠  Jen  ·  Tuesday session                │ │
│  │     No log recorded.                       │ │
│  │                                            │ │
│  │     [HOLD WEIGHTS]   [MARK MISSED]         │ │
│  │     [SNOOZE]                               │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│ ─────────────────────────────────────────────── │
│  📋 Today    👥 Clients    ⚠ 3    ⚙             │  ← iron tab bar
└──────────────────────────────────────────────────┘
```

**Top bar (iron chrome):**
- Back chevron — returns to wherever the trainer came from (usually the roster).
- Title "Attention" in display script + the day's date.
- ✎ pencil — opens dashboard settings (rule thresholds — defer to v2 if pilot shows the defaults are fine).

**Header row:** count of items + a `CLEAR ALL` action that snoozes every item for one week. Use sparingly — exists for the rare day the trainer triages everything in one pass.

**Item cards (paper):** one card per attention item. Same paper-on-iron treatment as everywhere else.

**Tab bar:** the ⚠ tab shows the count as a badge (`⚠ 3` above). The badge is `rust` colored. Zero state shows just `⚠` with no number.

---

## 3. Item card anatomy

Each card has four parts, top to bottom:

1. **Header.** ⚠ icon (rust), client name, optional context (lift name, or "Tuesday session" for whole-session items). Handwriting font, `type-pencil-lg`.
2. **Reason.** One sentence explaining why this is here. Handwriting font, `type-pencil-md`. Direct, no jargon.
3. **History snippet.** A tiny inline view of recent data — last 3–4 sessions for the affected lift, or last 2 sessions for whole-session items. Compact, scannable. Format depends on the rule (see §4 per-rule examples).
4. **Action buttons.** 2–4 block-font buttons, lowercase tap targets ≥44pt. Each button represents a decision the trainer might make. Tapping commits the decision and removes the card from the dashboard.

Cards do not nest details. If the trainer wants more context, tapping the client name opens that client's program editor with the relevant lift focused.

### Action buttons — design notes

- **Primary action (most likely choice)** is the leftmost button, in `rust` background with `paper-cream` text.
- **Secondary actions** are bordered (`ink-pencil` 1.5px stroke, transparent background, `ink-pencil` text).
- **Snooze** is always available. It defers the item by 1 week (or "until next session" for some rules — TBD per rule).
- Action labels are imperative and short: `HOLD WEIGHT`, `DELOAD`, `REP PROG`, not "Switch to rep progression for next session."

---

## 4. Rules — what triggers an item

Six rules drive the v1 dashboard. Each is independent. Each surfaces as its own card.

### Rule 1 — Repeated missed work sets

**Trigger:** A client missed work-set reps on the same lift in 2+ consecutive sessions of the same template.

**Card:**
- Reason: "Missed reps 2 sessions in a row at 95 lb × 5."
- History: `90 ✓   95 ✗   95 ✗` — last 3 prescribed weights, with check marks for "all reps hit," ✗ for "missed."
- Actions:
  - `HOLD WEIGHT` (default) — keep current prescribed weight one more session
  - `DELOAD` — drop weight by 10% next session
  - `REP PROG` — switch this client/lift to rep_progression phase
  - `SNOOZE 1 WK`

### Rule 2 — Repeatedly exceeded prescription

**Trigger:** A client logged more reps or higher weight than prescribed on the same lift in 2+ consecutive sessions.

**Card:**
- Reason: "Exceeded prescription 3 sessions in a row."
- History: `85→90  90→95  95→100` — prescribed → actual for the last 3 sessions.
- Actions:
  - `BUMP +10` — bump next session's prescription by an extra increment
  - `BUMP +5` — standard increment (the autofill default)
  - `SNOOZE`

### Rule 3 — No log recorded

**Trigger:** Client's prior session shows no logged sets at all (skipped, forgot, or genuinely missed).

**Card:**
- Reason: "No log recorded."
- History: nothing to show; don't render the history block.
- Actions:
  - `HOLD WEIGHTS` (default) — autofill the next program with the same prescription as last session
  - `MARK MISSED` — flag this as a known missed session (won't trigger this rule again next time)
  - `SNOOZE`

### Rule 4 — Phase transition candidate

**Trigger:** A client has been in `linear` phase on a lift for 8+ sessions with the most recent 2 showing missed reps. The autofill engine is asking permission to advance to `rep_progression`.

**Card:**
- Reason: "Linear progression seems to be stalling. Ready for rep progression?"
- History: last 4 sessions' prescribed/actual.
- Actions:
  - `SWITCH TO REP PROG` (default, rust)
  - `STAY ON LINEAR` (snoozes the suggestion for 4 more sessions)
  - `MOVE TO STALLED` (admin escalation — flags for deeper coach intervention)

### Rule 5 — Form-flag + heavy day

**Trigger:** A client whose `form_consistency` profile field is `low` has a ramp day or top-set day prescribed in their next session.

**Card:**
- Reason: "Form flag is low and tomorrow has a heavy single. Confirm or change?"
- History: shows the prescribed top set inline, e.g., `200 lb × 1 prescribed`.
- Actions:
  - `KEEP AS PLANNED` (default — the trainer is signing off)
  - `SWITCH TO STRAIGHT SETS`
  - `SNOOZE 1 WK`

### Rule 6 — Long-tenure progression modifier check

**Trigger:** A client's `progression_modifier` is `slower` or `faster`, and the autofill engine has been applying it for 90+ days. Surfaces once per quarter as a sanity check.

**Card:**
- Reason: "Sarah's been on slower progression for 4 months. Still right?"
- History: a small chart or list of the last few weeks' progress on her main compound lifts.
- Actions:
  - `KEEP SLOWER` (default)
  - `BACK TO NORMAL`
  - `EVEN SLOWER`
  - `SNOOZE`

This rule is the lowest priority; ship if time allows in v1, otherwise defer to v2.

---

## 5. Item ordering

Items appear in this order, top to bottom:

1. **Items affecting today's session first.** If the client's draft for today is impacted by the decision, the card sits at the top. The trainer should resolve these before publishing.
2. **Items affecting the next session second.**
3. **Long-horizon items** (rule 6, quarterly modifier checks) at the bottom.

Within each group, sort by client name alphabetically (the trainer can scan top-to-bottom predictably).

The dashboard doesn't paginate or virtualize in v1 — if there are 30 items, the trainer can scroll. (If 30+ items is the steady state, the rules are too noisy and we revisit thresholds.)

---

## 6. Empty state

```
┌────────────────────────────────────────────┐
│                                            │
│              ✓                              │
│                                            │
│         No items today.                    │
│                                            │
│         The autofill engine drafted        │
│         every program without              │
│         needing your input.                │
│                                            │
└────────────────────────────────────────────┘
```

- Centered on the iron frame, no paper card.
- Check glyph (large, `iron-light`) or a hand-drawn "✓" SVG.
- Headline `type-display-md` in `iron-stencil`.
- Body `type-pencil-md` in `iron-stencil`.
- This is the *good* state. The trainer should see it most days. If he never sees it, the rules are too noisy.

---

## 7. Interactions

### 7.1 Tapping an action button

- Commits the decision immediately. No confirmation.
- Card animates out (slide left + fade, ~250ms).
- The trainer's chosen action is applied to the underlying state:
  - `HOLD WEIGHT` writes the same prescribed weight to the next draft for that client/lift.
  - `DELOAD` calculates the deload weight (-10%, rounded to nearest 5 lb) and writes it.
  - `REP PROG` updates the `progression_state.phase` to `rep_progression` for that client/lift, and the next autofill will reflect it.
  - `BUMP +10` writes a larger-than-default increment for next session only (one-shot, not a permanent rate change).
  - `MARK MISSED` flags the prior session as a known miss (the next autofill won't re-flag this).
  - `SNOOZE` stores a `snoozed_until` timestamp; the rule won't trigger again for this client/lift until that date.
  - `KEEP AS PLANNED` is essentially "snooze until next time the rule fires" — acknowledges without changing anything.

### 7.2 Tapping the client name (header)

Pushes the program editor for that client, focused on the affected lift (scrolled to it, lift row briefly highlighted in `rust`). Trainer can make broader edits and return.

### 7.3 Tapping the history snippet

Expands the snippet inline to show more sessions (last 8, say), with a small line chart underneath. Tap again to collapse. Useful for the rare case when 3 sessions of context aren't enough.

### 7.4 Swipe-to-snooze (iPad gesture)

Swipe a card left → quick `SNOOZE 1 WK`. Swipe right → quick "Open in editor." Optional polish; ship without if it complicates v1.

---

## 8. Where this screen lives

- **Tab bar entry** — third tab in admin, ⚠ icon, with badge count.
- **Inline access from program editor** — when a draft has flagged lifts, tapping the inline ⚠ on the lift row jumps to the relevant card on this screen. (Or: opens the action sheet inline. Decide during build.)
- **Optional: morning-prep banner on the roster** — "3 items need attention before publishing." Tap to jump here. Subtle; one line; dismissable.

The trainer should always be able to find this screen. He should never feel forced into it.

---

## 9. iPad layout

### 9.1 Portrait

- Standard list, full-screen. Same as the layout in §2.
- Cards span the full content width with `space-7` margins.

### 9.2 Landscape

- Two-column layout becomes possible: cards on the left (~480pt), focused card detail on the right (the affected client's lift history, expanded).
- Defer to v2 unless trivial. Single column works fine.

---

## 10. Performance

- Dashboard is computed server-side from the autofill engine's outputs. Fetch is one query; render is fast.
- Action commits should feel instant (optimistic UI: card disappears immediately, server confirms in the background).
- If a server-side commit fails (rare), the card reappears with a small toast: "Couldn't save. Try again?"

---

## 11. Accessibility

- Cards are scannable as a list with screen readers. Each card has a structured label: e.g., `aria-label="Attention item: Marcus, Deadlift, missed reps 2 sessions in a row at 95 pounds. Actions: hold weight, deload, switch to rep progression, snooze."`
- Action buttons are real buttons with clear labels.
- Same color/contrast/tap-target rules as the rest of the app.

---

## 12. What this screen is NOT

- **Not a notification feed.** Items don't pop up urgently. They sit and wait.
- **Not a coaching analytics tool.** It surfaces decisions, not insights. "Plot Marcus's deadlift over a year" lives on the client profile / trends view, not here.
- **Not editable in detail here.** Action buttons commit decisions; deeper editing happens in the program editor.
- **Not a chat with the system.** No free-text input on this screen. Every interaction is one of a small set of pre-defined actions.

---

## 13. Build order suggestion

1. **Static cards.** Hardcode 3 mock items, render the layout. Verify aesthetics on iPad.
2. **Wire up Rule 1 (repeated missed reps)** end-to-end: autofill engine flags, dashboard fetches, action buttons commit. Prove the round-trip on the most important rule.
3. **Add Rules 2, 3.** Same pattern.
4. **Empty state.**
5. **Tab bar badge count.**
6. **Tap client name → editor jump.** Wire navigation.
7. **Add Rules 4, 5.** Phase transitions and form-flag rules.
8. **Add Rule 6** (quarterly modifier check) — lowest priority.
9. **Snooze + state persistence.**
10. **Inline ⚠ on roster cards** linking back here.
11. **Polish: swipe gestures, animations, history-snippet expand.**

---

## 14. Open questions surfaced by writing this spec

1. **Threshold tuning.** "2 consecutive missed sessions" is the default for Rule 1. Could be 1 or 3. Pilot will tell us. Make the threshold a server-side config so we can tune without redeploying.
2. **Snooze durations.** "1 week" is generic. Some rules might want shorter (`until next session`) or longer (`until next month`). Defer per-rule snooze customization to v2 unless there's a clear v1 need.
3. **Rule 5 (form flag + heavy).** Requires a `form_consistency` profile field that the trainer must populate. If the trainer never sets it, this rule never fires. Worth building? Probably yes — it's the highest-stakes rule (preventing injury) and it's cheap to implement.
4. **Rule 6 (quarterly modifier).** Adds a recurring nag the trainer might find annoying. Consider building but defaulting to disabled, with a settings toggle.
5. **History snippet — chart vs text?** For most rules, 3–4 numbers in a line is enough. For Rule 4 (phase transition), a tiny sparkline would communicate "stalling" much faster than numbers. Worth one custom small-chart component.
6. **Bulk actions.** "Snooze all" exists; could we want "Hold weight on all flagged lifts for this client"? Probably not — bulk-snoozing is the only safe bulk action.
7. **Action audit trail.** Every action button click is a coaching decision. Should they be logged in a per-client coaching log the trainer can review later? Probably yes — useful for the "why did I deload Marcus 6 weeks ago?" question. Cheap to add.
