# Middleware Insight Studio (Fullstack Challenge)

A fullstack demo of an **AI-middleware client UI + FastAPI backend**.

## What this project does
This application lets a user:
1. Enter a **prompt** and select a **target language**.
2. Send the request to a backend endpoint (`POST /api/prompt`).
3. Receive one of these backend responses:
   - **SUCCESS**: returns structured *insights* (displayed in a table)
   - **NEEDS_CLARIFICATION**: if the prompt is too short/unclear (no “AI” generation happens)
   - **4xx errors**: structured validation errors (e.g., invalid language)
4. Use **debounced search**, **sorting**, and **backend-driven pagination** (“Load more”).

> The backend uses mock data (no real LLM call).

---

## Tech stack
- **Frontend**: React, Vite, JavaScript, Redux Toolkit, RTK Query, Zod
- **Backend/BFF**: FastAPI, Pydantic, Uvicorn
- **Workspace**: npm workspaces
- **Shared contracts**: `packages/contracts`

---

## Project structure
```text
apps/
  api/                  FastAPI backend/BFF
    app/main.py         App setup, CORS, error handlers, health route
    app/routes.py       Prompt endpoint, validation, pagination response
    app/services/      Mock AI insight generator
    tests/              Backend smoke tests

  web/                  React + Vite frontend
    src/App.jsx         Main feature orchestration
    src/services/       RTK Query API layer
    src/features/       Redux slices for session and UI state
    src/components/     Small UI components (form, table, banner, pagination)
    src/lib/            Validation + debounce helpers

packages/
  contracts/            Shared values used by the frontend
```

---

## Backend API
### Health
- `GET /health`

### Submit prompt
- `POST /api/prompt`

**Request body**
```json
{
  "prompt": "Analyze this workflow for the frontend client",
  "targetLanguage": "en",
  "contextId": "optional-uuid",
  "page": 1,
  "pageSize": 10
}
```

**Possible responses**
- `SUCCESS` with:
  - `insights[]`
  - `pagination` metadata (`page`, `pageSize`, `total`, `hasMore`)
- `NEEDS_CLARIFICATION` with:
  - a user-facing `message`
- `4xx` errors with:
  - `{ "error": "INVALID_LANGUAGE" | "INVALID_PROMPT" | ... , "message": "..." }`

---

## Frontend behavior
### Validation
- The submit button is disabled until the prompt and inputs are valid.
- The frontend uses schema validation (Zod) to prevent invalid requests from being sent.
- If the backend determines the prompt is unclear, it returns `NEEDS_CLARIFICATION` and the UI displays the backend message.


### Response handling
- **SUCCESS**: shows insights table
- **NEEDS_CLARIFICATION**: shows clarification banner
- **4xx**: shows structured error banner

### Pagination
- Uses backend `pagination.hasMore`.
- Pressing **Load more** requests the next page and appends results.

### Performance
- Debounced search (250ms)
- Sorting and filtering are memoized with `useMemo`.

---

## Setup
From the repository root:
```bash
npm run setup
```

If Python is not available as `python` on your machine, create the backend venv manually:
```bash
cd apps/api
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

---

## Run locally
Start both backend + frontend:
```bash
npm run dev
```

Useful alternatives:
```bash
npm run dev:web   # frontend only
npm run dev:api   # backend only
```

Default URLs:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`

---

## Tests & build
### Frontend build
```bash
npm run build:web
```

### Backend tests
```bash
npm run test:api
```

---

## Notes
- The backend intentionally generates mock insights.
- `contextId` is accepted by the endpoint and validated (UUID), even though the mock does not store conversation state.

