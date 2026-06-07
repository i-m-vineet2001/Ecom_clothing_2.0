// import React, { useEffect, useState } from "react";
// import {
//   Star,
//   Trash2,
//   Eye,
//   EyeOff,
//   Mail,
//   Calendar,
//   MessageSquareDashed,
//   ExternalLink,
//   RefreshCw,
// } from "lucide-react";
// import api from "../../lib/api.jsx";
// import { toast } from "sonner";

// // ── Star display ──────────────────────────────────────────────────────────────
// const Stars = ({ value }) => (
//   <div className="flex gap-0.5">
//     {[1, 2, 3, 4, 5].map((n) => (
//       <Star
//         key={n}
//         className={`w-3.5 h-3.5 ${n <= value ? "text-[#C5A059] fill-[#C5A059]" : "text-gray-200"}`}
//       />
//     ))}
//   </div>
// );

// const RATING_LABELS = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

// const Feedback = () => {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState("all"); // all | unread | 5star | low

//   useEffect(() => {
//     fetchFeedback();
//   }, []);

//   const fetchFeedback = async () => {
//     setLoading(true);
//     try {
//       const res = await api.get("/feedback?limit=500");
//       setItems(res.data);
//     } catch {
//       toast.error("Failed to load feedback");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const markRead = async (id) => {
//     try {
//       await api.patch(`/feedback/${id}/read`);
//       setItems((prev) =>
//         prev.map((f) => (f.id === id ? { ...f, is_read: true } : f)),
//       );
//     } catch {
//       toast.error("Failed to update");
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!confirm("Delete this feedback?")) return;
//     try {
//       await api.delete(`/feedback/${id}`);
//       setItems((prev) => prev.filter((f) => f.id !== id));
//       toast.success("Deleted");
//     } catch {
//       toast.error("Failed to delete");
//     }
//   };

//   // Stats
//   const unreadCount = items.filter((f) => !f.is_read).length;
//   const avgRating = items.length
//     ? (items.reduce((s, f) => s + f.rating, 0) / items.length).toFixed(1)
//     : "—";
//   const fiveStars = items.filter((f) => f.rating === 5).length;

//   // Filtered list
//   const visible = items.filter((f) => {
//     if (filter === "unread") return !f.is_read;
//     if (filter === "5star") return f.rating === 5;
//     if (filter === "low") return f.rating <= 2;
//     return true;
//   });

//   const formatDate = (iso) => {
//     if (!iso) return "";
//     const d = new Date(iso);
//     return d.toLocaleDateString("en-IN", {
//       day: "numeric",
//       month: "short",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const FILTERS = [
//     { key: "all", label: "All", count: items.length },
//     { key: "unread", label: "Unread", count: unreadCount },
//     { key: "5star", label: "⭐ 5 Star", count: fiveStars },
//     {
//       key: "low",
//       label: "Low Rating",
//       count: items.filter((f) => f.rating <= 2).length,
//     },
//   ];

//   return (
//     <div className="p-8 max-w-5xl">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-8">
//         <div>
//           <h1 className="font-heading text-2xl font-semibold text-[#2C2C2C]">
//             Customer Feedback
//           </h1>
//           <p className="text-sm text-gray-400 mt-1">
//             Reviews and suggestions submitted from the footer
//           </p>
//         </div>
//         <button
//           onClick={fetchFeedback}
//           className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#C5A059] transition-colors border border-[#E8E5E0] px-3 py-2 rounded hover:border-[#C5A059]"
//         >
//           <RefreshCw className="w-3.5 h-3.5" /> Refresh
//         </button>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-3 gap-4 mb-8">
//         {[
//           { label: "Total Reviews", value: items.length, sub: "all time" },
//           { label: "Average Rating", value: avgRating, sub: "out of 5 stars" },
//           {
//             label: "Unread",
//             value: unreadCount,
//             sub: unreadCount > 0 ? "needs attention" : "all caught up",
//           },
//         ].map(({ label, value, sub }) => (
//           <div
//             key={label}
//             className="bg-[#F9F8F5] border border-[#F2F0EB] rounded-lg px-5 py-4"
//           >
//             <p className="text-2xl font-bold text-[#2C2C2C]">{value}</p>
//             <p className="text-xs font-semibold text-gray-500 mt-0.5">
//               {label}
//             </p>
//             <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>
//           </div>
//         ))}
//       </div>

//       {/* Filter tabs */}
//       <div className="flex gap-2 mb-6 flex-wrap">
//         {FILTERS.map(({ key, label, count }) => (
//           <button
//             key={key}
//             onClick={() => setFilter(key)}
//             className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all ${
//               filter === key
//                 ? "bg-[#2C2C2C] text-white border-[#2C2C2C]"
//                 : "bg-white text-gray-500 border-[#E8E5E0] hover:border-[#C5A059] hover:text-[#C5A059]"
//             }`}
//           >
//             {label} <span className="opacity-60 ml-0.5">({count})</span>
//           </button>
//         ))}
//       </div>

