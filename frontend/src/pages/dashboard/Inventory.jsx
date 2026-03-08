
// import React, { useEffect, useState, useRef } from "react";
// import {
//   Package,
//   Search,
//   AlertTriangle,
//   CheckCircle,
//   XCircle,
//   Edit2,
//   Save,
//   X,
// } from "lucide-react";
// import api from "../../lib/api.jsx";
// import { toast } from "sonner";

// const Inventory = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");
//   const [filter, setFilter] = useState("all");
//   const [editingId, setEditingId] = useState(null);
//   const [editQty, setEditQty] = useState("");
//   const inputRef = useRef(null);

//   useEffect(() => {
//     fetchAll();
//   }, []);
//   useEffect(() => {
//     if (editingId && inputRef.current) inputRef.current.focus();
//   }, [editingId]);

//   const fetchAll = async () => {
//     setLoading(true);
//     try {
//       const res = await api.get("/products?limit=500&include_inactive=true");
//       setProducts(res.data);
//     } catch {
//       toast.error("Failed to load inventory");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const startEdit = (p) => {
//     setEditingId(p.id);
//     setEditQty(String(p.inventory?.quantity ?? 0));
//   };
//   const cancelEdit = () => {
//     setEditingId(null);
//     setEditQty("");
//   };

//   const saveQty = async (productId) => {
//     const qty = parseInt(editQty, 10);
//     if (isNaN(qty) || qty < 0) {
//       toast.error("Enter a valid quantity (0 or more)");
//       return;
//     }
//     try {
//       await api.put(`/products/${productId}/inventory`, { quantity: qty });
//       setProducts((prev) =>
//         prev.map((p) =>
//           p.id === productId
//             ? { ...p, inventory: { ...(p.inventory || {}), quantity: qty } }
//             : p,
//         ),
//       );
//       toast.success("Stock updated");
//       cancelEdit();
//     } catch {
//       toast.error("Failed to update");
//     }
//   };

//   const stockStatus = (qty) => {
//     if (qty === 0) return "outofstock";
//     if (qty <= 5) return "low";
//     return "instock";
//   };

//   const visible = products.filter((p) => {
//     const qty = p.inventory?.quantity ?? 0;
//     const matchSearch =
//       !search ||
//       p.title?.toLowerCase().includes(search.toLowerCase()) ||
//       p.sku?.toLowerCase().includes(search.toLowerCase());
//     const matchFilter = filter === "all" || stockStatus(qty) === filter;
//     return matchSearch && matchFilter;
//   });

//   const inStock = products.filter(
//     (p) => (p.inventory?.quantity ?? 0) > 5,
//   ).length;
//   const low = products.filter((p) => {
//     const q = p.inventory?.quantity ?? 0;
//     return q > 0 && q <= 5;
//   }).length;
//   const outStock = products.filter(
//     (p) => (p.inventory?.quantity ?? 0) === 0,
//   ).length;

//   const FILTERS = [
//     { key: "all", label: "All", count: products.length },
//     { key: "instock", label: "In Stock", count: inStock },
//     { key: "low", label: "Low", count: low },
//     { key: "outofstock", label: "Out", count: outStock },
//   ];

//   const statusConfig = {
//     instock: {
//       label: "In Stock",
//       color: "bg-green-50 text-green-700",
//       dot: "bg-green-500",
//     },
//     low: {
//       label: "Low Stock",
//       color: "bg-amber-50 text-amber-700",
//       dot: "bg-amber-500",
//     },
//     outofstock: {
//       label: "Out of Stock",
//       color: "bg-red-50 text-red-600",
//       dot: "bg-red-500",
//     },
//   };

//   return (
//     <div className="p-4 md:p-8 max-w-5xl">
//       {/* Header */}
//       <div className="mb-6 md:mb-8">
//         <h1 className="font-heading text-xl md:text-2xl font-semibold text-[#2C2C2C]">
//           Inventory
//         </h1>
//         <p className="text-xs md:text-sm text-gray-400 mt-1">
//           Manage stock quantities across all products
//         </p>
//       </div>

