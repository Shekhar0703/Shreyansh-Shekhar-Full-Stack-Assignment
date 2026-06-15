# AI Middleware Challenge

This repository contains a fullstack starter for the coding challenge:

- `apps/web`: React + Vite + TypeScript frontend
- `apps/api`: FastAPI backend/BFF
- `packages/contracts`: shared request/response contracts for the frontend

## Local run

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
