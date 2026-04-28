# Screen Spec — Program Builder

**Status:** v0.1
**Last updated:** 2026-04-27
**Surface:** Admin iPad (primary), desktop web (secondary)
**Priority:** High. This is where the trainer wins back his 2 hours/day. If creating or adjusting a program here is slower than writing in the notebook, the autofill engine has nothing to ride on.
**Companion docs:** [`design-tokens.md`](../design-tokens.md), [`logging-screen.md`](./logging-screen.md), [`prd.md`](../prd.md) §6.1, §6.2, §6.3

---

## 1. What this screen is

The trainer's daily working surface. He opens it on his iPad in the morning (or the night before) and sees every client's program for the day, already drafted by the autofill engine. He scans, tweaks, publishes.

Three jobs the screen serves:

1. **Review and publish autofilled drafts.** The 90% case. Most days, most clients, most lifts — the autofill is right and one tap publishes.
2. **Tweak the 10%.** Adjust a number, swap a lift, add a deload, convert a session to a ramp day. Inline editing, no modals.
3. **Build a brand-new program from scratch.** New client, never-before-trained lift, special session. Slower path, but rare.

The trainer never logs in to "do data entry." The system pre-stages everything; he reviews and adjusts. (PRD §5.)

---

## 2. The flow, top to bottom

The screen is two views layered:

- **Roster view** — the day's clients in a list. Default landing.
- **Program editor view** — one client's program, opened from the roster. Visually identical to the [logging screen](./logging-screen.md) with admin-mode controls layered on top.

These are not separate routes; they're a master/detail relationship. On iPad portrait it's a stack (tap a roster row → push the editor). On iPad landscape it's a side-by-side split (roster on the left ~320pt, editor on the right).

---

## 3. Roster view

### 3.1 Layout

```
┌──────────────────────────────────────────────────┐
│  ◀  Wed Apr 27                          ⋯  ✎    │  ← iron top bar
│ ─────────────────────────────────────────────── │
│                                                  │
│  TODAY                            PUBLISH ALL   │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │  6:00 am   Nic            DRAFT         ›  │ │
│  ├────────────────────────────────────────────┤ │
│  │  6:00 am   Sarah          PUBLISHED     ›  │ │
│  ├────────────────────────────────────────────┤ │
│  │  6:45 am   Marcus         DRAFT     ⚠   ›  │ │
│  ├────────────────────────────────────────────┤ │
│  │  6:45 am   Jen            COMPLETED     ›  │ │
│  ├────────────────────────────────────────────┤ │
│  │  7:30 am   David          DRAFT         ›  │ │
│  ├────────────────────────────────────────────┤ │
│  │  9:00 am   Pat            NO PROGRAM    ›  │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  + ADD CLIENT TO TODAY                           │
│                                                  │
│ ─────────────────────────────────────────────── │
│  📋 Today    👥 Clients    ⚠ Attention    ⚙    │  ← iron tab bar
└──────────────────────────────────────────────────┘
```

**Top bar (iron chrome):**
- Back chevron — returns to the multi-day calendar (a future view, not v1; for v1 this just goes back to the previous date).
- Date in display script — tappable to jump to a different day.
- ⋯ overflow — admin actions: "Jump to date," "Manage templates," "Export day."
- ✎ pencil — switches to a fresh "create new program" flow for someone not in today's roster (rare).

**`TODAY` block label** + **`PUBLISH ALL` button** on the right of that row. The button is enabled only when ≥1 draft exists; tapping publishes every draft for today's date in one action. Confirmation: a small toast `5 programs published`. No "are you sure" — the trainer can unpublish individuals.

**Roster rows.** One per client expected today. Each row:
- **Time** (left, block font, `type-block-md`, `ink-pencil-light`) — the trainer-entered session time. Time is informational; it doesn't drive any logic. Order rows by time ascending.
- **Client name** (handwriting, `type-pencil-lg`, `ink-pencil`).
- **Status pill** (block font, `type-block-sm`, in the status color from tokens — `status-draft`, `status-published`, `status-completed`, or empty/`NO PROGRAM`).
- **Attention badge** (⚠ in `rust`) — surfaces when the autofill engine flagged the draft for review (see needs-attention spec). Optional per row.
- **Chevron** (right edge) — visual affordance that the row pushes a detail screen.

Tap any row → opens the program editor for that client (§4).

**`+ ADD CLIENT TO TODAY`** at the bottom. For walk-ins or anyone not already in the roster. Opens a client picker (filterable list of all clients), then auto-creates a draft program for them using the autofill engine.

### 3.2 Status semantics

