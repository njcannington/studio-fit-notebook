# Build Order

**Status:** living queue
**Purpose:** the next thing to build comes from this file, not from a fresh "where to next?" brainstorm. New ideas go in [`notes.md`](notes.md), not here.

This is the queue. Build top-to-bottom. Each item names a target user behavior, points to the spec section it satisfies, and lists what "done" means.

---

## In progress / next up

(Nothing currently committed to mid-flight. The next item below is the next thing to start.)

---

## MVP queue — required to demo a viable product to the trainer

(Empty. The four MVP-queue items have shipped. Anything else surfacing should land in [`notes.md`](notes.md) first; promoted here only with clear trainer signal.)

---

## Done

- **New-program-from-scratch flow** ([de43977](https://github.com/njcannington/studio-fit-notebook/commit/de43977)). Tapping a NO PROGRAM roster row opens an action sheet with two starting points — Empty program or Copy from another client. The new program opens immediately in the editor. "New Client template" deferred (no templates yet).
- **Add lift to a program (lift picker)** ([cf75749](https://github.com/njcannington/studio-fit-notebook/commit/cf75749)). Admin gets a `+ Add lift` button inside the paper card in editor mode. Slide-up picker searches a canonical library; selection appends with template defaults.
- **"Was X" annotations** ([439adf3](https://github.com/njcannington/studio-fit-notebook/commit/439adf3)). Admin sees prior-session prescribed weight as a faded italic annotation on each lift's header. Hidden when weight is unchanged or no prior exists.
- **Per-set notes** ([578cb7b](https://github.com/njcannington/studio-fit-notebook/commit/578cb7b)). Trainer's first piece of pilot feedback. `+ note` chip on deviating sets opens a sheet input; saved notes render inline as italic pencil text. Admin and completed sessions are read-only.

---

## After MVP — only with explicit user demand

These are valuable but not on the critical path. Build only after the trainer (or pilot data) asks for them.

- **Backend + sync** ([logging §3.5](specs/logging-screen.md), [program-builder §10](specs/program-builder.md)) — local-first works for the demo. AWS path discussed in conversation; defer until multi-device pilot.
- **Templates manager** ([program-builder §6](specs/program-builder.md)) — explicitly low-priority in the spec.
- **Ramp day builder** ([program-builder §5](specs/program-builder.md)) — specialized, low frequency.
- **Long-press on a roster row** (remove from today, etc.) — only useful at scale.
- **Live-update toast when admin edits a published program** ([logging §4.6](specs/logging-screen.md)) — needs sync.
- **iPad landscape split view** ([program-builder §8.2](specs/program-builder.md)) — biggest layout change, last per spec.
- **Multi-day calendar / past-date jumping for admin** — current History tab covers this loosely.
- **Needs-attention dashboard** ([dedicated spec](specs/needs-attention-dashboard.md)) — separate surface, separate effort.
- **Autofill engine** ([logging §11.5](specs/logging-screen.md), [program-builder §1](specs/program-builder.md)) — large; PRD's eventual differentiator but not the MVP.
- **Authentication / multi-user** — deferred. Single trainer, dev role toggle covers the demo.

---

## How to use this file

When proposing the next chunk of work:
1. Pick the top in-progress item or the top MVP-queue item.
2. If a different surface tempts, check whether its corresponding spec section is in this file. If not, the work goes in [`notes.md`](notes.md), not here.
3. After a chunk is shipped, move it to a "Done" section at the bottom (or remove it — whichever is cleaner). Update what's "in progress."

Open questions, trainer feedback, and ideas-we-might-want-later live in [`notes.md`](notes.md). This file is only for things we've decided to build, in the order we'll build them.
