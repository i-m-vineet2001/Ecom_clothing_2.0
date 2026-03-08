// import { useState, useEffect, useCallback } from "react";

// const API_BASE =
//   import.meta.env.VITE_API_URL || "https://ecom-clothing-2-0.onrender.com";

// const StatusDot = ({ status }) => {
//   const colors = {
//     online: "#4ade80",
//     offline: "#f87171",
//     checking: "#C5A059",
//   };
//   return (
//     <span
//       style={{
//         display: "inline-block",
//         width: 10,
//         height: 10,
//         borderRadius: "50%",
//         background: colors[status] || "#888",
//         boxShadow: status === "online" ? `0 0 8px ${colors.online}` : "none",
//         marginRight: 8,
//         transition: "all 0.3s ease",
//       }}
//     />
//   );
// };

// const MetricCard = ({ label, value, sub, status }) => (
//   <div
//     style={{
//       background: "#1a1a1a",
//       border: "1px solid #2c2c2c",
//       borderRadius: 12,
//       padding: "20px 24px",
//       display: "flex",
//       flexDirection: "column",
//       gap: 6,
//     }}
//   >
//     <span
//       style={{
//         color: "#888",
//         fontSize: 12,
//         textTransform: "uppercase",
//         letterSpacing: "0.1em",
//       }}
//     >
//       {label}
//     </span>
//     <div style={{ display: "flex", alignItems: "center" }}>
//       {status && <StatusDot status={status} />}
//       <span style={{ color: "#F9F8F5", fontSize: 22, fontWeight: 600 }}>
//         {value}
//       </span>
//     </div>
//     {sub && <span style={{ color: "#555", fontSize: 12 }}>{sub}</span>}
//   </div>
// );

// export default function HealthCheck() {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [history, setHistory] = useState([]);
//   const [lastChecked, setLastChecked] = useState(null);

//   const check = useCallback(async () => {
//     setLoading(true);
//     const start = Date.now();
//     try {
//       const res = await fetch(`${API_BASE}/api/health`, { method: "GET" });
//       const elapsed = Date.now() - start;
//       const json = await res.json();
//       const result = {
//         status: res.ok ? "online" : "offline",
//         responseTime: elapsed,
//         mongoStatus: json.mongo ?? "unknown",
//         raw: json,
//         time: new Date(),
//       };
//       setData(result);
//       setHistory((h) => [result, ...h].slice(0, 10));
//     } catch {
//       const elapsed = Date.now() - start;
//       const result = {
//         status: "offline",
//         responseTime: elapsed,
//         mongoStatus: "unknown",
//         time: new Date(),
//       };
//       setData(result);
//       setHistory((h) => [result, ...h].slice(0, 10));
//     } finally {
//       setLoading(false);
//       setLastChecked(new Date());
//     }
//   }, []);

//   useEffect(() => {
//     check();
//     const interval = setInterval(check, 60000); // auto-refresh every 60s
//     return () => clearInterval(interval);
//   }, [check]);

//   const formatTime = (d) =>
//     d
//       ? d.toLocaleTimeString("en-IN", {
//           hour: "2-digit",
//           minute: "2-digit",
//           second: "2-digit",
//         })
//       : "—";

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background: "#111",
//         color: "#F9F8F5",
//         fontFamily: "'Tenor Sans', sans-serif",
//         padding: "40px 32px",
//       }}
//     >
//       {/* Header */}
//       <div style={{ marginBottom: 36 }}>
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: 12,
//             marginBottom: 6,
//           }}
//         >
//           <div
//             style={{
//               width: 36,
//               height: 36,
//               background: "#C5A059",
//               borderRadius: 8,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               fontSize: 18,
//             }}
//           >
//             ⚡
//           </div>
//           <h1
//             style={{
//               margin: 0,
//               fontSize: 24,
//               fontWeight: 600,
//               color: "#F9F8F5",
//             }}
//           >
//             System Health
//           </h1>
//         </div>
//         <p style={{ margin: 0, color: "#666", fontSize: 14 }}>
//           Live status of GM Bastralaya backend services
//         </p>
//       </div>

