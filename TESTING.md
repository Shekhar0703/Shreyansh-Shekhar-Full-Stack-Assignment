# Testing Plan

This plan covers the fullstack coding challenge implementation in this repository.

## 1. Prerequisites

Run the workspace setup first from the repository root:

```powershell
npm run setup
```

This prepares the React frontend dependencies and the Python backend environment.

## 2. Automated Checks

Run these checks before manual testing:

```powershell
npm run test:api
```

Expected result:
- 4 backend smoke tests pass.
- `/api/prompt` returns `SUCCESS` for valid prompts.
- Short prompts return `NEEDS_CLARIFICATION`.
- Invalid prompt or language returns structured 4xx responses.

```powershell
npm run build:web
```

Expected result:
- The React app builds successfully.
- No TypeScript build step is required because the frontend uses JavaScript.

## 3. Manual Functional Test Cases

### Prompt form

- Open the app with `npm run dev`.
- Leave the prompt empty and confirm the submit button stays disabled.
- Enter a prompt with fewer than 5 characters and confirm the form remains invalid.
- Select each target language and confirm the dropdown values are available.
- Enter an invalid context ID and confirm validation fails.

### Backend response states

- Submit a clear prompt such as `Analyze this workflow for the frontend client`.
- Confirm the UI shows a success banner.
- Confirm insights are rendered in the table.
- Confirm pagination metadata is shown when more than 10 items exist.

- Submit a short prompt such as `help`.
- Confirm the UI shows the clarification banner.
- Confirm no insights are shown for that response.

- Submit an unsupported language by calling the API directly.
- Confirm the backend returns a structured error like `INVALID_LANGUAGE`.

### Insights list

- Confirm the table renders `Title`, `Content`, and `Category` columns.
- Confirm the empty state appears before the first submission.
- Confirm the filtered empty state appears when search returns no matches.

### Search and sort

- Type in the search field and confirm filtering happens after a short debounce.
- Search by title, content, and category.
- Switch sorting between A-Z and Z-A for title and content.
- Confirm search and sort work together.

### Pagination

- Submit a prompt that returns more than 10 results.
- Confirm `Load more` appears.
- Click `Load more` and confirm the next page appends to the list.
- Confirm the banner updates with the current page information.

## 4. Local Run Commands

Frontend and backend together:

```powershell
npm run dev
```

Backend only:

```powershell
npm run dev:api
```

Frontend only:

```powershell
npm run dev:web
```

## 5. Acceptance Criteria

The project is ready when all of the following are true:

- The backend smoke tests pass.
- The frontend build passes.
- The app starts from the root workspace command.
- Valid prompts return insight data.
- Short prompts trigger clarification.
- Invalid inputs return structured 4xx errors.
- Search, sorting, and pagination work together without breaking the UI.

## 6. Notes

- The backend smoke tests live in `apps/api/tests/test_routes.py`.
- The root startup and test scripts live in `package.json`.
- The user-facing frontend behavior is implemented in `apps/web/src/App.jsx`.