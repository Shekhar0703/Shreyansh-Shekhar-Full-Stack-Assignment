export function InsightList({ insights, emptyTitle = "No insights yet", emptyMessage = "Submit a prompt to populate the results panel." }) {
  if (!insights.length) {
    return (
      <div className="empty-state">
        <h3>{emptyTitle}</h3>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="table-shell">
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Content</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {insights.map((insight) => (
            <tr key={insight.id}>
              <td>{insight.title}</td>
              <td>{insight.content}</td>
              <td>{insight.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
