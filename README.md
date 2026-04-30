# Studio Fit Notebook

A pencil-and-paper workout notebook, made digital.

The trainer publishes programs from his iPad. Clients open the app at the gym, tap to log, edit any prescribed value to log what they actually did. Strikethroughs preserve the prescription so history reads like a real notebook.

Heavy design opinions live in [`docs/design-tokens.md`](docs/design-tokens.md). The product spec is in [`docs/prd.md`](docs/prd.md). Surface specs live in [`docs/specs/`](docs/specs/).

## Repo layout

```
apps/
  admin/        Next.js 16 admin web — trainer-side surfaces (early)
  mobile/       Expo SDK 54 mobile app — the logging screen and tabs
packages/
  design-tokens/  Shared color, type, spacing, surface tokens
docs/
  design-tokens.md, prd.md, specs/*.md
```

pnpm workspaces. Node ≥ 20.

## Running locally

```sh
pnpm install
```

### Mobile (Expo)

```sh
pnpm --filter @studio-fit/mobile start
```

Install Expo Go on an iPhone, put the phone on the same Wi-Fi as the dev machine, scan the QR. The mobile app uses `expo-sqlite` for local persistence — every install has its own database. There is no backend yet.

### Admin (Next.js)

```sh
pnpm --filter @studio-fit/admin dev
```

Opens on http://localhost:3000. Currently a smoke screen showing the design tokens; real admin surfaces are not built yet.

### Design tokens

The shared tokens module is the source of truth for colors, fonts, spacing, and surface treatments. The admin app generates a Tailwind 4 `@theme` block from the tokens at build time:

```sh
pnpm tokens:build
```

Mobile imports the tokens directly via `@studio-fit/design-tokens`.

## Status

Logging screen build order from [`docs/specs/logging-screen.md`](docs/specs/logging-screen.md):

- [x] 1. Static layout with mock data
- [x] 2. Tap-to-check
- [x] 3. Custom number pad component
- [x] 4. Tap-to-edit values
- [x] 5. Local persistence (SQLite)
- [ ] 6. Sync indicator + sync (backend deferred)
- [x] 7. Empty / completed states
- [x] 8. Admin mode (excluding live-update toasts which need a backend)

## License

Private project, no license declared.
