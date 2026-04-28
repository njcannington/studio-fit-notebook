# The Studio Fit Notebook — Product Requirements

**Status:** Draft v0.2 — open questions resolved with trainer
**Owner:** Nic
**Last updated:** 2026-04-27

---

## 1. Problem

A personal trainer at a single small gym writes hand-lettered strength programs into composition notebooks for each client, every session. He runs an A/B-split style of programming: every session is a new page, with prescribed lifts, weights, sets, and reps. Clients arrive, pick up their notebook, log results in pencil (tally marks for completed sets, strikethroughs when they fall short), and return it. The trainer reviews the logs and writes the next session.

The system works. Clients like it. The trainer values "the authentic feel." But it costs him roughly **two hours a day writing programs** — time he'd rather spend on the floor coaching. And it imposes hidden costs: clients can't see programs ahead of time, can't train when traveling, and have no record of their training history beyond what's in the books. There's no way to recover a lost or destroyed notebook.

The opportunity is to digitize the workflow without losing what he and his clients value about it. The single most important outcome is **giving him back coaching hours by automating the 90% of program prep that follows predictable progression rules** — while keeping the trainer firmly in the loop for the 10% that requires judgment.

## 2. Users

**Trainer (admin)** — runs the gym, programs all clients, coaches in person. Wants to spend less time at a desk and more time on the floor. iPad-native workflow preferred so he can walk around with it. Will not adopt anything that feels like generic fitness software.

**Clients** — strength clients of varying ages, comfort levels, and tech-savvy. Some bring phones to the gym; some don't. Some travel and would benefit from training away from the gym. All are accustomed to receiving their program at the moment they arrive.

**Walk-in / loaner-iPad clients** — clients who don't bring a phone. They use a shared iPad kept at the gym, signing in by tapping their name on a roster.

## 3. Goals

**Primary**
- Reduce the trainer's daily program-prep time substantially (target: from ~2 hours to under 30 minutes for a typical day).
- Preserve the visual and emotional character of the notebook — it is the only thing the trainer would miss if it went away.
- Keep the trainer in the loop on every consequential decision; never advance a client's program in a way that could embarrass him.

**Secondary**
- Give clients access to their programs and history on their own devices.
- Enable training outside the gym (travel, illness, schedule conflicts).
- Eliminate the risk of losing a client's training history to a lost or damaged notebook.

