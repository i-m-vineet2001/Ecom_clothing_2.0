
// import React, { useEffect, useState, useRef } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import ProductCard from "../components/ProductCard";
// import api from "../lib/api.jsx";
// import {
//   Search,
//   SlidersHorizontal,
//   X,
//   Plus,
//   Minus,
//   ChevronRight,
// } from "lucide-react";

// // ── Filter accordion ──────────────────────────────────────────────────────────
// const FilterSection = ({ title, open, onToggle, children }) => (
//   <div className="border-b border-gray-100 py-5">
//     <button
//       onClick={onToggle}
//       className="w-full flex items-center justify-between text-left"
//     >
//       <span className="text-[13px] font-semibold text-[#2C2C2C] tracking-wide">
//         {title}
//       </span>
//       {open ? (
//         <Minus className="w-3.5 h-3.5 text-gray-400 shrink-0" />
//       ) : (
//         <Plus className="w-3.5 h-3.5 text-gray-400 shrink-0" />
//       )}
//     </button>
//     {open && <div className="mt-4">{children}</div>}
//   </div>
// );

// // ── Radio circle ──────────────────────────────────────────────────────────────
// const RadioCircle = ({ checked }) => (
//   <div
//     className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
//       checked ? "border-[#2C2C2C] bg-[#2C2C2C]" : "border-gray-300"
//     }`}
//   >
//     {checked && <div className="w-2 h-2 bg-white rounded-full" />}
//   </div>
// );

// // ── Price inputs + dual slider ────────────────────────────────────────────────
// const PriceFilter = ({ min, max, value, onChange }) => {
//   const [lo, setLo] = useState(value[0]);
//   const [hi, setHi] = useState(value[1]);

//   useEffect(() => {
//     setLo(value[0]);
//     setHi(value[1]);
//   }, [value[0], value[1]]);

//   const pct = (v) => (max > min ? ((v - min) / (max - min)) * 100 : 0);

//   const commit = (newLo, newHi) => onChange([newLo, newHi]);

//   return (
//     <div className="space-y-5">
//       {/* Boxes */}
//       <div className="flex items-center gap-2">
//         {[
//           { val: lo, set: setLo, isMin: true },
//           { val: hi, set: setHi, isMin: false },
//         ].map(({ val, set, isMin }) => (
//           <React.Fragment key={isMin ? "min" : "max"}>
//             {!isMin && <span className="text-gray-300 text-sm">—</span>}
//             <div className="flex-1 border border-gray-300 px-3 py-2 flex items-center gap-1 focus-within:border-[#2C2C2C]">
//               <span className="text-xs text-gray-400">₹</span>
//               <input
//                 type="number"
//                 value={val}
//                 onChange={(e) => {
//                   const v = Number(e.target.value);
//                   set(v);
//                 }}
//                 onBlur={() => {
//                   const newLo = Math.min(lo, hi - 1);
//                   const newHi = Math.max(lo + 1, hi);
//                   setLo(newLo);
//                   setHi(newHi);
//                   commit(newLo, newHi);
//                 }}
//                 className="w-full text-sm text-[#2C2C2C] bg-transparent outline-none"
//               />
//             </div>
//           </React.Fragment>
//         ))}
//       </div>

//       {/* Slider track */}
//       <div className="relative h-[2px] bg-gray-200 mx-2 mt-6 mb-4">
//         <div
//           className="absolute h-full bg-[#2C2C2C]"
//           style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }}
//         />
//         {/* Min thumb */}
//         <input
//           type="range"
//           min={min}
//           max={max}
//           value={lo}
//           onChange={(e) => {
//             const v = Math.min(Number(e.target.value), hi - 1);
//             setLo(v);
//             commit(v, hi);
//           }}
//           className="absolute inset-0 w-full opacity-0 cursor-pointer h-5 -top-2"
//           style={{ zIndex: lo > max - 100 ? 5 : 3 }}
//         />
//         {/* Max thumb */}
//         <input
//           type="range"
//           min={min}
//           max={max}
//           value={hi}
//           onChange={(e) => {
//             const v = Math.max(Number(e.target.value), lo + 1);
//             setHi(v);
//             commit(lo, v);
//           }}
//           className="absolute inset-0 w-full opacity-0 cursor-pointer h-5 -top-2"
//           style={{ zIndex: 4 }}
//         />
//         {/* Visual thumbs */}
//         <div
//           className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-[#2C2C2C] rounded-full shadow pointer-events-none"
//           style={{ left: `calc(${pct(lo)}% - 8px)` }}
//         />
//         <div
//           className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-[#2C2C2C] rounded-full shadow pointer-events-none"
//           style={{ left: `calc(${pct(hi)}% - 8px)` }}
//         />
//       </div>
//     </div>
//   );
// };

