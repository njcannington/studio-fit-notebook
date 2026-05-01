# CLAUDE.md

Read [`docs/build-order.md`](docs/build-order.md) and [`docs/notes.md`](docs/notes.md) before suggesting any next step. The build order is the queue; the notes file is everything else (trainer feedback, open questions, cut-for-MVP items).

## Working agreements

- **The build order is the queue.** Pick the top in-progress item or the top MVP-queue item. Don't propose work that isn't in the queue without saying so plainly.
- **New ideas land in [`docs/notes.md`](docs/notes.md), not in code.** If a new idea comes up mid-session (mine, the user's, or surfaced from a spec), add it to notes — don't build it.
- **The trainer's feedback is the source of truth for re-prioritization.** When new trainer feedback arrives, log it under "Trainer feedback" in notes, then promote it to the build order if accepted.
- **Match scope to ask.** A bug fix doesn't need surrounding cleanup; a single-feature commit shouldn't accrete unrelated polish. If polish is tempting, drop it in notes.
- **When the user asks "what's next?", read the build order first** and propose from there. Spec sections that aren't on the build order are out of scope for now (see "Cut for MVP" in notes).

## Project shape

- pnpm workspace, Node 22, Expo SDK 54 mobile + Next.js 16 admin
- Mobile app is the primary surface; web build at GitHub Pages exists for trainer demos but is not a maintained product
- No backend yet; local SQLite. Backend deferred per [`docs/notes.md` §3](docs/notes.md)
- Specs live under [`docs/specs/`](docs/specs/); design tokens in [`docs/design-tokens.md`](docs/design-tokens.md); PRD in [`docs/prd.md`](docs/prd.md)

## What's live

- Live demo: https://njcannington.github.io/studio-fit-notebook/
- Visual mockup: https://njcannington.github.io/studio-fit-notebook/mockup/
- CI: typecheck on push/PR; auto-deploy to Pages on push to main
