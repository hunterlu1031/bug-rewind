# Bug Rewind

**Proof-of-concept prototype only — not intended for production use.**

Bug Rewind is an experimental frontend-only QA workflow demo: in-app interaction recording, DOM replay, and rule-based “AI” analysis. It showcases ideas for replay-driven bug reporting and is built for static hosting (e.g. AWS S3). Data lives in the browser (`localStorage`); there is no backend, authentication, or multi-user support.

> This project may contain incomplete features, rough edges, and bugs. Use it to explore the concept — not as a production bug tracker or QA platform.

## Features

- **Bug tracker** — title, description, severity, status, bug type; dashboard table with filters; localStorage persistence
- **Test Playground** — ShopDemo mock retail SUT (catalog, product detail, cart, checkout); static frontend-only data
- **Recording** — captures interactions inside the playground via `data-testid` (not the bug tracker chrome)
- **Replay** — runs in the Test Playground with step-by-step playback, then returns to the bug ticket
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
2. **Create Bug** — open Test Playground, record in ShopDemo, stop recording, save bug
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
  playground/   ShopDemo SUT pages
  services/     localStorage wrapper
  utils/        replay engine, selectors
```

## Recording & replay notes

- Recording only captures events inside the playground root (`#playground`)
- Only elements with `data-testid` are recorded (playground uses `pg-*` ids)
- Replay scopes queries to the playground root and navigates back to the bug detail page when finished

## License

See LICENSE.