//       {/* Stats row */}
//       <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
//         {[
//           {
//             label: "In Stock",
//             value: inStock,
//             icon: CheckCircle,
//             color: "text-green-500",
//             bg: "bg-green-50",
//           },
//           {
//             label: "Low Stock",
//             value: low,
//             icon: AlertTriangle,
//             color: "text-amber-500",
//             bg: "bg-amber-50",
//           },
//           {
//             label: "Out of Stock",
//             value: outStock,
//             icon: XCircle,
//             color: "text-red-500",
//             bg: "bg-red-50",
//           },
//         ].map(({ label, value, icon: Icon, color, bg }) => (
//           <div
//             key={label}
//             className={`${bg} rounded-lg px-3 md:px-5 py-3 md:py-4 flex flex-col md:flex-row items-center md:items-center gap-1 md:gap-4`}
//           >
//             <Icon className={`w-5 h-5 md:w-6 md:h-6 ${color} shrink-0`} />
//             <div className="text-center md:text-left">
//               <p className="text-xl md:text-2xl font-bold text-[#2C2C2C] leading-none">
//                 {value}
//               </p>
//               <p className="text-[9px] md:text-xs text-gray-500 mt-0.5 leading-tight">
//                 {label}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Search + filters */}
//       <div className="flex flex-col gap-3 mb-5 md:mb-6">
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search by name or SKU…"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full pl-9 pr-3 py-2.5 text-sm border border-[#E8E5E0] rounded bg-white focus:outline-none focus:border-[#C5A059]"
//           />
//         </div>
//         {/* Filter pills — scrollable on mobile */}
//         <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap md:overflow-visible">
//           {FILTERS.map(({ key, label, count }) => (
//             <button
//               key={key}
//               onClick={() => setFilter(key)}
//               className={`shrink-0 px-3 py-1.5 text-xs font-semibold rounded-full border transition-all ${
//                 filter === key
//                   ? "bg-[#2C2C2C] text-white border-[#2C2C2C]"
//                   : "bg-white text-gray-500 border-[#E8E5E0] hover:border-[#C5A059] hover:text-[#C5A059]"
//               }`}
//             >
//               {label} <span className="opacity-60">({count})</span>
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Content */}
//       {loading ? (
//         <div className="flex items-center justify-center py-20">
//           <div className="w-7 h-7 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
//         </div>
//       ) : visible.length === 0 ? (
//         <div className="text-center py-20 border border-[#F2F0EB] rounded-lg">
//           <Package className="w-10 h-10 text-gray-200 mx-auto mb-3" />
//           <p className="text-gray-400 text-sm">No products found</p>
//         </div>
//       ) : (
//         <>
//           {/* ── MOBILE: Card list ── */}
//           <div className="md:hidden space-y-3">
//             {visible.map((p) => {
//               const qty = p.inventory?.quantity ?? 0;
//               const status = stockStatus(qty);
//               const { label, color, dot } = statusConfig[status];
//               const cover = p.images?.[0]?.url;
//               const isEdit = editingId === p.id;

//               return (
//                 <div
//                   key={p.id}
//                   className={`bg-white border border-[#F2F0EB] rounded-xl p-4 ${!p.active ? "opacity-50" : ""}`}
//                 >
//                   <div className="flex items-start gap-3">
//                     {/* Thumbnail */}
//                     <div className="w-14 h-14 rounded-lg bg-[#F2F0EB] overflow-hidden shrink-0">
//                       {cover ? (
//                         <img
//                           src={cover}
//                           alt=""
//                           className="w-full h-full object-cover"
//                         />
//                       ) : (
//                         <div className="w-full h-full flex items-center justify-center">
//                           <Package className="w-5 h-5 text-gray-300" />
//                         </div>
//                       )}
//                     </div>

//                     {/* Info */}
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-start justify-between gap-2">
//                         <p className="font-semibold text-sm text-[#2C2C2C] leading-snug line-clamp-2 flex-1">
//                           {p.title}
//                         </p>
//                         <span
//                           className={`shrink-0 inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${color}`}
//                         >
//                           <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
//                           {label}
//                         </span>
//                       </div>

//                       {p.sku && (
//                         <p className="text-[10px] text-gray-400 font-mono mt-0.5">
//                           {p.sku}
//                         </p>
//                       )}
//                       {!p.active && (
//                         <span className="text-[10px] text-gray-400">
//                           Hidden
//                         </span>
//                       )}
//                     </div>
//                   </div>