// // ── Sidebar (shared desktop + mobile) ────────────────────────────────────────
// const Sidebar = ({
//   search,
//   setSearch,
//   availability,
//   setAvailability,
//   inStockCount,
//   outStockCount,
//   priceRange,
//   setPriceRange,
//   priceMin,
//   priceMax,
//   sortKey,
//   setSortKey,
//   totalCount,
//   filteredCount,
//   onReset,
// }) => {
//   const [openSections, setOpenSections] = useState({
//     availability: true,
//     price: true,
//     sort: true,
//   });
//   const toggle = (k) => setOpenSections((s) => ({ ...s, [k]: !s[k] }));

//   const SORT_OPTIONS = [
//     { label: "Alphabetically, A–Z", key: "title::asc" },
//     { label: "Alphabetically, Z–A", key: "title::desc" },
//     { label: "Price, low to high", key: "base_price::asc" },
//     { label: "Price, high to low", key: "base_price::desc" },
//     { label: "Date, old to new", key: "created_at::asc" },
//     { label: "Date, new to old", key: "created_at::desc" },
//   ];

//   const isFiltered =
//     availability !== "all" ||
//     priceRange[0] > priceMin ||
//     priceRange[1] < priceMax ||
//     search;

//   return (
//     <div className="select-none">
//       {/* Search */}
//       <div className="pb-5 border-b border-gray-100">
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search…"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 bg-[#F9F8F5] focus:outline-none focus:border-[#C5A059]"
//           />
//           {search && (
//             <button
//               onClick={() => setSearch("")}
//               className="absolute right-3 top-1/2 -translate-y-1/2"
//             >
//               <X className="w-3 h-3 text-gray-400 hover:text-gray-700" />
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Availability */}
//       <FilterSection
//         title="Availability"
//         open={openSections.availability}
//         onToggle={() => toggle("availability")}
//       >
//         <div className="space-y-3">
//           {[
//             { label: "In stock", val: "instock", count: inStockCount },
//             { label: "Out of stock", val: "outofstock", count: outStockCount },
//           ].map(({ label, val, count }) => (
//             <label
//               key={val}
//               className="flex items-center justify-between cursor-pointer group"
//               onClick={() =>
//                 setAvailability(availability === val ? "all" : val)
//               }
//             >
//               <div className="flex items-center gap-3">
//                 <RadioCircle checked={availability === val} />
//                 <span
//                   className={`text-sm ${availability === val ? "text-[#2C2C2C] font-medium" : "text-gray-600"}`}
//                 >
//                   {label}
//                 </span>
//               </div>
//               <span className="text-xs text-gray-400">{count}</span>
//             </label>
//           ))}
//         </div>
//       </FilterSection>

//       {/* Price */}
//       <FilterSection
//         title="Price"
//         open={openSections.price}
//         onToggle={() => toggle("price")}
//       >
//         <PriceFilter
//           min={priceMin}
//           max={priceMax}
//           value={priceRange}
//           onChange={setPriceRange}
//         />
//       </FilterSection>

//       {/* Sort by */}
//       <FilterSection
//         title="Sort by"
//         open={openSections.sort}
//         onToggle={() => toggle("sort")}
//       >
//         <div className="space-y-3">
//           {SORT_OPTIONS.map(({ label, key }) => (
//             <label
//               key={key}
//               className="flex items-center gap-3 cursor-pointer"
//               onClick={() => setSortKey(key)}
//             >
//               <RadioCircle checked={sortKey === key} />
//               <span
//                 className={`text-sm ${sortKey === key ? "text-[#2C2C2C] font-medium" : "text-gray-600"}`}
//               >
//                 {label}
//               </span>
//             </label>
//           ))}
//         </div>
//       </FilterSection>

//       {/* Reset + count */}
//       {isFiltered && (
//         <button
//           onClick={onReset}
//           className="mt-4 w-full py-2 text-xs tracking-widest uppercase font-bold text-gray-400 hover:text-[#C5A059] border border-gray-200 hover:border-[#C5A059] transition-colors"
//         >
//           Clear all filters
//         </button>
//       )}
//       <p className="text-xs text-gray-400 text-center mt-4">
//         {filteredCount} of {totalCount} products
//       </p>
//     </div>
//   );
// };