//       {/* Feedback list */}
//       {loading ? (
//         <div className="flex items-center justify-center py-20">
//           <div className="w-7 h-7 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
//         </div>
//       ) : visible.length === 0 ? (
//         <div className="text-center py-24 border border-dashed border-[#E8E5E0] rounded-lg">
//           <MessageSquareDashed className="w-12 h-12 text-gray-200 mx-auto mb-4" />
//           <p className="text-gray-400">No feedback yet</p>
//           <p className="text-xs text-gray-300 mt-1">
//             Feedback submitted from the website footer will appear here
//           </p>
//         </div>
//       ) : (
//         <div className="space-y-3">
//           {visible.map((fb) => (
//             <div
//               key={fb.id}
//               className={`border rounded-lg px-5 py-4 transition-all ${
//                 !fb.is_read
//                   ? "border-[#C5A059]/40 bg-[#FDFBF7]"
//                   : "border-[#F2F0EB] bg-white"
//               }`}
//             >
//               <div className="flex items-start justify-between gap-4">
//                 {/* Left: content */}
//                 <div className="flex-1 min-w-0">
//                   {/* Top row */}
//                   <div className="flex items-center gap-3 flex-wrap mb-2">
//                     {/* Unread dot */}
//                     {!fb.is_read && (
//                       <span className="w-2 h-2 rounded-full bg-[#C5A059] shrink-0" />
//                     )}

//                     {/* Name */}
//                     <span className="font-semibold text-[#2C2C2C] text-sm">
//                       {fb.name}
//                     </span>

//                     {/* Stars */}
//                     <Stars value={fb.rating} />
//                     <span className="text-xs text-gray-400">
//                       {RATING_LABELS[fb.rating]}
//                     </span>

//                     {/* Email */}
//                     {fb.email && (
//                       <a
//                         href={`mailto:${fb.email}`}
//                         className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#C5A059] transition-colors"
//                       >
//                         <Mail className="w-3 h-3" /> {fb.email}
//                       </a>
//                     )}
//                   </div>

//                   {/* Message */}
//                   <p className="text-sm text-gray-700 leading-relaxed mb-2">
//                     "{fb.message}"
//                   </p>

//                   {/* Footer meta */}
//                   <div className="flex items-center gap-4 text-[10px] text-gray-400">
//                     <span className="flex items-center gap-1">
//                       <Calendar className="w-3 h-3" />
//                       {formatDate(fb.created_at)}
//                     </span>
//                     {fb.page_url && (
//                       <a
//                         href={fb.page_url}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="flex items-center gap-1 hover:text-[#C5A059] transition-colors truncate max-w-[200px]"
//                       >
//                         <ExternalLink className="w-3 h-3 shrink-0" />
//                         {fb.page_url.replace(/^https?:\/\/[^/]+/, "") || "/"}
//                       </a>
//                     )}
//                   </div>
//                 </div>

//                 {/* Right: actions */}
//                 <div className="flex items-center gap-2 shrink-0">
//                   {!fb.is_read && (
//                     <button
//                       onClick={() => markRead(fb.id)}
//                       title="Mark as read"
//                       className="p-1.5 text-gray-400 hover:text-[#C5A059] transition-colors rounded border border-[#E8E5E0] hover:border-[#C5A059]"
//                     >
//                       <Eye className="w-3.5 h-3.5" />
//                     </button>
//                   )}
//                   {fb.is_read && (
//                     <span title="Read" className="p-1.5 text-gray-200">
//                       <EyeOff className="w-3.5 h-3.5" />
//                     </span>
//                   )}
//                   <button
//                     onClick={() => handleDelete(fb.id)}
//                     title="Delete"
//                     className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded border border-[#E8E5E0] hover:border-red-300"
//                   >
//                     <Trash2 className="w-3.5 h-3.5" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Feedback;


import React, { useEffect, useState } from "react";
import {
  Star,
  Trash2,
  Eye,
  EyeOff,
  Mail,
  Calendar,
  MessageSquareDashed,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import api from "../../lib/api.jsx";
import { toast } from "sonner";

// ── Star display ──────────────────────────────────────────────────────────────
const Stars = ({ value }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((n) => (
      <Star
        key={n}
        className={`w-3.5 h-3.5 ${n <= value ? "text-[#C5A059] fill-[#C5A059]" : "text-gray-200"}`}
      />
    ))}
  </div>
);

const RATING_LABELS = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