**Explicit non-goals (v1)**
- Replacing Wellness (the third-party app the gym uses for scheduling, waivers, payments, and reminders; "Achieve" is its scheduling sub-feature). The app coexists.
- Programs for pilates or open-cardio classes (those classes use Wellness for booking only and don't require per-session programs).
- Multi-tenancy, white-labeling, or selling to other gyms.
- Video demonstrations, social features, leaderboards, wearable integrations.
- Payments of any kind.
- AI-generated programs. The trainer's expertise is the product; we automate his patterns, we don't replace his judgment.

## 4. Success criteria

The pilot succeeds if, after one month of full use:
- The trainer reports spending less than 45 minutes per day on program prep.
- At least 80% of next-session programs are accepted by the trainer with zero or trivial edits.
- No client reports preferring the paper notebook over the app.
- The trainer keeps using it after the pilot (the strongest possible signal).

## 5. Core workflow (the happy path)

The morning of, or the night before, the trainer opens the admin app on his iPad. He sees today's roster: every client booked for a strength class, in time order. Each client's program for today is **already drafted** by the system — autofilled from the client's last session of the same template (A day, B day, etc.), with weights advanced according to the client's progression phase for each lift.

He scans each draft. For most clients, the autofill is right; he taps publish. For a few, he tweaks a number, swaps a lift, or applies a deload — then publishes. He can use a "publish all today" action when he's ready to make the day live in bulk.

Clients open the app when they're ready to work out and see today's prescribed lifts in a layout that visually echoes the notebook page. (No push notification fires on publish; the program is simply there when they look.) During the workout they tap a circle to mark a set complete; if reality diverged from the prescription, they tap the number and edit it. Edits are saved instantly to the device, syncing in the background.

If the gym wifi drops mid-workout (it often does), nothing breaks. The phone is the source of truth during the session; sync resumes when connectivity returns.

After the session, the trainer can pull up the client's day on his iPad while walking the gym, see what actually happened, and make on-the-fly adjustments for next time. Because edits propagate live, the next-session draft is already updating as he thinks.

The trainer never logs into the system to "do data entry." The system pre-stages everything; he reviews and adjusts.

## 6. Functional requirements

### 6.1 Program prescription

- Programs are dated and assigned to one client.
- A program is a flat ordered list of lifts. (No exposed grouping, supersets, or "blocks" — the trainer doesn't write those, and the client doesn't need them.)
- Each lift in a program has one or more prescribed sets. Each set has its own target reps, target weight, set type (warmup, work, top set, backoff, AMRAP), and unit (reps or seconds). Per-set rows are required because the trainer's notebook expresses four distinct patterns:
  - **Straight sets:** same weight and reps across all sets (`Pulldown 55×3×12`)
  - **Warmup + work:** a light warmup followed by working sets (`Press 15×7  30×5×7`)
  - **Ramp + backoff:** every set a different weight building to a top single, then a backoff set (`DL 95×5  135×5  160×3  185×1  200×1 | 190×5`) — used periodically, especially at the end of training cycles or to break plateaus
  - **Variable reps per set:** same weight, decreasing reps (`Inc DB 30×12,10,8`)
- Weight notation must accept bodyweight (`BW`), bodyweight-plus (`+15`, `BW+20`), and absolute numeric values. Notation is stored as a string in v1; only the autofill engine parses it for arithmetic.
- Each program belongs to a **template** (e.g., "A day," "B day," "C day"). Templates define the rotation a client is on. Autofill always references the most recent program of the same template, not just the most recent program.

### 6.2 Publish workflow

- The autofill engine creates the next program as a **draft** the moment the prior session is closed (marked complete). Drafts exist immediately; they are visible only to the trainer.
- A draft becomes visible to the client only when the trainer publishes it. Publishing is **always manual** — there is no scheduled or automatic publish.
- Publishing can happen at any time — night before, morning of, or at the moment of arrival. The trainer's preference may vary by client and is not constrained by the system.
- A bulk "publish all today" action exists for the morning ritual.
- Edits to a published program propagate live to the client's device. The client app indicates when a published program has been updated by the trainer.
- Programs can be unpublished (reverted to draft).
- After a session is complete, programs move to a "completed" state. They remain editable for retroactive corrections, and closing a session immediately triggers the next draft for that client (continuing the cycle).
- No push notification fires on publish. The client opens the app when ready to work out and the program is there. (See §8.)

### 6.3 Autofill (the core value feature)

When the trainer opens tomorrow's roster, every client's program is pre-drafted by the autofill engine. The engine reads the client's most recent program of the same template, looks at what the client logged, and applies the appropriate progression rule per lift.

**Progression is a four-phase state machine maintained per (client, lift):**

1. **Beginner.** Bigger jumps (10–15 lb on compounds, +5 on others) until the client can no longer sustain them.
2. **Linear.** +5 lb per session for as long as the client can hold form. This is the trainer's default for established clients on barbell lifts.
3. **Rep progression.** When linear stalls, the client holds weight and climbs reps over a four-session cycle (e.g., 100×4 → 100×5 → 100×6 → 100×6, then +5 lb back to 4 reps, repeat).
4. **Stalled.** Indicates the client needs coach intervention beyond the algorithm.

Phase transitions are **trainer decisions, not automatic.** The system surfaces candidates ("client failed reps twice at 100 lb on bench — consider rep progression") on a needs-attention dashboard. The trainer chooses to advance or hold.

**Per-client progression modifier** lets the trainer mark clients who progress slower or faster than default. The trainer cited four populations needing slower progression: clients with recent or chronic injuries, older clients (slower recovery), clients in a calorie deficit, and clients who are weight-tentative.

**The autofill rule per lift, given the phase:**
- All prescribed reps hit → advance per phase rule
- Any work set missed → hold the prescription, flag for trainer review
- No log at all → hold the prescription, flag

**Autofill source** is always "the most recent completed program for this client of this template." For an A/B split, Friday's A-day draft pulls from the previous A-day (not Wednesday's B).

### 6.4 Logging (client side)

The logging screen is the most-used surface in the app. Its design rules are not negotiable:

