# Flatverify.ai — Recovered Old UI

This is a clean recovery copy of the old Flatverify.ai React/TypeScript/Vite UI extracted from the user's backup ZIP.

## Purpose
- Preserve the old UI that matches the saved screenshots.
- Use this web project as a UI/UX reference/prototype.
- Keep the production Flutter Android/iOS project separate.

## Included
- `src/` — recovered React UI, views, components, context, utilities, and sample data
- `package.json`
- `index.html`
- TypeScript/Vite configuration

## Excluded intentionally
Flutter/Dart and native platform folders (`lib`, `android`, `ios`, `macos`, `windows`, `linux`, `web`) were removed from this clean copy so AI Studio or another web tool does not confuse the recovered web UI with the Flutter production app.

## Local run
```bash
npm install
npm run dev
```

Then open the local URL shown by Vite (configured for port 3000).

## Production build
```bash
npm run build
```

## Recovery note
Do not overwrite the production Flutter project with this folder. Preserve this recovered copy in source control before making design changes.
