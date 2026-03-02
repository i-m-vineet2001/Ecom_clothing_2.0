import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import api from "../lib/api";
import {
  Search,
  SlidersHorizontal,
  X,
  Plus,
  Minus,
  ChevronRight,
} from "lucide-react";

// ── Filter accordion ──────────────────────────────────────────────────────────
const FilterSection = ({ title, open, onToggle, children }) => (
  <div className="border-b border-gray-100 py-5">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between text-left"
    >
      <span className="text-[13px] font-semibold text-[#2C2C2C] tracking-wide">
        {title}
      </span>
      {open ? (
        <Minus className="w-3.5 h-3.5 text-gray-400 shrink-0" />
      ) : (
        <Plus className="w-3.5 h-3.5 text-gray-400 shrink-0" />
      )}
    </button>
    {open && <div className="mt-4">{children}</div>}
  </div>
);

// ── Radio circle ──────────────────────────────────────────────────────────────
const RadioCircle = ({ checked }) => (
  <div
    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
      checked ? "border-[#2C2C2C] bg-[#2C2C2C]" : "border-gray-300"
    }`}
  >
    {checked && <div className="w-2 h-2 bg-white rounded-full" />}
  </div>
);

// ── Price inputs + dual slider ────────────────────────────────────────────────
const PriceFilter = ({ min, max, value, onChange }) => {
  const [lo, setLo] = useState(value[0]);
  const [hi, setHi] = useState(value[1]);

  useEffect(() => {
    setLo(value[0]);
    setHi(value[1]);
  }, [value[0], value[1]]);

  const pct = (v) => (max > min ? ((v - min) / (max - min)) * 100 : 0);

  const commit = (newLo, newHi) => onChange([newLo, newHi]);

  return (
    <div className="space-y-5">
      {/* Boxes */}
      <div className="flex items-center gap-2">
        {[
          { val: lo, set: setLo, isMin: true },
          { val: hi, set: setHi, isMin: false },
        ].map(({ val, set, isMin }) => (
          <React.Fragment key={isMin ? "min" : "max"}>
            {!isMin && <span className="text-gray-300 text-sm">—</span>}
            <div className="flex-1 border border-gray-300 px-3 py-2 flex items-center gap-1 focus-within:border-[#2C2C2C]">
              <span className="text-xs text-gray-400">₹</span>
              <input
                type="number"
                value={val}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  set(v);
                }}
                onBlur={() => {
                  const newLo = Math.min(lo, hi - 1);
                  const newHi = Math.max(lo + 1, hi);
                  setLo(newLo);
                  setHi(newHi);
                  commit(newLo, newHi);
                }}
                className="w-full text-sm text-[#2C2C2C] bg-transparent outline-none"
              />
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Slider track */}
      <div className="relative h-[2px] bg-gray-200 mx-2 mt-6 mb-4">
        <div
          className="absolute h-full bg-[#2C2C2C]"
          style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }}
        />
        {/* Min thumb */}
        <input
          type="range"
          min={min}
          max={max}
          value={lo}
          onChange={(e) => {
            const v = Math.min(Number(e.target.value), hi - 1);
            setLo(v);
            commit(v, hi);
          }}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-5 -top-2"
          style={{ zIndex: lo > max - 100 ? 5 : 3 }}
        />
        {/* Max thumb */}
        <input
          type="range"
          min={min}
          max={max}
          value={hi}
          onChange={(e) => {
            const v = Math.max(Number(e.target.value), lo + 1);
            setHi(v);
            commit(lo, v);
          }}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-5 -top-2"
          style={{ zIndex: 4 }}
        />
        {/* Visual thumbs */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-[#2C2C2C] rounded-full shadow pointer-events-none"
          style={{ left: `calc(${pct(lo)}% - 8px)` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-[#2C2C2C] rounded-full shadow pointer-events-none"
          style={{ left: `calc(${pct(hi)}% - 8px)` }}
        />
      </div>
    </div>
  );
};

// ── Sidebar (shared desktop + mobile) ────────────────────────────────────────
const Sidebar = ({
  search,
  setSearch,
  availability,
  setAvailability,
  inStockCount,
  outStockCount,
  priceRange,
  setPriceRange,
  priceMin,
  priceMax,
  sortKey,
  setSortKey,
  totalCount,
  filteredCount,
  onReset,
}) => {
  const [openSections, setOpenSections] = useState({
    availability: true,
    price: true,
    sort: true,
  });
  const toggle = (k) => setOpenSections((s) => ({ ...s, [k]: !s[k] }));

  const SORT_OPTIONS = [
    { label: "Alphabetically, A–Z", key: "title::asc" },
    { label: "Alphabetically, Z–A", key: "title::desc" },
    { label: "Price, low to high", key: "base_price::asc" },
    { label: "Price, high to low", key: "base_price::desc" },
    { label: "Date, old to new", key: "created_at::asc" },
    { label: "Date, new to old", key: "created_at::desc" },
  ];

  const isFiltered =
    availability !== "all" ||
    priceRange[0] > priceMin ||
    priceRange[1] < priceMax ||
    search;

  return (
    <div className="select-none">
      {/* Search */}
      <div className="pb-5 border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 bg-[#F9F8F5] focus:outline-none focus:border-[#C5A059]"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="w-3 h-3 text-gray-400 hover:text-gray-700" />
            </button>
          )}
        </div>
      </div>

      {/* Availability */}
      <FilterSection
        title="Availability"
        open={openSections.availability}
        onToggle={() => toggle("availability")}
      >
        <div className="space-y-3">
          {[
            { label: "In stock", val: "instock", count: inStockCount },
            { label: "Out of stock", val: "outofstock", count: outStockCount },
          ].map(({ label, val, count }) => (
            <label
              key={val}
              className="flex items-center justify-between cursor-pointer group"
              onClick={() =>
                setAvailability(availability === val ? "all" : val)
              }
            >
              <div className="flex items-center gap-3">
                <RadioCircle checked={availability === val} />
                <span
                  className={`text-sm ${availability === val ? "text-[#2C2C2C] font-medium" : "text-gray-600"}`}
                >
                  {label}
                </span>
              </div>
              <span className="text-xs text-gray-400">{count}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price */}
      <FilterSection
        title="Price"
        open={openSections.price}
        onToggle={() => toggle("price")}
      >
        <PriceFilter
          min={priceMin}
          max={priceMax}
          value={priceRange}
          onChange={setPriceRange}
        />
      </FilterSection>

      {/* Sort by */}
      <FilterSection
        title="Sort by"
        open={openSections.sort}
        onToggle={() => toggle("sort")}
      >
        <div className="space-y-3">
          {SORT_OPTIONS.map(({ label, key }) => (
            <label
              key={key}
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setSortKey(key)}
            >
              <RadioCircle checked={sortKey === key} />
              <span
                className={`text-sm ${sortKey === key ? "text-[#2C2C2C] font-medium" : "text-gray-600"}`}
              >
                {label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Reset + count */}
      {isFiltered && (
        <button
          onClick={onReset}
          className="mt-4 w-full py-2 text-xs tracking-widest uppercase font-bold text-gray-400 hover:text-[#C5A059] border border-gray-200 hover:border-[#C5A059] transition-colors"
        >
          Clear all filters
        </button>
      )}
      <p className="text-xs text-gray-400 text-center mt-4">
        {filteredCount} of {totalCount} products
      </p>
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

  // ── Resolve category by slug or id
  useEffect(() => {
    const load = async () => {
      setCatLoading(true);
      try {
        const res = await api.get("/categories");
        const cat = res.data.find((c) => c.slug === slug || c.id === slug);
        if (!cat) {
          navigate("/categories", { replace: true });
          return;
        }
        setCategory(cat);
      } catch {
        navigate("/categories", { replace: true });
      } finally {
        setCatLoading(false);
      }
    };
    load();
  }, [slug]);

  // ── Fetch products when category resolved
  useEffect(() => {
    if (!category) return;
    const [sb, so] = sortKey.split("::");
    const load = async () => {
      setProdLoading(true);
      try {
        const res = await api.get(
          `/products?category_id=${category.id}&sort_by=${sb}&sort_order=${so}&limit=200`,
        );
        setAllProducts(res.data);
        if (res.data.length) {
          const prices = res.data.map((p) => p.final_price ?? p.base_price);
          const lo = 0;
          const hi = Math.ceil(Math.max(...prices) / 100) * 100 || 50000;
          setPriceMin(lo);
          setPriceMax(hi);
          setPriceRange([lo, hi]);
        }
      } catch {
        setAllProducts([]);
      } finally {
        setProdLoading(false);
      }
    };
    load();
  }, [category, sortKey]);

  // ── Client-side filters
  const filtered = allProducts.filter((p) => {
    const price = p.final_price ?? p.base_price;
    const qty = p.inventory?.quantity ?? 0;
    if (search && !p.title?.toLowerCase().includes(search.toLowerCase()))
      return false;
    if (availability === "instock" && qty === 0) return false;
    if (availability === "outofstock" && qty > 0) return false;
    if (price < priceRange[0] || price > priceRange[1]) return false;
    return true;
  });

  const inStockCount = allProducts.filter(
    (p) => (p.inventory?.quantity ?? 0) > 0,
  ).length;
  const outStockCount = allProducts.filter(
    (p) => (p.inventory?.quantity ?? 0) === 0,
  ).length;

  const resetFilters = () => {
    setSearch("");
    setAvailability("all");
    setPriceRange([priceMin, priceMax]);
    setSortKey("created_at::desc");
  };

  const sidebarProps = {
    search,
    setSearch,
    availability,
    setAvailability,
    inStockCount,
    outStockCount,
    priceRange,
    setPriceRange,
    priceMin,
    priceMax,
    sortKey,
    setSortKey,
    totalCount: allProducts.length,
    filteredCount: filtered.length,
    onReset: resetFilters,
  };

  if (catLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero Banner ──────────────────────────────────────────────────── */}
      <div className="relative w-full h-[280px] md:h-[400px] overflow-hidden bg-[#1a1a1a]">
        {category?.image_url ? (
          <img
            src={category.image_url}
            alt={category.name}
            className="w-full h-full object-cover opacity-65"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#2C2C2C] via-[#3d2e1e] to-[#1a1a1a]" />
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

        {/* Breadcrumb */}
        <div className="absolute top-5 left-6 md:left-12 flex items-center gap-2 text-white/60 text-[11px] tracking-widest uppercase">
          <Link to="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/categories" className="hover:text-white transition-colors">
            Categories
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-white">{category?.name}</span>
        </div>

        {/* Title */}
        <div className="absolute bottom-8 left-6 md:left-12 right-6">
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-white uppercase tracking-tight leading-none">
            {category?.name}
          </h1>
          {category?.description && (
            <p className="text-white/60 text-sm mt-3 max-w-lg leading-relaxed">
              {category.description}
            </p>
          )}
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-10">
        {/* Mobile top bar */}
        <div className="flex items-center justify-between mb-6 md:hidden">
          <p className="text-sm text-gray-500">{filtered.length} products</p>
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-2 text-sm font-semibold border border-[#2C2C2C] px-4 py-2"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
        </div>

        <div className="flex gap-10">
          {/* Desktop sidebar */}
          <aside className="hidden md:block w-56 shrink-0">
            <Sidebar {...sidebarProps} />
          </aside>

          {/* Mobile drawer */}
          {drawerOpen && (
            <div className="fixed inset-0 z-[200] flex">
              <div
                className="absolute inset-0 bg-black/50"
                onClick={() => setDrawerOpen(false)}
              />
              <div className="relative ml-auto w-72 bg-white h-full overflow-y-auto p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-heading text-lg font-semibold">
                    Filters
                  </h2>
                  <button onClick={() => setDrawerOpen(false)}>
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <Sidebar {...sidebarProps} />
              </div>
            </div>
          )}

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            {prodLoading ? (
              <div className="flex items-center justify-center py-32">
                <div className="w-8 h-8 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-32">
                <p className="text-gray-500 font-medium mb-1">
                  No products found
                </p>
                <p className="text-sm text-gray-400 mb-5">
                  Try adjusting your filters
                </p>
                <button
                  onClick={resetFilters}
                  className="text-xs font-bold tracking-widest uppercase text-white bg-[#2C2C2C] hover:bg-[#C5A059] px-6 py-2.5 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-400 mb-6">
                  Showing{" "}
                  <span className="text-[#2C2C2C] font-semibold">
                    {filtered.length}
                  </span>{" "}
                  product{filtered.length !== 1 ? "s" : ""}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                  {filtered.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
