export function PaginationControls({ hasMore, onLoadMore, isLoading }) {
  if (!hasMore) {
    return null;
  }

  return (
    <div className="pagination-row">
      <span>More results are available from the backend.</span>
      <button className="secondary-button" type="button" onClick={onLoadMore} disabled={isLoading}>
        {isLoading ? "Loading..." : "Load more"}
      </button>
    </div>
  );
}