// // ── Main CategoryPage ─────────────────────────────────────────────────────────
// const CategoryPage = () => {
//   const { slug } = useParams();
//   const navigate = useNavigate();

//   const [category, setCategory] = useState(null);
//   const [allProducts, setAllProducts] = useState([]);
//   const [catLoading, setCatLoading] = useState(true);
//   const [prodLoading, setProdLoading] = useState(true);
//   const [drawerOpen, setDrawerOpen] = useState(false);

//   // Filter state
//   const [search, setSearch] = useState("");
//   const [availability, setAvailability] = useState("all");
//   const [priceRange, setPriceRange] = useState([0, 50000]);
//   const [priceMin, setPriceMin] = useState(0);
//   const [priceMax, setPriceMax] = useState(50000);
//   const [sortKey, setSortKey] = useState("created_at::desc");

//   // ── Resolve category by slug or id
//   useEffect(() => {
//     const load = async () => {
//       setCatLoading(true);
//       try {
//         const res = await api.get("/categories");
//         const cat = res.data.find((c) => c.slug === slug || c.id === slug);
//         if (!cat) {
//           navigate("/categories", { replace: true });
//           return;
//         }
//         setCategory(cat);
//       } catch {
//         navigate("/categories", { replace: true });
//       } finally {
//         setCatLoading(false);
//       }
//     };
//     load();
//   }, [slug]);

//   // ── Fetch products when category resolved
//   useEffect(() => {
//     if (!category) return;
//     const [sb, so] = sortKey.split("::");
//     const load = async () => {
//       setProdLoading(true);
//       try {
//         const res = await api.get(
//           `/products?category_id=${category.id}&sort_by=${sb}&sort_order=${so}&limit=200`,
//         );
//         setAllProducts(res.data);
//         if (res.data.length) {
//           const prices = res.data.map((p) => p.final_price ?? p.base_price);
//           const lo = 0;
//           const hi = Math.ceil(Math.max(...prices) / 100) * 100 || 50000;
//           setPriceMin(lo);
//           setPriceMax(hi);
//           setPriceRange([lo, hi]);
//         }
//       } catch {
//         setAllProducts([]);
//       } finally {
//         setProdLoading(false);
//       }
//     };
//     load();
//   }, [category, sortKey]);

//   // ── Client-side filters
//   const filtered = allProducts.filter((p) => {
//     const price = p.final_price ?? p.base_price;
//     const qty = p.inventory?.quantity ?? 0;
//     if (search && !p.title?.toLowerCase().includes(search.toLowerCase()))
//       return false;
//     if (availability === "instock" && qty === 0) return false;
//     if (availability === "outofstock" && qty > 0) return false;
//     if (price < priceRange[0] || price > priceRange[1]) return false;
//     return true;
//   });

//   const inStockCount = allProducts.filter(
//     (p) => (p.inventory?.quantity ?? 0) > 0,
//   ).length;
//   const outStockCount = allProducts.filter(
//     (p) => (p.inventory?.quantity ?? 0) === 0,
//   ).length;

//   const resetFilters = () => {
//     setSearch("");
//     setAvailability("all");
//     setPriceRange([priceMin, priceMax]);
//     setSortKey("created_at::desc");
//   };

//   const sidebarProps = {
//     search,
//     setSearch,
//     availability,
//     setAvailability,
//     inStockCount,
//     outStockCount,
//     priceRange,
//     setPriceRange,
//     priceMin,
//     priceMax,
//     sortKey,
//     setSortKey,
//     totalCount: allProducts.length,
//     filteredCount: filtered.length,
//     onReset: resetFilters,
//   };

//   if (catLoading)
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="w-8 h-8 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-white">
//       {/* ── Hero Banner ──────────────────────────────────────────────────── */}
//       <div className="relative w-full h-[280px] md:h-[400px] overflow-hidden bg-[#1a1a1a]">
//         {category?.image_url ? (
//           <img
//             src={category.image_url}
//             alt={category.name}
//             className="w-full h-full object-cover opacity-65"
//           />
//         ) : (
//           <div className="w-full h-full bg-gradient-to-br from-[#2C2C2C] via-[#3d2e1e] to-[#1a1a1a]" />
//         )}
//         {/* Gradient overlay */}
//         <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