//       {/* Main metrics */}
//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
//           gap: 16,
//           marginBottom: 32,
//         }}
//       >
//         <MetricCard
//           label="Backend Status"
//           value={
//             loading
//               ? "Checking..."
//               : data?.status === "online"
//                 ? "Online"
//                 : "Offline"
//           }
//           status={loading ? "checking" : data?.status}
//           sub={`Last checked: ${formatTime(lastChecked)}`}
//         />
//         <MetricCard
//           label="Response Time"
//           value={loading ? "—" : `${data?.responseTime ?? "—"} ms`}
//           sub={
//             data?.responseTime < 500
//               ? "Fast ✓"
//               : data?.responseTime < 1500
//                 ? "Moderate"
//                 : "Slow ⚠"
//           }
//         />
//         <MetricCard
//           label="MongoDB"
//           value={
//             loading
//               ? "Checking..."
//               : data?.mongoStatus === true || data?.mongoStatus === "connected"
//                 ? "Connected"
//                 : data?.mongoStatus === "unknown"
//                   ? "Unknown"
//                   : "Disconnected"
//           }
//           status={
//             data?.mongoStatus === true || data?.mongoStatus === "connected"
//               ? "online"
//               : data?.mongoStatus === "unknown"
//                 ? "checking"
//                 : "offline"
//           }
//           sub="Atlas Free Tier"
//         />
//         <MetricCard
//           label="Auto Refresh"
//           value="Every 60s"
//           sub="cron-job.org pings every 5 min"
//         />
//       </div>

//       {/* Manual refresh button */}
//       <button
//         onClick={check}
//         disabled={loading}
//         style={{
//           background: loading ? "#2c2c2c" : "#C5A059",
//           color: loading ? "#666" : "#111",
//           border: "none",
//           borderRadius: 8,
//           padding: "10px 24px",
//           fontSize: 14,
//           fontWeight: 600,
//           cursor: loading ? "not-allowed" : "pointer",
//           marginBottom: 32,
//           transition: "all 0.2s",
//         }}
//       >
//         {loading ? "Checking..." : "↻ Refresh Now"}
//       </button>

//       {/* History */}
//       {history.length > 0 && (
//         <div>
//           <h2
//             style={{
//               fontSize: 16,
//               color: "#888",
//               marginBottom: 16,
//               fontWeight: 500,
//             }}
//           >
//             Recent Checks
//           </h2>
//           <div
//             style={{
//               background: "#1a1a1a",
//               border: "1px solid #2c2c2c",
//               borderRadius: 12,
//               overflow: "hidden",
//             }}
//           >
//             <table style={{ width: "100%", borderCollapse: "collapse" }}>
//               <thead>
//                 <tr style={{ borderBottom: "1px solid #2c2c2c" }}>
//                   {["Time", "Status", "Response Time", "MongoDB"].map((h) => (
//                     <th
//                       key={h}
//                       style={{
//                         padding: "12px 16px",
//                         textAlign: "left",
//                         color: "#555",
//                         fontSize: 12,
//                         textTransform: "uppercase",
//                         letterSpacing: "0.08em",
//                       }}
//                     >
//                       {h}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {history.map((h, i) => (
//                   <tr
//                     key={i}
//                     style={{
//                       borderBottom:
//                         i < history.length - 1 ? "1px solid #222" : "none",
//                       background: i === 0 ? "#1f1f1f" : "transparent",
//                     }}
//                   >
//                     <td
//                       style={{
//                         padding: "12px 16px",
//                         color: "#888",
//                         fontSize: 13,
//                       }}
//                     >
//                       {formatTime(h.time)}
//                     </td>
//                     <td style={{ padding: "12px 16px" }}>
//                       <StatusDot status={h.status} />
//                       <span
//                         style={{
//                           color: h.status === "online" ? "#4ade80" : "#f87171",
//                           fontSize: 13,
//                         }}
//                       >
//                         {h.status === "online" ? "Online" : "Offline"}
//                       </span>
//                     </td>
//                     <td
//                       style={{
//                         padding: "12px 16px",
//                         color: "#F9F8F5",
//                         fontSize: 13,
//                       }}
//                     >
//                       {h.responseTime} ms
//                     </td>
//                     <td style={{ padding: "12px 16px", fontSize: 13 }}>
//                       <span
//                         style={{
//                           color:
//                             h.mongoStatus === true ||
//                             h.mongoStatus === "connected"
//                               ? "#4ade80"
//                               : "#888",
//                         }}
//                       >
//                         {h.mongoStatus === true || h.mongoStatus === "connected"
//                           ? "Connected"
//                           : "Unknown"}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useState, useEffect, useCallback } from "react";

