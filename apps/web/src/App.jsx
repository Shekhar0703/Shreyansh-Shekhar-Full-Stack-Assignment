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

  const hasMore = response?.pagination?.hasMore ?? false;

  const handleSubmit = async (formValues) => {
    const request = { ...formValues, page: 1, pageSize: PAGE_SIZE };
    dispatch(requestStarted(request));
    setPage(1);

    try {
      const result = await submitPrompt(request).unwrap();
      dispatch(requestSucceeded({ request, response: result, append: false }));
    } catch (caughtError) {
      const payload = caughtError?.data?.detail ?? {
        error: "UNKNOWN_ERROR",
        message: caughtError?.error ?? "An unexpected error occurred",
      };
      dispatch(requestFailed(payload));
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
      const payload = caughtError?.data?.detail ?? {
        error: "UNKNOWN_ERROR",
        message: caughtError?.error ?? "An unexpected error occurred",
      };
      dispatch(requestFailed(payload));
    }
  };

  return (
    <main className="shell">
      <section className="hero panel">
        <div>
          <span className="eyebrow">AI middleware challenge</span>
          <h1>Structured prompts, validated flows, and paginated insights.</h1>
          <p>
            A React client with RTK Query, debounced search, client-side sorting, and backend-driven
            validation states.
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
              </div>
              <div className="toolbar">
                <SearchBar />
                <SortControls />
              </div>
            </div>

            <InsightList insights={filteredInsights} />

            <PaginationControls hasMore={hasMore} onLoadMore={handleLoadMore} isLoading={submitResult.isLoading} />
          </div>
        </div>
      </section>
    </main>
  );
}