//         {/* Breadcrumb */}
//         <div className="absolute top-5 left-6 md:left-12 flex items-center gap-2 text-white/60 text-[11px] tracking-widest uppercase">
//           <Link to="/" className="hover:text-white transition-colors">
//             Home
//           </Link>
//           <ChevronRight className="w-3 h-3" />
//           <Link to="/categories" className="hover:text-white transition-colors">
//             Categories
//           </Link>
//           <ChevronRight className="w-3 h-3" />
//           <span className="text-white">{category?.name}</span>
//         </div>

//         {/* Title */}
//         <div className="absolute bottom-8 left-6 md:left-12 right-6">
//           <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-white uppercase tracking-tight leading-none">
//             {category?.name}
//           </h1>
//           {category?.description && (
//             <p className="text-white/60 text-sm mt-3 max-w-lg leading-relaxed">
//               {category.description}
//             </p>
//           )}
//         </div>
//       </div>

//       {/* ── Body ─────────────────────────────────────────────────────────── */}
//       <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-10">
//         {/* Mobile top bar */}
//         <div className="flex items-center justify-between mb-6 md:hidden">
//           <p className="text-sm text-gray-500">{filtered.length} products</p>
//           <button
//             onClick={() => setDrawerOpen(true)}
//             className="flex items-center gap-2 text-sm font-semibold border border-[#2C2C2C] px-4 py-2"
//           >
//             <SlidersHorizontal className="w-4 h-4" /> Filters
//           </button>
//         </div>

//         <div className="flex gap-10">
//           {/* Desktop sidebar */}
//           <aside className="hidden md:block w-56 shrink-0">
//             <Sidebar {...sidebarProps} />
//           </aside>

//           {/* Mobile drawer */}
//           {drawerOpen && (
//             <div className="fixed inset-0 z-[200] flex">
//               <div
//                 className="absolute inset-0 bg-black/50"
//                 onClick={() => setDrawerOpen(false)}
//               />
//               <div className="relative ml-auto w-72 bg-white h-full overflow-y-auto p-6 shadow-2xl">
//                 <div className="flex items-center justify-between mb-5">
//                   <h2 className="font-heading text-lg font-semibold">
//                     Filters
//                   </h2>
//                   <button onClick={() => setDrawerOpen(false)}>
//                     <X className="w-5 h-5 text-gray-500" />
//                   </button>
//                 </div>
//                 <Sidebar {...sidebarProps} />
//               </div>
//             </div>
//           )}

//           {/* Product grid */}
//           <div className="flex-1 min-w-0">
//             {prodLoading ? (
//               <div className="flex items-center justify-center py-32">
//                 <div className="w-8 h-8 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
//               </div>
//             ) : filtered.length === 0 ? (
//               <div className="text-center py-32">
//                 <p className="text-gray-500 font-medium mb-1">
//                   No products found
//                 </p>
//                 <p className="text-sm text-gray-400 mb-5">
//                   Try adjusting your filters
//                 </p>
//                 <button
//                   onClick={resetFilters}
//                   className="text-xs font-bold tracking-widest uppercase text-white bg-[#2C2C2C] hover:bg-[#C5A059] px-6 py-2.5 transition-colors"
//                 >
//                   Clear Filters
//                 </button>
//               </div>
//             ) : (
//               <>
//                 <p className="text-sm text-gray-400 mb-6">
//                   Showing{" "}
//                   <span className="text-[#2C2C2C] font-semibold">
//                     {filtered.length}
//                   </span>{" "}
//                   product{filtered.length !== 1 ? "s" : ""}
//                 </p>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
//                   {filtered.map((product) => (
//                     <ProductCard key={product.id} product={product} />
//                   ))}
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CategoryPage;




import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import api from "../lib/api.jsx";
import {
  Search,
  SlidersHorizontal,
  X,
  Plus,
  Minus,
  ChevronRight,
  Filter,
} from "lucide-react";

