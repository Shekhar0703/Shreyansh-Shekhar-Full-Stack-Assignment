export function StatusBanner({ error, response, isLoading }) {
  if (isLoading) {
    return (
      <div className="banner banner-loading">
        <strong>Working on your request...</strong>
      </div>
    );
  }

  if (error) {
    return (
      <div className="banner banner-error">
        <strong>{error.error ?? "ERROR"}</strong>
        <span>{error.message ?? "Unable to process request."}</span>
      </div>
    );
  }

  if (response?.status === "NEEDS_CLARIFICATION") {
    return (
      <div className="banner banner-warning">
        <strong>Clarification needed</strong>
        <span>{response.message}</span>
      </div>
    );
  }

  if (response?.status === "SUCCESS") {
    return (
      <div className="banner banner-success">
        <strong>Success</strong>
        <span>{response.pagination ? `Page ${response.pagination.page} of ${Math.ceil(response.pagination.total / response.pagination.pageSize)}` : "Insights ready"}</span>
      </div>
    );
  }

  return (
    <div className="banner banner-idle">
      <strong>Ready</strong>
      <span>Submit a valid prompt to begin.</span>
    </div>
  );
}