| Status | Meaning | Visual |
|---|---|---|
| `NO PROGRAM` | Client is on the roster but the autofill engine produced nothing (e.g., never trained before, or no template assigned). | Pill: empty/grey, `iron-light`. Tap → "create from scratch" flow. |
| `DRAFT` | Autofill produced a program. Trainer hasn't published it yet. | Pill: `status-draft` (`ink-pencil-faded`). |
| `PUBLISHED` | Trainer has published. Client can see it. | Pill: `status-published` (`ink-pencil`). |
| `IN PROGRESS` | Client has logged at least one set. | Pill: `status-published` color, with a small dot indicator. |
| `COMPLETED` | Session marked complete. Closing the session triggered the next draft. | Pill: `status-completed` (`ink-pencil-light`). |

### 3.3 Roster source (v1)

The roster is **trainer-maintained** in v1. He reads Wellness/Achieve in the morning and adds whoever's coming. Walk-ins are added the same way when they arrive.

Practical workflow:
- The roster persists across days for clients who train on a regular cadence (the system can suggest "Nic usually comes Mon/Wed/Fri at 6am" based on history).
- For v1, simplest is: yesterday's roster does NOT auto-populate today. The trainer adds clients fresh each morning. Why: avoids ghost rows for no-shows/cancellations; matches his current notebook prep ritual where he sets up books for who's actually coming.
- An alternative — auto-populate today's roster with recurring patterns and let him remove no-shows — is faster but riskier (he might publish a program for someone who isn't coming). Defer this until pilot feedback says it's worth the risk.

---

## 4. Program editor view

This is the [logging screen](./logging-screen.md) with admin permissions enabled. Re-read that spec; this section adds the admin-only deltas.

### 4.1 What's the same

- Same paper-on-iron layout
- Same handwriting type for content
- Same tap-the-circle and tap-the-number interactions
- Same custom number pad
- Same strikethrough rendering when actual ≠ prescribed

### 4.2 What's different in admin mode

```
┌──────────────────────────────────────────────┐
│  ◀  Nic — Wed Apr 27       EDITING    ✎     │  ← iron top bar with mode pill
│ ─────────────────────────────────────────── │
│                                              │
│  ┌────────────────────────────────────────┐ │
│  │                                        │ │
│  │   Press      35 lb    1/27             │ │  ← was 30
│  │   ●  7   ●  7   ○  7   ○  7   ○  7    │ │
│  │                                        │ │
│  │   Squat 16"  +25 lb                   │ │  ← was +20
│  │   ○  10   ○  10   ○  10   ○  10        │ │
│  │     ○  10                              │ │
│  │                                        │ │
│  │   DL    85 lb         ⚠                │ │  ← was 80, but missed last 2
│  │   ○  5   ○  5   ○  5   ○  5            │ │     phase transition flagged
│  │                                        │ │
│  │   + ADD LIFT                            │ │
│  │                                        │ │
│  └────────────────────────────────────────┘ │
│                                              │
│              [   PUBLISH   ]                 │  ← rust button
│                                              │
│ ─────────────────────────────────────────── │
└──────────────────────────────────────────────┘
```

**Mode pill** in the top bar: a small `EDITING` block-style pill in `rust`. Always visible in admin mode. Removes ambiguity between "looking" and "editing."

**"Was X" annotations** to the right of each lift's weight. Small, `type-pencil-sm`, `ink-pencil-faded`. Tells the trainer at a glance what the prior session's prescription was, so he can sanity-check the autofill's choice. Tap the "was X" text to expand a small tooltip showing the last 4 sessions' prescriptions for that lift.

**Attention badge** (⚠) inline on a lift row when the autofill engine flagged it. Tap → expands an inline note: "Missed reps on this lift twice in a row — consider switching to rep progression." See the needs-attention spec for the full set of rules.