- **No edit mode.** Every number on screen is directly tappable. Tap a rep count or weight; a numeric keypad slides up; type the new value; done.
- **Strikethrough, never overwrite.** When the client edits a prescribed `5` to an actual `4`, the screen shows `~~5~~ 4`. The prescription stays visible. This matches the notebook exactly.
- **Tap the circle to mark a set complete.** A pencil-tick animation fills it.
- **No save buttons, no confirmations, no undo prompts.** Last edit wins. Edits save to local storage immediately; sync is silent and background.
- **No modals.** The number keypad slides up over the screen; the lift row stays visible above it.
- **Sets render in a row, not as a list.** `DL  80 lb  ● 5  ● 5  ● ~~5~~ 4  ● ~~5~~ 2`. Matches notebook density. If a set's weight diverges from the lift's default, that set expands inline to show its own weight.

The bar this screen must beat: the trainer estimates a pencil strike + rewrite at ~4 seconds, zero cognitive load. If the digital flow is slower or more cognitively expensive than that, the app fails its core promise.

### 6.5 Offline behavior

The gym has poor wifi and cellular signal. Offline is the **primary** logging path, not an edge case. This shapes the architecture:

- The phone is the source of truth during a session. The server is a sync target, not a real-time dependency.
- A locally cached program remains fully usable — viewable and loggable — without any network connectivity.
- Local writes queue and sync when connectivity returns. The user never sees an "offline" error mid-workout.
- A subtle indicator distinguishes synced state from queued-locally state (a pencil icon vs an ink-pen icon, fitting the aesthetic).
- Conflict rules:
  - Logged sets: last-write-wins per set per device. Collisions are rare in practice (clients edit only their own logs).
  - Prescribed sets: the trainer wins. If the client is offline viewing a program the trainer has since edited, the trainer's version applies on next sync.
  - Bookings: not applicable in v1 (Wellness/Achieve owns scheduling).

The admin web app (iPad) also requires offline tolerance. Service-worker caching and form-state persistence to IndexedDB ensure the trainer can edit programs in the gym even if wifi drops.

### 6.6 Admin (iPad-primary)

The trainer prefers to walk the gym with an iPad, pulling up clients' programs in real time and making adjustments while coaching. The admin is a responsive web app, optimized first for iPad portrait and landscape, secondarily for desktop.

Required admin views:

- **Today's roster.** Every client the trainer expects today (drawn from his manual reading of the Wellness/Achieve schedule, plus walk-ins), in time order, with status indicators (draft, published, in progress, completed). One-tap to open a client's program. The roster is trainer-maintained in v1; native scheduling is a v2 goal (see §9.5).
- **Program editor.** The same visual layout as the client logging screen. The trainer sees what the client sees, with edit access to prescribed values. This is intentional: one screen, two permission modes — not two parallel UIs.
- **Client profile.** Name, age, training start date, comfort level, form consistency, goals, chronic injuries, lift history notes, progression modifier (slower/normal/faster). These fields came directly from the trainer's "head knowledge" list — things he carries about each client that aren't in the notebook today.
- **Per-lift trend chart.** Four to six weeks of prescribed vs actual for a given lift on a given client. The trainer flips back through notebook pages today for exactly this view; we replace it with a chart.
- **Needs attention dashboard.** Surfaces the 10% of cases the autofill engine wants the trainer to look at: missed reps two sessions running, exceeded prescription multiple sessions, no log recorded, candidates for phase transition.
- **Templates.** Create and manage templates (A day, B day, etc.) and assign clients to rotations.

Tap-target minimums (44pt), no hover-dependent interactions, and every reveal works on tap.

### 6.7 Loaner iPads

The gym keeps approximately three iPads available for clients who don't bring a phone. Operational model:

- Devices live at the front desk, charged there between uses.
- The trainer hands them out, installs the app, and handles communication if a device goes missing. There is no front-desk staff role to design around.
- A loaner iPad runs the same client app in **kiosk mode**.
- On open, it shows a roster of clients in the current class window. The user taps their name; their program loads.
- After a configurable idle timeout (default 30 minutes) or explicit "I'm done" action, the device returns to the roster screen.
- Loaner sessions are flagged in the database (`device_kind = loaner_ipad`) for audit purposes.
- No PII beyond first names appears on the roster screen.

### 6.8 Roster, booking, and walk-ins

