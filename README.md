# AI Middleware Challenge

Fullstack coding challenge implementation for an AI-powered middleware client.

The app lets a user submit a prompt, validates the request on both the client and API, returns either structured insights or clarification/error states, and supports searching, sorting, and backend-driven pagination.

## Tech Stack

- Frontend: React, Vite, JavaScript, Redux Toolkit, RTK Query, Zod
- Backend/BFF: FastAPI, Pydantic, Uvicorn
- Workspace: npm workspaces
- Shared package: `packages/contracts`

## Project Structure

```text
apps/
  api/                  FastAPI backend/BFF
    app/main.py         App setup, CORS, error handlers, health route
    app/routes.py       Prompt endpoint, validation, pagination response
    app/services/       Mock AI insight generator
    tests/              Backend smoke tests
  web/                  React + Vite frontend
    src/App.jsx         Main feature orchestration
    src/services/       RTK Query API layer
    src/features/       Redux slices for session and UI state
    src/components/     Small UI components
    src/lib/            Validation and debounce helpers
packages/
  contracts/            Shared frontend contract values
scripts/                Workspace setup and dev helpers
```

## Implemented Requirements

### Frontend

- Prompt submission form with:
  - `prompt`
  - `targetLanguage`
  - optional `contextId`
- Zod schema validation.
- Submit button is disabled until inputs are valid.
- RTK Query mutation posts requests to the backend.
- Request and response data are stored in global Redux state.
- Handles backend states:
  - `SUCCESS`: renders returned insights.
  - `NEEDS_CLARIFICATION`: shows a clarification message.
  - 4xx errors: displays structured error details.
- Displays insights in a table.
- Supports backend pagination with `Load more`.
- Implements client-side debounced search across title, content, and category.
- Implements sorting by title/content in A-Z and Z-A order.
- Uses `useMemo` for filtered/sorted insight lists to avoid unnecessary recalculation.
- Keeps API logic, UI components, and state management separated.

### Backend/BFF

- FastAPI `POST /api/prompt` endpoint.
- Accepts:
  - `prompt`: required string
  - `targetLanguage`: required ISO-like language code
  - `contextId`: optional UUID
  - `page`: optional pagination page
  - `pageSize`: optional pagination size
- Strict validation with Pydantic.
- Empty prompts return a structured 4xx response.
- Unsupported languages return a structured 4xx response.
- Short or unclear prompts return `NEEDS_CLARIFICATION` before mock AI generation.
- Mock AI service returns 20 insight records.
- API returns pagination metadata when insights are returned.

## Local Setup

Install frontend dependencies and backend Python dependencies:

```bash
npm run setup
```

If Python is not available as `python` on your machine, create the backend environment manually with your installed Python executable:

```bash
cd apps/api
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

## Run Locally

Start both apps from the repository root:

```bash
npm run dev
```

Start only the frontend:

```bash
npm run dev:web
```

Start only the backend:

```bash
npm run dev:api
```

Default URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`
- API endpoint: `POST http://localhost:8000/api/prompt`
- Health check: `GET http://localhost:8000/health`

## Test And Build

Frontend production build:

```bash
npm run build:web
```

Backend smoke tests:

```bash
npm run test:api
```

Expected backend test coverage:

- Valid prompt returns `SUCCESS`.
- Short prompt returns `NEEDS_CLARIFICATION`.
- Unsupported language returns `INVALID_LANGUAGE`.
- Blank prompt returns `INVALID_PROMPT`.

## Example API Requests

Successful request:

```json
{
  "prompt": "Analyze this workflow for the frontend client",
  "targetLanguage": "en",
  "page": 1,
  "pageSize": 10
}
```

Clarification request:

```json
{
  "prompt": "help",
  "targetLanguage": "en"
}
```

Invalid language request:

```json
{
  "prompt": "Analyze this workflow for the frontend client",
  "targetLanguage": "jp"
}
```

## Verification Notes

Latest local verification performed on this workspace:

- `npm run build:web`: passed when run outside the managed sandbox. The sandboxed run failed because Vite/esbuild could not read the config path due to an access-denied filesystem restriction.
- `npm run test:api`: blocked on this machine because `python` is not available on PATH.
- Existing `.venv` launchers are also broken locally because they point to a missing Python installation path. Recreate the backend virtual environment after installing Python, then rerun `npm run test:api`.

## Notes

- The backend intentionally uses generated mock insight data instead of calling a real LLM.
- The frontend uses JavaScript modules, while a few helper files also have TypeScript counterparts from the starter structure.
- Supported frontend language options come from `packages/contracts`; the backend currently validates against its own `SUPPORTED_LANGUAGES` set.