**`+ ADD LIFT`** at the bottom of the program. Tap → lift picker (autocomplete from the canonical lift list, with the trainer's shorthand — see PRD Appendix A). Selecting a lift adds it to the bottom of the program with sensible defaults (e.g., 3 sets of 10 at a starter weight, which the trainer immediately edits).

**Long-press on a lift row** opens an action sheet (already specified in [logging-screen.md §8.2](./logging-screen.md)):
- Add set
- Remove set
- Swap lift
- Convert to ramp day (opens ramp builder — see §5)
- Add note
- Remove lift

**`PUBLISH` button** at the bottom of the screen, full-width on phone, fixed-width 240pt centered on iPad. Background `rust`, text `paper-cream`, block font (`type-block-lg`), letter-spaced. Disabled while the program is `published` (replaced by a quieter `Unpublish` link); gone when `completed`.

### 4.3 Notes

Two kinds of notes:

- **Program-level note.** A small expandable text area at the very top of the paper card, under the date. Collapsed by default with a `+ Add a note` link. When expanded, a single-line text field with placeholder "Notes for this session." Visible to the client when the program is published. Use case: "Today we'll focus on form, not weight."
- **Lift-level note.** Long-press a lift → "Add note." Renders as a small italic line of `type-pencil-sm` text directly under the lift, indented. Visible to the client. Use case: "Pause 1 second at the bottom."

Notes are not searchable in v1. They're freeform text the trainer writes for the client to read.

---

## 5. Ramp day builder

When the trainer long-presses a lift and chooses "Convert to ramp day," a focused inline editor opens for that lift only. The rest of the program stays visible above and below.

```
┌────────────────────────────────────────────┐
│   DL — RAMP                          ✕     │
│ ───────────────────────────────────────── │
│                                            │
│   Top set:    [ 200 ] lb × [ 1 ] reps    │
│                                            │
│   Warmups (auto-generated):                │
│   95 × 5    135 × 5    160 × 3    185 × 1 │
│                                            │
│   Backoff:    [ 190 ] lb × [ 5 ] reps    │
│                                            │
│            [   APPLY   ]                   │
└────────────────────────────────────────────┘
```

Three inputs:
- **Top set** weight and reps. The peak.
- **Warmups** are auto-computed from the top set as a 4-step ramp (rough thirds). The trainer can edit any warmup weight inline; the system stops auto-generating once any value is hand-edited.
- **Backoff** weight and reps. Optional — uncheck to skip.

Apply commits the ramp as a series of `program_entry_sets` for that lift.

**Why a focused editor and not the standard set-list editor?** Ramp days have a distinct mental model — "I'm building toward a top single, then dropping for a backoff." The dedicated UI matches the trainer's mental model in 5 seconds; a generic set-list editor takes 30 seconds and 6+ taps. Worth the extra component.

---

## 6. Templates

A template is a named program shape attached to a client (e.g., "A Day," "B Day," "Lower Heavy"). Programs are instances of templates. Autofill always reads the most recent program *of the same template* for the client. (PRD §6.3.)

In the program editor, the template assignment is visible as a small block label under the client's name in the top bar:

```
Nic — Wed Apr 27   ·   A DAY
```

Tap the template label to switch templates for this program (rare; usually correct from autofill).

A separate **Templates manager** lives under the ⚙ tab → "Templates":
- Per-client list of templates with their rotation order
- Create/rename/delete templates
- Reassign a client's rotation
- Templates can also be cloned across clients ("apply Nic's A Day to Marcus")

The templates manager is a v1 feature but a low-priority one. Build it after the editor and roster are solid.

---

## 7. New-program-from-scratch flow

For new clients or unusual sessions where autofill produces nothing.

From the roster, tap a `NO PROGRAM` row (or `+ ADD CLIENT TO TODAY`):

1. **Pick a template** (or "no template / one-off").
2. **Pick a starting point:**
   - "Use my New Client template" (a saved template with the trainer's standard onboarding lifts)
   - "Copy from another client's program" (search clients, pick a recent program, system clones the structure with weights stripped)
   - "Empty program" (drops into the editor with zero lifts)
3. The editor opens with the chosen starting point as a draft. Trainer adjusts and publishes.

This flow is rare. Keep it accessible but don't optimize for speed — speed is for the autofill path.

---

## 8. iPad-specific layout

### 8.1 Portrait (768 × 1024)

- Roster is a full-screen list. Tap row → push editor.
- Editor uses the layout from [logging-screen.md §5](./logging-screen.md), max-width 720pt centered.
- Top bar back chevron returns to roster.

### 8.2 Landscape (1024 × 768) — the daily-driver orientation

- Split view: roster on the left (320pt), editor on the right.
- Tapping a roster row updates the editor without navigation.
- Roster row is highlighted (`rust` left-border bar) when its program is open.
- Trainer can publish, walk to the next client physically, then tap the next row without losing context.

### 8.3 Desktop web (bonus, not primary)

- Same as iPad landscape, with mouse-friendly hover states (subtle background tint on roster rows).
- Keyboard shortcuts (deferred to v2 unless trivial): ↑/↓ to move between roster rows, Enter to focus the editor, Cmd+Enter to publish current program.

---

## 9. States

### 9.1 First-of-the-day (no programs drafted yet)

If the trainer opens this screen before the autofill engine has run for any client (e.g., very early in the morning, or after a system glitch), show:

```
┌────────────────────────────────────────────┐
│                                            │
│         No programs drafted yet for        │
│         today.                             │
│                                            │
│         [ + ADD CLIENT ]                   │
│                                            │
│         Drafts auto-create when a          │
│         client's previous session closes.  │
│                                            │
└────────────────────────────────────────────┘
```

Reminds the trainer that drafts come from session closures, not from this screen. The "+ ADD CLIENT" button kicks off the new-program flow.

### 9.2 All published

When every draft on today's roster is published (or completed), the `PUBLISH ALL` button is replaced by a small `All published` block label in `ink-pencil-light`. No call to action.

### 9.3 Editing a published program

Editing is allowed (PRD §6.2 — edits propagate live). When the trainer changes a value on a published program, no confirmation modal — but the change is logged in the audit trail (`last_edited_by`, `edited_at`) and the client's logging screen shows the live-update toast (logging-screen.md §4.6).

### 9.4 Editing a completed program

Allowed for retroactive corrections. Visual treatment: the `EDITING` mode pill in the top bar gains a `· COMPLETED` suffix to remind the trainer the session is in the past.

---

## 10. Performance

The trainer flips through 8 clients in ≤2 minutes if everything is right. Implications:

- **Roster loads instantly.** Cached locally; refreshes in the background.
- **Tapping a roster row opens the editor in <100ms.** The editor data should be pre-fetched when the roster row is rendered.
- **Saving an edit is instant.** Local-first, then sync. The trainer never sees a spinner.
- **Publishing 8 programs at once is one network round-trip,** not 8. Batch the API call.

Network slowness should never block the trainer's flow. He should be able to draft, edit, and "publish" 8 programs entirely offline; sync happens when wifi returns.

---

## 11. Accessibility

Same baselines as the logging screen (logging-screen.md §7). One additional consideration:

- The trainer is the *only* user of this screen who isn't a paying client. He has authority to design it for *himself*, not for accessibility broadly. But: keep tap targets at 44pt for one-handed iPad use, and keep contrast at AA — he'll appreciate it when he's tired at 9pm prepping the next day.

---

## 12. What this screen is NOT

- **Not a calendar / scheduling tool.** v1 has no booking system. The roster is just "who the trainer says is coming today."
- **Not a coaching analytics dashboard.** That's the needs-attention dashboard, separate spec. This screen surfaces *individual* attention flags but doesn't aggregate them.
- **Not a client-management surface.** Editing client profiles (age, injuries, progression modifier) lives under the Clients tab, separate.
- **Not where templates are built.** That's a separate manager screen under settings.

---

## 13. Build order suggestion

1. **Roster view, static.** Hardcode 6 clients in mock state. Verify the iron + paper feels right. Confirm row tap navigates to a placeholder editor.
2. **Program editor — read-only first.** Re-use the logging screen component in a "read-only admin" mode. Verify it renders the same.
3. **Edit mode.** Wire up tap-to-edit values, tap-to-toggle ticks (already inherited from the logging screen). Confirm changes persist locally.
4. **Add lift / remove lift / swap lift.** Long-press menu, lift picker. Local state only.
5. **Publish / unpublish.** Wire to backend. Verify status updates roster.
6. **Publish All.** Bulk action.
7. **Ramp day builder.** Standalone component.
8. **Templates label** in the editor top bar. Tap-to-switch is a v1.5 polish.
9. **Notes (program-level and lift-level).**
10. **Add client to today / new program from scratch.**
11. **iPad landscape split view.** Last, because it's a layout reorganization rather than new functionality.

---

## 14. Open questions surfaced by writing this spec

1. **Roster carry-over.** Does yesterday's roster auto-populate today, or does the trainer add fresh each morning? Spec defaults to fresh; pilot will tell us.
2. **Recurring-attendance suggestions.** When adding a client, the system could suggest "Nic usually comes Mon/Wed/Fri" based on history. Worth doing in v1, or wait for the trainer to ask?
3. **Lift picker autocomplete.** Should it order by frequency-of-use for this client, alphabetically, or by recency? Probably frequency for this client; verify with the trainer.
4. **Ramp warmup auto-generation algorithm.** Rough thirds is a start; the trainer may have a specific preference (50/70/85/95 percent? plate-jump-friendly?). Confirm with him before building.
5. **Bulk operations beyond Publish All.** Do we need "apply +5 lb to bench across every published draft today" or similar? Probably not in v1; defer.
6. **Multi-day view.** The trainer might want to see Wed and Thu side-by-side when prepping. Defer to v2 unless pilot feedback demands it.
