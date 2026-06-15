# AI Middleware Challenge

This repository contains a fullstack starter for the coding challenge:

- `apps/web`: React + Vite + JavaScript frontend
- `apps/api`: FastAPI backend/BFF
- `packages/contracts`: shared request/response contracts for the frontend

## Tech stack

- Frontend: React, Vite, Redux Toolkit, RTK Query, Zod
- Backend: FastAPI, Pydantic, Uvicorn
- Tooling: npm workspaces, GitHub, VS Code

## Local run

Set up dependencies first:

```bash
npm run setup
```

Start both apps from the repository root:

```bash
npm run dev:all
```

Make sure the frontend and backend dependencies are installed first.

Or start them separately:

Frontend:

```bash
cd apps/web
npm install
npm run dev
```

Backend:

```bash
cd apps/api
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## GitHub

The repo is prepared to be committed and pushed to GitHub. Initialize or add a remote, then push your branch in the usual way.

## Notes

- The frontend uses JavaScript modules, not TypeScript, to match the challenge brief.
- The backend returns structured validation and error payloads so the UI can display them consistently.