Booking is handled by Wellness (a third-party app the gym already uses; "Achieve" is its scheduling sub-feature). Wellness also handles waivers, payments, reminders, and other client-facing communications. The Studio Fit Notebook app does not duplicate any of this in v1.

Operational model:

- The trainer reads the Wellness/Achieve schedule as part of his existing morning routine.
- The Studio Fit Notebook app is independent of Wellness; it has no integration with it in v1.
- The autofill engine drafts the next program for each client **the moment their previous session is closed** — not based on a future booking. By the time any client (booked or walk-in) arrives, their next program is already drafted and waiting.
- The trainer reviews and publishes drafts as needed. Walk-ins are handled identically to booked clients: their draft is already there, the trainer publishes it.
- The 8-person class cap is informal — a guardrail to keep racks open, not a hard timeslot. No cap-enforcement UI is needed.
- A 9th client (walk-in or call-ahead) is an unremarkable case: they get their published program like anyone else.

Native scheduling is a v2 goal (see §9.5). Until then, the trainer is the source of truth for who is in the gym; the app focuses entirely on the program workflow.

### 6.9 History

Every published program and every logged session is preserved indefinitely. Clients can browse their history. The trainer can browse any client's history. History is the basis for future trend analysis and is also the disaster-recovery story (no more "I lost my notebook").

## 7. Aesthetic requirements

The trainer's only positive answer to "what would you miss about the notebook" was **"the authentic feel."** This is not decorative — it is the single retention feature he cares about. The app must feel like a notebook in a 70s-iron gym, not like generic fitness software.