// ── Refined Filter Accordion ──────────────────────────────────────────────────
const FilterSection = ({ title, open, onToggle, children }) => (
  <div className="border-b border-gray-100 py-6 transition-all duration-300">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between text-left group"
    >
      <span className="text-[11px] font-bold text-[#2C2C2C] tracking-[0.2em] uppercase group-hover:text-[#C5A059] transition-colors">
        {title}
      </span>
      {open ? (
        <Minus className="w-3 h-3 text-[#C5A059] shrink-0" />
      ) : (
        <Plus className="w-3 h-3 text-gray-300 group-hover:text-[#C5A059] shrink-0" />
      )}
    </button>
    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${open ? 'max-h-[400px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
      {children}
    </div>
  </div>
);

// ── Minimalist Radio ─────────────────────────────────────────────────────────
const RadioCircle = ({ checked }) => (
  <div
    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all ${
      checked ? "border-[#C5A059] bg-[#C5A059]" : "border-gray-200"
    }`}
  >
    {checked && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
  </div>
);

// ── Sidebar (Refined Aesthetic) ──────────────────────────────────────────────
const Sidebar = ({
  search, setSearch, availability, setAvailability, inStockCount, outStockCount,
  priceRange, setPriceRange, priceMin, priceMax, sortKey, setSortKey,
  totalCount, filteredCount, onReset,
}) => {
  const [openSections, setOpenSections] = useState({ availability: true, price: true, sort: true });
  const toggle = (k) => setOpenSections((s) => ({ ...s, [k]: !s[k] }));

  const SORT_OPTIONS = [
    { label: "Newest Arrivals", key: "created_at::desc" },
    { label: "Price: Low to High", key: "base_price::asc" },
    { label: "Price: High to Low", key: "base_price::desc" },
    { label: "Alphabetical (A-Z)", key: "title::asc" },
  ];

  const isFiltered = availability !== "all" || priceRange[0] > priceMin || priceRange[1] < priceMax || search;

  return (
    <div className="select-none sticky top-24">
      {/* Search Bar - Underlined Style */}
      <div className="pb-8 border-b border-gray-100">
        <div className="relative group">
          <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 group-focus-within:text-[#C5A059] transition-colors" />
          <input
            type="text"
            placeholder="Search within..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-7 pr-3 py-2 text-[10px] uppercase tracking-widest bg-transparent border-b border-gray-100 focus:outline-none focus:border-[#C5A059] transition-all"
          />
        </div>
      </div>

      <FilterSection title="Availability" open={openSections.availability} onToggle={() => toggle("availability")}>
        <div className="space-y-4">
          {[
            { label: "In stock", val: "instock", count: inStockCount },
            { label: "Out of stock", val: "outofstock", count: outStockCount },
          ].map(({ label, val, count }) => (
            <div key={val} className="flex items-center justify-between cursor-pointer group" onClick={() => setAvailability(availability === val ? "all" : val)}>
              <div className="flex items-center gap-3">
                <RadioCircle checked={availability === val} />
                <span className={`text-[11px] uppercase tracking-wider ${availability === val ? "text-[#2C2C2C] font-bold" : "text-gray-500 group-hover:text-[#2C2C2C]"}`}>{label}</span>
              </div>
              <span className="text-[9px] font-bold text-gray-300">({count})</span>
            </div>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Sort Selection" open={openSections.sort} onToggle={() => toggle("sort")}>
        <div className="space-y-4">
          {SORT_OPTIONS.map(({ label, key }) => (
            <div key={key} className="flex items-center gap-3 cursor-pointer group" onClick={() => setSortKey(key)}>
              <RadioCircle checked={sortKey === key} />
              <span className={`text-[11px] uppercase tracking-wider ${sortKey === key ? "text-[#2C2C2C] font-bold" : "text-gray-500 group-hover:text-[#2C2C2C]"}`}>{label}</span>
            </div>
          ))}
        </div>
      </FilterSection>

      {isFiltered && (
        <button onClick={onReset} className="mt-8 w-full py-4 text-[9px] tracking-[0.3em] uppercase font-bold text-white bg-[#2C2C2C] hover:bg-[#C5A059] transition-all duration-500">
          Reset Filters
        </button>
      )}
    </div>
  );
};

// ── Main CategoryPage ─────────────────────────────────────────────────────────
const CategoryPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [catLoading, setCatLoading] = useState(true);
  const [prodLoading, setProdLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Filter state
  const [search, setSearch] = useState("");
  const [availability, setAvailability] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(50000);
  const [sortKey, setSortKey] = useState("created_at::desc");

  useEffect(() => {
    const loadCat = async () => {
      setCatLoading(true);
      try {
        const res = await api.get("/categories");
        const cat = res.data.find((c) => c.slug === slug || c.id === slug);
        if (!cat) return navigate("/categories", { replace: true });
        setCategory(cat);
      } catch { navigate("/categories", { replace: true }); }
      finally { setCatLoading(false); }
    };
    loadCat();
  }, [slug]);

  useEffect(() => {
    if (!category) return;
    const [sb, so] = sortKey.split("::");
    const loadProds = async () => {
      setProdLoading(true);
      try {
        const res = await api.get(`/products?category_id=${category.id}&sort_by=${sb}&sort_order=${so}&limit=200`);
        setAllProducts(res.data);
        if (res.data.length) {
          const prices = res.data.map((p) => p.final_price ?? p.base_price);
          const hi = Math.ceil(Math.max(...prices) / 100) * 100 || 50000;
          setPriceMax(hi); setPriceRange([0, hi]);
        }
      } catch { setAllProducts([]); }
      finally { setProdLoading(false); }
    };
    loadProds();
  }, [category, sortKey]);

  const filtered = allProducts.filter((p) => {
    const price = p.final_price ?? p.base_price;
    const qty = p.inventory?.quantity ?? 0;
    if (search && !p.title?.toLowerCase().includes(search.toLowerCase())) return false;
    if (availability === "instock" && qty === 0) return false;
    if (availability === "outofstock" && qty > 0) return false;
    if (price < priceRange[0] || price > priceRange[1]) return false;
    return true;
  });

  const sidebarProps = {
    search, setSearch, availability, setAvailability, inStockCount: allProducts.filter(p => (p.inventory?.quantity ?? 0) > 0).length,
    outStockCount: allProducts.filter(p => (p.inventory?.quantity ?? 0) === 0).length,
    priceRange, setPriceRange, priceMin, priceMax, sortKey, setSortKey,
    totalCount: allProducts.length, filteredCount: filtered.length, onReset: () => { setSearch(""); setAvailability("all"); setPriceRange([0, priceMax]); }
  };

  if (catLoading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="w-12 h-12 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin mb-4" />
      <span className="text-[10px] tracking-[0.3em] uppercase text-gray-400">Loading Archive</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FCFAF8]">
      {/* ── Hero Banner ── */}
      <div className="relative w-full h-[350px] md:h-[500px] overflow-hidden bg-black">
        <img
          src={category?.image_url || "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1800"}
          alt={category?.name}
          className="w-full h-full object-cover opacity-60 animate-subtle-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FCFAF8] via-black/20 to-transparent" />
        
        {/* Header Content */}
        <div className="absolute inset-0 flex flex-col justify-end pb-12 px-6 md:px-12 lg:px-24">
          <div className="flex items-center gap-2 text-white/60 text-[9px] tracking-[0.3em] uppercase mb-6">
            <Link to="/" className="hover:text-[#C5A059] transition-colors">Home</Link>
            <ChevronRight className="w-2.5 h-2.5" />
            <span className="text-white">{category?.name}</span>
          </div>
          <h1 className="font-heading text-6xl md:text-8xl lg:text-9xl font-light text-white tracking-tighter leading-none mb-4">
            {category?.name?.split(' ')[0]} <br />
            <span className="font-serif italic text-[#C5A059] ml-12 md:ml-24">{category?.name?.split(' ').slice(1).join(' ')}</span>
          </h1>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 py-16">
        {/* Mobile Filter Trigger */}
        <div className="flex items-center justify-between mb-10 md:hidden border-b border-gray-100 pb-6">
          <span className="text-[10px] uppercase tracking-widest text-gray-400">{filtered.length} Items found</span>
          <button onClick={() => setDrawerOpen(true)} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#2C2C2C]">
            <SlidersHorizontal className="w-4 h-4" /> Filter Selection
          </button>
        </div>

        <div className="flex gap-20">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-64 shrink-0 border-r border-gray-50 pr-10">
            <Sidebar {...sidebarProps} />
          </aside>

          {/* Product Section */}
          <div className="flex-1">
            <div className="hidden md:flex items-center justify-between mb-12">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-300">Displaying {filtered.length} Curated Items</span>
              <div className="h-[1px] flex-1 bg-gray-100 mx-8" />
            </div>

            {prodLoading ? (
              <div className="flex items-center justify-center py-40">
                <div className="w-10 h-10 border border-[#C5A059] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-40 bg-white border border-gray-100">
                <Filter className="w-12 h-12 text-gray-100 mx-auto mb-6" />
                <p className="font-serif italic text-2xl text-gray-300">No pieces match your search</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Glassmorphism) */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[500] flex animate-fade-in">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
          <div className="relative ml-auto w-4/5 max-w-sm bg-white h-full p-8 shadow-2xl animate-slide-left">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-[11px] font-bold tracking-[0.3em] uppercase">Refine</h2>
              <button onClick={() => setDrawerOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            <Sidebar {...sidebarProps} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;