
import { useEffect, useState } from "react";
import {
  fetchHistory,
  clearLocalHistory,
  HistoryEntry,
} from "../services/predictApi";
import "./History.css";


function formatDate(iso: string) {
  const d = new Date(iso);

  return (
    d.toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
    }) +
    " " +
    d.toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  );
}

export default function History() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchHistory();
      setEntries(data);
    } catch {
      setError("Failed to load history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleClear = () => {
    if (
      window.confirm(
        "Clear all prediction history? This cannot be undone."
      )
    ) {
      clearLocalHistory();
      setEntries([]);
    }
  };

  const filtered = entries.filter((e) => {
    const q = search.toLowerCase();

    return (
      e.crop.toLowerCase().includes(q) ||
      e.state.toLowerCase().includes(q) ||
      e.district.toLowerCase().includes(q) ||
      e.season.toLowerCase().includes(q)
    );
  });

  return (
    <div className="history-page">
      <div className="page-container">
        {/* Header */}
        <div className="page-header-row">
          <div>
            <h1 className="page-title">
              Prediction History
            </h1>

            <p className="page-subtitle">
              {entries.length} total predictions recorded
            </p>
          </div>

          <div className="header-actions">
            <input
              type="search"
              className="search-input"
              placeholder="Search crop, state, district..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            {entries.length > 0 && (
              <button
                className="btn-danger"
                onClick={handleClear}
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="loading-container">
            <div className="table-spinner" />
            <p>Loading history...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="error-alert">
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          filtered.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">
                📄
              </div>

              <h3>
                {search
                  ? "No matching predictions"
                  : "No predictions yet"}
              </h3>

              <p>
                {search
                  ? "Try a different search term."
                  : "Go to Home page and make your first prediction."}
              </p>
            </div>
          )}

        {/* Table */}
        {!loading &&
          !error &&
          filtered.length > 0 && (
            <div className="table-card">
              <div className="table-scroll">
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Crop</th>
                      <th>State</th>
                      <th>District</th>
                      <th>Season</th>
                      <th>Area</th>
                      <th>Yield</th>
                      <th>Production</th>
                      <th>Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filtered.map((e, i) => (
                      <tr
                        key={e.id}
                        className="table-row"
                      >
                        <td>{i + 1}</td>

                        <td>
                          <span className="crop-badge">
                            {e.crop}
                          </span>
                        </td>

                        <td>{e.state}</td>

                        <td>{e.district}</td>

                        <td>
                          <span
                            className={`season-badge season-${e.season
                              .toLowerCase()
                              .replace(" ", "-")}`}
                          >
                            {e.season}
                          </span>
                        </td>

                        <td>
                          {e.area.toFixed(2)} ha
                        </td>

                        <td>
                          <strong>
                            {e.predicted_yield.toFixed(
                              2
                            )}
                          </strong>{" "}
                          {e.unit}
                        </td>

                        <td>
                          {e.estimated_production.toFixed(
                            2
                          )}{" "}
                          tons
                        </td>

                        <td>
                          {formatDate(e.date)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}