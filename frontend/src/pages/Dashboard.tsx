



import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
// import { getLocalHistory, HistoryEntry } from "../services/predictApi";
import {
  fetchHistory,
  HistoryEntry,
} from "../services/predictApi";
import "./Dashboard.css";

const CHART_COLORS = [
  "#16a34a",
  "#0891b2",
  "#7c3aed",
  "#db2777",
  "#d97706",
  "#059669",
  "#2563eb",
  "#9333ea",
  "#e11d48",
  "#f59e0b",
];

/* ----------------------------- */
/* Crop-wise Average Yield */
/* ----------------------------- */
function aggregateByCrop(entries: HistoryEntry[]) {
  const map: Record<string, { total: number; count: number }> = {};

  for (const e of entries) {
    if (!map[e.crop]) {
      map[e.crop] = { total: 0, count: 0 };
    }

    map[e.crop].total += e.predicted_yield;
    map[e.crop].count += 1;
  }

  return Object.entries(map)
    .map(([name, v]) => ({
      name,
      avg: parseFloat((v.total / v.count).toFixed(2)),
      count: v.count,
    }))
    .sort((a, b) => b.avg - a.avg);
}

/* ----------------------------- */
/* State-wise Prediction Count */
/* ----------------------------- */
function aggregateByState(entries: HistoryEntry[]) {
  const map: Record<string, { total: number; count: number }> = {};

  for (const e of entries) {
    if (!map[e.state]) {
      map[e.state] = { total: 0, count: 0 };
    }

    map[e.state].total += e.predicted_yield;
    map[e.state].count += 1;
  }

  return Object.entries(map)
    .map(([name, v]) => ({
      name,
      avg: parseFloat((v.total / v.count).toFixed(2)),
      count: v.count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
}

/* ----------------------------- */
/* Season Distribution */
/* ----------------------------- */
function aggregateBySeason(entries: HistoryEntry[]) {
  const map: Record<string, { total: number; count: number }> = {};

  for (const e of entries) {
    if (!map[e.season]) {
      map[e.season] = { total: 0, count: 0 };
    }

    map[e.season].total += e.predicted_yield;
    map[e.season].count += 1;
  }

  return Object.entries(map).map(([name, v]) => ({
    name,
    value: v.count,
    avg: parseFloat((v.total / v.count).toFixed(2)),
  }));
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: { name: string; value: number }[];
  label?: string;
}

function CustomTooltip({
  active,
  payload,
  label,
}: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="tooltip-label">{label}</p>

        {payload.map((p, i) => (
          <p key={i} className="tooltip-value">
            {p.name}: <strong>{p.value}</strong>
          </p>
        ))}
      </div>
    );
  }

  return null;
}

export default function Dashboard() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // useEffect(() => {
  //   setHistory(getLocalHistory());
  // }, []);

  useEffect(() => {
  async function loadData() {
    const data = await fetchHistory();
    setHistory(data);
  }

  loadData();
}, []);

  const cropData = aggregateByCrop(history);
  const stateData = aggregateByState(history);
  const seasonData = aggregateBySeason(history);

  const totalPredictions = history.length;

  const avgYield = history.length
    ? (
        history.reduce(
          (sum, item) => sum + item.predicted_yield,
          0
        ) / history.length
      ).toFixed(2)
    : "—";

  const topCrop = cropData[0]?.name ?? "—";
  const topState = stateData[0]?.name ?? "—";

  const hasData = history.length > 0;

  return (
    <div className="dashboard-page">
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">
              Insights from your prediction history
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-card-icon green">
              📄
            </div>

            <div>
              <p className="stat-card-value">
                {totalPredictions}
              </p>
              <p className="stat-card-label">
                Total Predictions
              </p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-icon blue">
              📈
            </div>

            <div>
              <p className="stat-card-value">
                {avgYield}
                {avgYield !== "—" ? " t/ha" : ""}
              </p>

              <p className="stat-card-label">
                Average Yield
              </p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-icon teal">
              🌾
            </div>

            <div>
              <p className="stat-card-value">
                {topCrop}
              </p>
              <p className="stat-card-label">
                Top Crop
              </p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-icon purple">
              📍
            </div>

            <div>
              <p className="stat-card-value">
                {topState}
              </p>
              <p className="stat-card-label">
                Top State
              </p>
            </div>
          </div>
        </div>

        {!hasData ? (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <h3>No data yet</h3>
            <p>
              Make some predictions on the Home page
              to see charts here.
            </p>
          </div>
        ) : (
          <div className="charts-grid">
            {/* Crop Chart */}
            <div className="chart-card wide">
              <h2 className="chart-title">
                Crop-wise Average Yield
              </h2>

              <div className="chart-container">
                <ResponsiveContainer
                  width="100%"
                  height={260}
                >
                  <BarChart data={cropData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />

                    <Bar dataKey="avg">
                      {cropData.map((_, i) => (
                        <Cell
                          key={i}
                          fill={
                            CHART_COLORS[
                              i % CHART_COLORS.length
                            ]
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Season Pie */}
            <div className="chart-card">
              <h2 className="chart-title">
                Season Distribution
              </h2>

              <div className="chart-container">
                <ResponsiveContainer
                  width="100%"
                  height={260}
                >
                  <PieChart>
                    <Pie
                      data={seasonData}
                      dataKey="value"
                      outerRadius={90}
                      label
                    >
                      {seasonData.map((_, i) => (
                        <Cell
                          key={i}
                          fill={
                            CHART_COLORS[
                              i % CHART_COLORS.length
                            ]
                          }
                        />
                      ))}
                    </Pie>

                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* State Count */}
            <div className="chart-card">
              <h2 className="chart-title">
                State-wise Prediction Count
              </h2>

              <div className="chart-container">
                <ResponsiveContainer
                  width="100%"
                  height={260}
                >
                  <BarChart
                    data={stateData}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis
                      dataKey="name"
                      type="category"
                    />
                    <Tooltip />
                    <Bar
                      dataKey="count"
                      fill="#0891b2"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
