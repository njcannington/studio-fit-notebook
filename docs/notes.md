# Notes

**Status:** living
**Purpose:** capture trainer feedback, open questions, and ideas-to-defer so they don't pollute the [build-order](build-order.md).

This file is **not** the queue. Things here are either (a) waiting for a decision, (b) waiting for the right time to build, or (c) explicitly cut. When something here gets accepted into the queue, move it to [`build-order.md`](build-order.md).

---

## 1. Trainer feedback

Verbatim or close-paraphrase, dated, source noted.

### 2026-04-30 — first round of pilot link review
- **Per-set notes.** Clients need a way to explain a deviation. Example: "didn't get all 5 because I pulled a muscle." Source: text-message feedback after the trainer reviewed [the live link](https://njcannington.github.io/studio-fit-notebook/). **→ Promoted to build queue (item 1).**

---

## 2. Open questions surfaced during the build

Things we hit during implementation, made a call on, and want to revisit later. Most of these are also captured in `specs/logging-screen.md §12` — duplicated here so this file is the single drop point.

- **Tap-target proximity between tally circle and rep number** (~4px on phone). Mistaps observed in iPhone testing. Spacing them apart dilutes the notebook aesthetic. Style wins for now; revisit if pilot users complain.
- **Header shorthand cell display.** Homogeneous lifts collapse to `Press · 35 lb × 7 × 5` for client (with per-set cells still shown) and to header-only for admin. Open: how does admin author a *varied* prescription starting from a homogeneous one? Currently the only path is to make set 1 different so the row flips to varied mode.
- **Per-set weight overrides** ([logging-screen.md §3.4](specs/logging-screen.md)). Schema supports it (`sets.prescribed_weight`/`actual_weight` columns); UI doesn't render or edit per-set weight. Spec dot-separator visual is unverified.
- **Bodyweight (BW) lifts.** Editing weight on a `BW` lift overwrites the literal `BW` notation with a number. Edge case; not handled.
- **Undo "Mark complete."** Tapping the button is one-way in the production UI. The DB has the mutator (status setter on Me dev page) but no client-facing undo.
- **Caveat font on the wordmark.** `Studio Fit Notebook` clips the `k` on phone widths because Caveat's metrics are unusual; current fix is to break it into two lines. Revisit when we have a polished header treatment.
- **Tab bar safe-area inset.** Tab bar height doesn't reserve space for the home indicator on home-indicator iPhones. Visually fine but not polished.
- **`router.navigate` to `/(tabs)`** assumes the tab is index. Fragile if we add another route to the tabs group.
- **Sync indicator** (top-right pencil icon) is decorative. Will become real when sync exists; leave for now.
- **Default session time on add-client** is the current hour rounded down (e.g. "10:00 am"). No UI to edit. Trainer might want 15-min granularity.
- **Search ranking on client picker** — currently `name.includes()`. No fuzzy match, no recency weighting. Spec §14.3 raised this.
- **"Was X" lookup is per-lift, on every program load.** N queries per program render, where each is an indexed join. Fine for the demo; at scale (100s of clients × 100s of past programs), should batch-load priors for the visible program in a single query.

---

## 3. Cut for MVP

Explicitly out of scope for the "demo to the trainer / would you pay for this" milestone. Don't build these without a clear ask.

- **Backend / sync** — local-only is the demo plan. AWS path (Cognito + AppSync + RDS, manual sync via subscriptions) discussed and deferred.
- **Authentication** — no login. Dev role toggle covers admin/client distinction.
- **Templates manager** ([program-builder.md §6](specs/program-builder.md)).
- **Ramp day builder** ([program-builder.md §5](specs/program-builder.md)).
- **Live-update toasts** when admin edits a published program ([logging-screen.md §4.6](specs/logging-screen.md)) — needs sync.
- **Long-press on a roster row** (remove from today).
- **iPad landscape split view** ([program-builder.md §8.2](specs/program-builder.md)).
- **Multi-day calendar** for admin to scrub past dates.
- **Needs-attention dashboard** ([its own spec](specs/needs-attention-dashboard.md)).
- **Autofill engine** — the PRD's eventual differentiator, not in the MVP.
- **Live-update for trainer-edited published programs** ([logging-screen.md §4.6](specs/logging-screen.md)).
- **Lift picker autocomplete ranking** ([program-builder.md §14.3](specs/program-builder.md)).
- **Recurring-attendance suggestions when adding clients** ([program-builder.md §14.2](specs/program-builder.md)).
- **Publish All** ([program-builder.md §3.1](specs/program-builder.md)). Cut 2026-05-01: trainer wants to evaluate each program individually rather than rubber-stamp the day's drafts in one action. The bulk shortcut would train the wrong habit. Roster header no longer shows the affordance.
- **Bulk operations** beyond Publish All ([program-builder.md §14.5](specs/program-builder.md)).
- **Web-build feature parity** — current web build is a static demo with no persistence; no plan to make it a primary surface.

---

## 4. Process notes

- **Scope creep is the failure mode of this project.** The spec is the trainer's brief; the build order is the build queue. Not every spec section is on the queue (see "Cut for MVP" above). New ideas surfacing during a session land here, not in code, until promoted.
- **Trainer feedback is the queue's source of truth** for re-prioritization. The spec is the starting set; the trainer's review can re-rank or add items. New trainer asks log under §1, then get promoted to [`build-order.md`](build-order.md) if accepted.
- **The live link** ([https://njcannington.github.io/studio-fit-notebook/](https://njcannington.github.io/studio-fit-notebook/)) is the demo. The mockup ([`/mockup/`](https://njcannington.github.io/studio-fit-notebook/mockup/)) is the visual reference. Both auto-deploy from `main`.