//                   {/* Stock row */}
//                   <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F2F0EB]">
//                     <div className="flex items-center gap-2">
//                       <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
//                         Stock
//                       </span>
//                       {isEdit ? (
//                         <input
//                           ref={inputRef}
//                           type="number"
//                           min="0"
//                           value={editQty}
//                           onChange={(e) => setEditQty(e.target.value)}
//                           onKeyDown={(e) => {
//                             if (e.key === "Enter") saveQty(p.id);
//                             if (e.key === "Escape") cancelEdit();
//                           }}
//                           className="w-20 text-center text-sm border border-[#C5A059] rounded px-2 py-1 focus:outline-none"
//                         />
//                       ) : (
//                         <span
//                           className={`text-lg font-bold ${
//                             status === "instock"
//                               ? "text-[#2C2C2C]"
//                               : status === "low"
//                                 ? "text-amber-600"
//                                 : "text-red-500"
//                           }`}
//                         >
//                           {qty}
//                         </span>
//                       )}
//                     </div>

//                     {/* Actions */}
//                     {isEdit ? (
//                       <div className="flex items-center gap-2">
//                         <button
//                           onClick={() => saveQty(p.id)}
//                           className="flex items-center gap-1 text-xs font-bold text-white bg-[#2C2C2C] hover:bg-[#C5A059] px-3 py-1.5 rounded transition-colors"
//                         >
//                           <Save className="w-3 h-3" /> Save
//                         </button>
//                         <button
//                           onClick={cancelEdit}
//                           className="p-1.5 text-gray-400 hover:text-gray-700 rounded border border-[#E8E5E0]"
//                         >
//                           <X className="w-3.5 h-3.5" />
//                         </button>
//                       </div>
//                     ) : (
//                       <button
//                         onClick={() => startEdit(p)}
//                         className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#C5A059] transition-colors"
//                       >
//                         <Edit2 className="w-3.5 h-3.5" /> Edit Stock
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           {/* ── DESKTOP: Table ── */}
//           <div className="hidden md:block border border-[#F2F0EB] rounded-lg overflow-hidden">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="bg-[#F9F8F5] border-b border-[#F2F0EB]">
//                   <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest">
//                     Product
//                   </th>
//                   <th className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest">
//                     SKU
//                   </th>
//                   <th className="text-center px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest">
//                     Status
//                   </th>
//                   <th className="text-center px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest">
//                     Stock
//                   </th>
//                   <th className="text-right px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest">
//                     Action
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-[#F2F0EB]">
//                 {visible.map((p) => {
//                   const qty = p.inventory?.quantity ?? 0;
//                   const status = stockStatus(qty);
//                   const { label, color } = statusConfig[status];
//                   const isEdit = editingId === p.id;
//                   const cover = p.images?.[0]?.url;

//                   return (
//                     <tr
//                       key={p.id}
//                       className={`hover:bg-[#FDFCFA] transition-colors ${!p.active ? "opacity-50" : ""}`}
//                     >
//                       <td className="px-5 py-3">
//                         <div className="flex items-center gap-3">
//                           <div className="w-9 h-9 rounded bg-[#F2F0EB] overflow-hidden shrink-0">
//                             {cover ? (
//                               <img
//                                 src={cover}
//                                 alt=""
//                                 className="w-full h-full object-cover"
//                               />
//                             ) : (
//                               <Package className="w-4 h-4 text-gray-300 m-auto mt-2.5" />
//                             )}
//                           </div>
//                           <div>
//                             <p className="font-medium text-[#2C2C2C] leading-snug line-clamp-1">
//                               {p.title}
//                             </p>
//                             {!p.active && (
//                               <span className="text-[10px] text-gray-400">
//                                 Hidden
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-4 py-3 text-gray-400 text-xs font-mono">
//                         {p.sku}
//                       </td>
//                       <td className="px-4 py-3 text-center">
//                         <span
//                           className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${color}`}
//                         >
//                           {label}
//                         </span>
//                       </td>
//                       <td className="px-4 py-3 text-center">
//                         {isEdit ? (
//                           <input
//                             ref={inputRef}
//                             type="number"
//                             min="0"
//                             value={editQty}
//                             onChange={(e) => setEditQty(e.target.value)}
//                             onKeyDown={(e) => {
//                               if (e.key === "Enter") saveQty(p.id);
//                               if (e.key === "Escape") cancelEdit();
//                             }}
//                             className="w-20 text-center text-sm border border-[#C5A059] rounded px-2 py-1 focus:outline-none"
//                           />
//                         ) : (
//                           <span
//                             className={`text-base font-bold ${
//                               status === "instock"
//                                 ? "text-[#2C2C2C]"
//                                 : status === "low"
//                                   ? "text-amber-600"
//                                   : "text-red-500"
//                             }`}
//                           >
//                             {qty}
//                           </span>
//                         )}
//                       </td>
//                       <td className="px-5 py-3 text-right">
//                         {isEdit ? (
//                           <div className="flex items-center justify-end gap-2">
//                             <button
//                               onClick={() => saveQty(p.id)}
//                               className="flex items-center gap-1 text-xs font-bold text-white bg-[#2C2C2C] hover:bg-[#C5A059] px-3 py-1.5 rounded transition-colors"
//                             >
//                               <Save className="w-3 h-3" /> Save
//                             </button>
//                             <button
//                               onClick={cancelEdit}
//                               className="p-1.5 text-gray-400 hover:text-gray-700 rounded border border-[#E8E5E0] transition-colors"
//                             >
//                               <X className="w-3.5 h-3.5" />
//                             </button>
//                           </div>
//                         ) : (
//                           <button
//                             onClick={() => startEdit(p)}
//                             className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#C5A059] transition-colors ml-auto"
//                           >
//                             <Edit2 className="w-3.5 h-3.5" /> Edit
//                           </button>
//                         )}
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default Inventory;


// import React, { useEffect, useState, useRef } from "react";
// import {
//   Package,
//   Search,
//   AlertTriangle,
//   CheckCircle,
//   XCircle,
//   Edit2,
//   Save,
//   X,
// } from "lucide-react";
// import api from "../../lib/api.jsx";
// import { toast } from "sonner";

// const Inventory = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");
//   const [filter, setFilter] = useState("all"); // all | instock | low | outofstock
//   const [editingId, setEditingId] = useState(null);
//   const [editQty, setEditQty] = useState("");
//   const inputRef = useRef(null);

//   useEffect(() => {
//     fetchAll();
//   }, []);

//   useEffect(() => {
//     if (editingId && inputRef.current) inputRef.current.focus();
//   }, [editingId]);

//   const fetchAll = async () => {
//     setLoading(true);
//     try {
//       const res = await api.get("/products?limit=500&include_inactive=true");
//       setProducts(res.data);
//     } catch {
//       toast.error("Failed to load inventory");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const startEdit = (p) => {
//     setEditingId(p.id);
//     setEditQty(String(p.inventory?.quantity ?? 0));
//   };

//   const cancelEdit = () => {
//     setEditingId(null);
//     setEditQty("");
//   };

//   const saveQty = async (productId) => {
//     const qty = parseInt(editQty, 10);
//     if (isNaN(qty) || qty < 0) {
//       toast.error("Enter a valid quantity (0 or more)");
//       return;
//     }
//     try {
//       await api.put(`/products/${productId}/inventory`, { quantity: qty });
//       setProducts((prev) =>
//         prev.map((p) =>
//           p.id === productId
//             ? { ...p, inventory: { ...(p.inventory || {}), quantity: qty } }
//             : p,
//         ),
//       );
//       toast.success("Stock updated");
//       cancelEdit();
//     } catch {
//       toast.error("Failed to update");
//     }
//   };

//   const stockStatus = (qty) => {
//     if (qty === 0) return "outofstock";
//     if (qty <= 5) return "low";
//     return "instock";
//   };

//   // Filter + search
//   const visible = products.filter((p) => {
//     const qty = p.inventory?.quantity ?? 0;
//     const matchSearch =
//       !search ||
//       p.title?.toLowerCase().includes(search.toLowerCase()) ||
//       p.sku?.toLowerCase().includes(search.toLowerCase());
//     const matchFilter = filter === "all" || stockStatus(qty) === filter;
//     return matchSearch && matchFilter;
//   });

//   // Stats
//   const inStock = products.filter(
//     (p) => (p.inventory?.quantity ?? 0) > 5,
//   ).length;
//   const low = products.filter((p) => {
//     const q = p.inventory?.quantity ?? 0;
//     return q > 0 && q <= 5;
//   }).length;
//   const outStock = products.filter(
//     (p) => (p.inventory?.quantity ?? 0) === 0,
//   ).length;

//   const FILTERS = [
//     { key: "all", label: "All", count: products.length },
//     { key: "instock", label: "In Stock", count: inStock },
//     { key: "low", label: "Low Stock", count: low },
//     { key: "outofstock", label: "Out of Stock", count: outStock },
//   ];

//   return (
//     <div className="p-8 max-w-5xl">
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="font-heading text-2xl font-semibold text-[#2C2C2C]">
//           Inventory
//         </h1>
//         <p className="text-sm text-gray-400 mt-1">
//           Manage stock quantities across all products
//         </p>
//       </div>

//       {/* Stats row */}
//       <div className="grid grid-cols-3 gap-4 mb-8">
//         {[
//           {
//             label: "In Stock",
//             value: inStock,
//             icon: CheckCircle,
//             color: "text-green-500",
//             bg: "bg-green-50",
//           },
//           {
//             label: "Low Stock",
//             value: low,
//             icon: AlertTriangle,
//             color: "text-amber-500",
//             bg: "bg-amber-50",
//           },
//           {
//             label: "Out of Stock",
//             value: outStock,
//             icon: XCircle,
//             color: "text-red-500",
//             bg: "bg-red-50",
//           },
//         ].map(({ label, value, icon: Icon, color, bg }) => (
//           <div
//             key={label}
//             className={`${bg} border border-opacity-20 rounded-lg px-5 py-4 flex items-center gap-4`}
//           >
//             <Icon className={`w-6 h-6 ${color} shrink-0`} />
//             <div>
//               <p className="text-2xl font-bold text-[#2C2C2C]">{value}</p>
//               <p className="text-xs text-gray-500 mt-0.5">{label}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Search + filters */}
//       <div className="flex flex-wrap items-center gap-3 mb-6">
//         <div className="relative flex-1 min-w-[200px] max-w-xs">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search by name or SKU…"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full pl-9 pr-3 py-2 text-sm border border-[#E8E5E0] rounded bg-white focus:outline-none focus:border-[#C5A059]"
//           />
//         </div>
//         <div className="flex gap-2">
//           {FILTERS.map(({ key, label, count }) => (
//             <button
//               key={key}
//               onClick={() => setFilter(key)}
//               className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all ${
//                 filter === key
//                   ? "bg-[#2C2C2C] text-white border-[#2C2C2C]"
//                   : "bg-white text-gray-500 border-[#E8E5E0] hover:border-[#C5A059] hover:text-[#C5A059]"
//               }`}
//             >
//               {label} <span className="opacity-60 ml-0.5">({count})</span>
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Table */}
//       {loading ? (
//         <div className="flex items-center justify-center py-20">
//           <div className="w-7 h-7 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
//         </div>
//       ) : visible.length === 0 ? (
//         <div className="text-center py-20 border border-[#F2F0EB] rounded-lg">
//           <Package className="w-10 h-10 text-gray-200 mx-auto mb-3" />
//           <p className="text-gray-400 text-sm">No products found</p>
//         </div>
//       ) : (
//         <div className="border border-[#F2F0EB] rounded-lg overflow-hidden">
//           <table className="w-full text-sm">
//             <thead>
//               <tr className="bg-[#F9F8F5] border-b border-[#F2F0EB]">
//                 <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest">
//                   Product
//                 </th>
//                 <th className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest">
//                   SKU
//                 </th>
//                 <th className="text-center px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest">
//                   Status
//                 </th>
//                 <th className="text-center px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest">
//                   Stock
//                 </th>
//                 <th className="text-right px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest">
//                   Action
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-[#F2F0EB]">
//               {visible.map((p) => {
//                 const qty = p.inventory?.quantity ?? 0;
//                 const status = stockStatus(qty);
//                 const isEdit = editingId === p.id;
//                 const cover = p.images?.[0]?.url;

//                 return (
//                   <tr
//                     key={p.id}
//                     className={`hover:bg-[#FDFCFA] transition-colors ${!p.active ? "opacity-50" : ""}`}
//                   >
//                     {/* Product */}
//                     <td className="px-5 py-3">
//                       <div className="flex items-center gap-3">
//                         <div className="w-9 h-9 rounded bg-[#F2F0EB] overflow-hidden shrink-0">
//                           {cover ? (
//                             <img
//                               src={cover}
//                               alt=""
//                               className="w-full h-full object-cover"
//                             />
//                           ) : (
//                             <Package className="w-4 h-4 text-gray-300 m-auto mt-2.5" />
//                           )}
//                         </div>
//                         <div>
//                           <p className="font-medium text-[#2C2C2C] leading-snug line-clamp-1">
//                             {p.title}
//                           </p>
//                           {!p.active && (
//                             <span className="text-[10px] text-gray-400">
//                               Hidden
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     </td>

//                     {/* SKU */}
//                     <td className="px-4 py-3 text-gray-400 text-xs font-mono">
//                       {p.sku}
//                     </td>

//                     {/* Status badge */}
//                     <td className="px-4 py-3 text-center">
//                       <span
//                         className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
//                           status === "instock"
//                             ? "bg-green-50 text-green-700"
//                             : status === "low"
//                               ? "bg-amber-50 text-amber-700"
//                               : "bg-red-50 text-red-600"
//                         }`}
//                       >
//                         {status === "instock"
//                           ? "In Stock"
//                           : status === "low"
//                             ? "Low"
//                             : "Out of Stock"}
//                       </span>
//                     </td>

//                     {/* Stock qty — editable inline */}
//                     <td className="px-4 py-3 text-center">
//                       {isEdit ? (
//                         <input
//                           ref={inputRef}
//                           type="number"
//                           min="0"
//                           value={editQty}
//                           onChange={(e) => setEditQty(e.target.value)}
//                           onKeyDown={(e) => {
//                             if (e.key === "Enter") saveQty(p.id);
//                             if (e.key === "Escape") cancelEdit();
//                           }}
//                           className="w-20 text-center text-sm border border-[#C5A059] rounded px-2 py-1 focus:outline-none"
//                         />
//                       ) : (
//                         <span
//                           className={`text-base font-bold ${
//                             status === "instock"
//                               ? "text-[#2C2C2C]"
//                               : status === "low"
//                                 ? "text-amber-600"
//                                 : "text-red-500"
//                           }`}
//                         >
//                           {qty}
//                         </span>
//                       )}
//                     </td>

//                     {/* Action */}
//                     <td className="px-5 py-3 text-right">
//                       {isEdit ? (
//                         <div className="flex items-center justify-end gap-2">
//                           <button
//                             onClick={() => saveQty(p.id)}
//                             className="flex items-center gap-1 text-xs font-bold text-white bg-[#2C2C2C] hover:bg-[#C5A059] px-3 py-1.5 rounded transition-colors"
//                           >
//                             <Save className="w-3 h-3" /> Save
//                           </button>
//                           <button
//                             onClick={cancelEdit}
//                             className="p-1.5 text-gray-400 hover:text-gray-700 rounded border border-[#E8E5E0] transition-colors"
//                           >
//                             <X className="w-3.5 h-3.5" />
//                           </button>
//                         </div>
//                       ) : (
//                         <button
//                           onClick={() => startEdit(p)}
//                           className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#C5A059] transition-colors ml-auto"
//                         >
//                           <Edit2 className="w-3.5 h-3.5" /> Edit
//                         </button>
//                       )}
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Inventory;

import React, { useEffect, useState, useRef } from "react";
import {
  Package,
  Search,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Edit2,
  Save,
  X,
} from "lucide-react";
import api from "../../lib/api.jsx";
import { toast } from "sonner";

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editQty, setEditQty] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    fetchAll();
  }, []);
  useEffect(() => {
    if (editingId && inputRef.current) inputRef.current.focus();
  }, [editingId]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await api.get("/products?limit=500&include_inactive=true");
      setProducts(res.data);
    } catch {
      toast.error("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setEditQty(String(p.inventory?.quantity ?? 0));
  };
  const cancelEdit = () => {
    setEditingId(null);
    setEditQty("");
  };

  const saveQty = async (productId) => {
    const qty = parseInt(editQty, 10);
    if (isNaN(qty) || qty < 0) {
      toast.error("Enter a valid quantity (0 or more)");
      return;
    }
    try {
      await api.put(`/products/${productId}/inventory`, { quantity: qty });
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId
            ? { ...p, inventory: { ...(p.inventory || {}), quantity: qty } }
            : p,
        ),
      );
      toast.success("Stock updated");
      cancelEdit();
    } catch {
      toast.error("Failed to update");
    }
  };

  const stockStatus = (qty) => {
    if (qty === 0) return "outofstock";
    if (qty <= 5) return "low";
    return "instock";
  };

  const visible = products.filter((p) => {
    const qty = p.inventory?.quantity ?? 0;
    const matchSearch =
      !search ||
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || stockStatus(qty) === filter;
    return matchSearch && matchFilter;
  });

  const inStock = products.filter(
    (p) => (p.inventory?.quantity ?? 0) > 5,
  ).length;
  const low = products.filter((p) => {
    const q = p.inventory?.quantity ?? 0;
    return q > 0 && q <= 5;
  }).length;
  const outStock = products.filter(
    (p) => (p.inventory?.quantity ?? 0) === 0,
  ).length;

  const FILTERS = [
    { key: "all", label: "All", count: products.length },
    { key: "instock", label: "In Stock", count: inStock },
    { key: "low", label: "Low", count: low },
    { key: "outofstock", label: "Out", count: outStock },
  ];

  const statusConfig = {
    instock: {
      label: "In Stock",
      color: "bg-green-50 text-green-700",
      dot: "bg-green-500",
    },
    low: {
      label: "Low Stock",
      color: "bg-amber-50 text-amber-700",
      dot: "bg-amber-500",
    },
    outofstock: {
      label: "Out of Stock",
      color: "bg-red-50 text-red-600",
      dot: "bg-red-500",
    },
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="font-heading text-xl md:text-2xl font-semibold text-[#2C2C2C]">
          Inventory
        </h1>
        <p className="text-xs md:text-sm text-gray-400 mt-1">
          Manage stock quantities across all products
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
        {[
          {
            label: "In Stock",
            value: inStock,
            icon: CheckCircle,
            color: "text-green-500",
            bg: "bg-green-50",
          },
          {
            label: "Low Stock",
            value: low,
            icon: AlertTriangle,
            color: "text-amber-500",
            bg: "bg-amber-50",
          },
          {
            label: "Out of Stock",
            value: outStock,
            icon: XCircle,
            color: "text-red-500",
            bg: "bg-red-50",
          },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div
            key={label}
            className={`${bg} rounded-lg px-3 md:px-5 py-3 md:py-4 flex flex-col md:flex-row items-center md:items-center gap-1 md:gap-4`}
          >
            <Icon className={`w-5 h-5 md:w-6 md:h-6 ${color} shrink-0`} />
            <div className="text-center md:text-left">
              <p className="text-xl md:text-2xl font-bold text-[#2C2C2C] leading-none">
                {value}
              </p>
              <p className="text-[9px] md:text-xs text-gray-500 mt-0.5 leading-tight">
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Search + filters */}
      <div className="flex flex-col gap-3 mb-5 md:mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or SKU…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 text-sm border border-[#E8E5E0] rounded bg-white focus:outline-none focus:border-[#C5A059]"
          />
        </div>
        {/* Filter pills — scrollable on mobile */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap md:overflow-visible">
          {FILTERS.map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`shrink-0 px-3 py-1.5 text-xs font-semibold rounded-full border transition-all ${
                filter === key
                  ? "bg-[#2C2C2C] text-white border-[#2C2C2C]"
                  : "bg-white text-gray-500 border-[#E8E5E0] hover:border-[#C5A059] hover:text-[#C5A059]"
              }`}
            >
              {label} <span className="opacity-60">({count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-7 h-7 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : visible.length === 0 ? (
        <div className="text-center py-20 border border-[#F2F0EB] rounded-lg">
          <Package className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No products found</p>
        </div>
      ) : (
        <>
          {/* ── MOBILE: Card list ── */}
          <div className="md:hidden space-y-3">
            {visible.map((p) => {
              const qty = p.inventory?.quantity ?? 0;
              const status = stockStatus(qty);
              const { label, color, dot } = statusConfig[status];
              const cover = p.images?.[0]?.url;
              const isEdit = editingId === p.id;

              return (
                <div
                  key={p.id}
                  className={`bg-white border border-[#F2F0EB] rounded-xl p-4 ${!p.active ? "opacity-50" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    {/* Thumbnail */}
                    <div className="w-14 h-14 rounded-lg bg-[#F2F0EB] overflow-hidden shrink-0">
                      {cover ? (
                        <img
                          src={cover}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-5 h-5 text-gray-300" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-sm text-[#2C2C2C] leading-snug line-clamp-2 flex-1">
                          {p.title}
                        </p>
                        <span
                          className={`shrink-0 inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${color}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                          {label}
                        </span>
                      </div>

                      {p.sku && (
                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                          {p.sku}
                        </p>
                      )}
                      {!p.active && (
                        <span className="text-[10px] text-gray-400">
                          Hidden
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stock row */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F2F0EB]">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                        Stock
                      </span>
                      {isEdit ? (
                        <input
                          ref={inputRef}
                          type="number"
                          min="0"
                          value={editQty}
                          onChange={(e) => setEditQty(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveQty(p.id);
                            if (e.key === "Escape") cancelEdit();
                          }}
                          className="w-20 text-center text-sm border border-[#C5A059] rounded px-2 py-1 focus:outline-none"
                        />
                      ) : (
                        <span
                          className={`text-lg font-bold ${
                            status === "instock"
                              ? "text-[#2C2C2C]"
                              : status === "low"
                                ? "text-amber-600"
                                : "text-red-500"
                          }`}
                        >
                          {qty}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    {isEdit ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => saveQty(p.id)}
                          className="flex items-center gap-1 text-xs font-bold text-white bg-[#2C2C2C] hover:bg-[#C5A059] px-3 py-1.5 rounded transition-colors"
                        >
                          <Save className="w-3 h-3" /> Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="p-1.5 text-gray-400 hover:text-gray-700 rounded border border-[#E8E5E0]"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEdit(p)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#C5A059] transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Edit Stock
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── DESKTOP: Table ── */}
          <div className="hidden md:block border border-[#F2F0EB] rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F9F8F5] border-b border-[#F2F0EB]">
                  <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Product
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest">
                    SKU
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Status
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Stock
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2F0EB]">
                {visible.map((p) => {
                  const qty = p.inventory?.quantity ?? 0;
                  const status = stockStatus(qty);
                  const { label, color } = statusConfig[status];
                  const isEdit = editingId === p.id;
                  const cover = p.images?.[0]?.url;

                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-[#FDFCFA] transition-colors ${!p.active ? "opacity-50" : ""}`}
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded bg-[#F2F0EB] overflow-hidden shrink-0">
                            {cover ? (
                              <img
                                src={cover}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Package className="w-4 h-4 text-gray-300 m-auto mt-2.5" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-[#2C2C2C] leading-snug line-clamp-1">
                              {p.title}
                            </p>
                            {!p.active && (
                              <span className="text-[10px] text-gray-400">
                                Hidden
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs font-mono">
                        {p.sku}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${color}`}
                        >
                          {label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {isEdit ? (
                          <input
                            ref={inputRef}
                            type="number"
                            min="0"
                            value={editQty}
                            onChange={(e) => setEditQty(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveQty(p.id);
                              if (e.key === "Escape") cancelEdit();
                            }}
                            className="w-20 text-center text-sm border border-[#C5A059] rounded px-2 py-1 focus:outline-none"
                          />
                        ) : (
                          <span
                            className={`text-base font-bold ${
                              status === "instock"
                                ? "text-[#2C2C2C]"
                                : status === "low"
                                  ? "text-amber-600"
                                  : "text-red-500"
                            }`}
                          >
                            {qty}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-right">
                        {isEdit ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => saveQty(p.id)}
                              className="flex items-center gap-1 text-xs font-bold text-white bg-[#2C2C2C] hover:bg-[#C5A059] px-3 py-1.5 rounded transition-colors"
                            >
                              <Save className="w-3 h-3" /> Save
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="p-1.5 text-gray-400 hover:text-gray-700 rounded border border-[#E8E5E0] transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => startEdit(p)}
                            className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#C5A059] transition-colors ml-auto"
                          >
                            <Edit2 className="w-3.5 h-3.5" /> Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Inventory;