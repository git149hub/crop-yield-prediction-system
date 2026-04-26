// import { useEffect, useState } from "react";
// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
//   PieChart, Pie, Cell, Legend
// } from "recharts";
// import { getLocalHistory, HistoryEntry } from "../services/predictApi";
// import "./Dashboard.css";

// const CHART_COLORS = [
//   "#16a34a", "#0891b2", "#7c3aed", "#db2777", "#d97706",
//   "#059669", "#2563eb", "#9333ea", "#e11d48", "#f59e0b"
// ];

// function aggregateByCrop(entries: HistoryEntry[]) {
//   const map: Record<string, { total: number; count: number }> = {};
//   for (const e of entries) {
//     if (!map[e.crop_type]) map[e.crop_type] = { total: 0, count: 0 };
//     map[e.crop_type].total += e.predicted_yield;
//     map[e.crop_type].count += 1;
//   }
//   return Object.entries(map).map(([name, v]) => ({
//     name,
//     avg: parseFloat((v.total / v.count).toFixed(2)),
//     count: v.count,
//   })).sort((a, b) => b.avg - a.avg);
// }

// function aggregateByState(entries: HistoryEntry[]) {
//   const map: Record<string, { total: number; count: number }> = {};
//   for (const e of entries) {
//     if (!map[e.state]) map[e.state] = { total: 0, count: 0 };
//     map[e.state].total += e.predicted_yield;
//     map[e.state].count += 1;
//   }
//   return Object.entries(map).map(([name, v]) => ({
//     name,
//     avg: parseFloat((v.total / v.count).toFixed(2)),
//     count: v.count,
//   })).sort((a, b) => b.count - a.count).slice(0, 8);
// }

// function aggregateBySeason(entries: HistoryEntry[]) {
//   const map: Record<string, { total: number; count: number }> = {};
//   for (const e of entries) {
//     if (!map[e.season]) map[e.season] = { total: 0, count: 0 };
//     map[e.season].total += e.predicted_yield;
//     map[e.season].count += 1;
//   }
//   return Object.entries(map).map(([name, v]) => ({
//     name,
//     value: v.count,
//     avg: parseFloat((v.total / v.count).toFixed(2)),
//   }));
// }

// interface CustomTooltipProps {
//   active?: boolean;
//   payload?: { name: string; value: number }[];
//   label?: string;
// }

// function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
//   if (active && payload && payload.length) {
//     return (
//       <div className="chart-tooltip">
//         <p className="tooltip-label">{label}</p>
//         {payload.map((p, i) => (
//           <p key={i} className="tooltip-value">{p.name}: <strong>{p.value}</strong></p>
//         ))}
//       </div>
//     );
//   }
//   return null;
// }

// export default function Dashboard() {
//   const [history, setHistory] = useState<HistoryEntry[]>([]);

//   useEffect(() => {
//     setHistory(getLocalHistory());
//   }, []);

//   const cropData = aggregateByCrop(history);
//   const stateData = aggregateByState(history);
//   const seasonData = aggregateBySeason(history);

//   const totalPredictions = history.length;
//   const avgYield = history.length
//     ? (history.reduce((s, e) => s + e.predicted_yield, 0) / history.length).toFixed(2)
//     : "—";
//   const topCrop = cropData[0]?.name ?? "—";
//   const topState = stateData[0]?.name ?? "—";

//   const hasData = history.length > 0;

//   return (
//     <div className="dashboard-page">
//       <div className="page-container">
//         <div className="page-header">
//           <div>
//             <h1 className="page-title">Dashboard</h1>
//             <p className="page-subtitle">Insights from your prediction history</p>
//           </div>
//         </div>

//         <div className="stats-cards">
//           <div className="stat-card">
//             <div className="stat-card-icon green">
//               <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//                 <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="white" strokeWidth="2" strokeLinecap="round"/>
//               </svg>
//             </div>
//             <div>
//               <p className="stat-card-value">{totalPredictions}</p>
//               <p className="stat-card-label">Total Predictions</p>
//             </div>
//           </div>

//           <div className="stat-card">
//             <div className="stat-card-icon blue">
//               <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//                 <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//               </svg>
//             </div>
//             <div>
//               <p className="stat-card-value">{avgYield}{avgYield !== "—" ? " t/ha" : ""}</p>
//               <p className="stat-card-label">Average Yield</p>
//             </div>
//           </div>

//           <div className="stat-card">
//             <div className="stat-card-icon teal">
//               <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//                 <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2-8 2s.5-2 3-3C16 2 17 8 17 8z" fill="white"/>
//               </svg>
//             </div>
//             <div>
//               <p className="stat-card-value">{topCrop}</p>
//               <p className="stat-card-label">Top Crop</p>
//             </div>
//           </div>

//           <div className="stat-card">
//             <div className="stat-card-icon purple">
//               <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//                 <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke="white" strokeWidth="2" strokeLinecap="round"/>
//                 <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" stroke="white" strokeWidth="2" strokeLinecap="round"/>
//               </svg>
//             </div>
//             <div>
//               <p className="stat-card-value">{topState}</p>
//               <p className="stat-card-label">Top State</p>
//             </div>
//           </div>
//         </div>

//         {!hasData ? (
//           <div className="empty-state">
//             <div className="empty-icon">
//               <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
//                 <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
//               </svg>
//             </div>
//             <h3>No data yet</h3>
//             <p>Make some predictions on the Home page to see charts here.</p>
//           </div>
//         ) : (
//           <div className="charts-grid">
//             <div className="chart-card wide">
//               <h2 className="chart-title">Crop-wise Average Yield (tons/hectare)</h2>
//               <div className="chart-container">
//                 <ResponsiveContainer width="100%" height={260}>
//                   <BarChart data={cropData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                     <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6b7280" }} angle={-25} textAnchor="end" />
//                     <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} />
//                     <Tooltip content={<CustomTooltip />} />
//                     <Bar dataKey="avg" name="Avg Yield (t/ha)" radius={[6, 6, 0, 0]}>
//                       {cropData.map((_, i) => (
//                         <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
//                       ))}
//                     </Bar>
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>

//             <div className="chart-card">
//               <h2 className="chart-title">Season Distribution</h2>
//               <div className="chart-container">
//                 <ResponsiveContainer width="100%" height={260}>
//                   <PieChart>
//                     <Pie
//                       data={seasonData}
//                       cx="50%"
//                       cy="45%"
//                       outerRadius={90}
//                       dataKey="value"
//                       label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                       labelLine={false}
//                     >
//                       {seasonData.map((_, i) => (
//                         <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
//                       ))}
//                     </Pie>
//                     <Legend wrapperStyle={{ fontSize: "12px" }} />
//                     <Tooltip formatter={(val) => [`${val} predictions`, "Count"]} />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>

//             <div className="chart-card">
//               <h2 className="chart-title">State-wise Prediction Count</h2>
//               <div className="chart-container">
//                 <ResponsiveContainer width="100%" height={260}>
//                   <BarChart data={stateData} layout="vertical" margin={{ top: 5, right: 20, left: 70, bottom: 5 }}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
//                     <XAxis type="number" tick={{ fontSize: 11, fill: "#6b7280" }} />
//                     <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: "#6b7280" }} width={70} />
//                     <Tooltip content={<CustomTooltip />} />
//                     <Bar dataKey="count" name="Predictions" radius={[0, 6, 6, 0]} fill="#0891b2" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



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
import { getLocalHistory, HistoryEntry } from "../services/predictApi";
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

  useEffect(() => {
    setHistory(getLocalHistory());
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