const API_BASE =
  import.meta.env.VITE_API_URL || "https://ecom-clothing-2-0.onrender.com";

const StatusDot = ({ status }) => {
  const colors = {
    online: "#4ade80",
    offline: "#f87171",
    checking: "#C5A059",
  };
  return (
    <span
      style={{
        display: "inline-block",
        width: 10,
        height: 10,
        borderRadius: "50%",
        background: colors[status] || "#888",
        boxShadow: status === "online" ? `0 0 8px ${colors.online}` : "none",
        marginRight: 8,
        transition: "all 0.3s ease",
      }}
    />
  );
};

const MetricCard = ({ label, value, sub, status }) => (
  <div
    style={{
      background: "#1a1a1a",
      border: "1px solid #2c2c2c",
      borderRadius: 12,
      padding: "20px 24px",
      display: "flex",
      flexDirection: "column",
      gap: 6,
    }}
  >
    <span
      style={{
        color: "#888",
        fontSize: 12,
        textTransform: "uppercase",
        letterSpacing: "0.1em",
      }}
    >
      {label}
    </span>
    <div style={{ display: "flex", alignItems: "center" }}>
      {status && <StatusDot status={status} />}
      <span style={{ color: "#F9F8F5", fontSize: 22, fontWeight: 600 }}>
        {value}
      </span>
    </div>
    {sub && <span style={{ color: "#555", fontSize: 12 }}>{sub}</span>}
  </div>
);

