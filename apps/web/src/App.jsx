import { useMemo, useState } from "react";
import { useSubmitPromptMutation } from "./services/api";
import { requestFailed, requestStarted, requestSucceeded } from "./features/session/sessionSlice";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { useDebouncedValue } from "./lib/debounce";
import { PromptForm } from "./components/PromptForm";
import { SearchBar } from "./components/SearchBar";
import { SortControls } from "./components/SortControls";
import { InsightList } from "./components/InsightList";
import { PaginationControls } from "./components/PaginationControls";
import { StatusBanner } from "./components/StatusBanner";

const PAGE_SIZE = 10;

function normalizeText(value) {
  return value.toLowerCase();
}

function sortInsights(items, sortMode) {
  const sorted = [...items];
  const compare = (left, right, key) => normalizeText(left[key]).localeCompare(normalizeText(right[key]));

  switch (sortMode) {
    case "title-desc":
      return sorted.sort((left, right) => compare(right, left, "title"));
    case "content-asc":
      return sorted.sort((left, right) => compare(left, right, "content"));
    case "content-desc":
      return sorted.sort((left, right) => compare(right, left, "content"));
    case "title-asc":
    default:
      return sorted.sort((left, right) => compare(left, right, "title"));
  }
}

function extractErrorPayload(caughtError) {
  if (caughtError?.data?.error || caughtError?.data?.message) {
    return caughtError.data;
  }

  if (caughtError?.data?.detail?.error || caughtError?.data?.detail?.message) {
    return caughtError.data.detail;
  }

  if (Array.isArray(caughtError?.data?.detail) && caughtError.data.detail.length > 0) {
    return {
      error: "VALIDATION_ERROR",
      message: caughtError.data.detail[0]?.msg ?? "Invalid request",
    };
  }

  return {
    error: "UNKNOWN_ERROR",
    message: caughtError?.error ?? "An unexpected error occurred",
  };
}

export default function App() {
  const dispatch = useAppDispatch();
  const { insights, status, error, response, activeRequest } = useAppSelector((state) => state.session);
  const { searchQuery, sortMode } = useAppSelector((state) => state.ui);
  const [page, setPage] = useState(1);
  const [submitPrompt, submitResult] = useSubmitPromptMutation();
  const debouncedSearch = useDebouncedValue(searchQuery, 250);

  const filteredInsights = useMemo(() => {
    const query = normalizeText(debouncedSearch.trim());
    const matched = query
      ? insights.filter((item) =>
          [item.title, item.content, item.category].some((field) => normalizeText(field).includes(query)),
        )
      : insights;

    return sortInsights(matched, sortMode);
  }, [debouncedSearch, insights, sortMode]);

  const hasSearchFilter = debouncedSearch.trim().length > 0;
  const emptyTitle = hasSearchFilter ? "No matching insights" : "No insights yet";
  const emptyMessage = hasSearchFilter
    ? "Try a different keyword or clear the search box to view all generated results."
    : "Submit a prompt to populate the results panel.";

  const hasMore = response?.pagination?.hasMore ?? false;
  const visibleCount = filteredInsights.length;
  const totalCount = response?.pagination?.total ?? insights.length;

  const handleSubmit = async (formValues) => {
    const request = { ...formValues, page: 1, pageSize: PAGE_SIZE };
    dispatch(requestStarted(request));
    setPage(1);

    try {
      const result = await submitPrompt(request).unwrap();
      dispatch(requestSucceeded({ request, response: result, append: false }));
    } catch (caughtError) {
      dispatch(requestFailed(extractErrorPayload(caughtError)));
    }
  };

  const handleLoadMore = async () => {
    if (!activeRequest) return;
    const nextPage = page + 1;
    const request = { ...activeRequest, page: nextPage, pageSize: PAGE_SIZE };
    setPage(nextPage);
    dispatch(requestStarted(request));

    try {
      const result = await submitPrompt(request).unwrap();
      dispatch(requestSucceeded({ request, response: result, append: true }));
    } catch (caughtError) {
      dispatch(requestFailed(extractErrorPayload(caughtError)));
    }
  };

  return (
    <main className="shell">
      <section className="hero panel">
        <div>
          <span className="eyebrow">Middleware Insight Studio</span>
          <h1>Prompt validation, structured results, and paginated insights.</h1>
          <p>
            A React client that sends validated prompts to a middleware API, then renders structured insights with
            debounced search, sorting, and backend-driven pagination.
          </p>
        </div>
        <div className="hero-stats">
          <div>
            <strong>{insights.length}</strong>
            <span>insights in store</span>
          </div>
          <div>
            <strong>{status}</strong>
            <span>current status</span>
          </div>
        </div>
      </section>

      <section className="layout-grid">
        <PromptForm onSubmit={handleSubmit} isSubmitting={submitResult.isLoading} />

        <div className="stack">
          <StatusBanner error={error} response={response} isLoading={status === "loading"} />

          <div className="panel results-panel">
            <div className="panel-heading panel-heading-row">
              <div>
                <span className="eyebrow">Insights</span>
                <h2>Review and refine the generated output</h2>
                <p className="results-summary">
                  Showing {visibleCount} of {totalCount} results
                </p>
              </div>
              <div className="toolbar">
                <SearchBar />
                <SortControls />
              </div>
            </div>

            <InsightList insights={filteredInsights} emptyTitle={emptyTitle} emptyMessage={emptyMessage} />

            <PaginationControls hasMore={hasMore} onLoadMore={handleLoadMore} isLoading={submitResult.isLoading} />
          </div>
        </div>
      </section>
    </main>
  );
}
