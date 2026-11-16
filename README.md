# Hamnawa

Hamnawa is an accessibility reader for visually impaired students. It turns
PDF and PowerPoint files into readable content with speech, keyboard
navigation, voice commands, bookmarks, resume support, and accessible display
settings.

## Folder layout

- `frontend/`: React and Vite application
- `database/`: database schema and local database setup
- `API_CONTRACT.md`: frontend and backend API contract

## Run the frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend uses mock data by default. Copy `frontend/.env.example` to
`frontend/.env` to configure the API URL and mock mode.

## Run with the real backend

Start the backend on `http://localhost:8000`, then set:

```env
VITE_USE_MOCK=false
VITE_API_URL=http://localhost:8000
```

Restart Vite after changing environment variables.

## Run tests and lint

```bash
cd frontend
npm test
npm run test:coverage
npm run lint
npm run build
```

## Deploy to Netlify

Create a Netlify site with these settings:

- Base directory: `frontend`
- Build command: `npm run build`
- Publish directory: `frontend/dist`
- Environment variables: `VITE_USE_MOCK` and `VITE_API_URL`

The `frontend/public/_redirects` file keeps client-side routes working after
deployment.

## Design

Hamnawa uses the Plum and Pomegranate palette. The interface uses Bricolage
Grotesque for headings, Atkinson Hyperlegible for body text, and Noto Nastaliq
Urdu for Urdu content. Shared palette, typography, spacing, and motion tokens
live in `frontend/src/styles/tokens.css`.

The design system uses the voice thread as a divider and progress cue, stamp
buttons with hard offset shadows, petal-shaped panels, and dot-grid texture.
Motion uses short transform and opacity transitions and turns off when reduced
motion is enabled.