export default function HealthCheck() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [lastChecked, setLastChecked] = useState(null);

  const check = useCallback(async () => {
    setLoading(true);
    const start = Date.now();
    try {
      const res = await fetch(`${API_BASE}/api/health`, { method: "GET" });
      const elapsed = Date.now() - start;
      const json = await res.json();
      const result = {
        status: res.ok ? "online" : "offline",
        responseTime: elapsed,
        mongoStatus: json.mongo ?? "unknown",
        raw: json,
        time: new Date(),
      };
      setData(result);
      setHistory((h) => [result, ...h].slice(0, 10));
    } catch {
      const elapsed = Date.now() - start;
      const result = {
        status: "offline",
        responseTime: elapsed,
        mongoStatus: "unknown",
        time: new Date(),
      };
      setData(result);
      setHistory((h) => [result, ...h].slice(0, 10));
    } finally {
      setLoading(false);
      setLastChecked(new Date());
    }
  }, []);

  useEffect(() => {
    check();
    const interval = setInterval(check, 60000); // auto-refresh every 60s
    return () => clearInterval(interval);
  }, [check]);

  const formatTime = (d) =>
    d
      ? d.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      : "—";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#111",
        color: "#F9F8F5",
        fontFamily: "'Tenor Sans', sans-serif",
        padding: "24px 16px",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 6,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              background: "#C5A059",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
            }}
          >
            ⚡
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: "clamp(18px, 4vw, 24px)",
              fontWeight: 600,
              color: "#F9F8F5",
            }}
          >
            System Health
          </h1>
        </div>
        <p style={{ margin: 0, color: "#666", fontSize: 14 }}>
          Live status of GM Bastralaya backend services
        </p>
      </div>

      {/* Main metrics */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: 16,
          marginBottom: 32,
        }}
      >
        <MetricCard
          label="Backend Status"
          value={
            loading
              ? "Checking..."
              : data?.status === "online"
                ? "Online"
                : "Offline"
          }
          status={loading ? "checking" : data?.status}
          sub={`Last checked: ${formatTime(lastChecked)}`}
        />
        <MetricCard
          label="Response Time"
          value={loading ? "—" : `${data?.responseTime ?? "—"} ms`}
          sub={
            data?.responseTime < 500
              ? "Fast ✓"
              : data?.responseTime < 1500
                ? "Moderate"
                : "Slow ⚠"
          }
        />
        <MetricCard
          label="MongoDB"
          value={
            loading
              ? "Checking..."
              : data?.mongoStatus === true || data?.mongoStatus === "connected"
                ? "Connected"
                : data?.mongoStatus === "unknown"
                  ? "Unknown"
                  : "Disconnected"
          }
          status={
            data?.mongoStatus === true || data?.mongoStatus === "connected"
              ? "online"
              : data?.mongoStatus === "unknown"
                ? "checking"
                : "offline"
          }
          sub="Atlas Free Tier"
        />
        <MetricCard
          label="Auto Refresh"
          value="Every 60s"
          sub="cron-job.org pings every 5 min"
        />
      </div>

      {/* Manual refresh button */}
      <button
        onClick={check}
        disabled={loading}
        style={{
          background: loading ? "#2c2c2c" : "#C5A059",
          color: loading ? "#666" : "#111",
          border: "none",
          borderRadius: 8,
          padding: "10px 24px",
          fontSize: 14,
          fontWeight: 600,
          cursor: loading ? "not-allowed" : "pointer",
          marginBottom: 32,
          transition: "all 0.2s",
        }}
      >
        {loading ? "Checking..." : "↻ Refresh Now"}
      </button>

      {/* History */}
      {history.length > 0 && (
        <div>
          <h2
            style={{
              fontSize: 16,
              color: "#888",
              marginBottom: 16,
              fontWeight: 500,
            }}
          >
            Recent Checks
          </h2>
          <div
            style={{
              background: "#1a1a1a",
              border: "1px solid #2c2c2c",
              borderRadius: 12,
              overflow: "hidden",
              overflowX: "auto",
              WebkitOverflowScrolling: "touch",
            }}
          >
            <table
              style={{
                width: "100%",
                minWidth: 480,
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr style={{ borderBottom: "1px solid #2c2c2c" }}>
                  {["Time", "Status", "Response Time", "MongoDB"].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        color: "#555",
                        fontSize: 12,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {history.map((h, i) => (
                  <tr
                    key={i}
                    style={{
                      borderBottom:
                        i < history.length - 1 ? "1px solid #222" : "none",
                      background: i === 0 ? "#1f1f1f" : "transparent",
                    }}
                  >
                    <td
                      style={{
                        padding: "12px 16px",
                        color: "#888",
                        fontSize: 13,
                      }}
                    >
                      {formatTime(h.time)}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <StatusDot status={h.status} />
                      <span
                        style={{
                          color: h.status === "online" ? "#4ade80" : "#f87171",
                          fontSize: 13,
                        }}
                      >
                        {h.status === "online" ? "Online" : "Offline"}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        color: "#F9F8F5",
                        fontSize: 13,
                      }}
                    >
                      {h.responseTime} ms
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 13 }}>
                      <span
                        style={{
                          color:
                            h.mongoStatus === true ||
                            h.mongoStatus === "connected"
                              ? "#4ade80"
                              : "#888",
                        }}
                      >
                        {h.mongoStatus === true || h.mongoStatus === "connected"
                          ? "Connected"
                          : "Unknown"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}