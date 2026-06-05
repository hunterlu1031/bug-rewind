# Bug Rewind

Frontend-only QA bug tracker with in-app interaction recording, DOM replay, and rule-based “AI” analysis. Built for static hosting (e.g. AWS S3).

## Features

- **Bug tracker** — title, description, severity, status, bug type; dashboard table with filters; localStorage persistence
- **Test Playground** — ShopDemo mock retail SUT (catalog, product detail, cart, checkout); static frontend-only data
- **Recording** — UI bug type only; captures interactions inside the playground via `data-testid` (not the bug tracker chrome)
- **Replay** — runs in the Test Playground with a top “Replay in progress” banner, then returns to the bug ticket
- **Theme** — light mode default; toggle light/dark in the header
- **Fake AI** — severity hints, root cause guesses, summary rewrite, duplicate detection (`src/ai/fakeAiEngine.js`)

## Tech stack

- React 18 + Vite
- React Router 6
- Tailwind CSS 3
- No backend, database, or external APIs

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build for S3

```bash
npm run build
```

Upload the `dist/` folder to an S3 bucket configured for static website hosting. `vite.config.js` uses `base: './'` so asset paths work with relative URLs.

### Example AWS CLI deploy

```bash
aws s3 sync dist/ s3://YOUR-BUCKET-NAME --delete
```

Enable static website hosting on the bucket and set `index.html` as the index document. For client-side routing, configure the bucket/error document to `index.html` (or use CloudFront with custom error responses for 404 → `/index.html`).

## Workflow

1. **Dashboard** — view, filter, and clear bugs; open Test Playground
2. **Create Bug** — set **Bug Type** to **UI**, open Test Playground, record in ShopDemo, stop recording, save bug
3. **Bug Details** — replay in playground (returns here when done), export JSON, review AI insights

## Project structure

```
src/
  ai/           fakeAiEngine.js
  components/   UI, layout, recording, replay, AI
  constants/
  context/      bugs + recording providers
  hooks/        useBugs, useRecording
  pages/        Dashboard, Create Bug, Bug Details
  services/     localStorage wrapper
  utils/        replay engine, selectors
```

## Recording & replay notes

- Recording requires **Bug Type: UI** and only captures events inside `#test-playground-root`
- Only elements with `data-testid` are recorded (playground uses `pg-*` ids)
- Replay scopes queries to the playground root and navigates back to `/bugs/:id` when finished

## License

See LICENSE.