const Feedback = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all | unread | 5star | low

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const res = await api.get("/feedback?limit=500");
      setItems(res.data);
    } catch {
      toast.error("Failed to load feedback");
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id) => {
    try {
      await api.patch(`/feedback/${id}/read`);
      setItems((prev) =>
        prev.map((f) => (f.id === id ? { ...f, is_read: true } : f)),
      );
    } catch {
      toast.error("Failed to update");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this feedback?")) return;
    try {
      await api.delete(`/feedback/${id}`);
      setItems((prev) => prev.filter((f) => f.id !== id));
      toast.success("Deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  // Stats
  const unreadCount = items.filter((f) => !f.is_read).length;
  const avgRating = items.length
    ? (items.reduce((s, f) => s + f.rating, 0) / items.length).toFixed(1)
    : "—";
  const fiveStars = items.filter((f) => f.rating === 5).length;

  // Filtered list
  const visible = items.filter((f) => {
    if (filter === "unread") return !f.is_read;
    if (filter === "5star") return f.rating === 5;
    if (filter === "low") return f.rating <= 2;
    return true;
  });

  const formatDate = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const FILTERS = [
    { key: "all", label: "All", count: items.length },
    { key: "unread", label: "Unread", count: unreadCount },
    { key: "5star", label: "⭐ 5 Star", count: fiveStars },
    {
      key: "low",
      label: "Low Rating",
      count: items.filter((f) => f.rating <= 2).length,
    },
  ];

  return (
    <div className="p-4 sm:p-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-6 sm:mb-8">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-semibold text-[#2C2C2C]">
            Customer Feedback
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Reviews and suggestions submitted from the footer
          </p>
        </div>
        <button
          onClick={fetchFeedback}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#C5A059] transition-colors border border-[#E8E5E0] px-3 py-2 rounded hover:border-[#C5A059]"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {[
          { label: "Total Reviews", value: items.length, sub: "all time" },
          { label: "Average Rating", value: avgRating, sub: "out of 5 stars" },
          {
            label: "Unread",
            value: unreadCount,
            sub: unreadCount > 0 ? "needs attention" : "all caught up",
          },
        ].map(({ label, value, sub }) => (
          <div
            key={label}
            className="bg-[#F9F8F5] border border-[#F2F0EB] rounded-lg px-5 py-4"
          >
            <p className="text-2xl font-bold text-[#2C2C2C]">{value}</p>
            <p className="text-xs font-semibold text-gray-500 mt-0.5">
              {label}
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5 sm:mb-6 flex-wrap">
        {FILTERS.map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all ${
              filter === key
                ? "bg-[#2C2C2C] text-white border-[#2C2C2C]"
                : "bg-white text-gray-500 border-[#E8E5E0] hover:border-[#C5A059] hover:text-[#C5A059]"
            }`}
          >
            {label} <span className="opacity-60 ml-0.5">({count})</span>
          </button>
        ))}
      </div>

      {/* Feedback list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-7 h-7 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : visible.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-[#E8E5E0] rounded-lg">
          <MessageSquareDashed className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-400">No feedback yet</p>
          <p className="text-xs text-gray-300 mt-1">
            Feedback submitted from the website footer will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((fb) => (
            <div
              key={fb.id}
              className={`border rounded-lg px-5 py-4 transition-all ${
                !fb.is_read
                  ? "border-[#C5A059]/40 bg-[#FDFBF7]"
                  : "border-[#F2F0EB] bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                {/* Left: content */}
                <div className="flex-1 min-w-0">
                  {/* Top row */}
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    {/* Unread dot */}
                    {!fb.is_read && (
                      <span className="w-2 h-2 rounded-full bg-[#C5A059] shrink-0" />
                    )}

                    {/* Name */}
                    <span className="font-semibold text-[#2C2C2C] text-sm">
                      {fb.name}
                    </span>

                    {/* Stars */}
                    <Stars value={fb.rating} />
                    <span className="text-xs text-gray-400">
                      {RATING_LABELS[fb.rating]}
                    </span>

                    {/* Email */}
                    {fb.email && (
                      <a
                        href={`mailto:${fb.email}`}
                        className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#C5A059] transition-colors truncate max-w-[180px]"
                      >
                        <Mail className="w-3 h-3 shrink-0" /> {fb.email}
                      </a>
                    )}
                  </div>

                  {/* Message */}
                  <p className="text-sm text-gray-700 leading-relaxed mb-2">
                    "{fb.message}"
                  </p>

                  {/* Footer meta */}
                  <div className="flex items-center gap-4 text-[10px] text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(fb.created_at)}
                    </span>
                    {fb.page_url && (
                      <a
                        href={fb.page_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-[#C5A059] transition-colors truncate max-w-[200px]"
                      >
                        <ExternalLink className="w-3 h-3 shrink-0" />
                        {fb.page_url.replace(/^https?:\/\/[^/]+/, "") || "/"}
                      </a>
                    )}
                  </div>
                </div>

                {/* Right: actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {!fb.is_read && (
                    <button
                      onClick={() => markRead(fb.id)}
                      title="Mark as read"
                      className="p-1.5 text-gray-400 hover:text-[#C5A059] transition-colors rounded border border-[#E8E5E0] hover:border-[#C5A059]"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {fb.is_read && (
                    <span title="Read" className="p-1.5 text-gray-200">
                      <EyeOff className="w-3.5 h-3.5" />
                    </span>
                  )}
                  <button
                    onClick={() => handleDelete(fb.id)}
                    title="Delete"
                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded border border-[#E8E5E0] hover:border-red-300"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Feedback;