Design language:
- **Composition-notebook surfaces.** Off-white paper texture (~#F4F0E4), ink black (~#2D2A26) for prescribed values, ruled-line backgrounds for program rows, marbled black-and-white treatment for headers and the launch screen.
- **Hand-drawn details.** Dividers between programs are slightly wavy (matching how the trainer draws horizontal rules between sessions on a page). Tally marks, when used, are grouped in fives with a diagonal slash.
- **Iron-gym accents.** Warm leather-brown and oxidized iron tones for accent elements — buttons, status indicators, navigation chrome.
- **Typography.** A handwriting-leaning display face for program headings and logged values; a clean serif for body; tabular monospace for numbers (so columns of weights and reps align).
- **Crossed-out values for changed prescriptions.** When a target weight changes between sessions, render the old value with a pencil-style strikethrough next to the new. The client sees their own progression at a glance.
- **No Material crispness, no iOS-default chrome.** Buttons and icons should be slightly imperfect, line-drawn, with the texture of pencil on paper.

The design pass for the three core screens (client logging / admin program view, admin program builder, needs-attention dashboard) is a load-bearing milestone, not optional polish. Approach: written screen specs + a visual reference board, built directly in code rather than mocked in Figma. Solo build with no designer means polished mockups have no audience; the trainer reviews real screens on a real iPad.

## 8. Non-functional requirements

- **iOS, Android, web.** React Native + Expo for the client mobile app, Next.js for the admin web. PWA install on iPad provides app-like experience without an iPad-native app build.
- **Sync.** PowerSync + Supabase, chosen over hand-rolled WatermelonDB for the same reason a single-gym app should not write its own sync engine: the failure modes of offline-first software ("my data disappeared") are catastrophic for trust. Use a battle-tested solution.
- **Authentication.** Magic-link email by default; Apple and Google sign-in for clients on personal devices. Loaner iPads use a kiosk session with no per-client login.
- **Push notifications.** Not required in v1. The trainer specifically declined push on program publish: "the client really only needs the program when they're ready to work out." If push becomes useful for some other purpose later (mid-session program edits, trainer broadcasts), Expo Notifications and web push would be the path.
- **Data durability.** Every local write is journaled with a UUID and is never deleted from the device until the server acknowledges it. Schema migrations on the device must preserve unsynced writes.
- **Audit trail.** Every program edit is attributed (`last_edited_by`, `edited_at`). Useful for debugging and for the trainer reviewing his own changes later.

## 9. Open questions

All open questions from PRD v0.1 were resolved with the trainer on 2026-04-27. Resolutions are folded into the relevant sections above. Summary of what was decided:

- **Publish timing.** Drafts are auto-generated the moment the previous session closes. Publishing is always manual — no defaults, no scheduled auto-publish. (See §6.2 and §6.3.)
- **Loaner iPads.** Three devices, kept at the front desk, charged there, app installed by the trainer, trainer owns recovery if one walks off. (See §6.7.)
- **Wellness/Achieve.** Wellness is the third-party app that owns billing, scheduling, waivers, payments, and reminders. Achieve is its scheduling sub-feature. The Studio Fit Notebook app does not duplicate any of this; it focuses entirely on the program workflow. (See §6.8.)
- **Walk-ins.** Identical to booked clients. Their next-session draft is already waiting; trainer publishes when they arrive. No special UI flow needed. (See §6.8.)
- **Class-cap overrides.** Non-issue. The 8-person cap is informal — a guardrail to keep equipment open, not a hard slot. No enforcement UI. (See §6.8.)
- **Pilot candidates.** Trainer will name 3–5 tech-savvy, consistent (3x/week) clients closer to pilot launch. No commitment needed now.
- **Push on publish.** Not needed. Clients open the app when ready to work out; the program is there. Push infrastructure is not required for v1. (See §8.)
- **Body composition scans.** Out of v1 entirely. The InBody machine is a third party with no committed integration path. Schema does not need to accommodate scan attachments. (See §10.)
- **Apple Pencil notes.** Tap-only is fine for v1. Preserved on the v2 roadmap. (See §9.5.)

New questions raised by this PRD revision will be tracked in this section.

## 9.5 v2 roadmap (parking lot)

Things we want to build *after* v1 ships and stabilizes. Listed here so the team has a place to capture future direction without polluting v1 scope. Order is rough priority, not commitment.

- **Native class scheduling.** Replace the trainer's manual reading of Wellness/Achieve. Clients book strength and pilates classes directly in the app; soft capacity (8/class informal cap) tracked but probably not enforced; no-shows and cancellations recorded. Wellness continues to handle billing, waivers, and reminders.
- **Pilates and open-cardio class support.** Booking only at first (no per-session programs); pilates may eventually get its own program format if the trainer wants it.
- **InBody composition scan integration.** Investigate whether the InBody machine has an API; if so, attach scan history to client profiles and surface overtraining signals on the needs-attention dashboard.
- **Apple Pencil margin notes.** If the trainer uses a stylus, capture handwritten annotations on programs as ink, alongside or instead of typed notes.
- **Per-lift trend analytics.** Beyond the simple chart in v1: 1RM estimates, volume tracking, time-under-tension, plateau detection. Coach-facing first; client-facing later if useful.
- **Lift video demonstrations.** Embedded form videos per lift, optionally trainer-recorded. Useful for traveling clients or new lifts.
- **Smart phase-transition suggestions.** v1 surfaces candidates for phase transitions; v2 could recommend specific actions ("switch to rep progression at 100×4," "deload to 90 lb for one week").
- **Wellness/Achieve API integration (if available).** If Wellness exposes an API for bookings, replace the manual-read workflow with a synced roster. Investigate viability before committing.
- **Payments and memberships.** The big one. Replaces Wellness's billing role and lets the app become the single system of record. Requires Stripe integration, membership tiers, payment-failure handling, and a real legal/tax review. Multi-month effort.
- **Multi-tenancy and white-labeling.** If the trainer wants to license the system to other gyms, or open his own additional locations. Architectural shift; defer until there's demand.
- **Wearable integrations.** Apple Watch / Whoop / Garmin for HRV-informed deloads, heart rate during cardio, etc. Nice-to-have, not core.
- **Social features.** Client-to-client visibility, leaderboards, sharing PRs. Explicitly *not* the trainer's style; only build if clients ask repeatedly.
- **AI-assisted program review.** Not generation — that replaces the coach. But "here are five clients whose recent logs look unusual, here's why" could amplify the trainer's attention. Cautious, late-stage.

## 10. Out of scope (v1)

To prevent scope creep, the following are explicitly deferred:

- Pilates and open-cardio class programs
- Billing, payments, memberships
- Multi-tenancy, white-labeling, additional gyms
- Video demonstrations of lifts
- Social features, leaderboards, sharing to other clients
- Wearable integrations (Apple Watch, Whoop, Garmin)
- AI-generated programs or AI coaching commentary
- Body composition scan ingestion (third-party InBody device; no integration in v1)
- Apple Pencil ink capture
- Push notifications of any kind
- Native class scheduling and capacity enforcement (Wellness/Achieve handles this in v1)
- Marketing site, public landing page, app-store listing copy beyond what's required to ship

## 11. Risks

- **Trainer non-adoption.** His current flow is muscle memory. If admin entry is slower than writing in a notebook, he will quit. Mitigation: iPad-form-factor design specs reviewed against the actual device early, autofill as the default state, a real on-site pilot before broad rollout.
- **"My data disappeared."** Offline-first apps fail catastrophically when sync drops a write. Mitigation: PowerSync over hand-rolled sync; UUID-journaled local writes; no destructive local cleanup until server acknowledges; a debug screen for inspecting sync state.
- **Aesthetic-vs-usability tension.** The notebook aesthetic uses thin lines, small numbers, and pencil-grey contrast — none of which are accessible defaults. Mitigation: accessibility audit with the trainer's actual older clients during the pilot.
- **Wellness dual-system fatigue.** Clients keep two accounts (Wellness for scheduling/billing/waivers, this app for programs) for the foreseeable future. Mitigation: minimize friction by mapping accounts on email match and not requiring re-entry of profile info.
- **Progression engine misfires.** A wrong autofill that the trainer publishes without catching could embarrass him in front of a client. Mitigation: phase transitions are always trainer-approved, never automatic; needs-attention dashboard surfaces edge cases; trainer can unpublish at any time.
- **Solo-build velocity.** ~20 weeks of part-time work is generous; reality may be more like 6–9 months. Mitigation: ruthless v1 scope, defer everything in §10.

## 12. Rough timeline

| Phase | Scope | Effort |
|---|---|---|
| Discovery | Trainer questionnaire, photo collection, real seed data | Done (2026-04-27) |
| Design specs + reference board | Written specs for the three core screens (logging/admin program view, program builder, needs-attention dashboard), design tokens (colors, type, spacing), visual reference collection | 1 week |
| Backend foundation | Supabase + PowerSync setup, schema, auth, seed data | 2 weeks |
| Admin web MVP | Roster (trainer-maintained), program editor (shared with logging screen), templates, client profile | 3 weeks |
| Client mobile MVP | Auth, today's program, logging, history — local-first from day one | 4 weeks |
| Progression engine | Four-phase state machine, autofill, needs-attention dashboard | 2–3 weeks |
| Sync hardening | Sync edge cases, schema migration support, loaner-iPad kiosk mode | 1 week |
| Pilot | Trainer + 3–5 clients, daily feedback, bug fixing, sync stress tests | 2 weeks |
| Rollout | Migrate the rest of the gym off paper for strength clients | 1 week |

Realistic total: **~17 weeks part-time** of focused work; likely 5–8 months of evenings and weekends. (Native scheduling and push notifications, previously in v1, are now v2 — see §9.5.)

---

## Appendix A — Confirmed lift shorthand

The trainer's canonical names, to be used as the seed for the lift autocomplete in the program editor. The admin should never expand these (he writes "DL", not "Deadlift"; if we expand, he'll resent the typing):

Press, Squat 16" Box, DL, Bench, Pulldown, Plank, Bar PU, Inc DB, Hammer, C-Row.

Weight modifiers: `BW`, `+15`, `BW+20`. Units: reps or seconds.

This list is incomplete — the discovery photographs will expand it. Treat the seed list as a starting point.

## Appendix B — Direct trainer quotes (for reference when designing)

- *"Average 2 hours daily writing workouts. Less time to walk around and coach."* — primary pain point.
- *"The authentic feel that it has."* — only thing he'd miss about the notebook.
- *"The coach would need to remain a constant part of the programming process."* — on injury handling. Generalizes to all judgment-required cases. The system supports the coach; it does not replace him.
- *"Most of the time the workout only requires being able to see the previous workout that matches. For example if we are doing an A/B Split I would just need to see the previous A day to see what's next in the progression."* — confirms templates as first-class concept and sets the autofill source rule.
- *"At a certain point moving up 5 pounds every session would be too much for their body to handle. Then they would begin doing a rep progression."* — the four-phase progression model.
- *"When they have had multiple failed attempts at a specific weight and rep count or the form is significantly altered."* — trigger for phase transition; also drives the needs-attention dashboard rule.
