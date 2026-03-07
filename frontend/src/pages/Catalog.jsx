
// import React, { useEffect, useState } from "react";
// import { useSearchParams } from "react-router-dom";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import ProductCard from "../components/ProductCard";
// import api from "../lib/api.jsx";
// import { Search, Filter } from "lucide-react";

// const Catalog = () => {
//   const [searchParams, setSearchParams] = useSearchParams();

//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");
//   const [categoryId, setCategoryId] = useState(
//     searchParams.get("category_id") || "",
//   );
//   const [sortBy, setSortBy] = useState("created_at");

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   useEffect(() => {
//     fetchProducts();
//   }, [search, categoryId, sortBy]);

//   useEffect(() => {
//     const urlCat = searchParams.get("category_id") || "";
//     setCategoryId(urlCat);
//   }, [searchParams]);

//   const fetchCategories = async () => {
//     try {
//       const response = await api.get("/categories");
//       setCategories(response.data);
//     } catch (error) {
//       console.error("Failed to fetch categories:", error);
//     }
//   };

//   const fetchProducts = async () => {
//     setLoading(true);
//     try {
//       const params = new URLSearchParams();
//       if (search) params.append("search", search);
//       if (categoryId && categoryId !== "all")
//         params.append("category_id", categoryId);
//       params.append("sort_by", sortBy);
//       params.append("limit", "50");

//       const response = await api.get(`/products?${params.toString()}`);
//       setProducts(response.data);
//     } catch (error) {
//       console.error("Failed to fetch products:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCategoryChange = (value) => {
//     setCategoryId(value);
//     if (value && value !== "all") {
//       setSearchParams({ category_id: value });
//     } else {
//       setSearchParams({});
//     }
//   };

//   const handleSearchSubmit = (e) => {
//     e.preventDefault();
//     fetchProducts();
//   };

//   return (
//     <div
//       className="min-h-screen px-4 sm:px-6 md:px-12 lg:px-24 py-12 md:py-20"
//       data-testid="catalog-page"
//     >
//       {/* Header */}
//       <div className="text-center mb-10 md:mb-16">
//         <p className="text-xs tracking-widest uppercase text-gray-500 mb-4">
//           Shop
//         </p>
//         <h1
//           className="font-heading text-3xl sm:text-4xl md:text-6xl font-semibold tracking-tight text-[#2C2C2C]"
//           data-testid="catalog-title"
//         >
//           Our Catalog
//         </h1>
//       </div>

//       {/* Filters */}
//       <div
//         className="bg-white border border-[#F2F0EB] p-4 sm:p-6 mb-8 md:mb-12 relative z-10"
//         data-testid="filters-section"
//       >
//         {/* Search full width on all sizes */}
//         <form onSubmit={handleSearchSubmit} className="mb-4">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//             <Input
//               type="text"
//               placeholder="Search products..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="pl-10 bg-transparent border-b border-gray-300 focus:border-[#C5A059] rounded-none"
//               data-testid="search-input"
//             />
//           </div>
//         </form>

//         {/* Dropdowns side by side on all sizes */}
//         <div className="grid grid-cols-2 gap-3 sm:gap-4">
//           <Select
//             value={categoryId || "all"}
//             onValueChange={handleCategoryChange}
//           >
//             <SelectTrigger data-testid="category-filter">
//               <SelectValue placeholder="All Categories" />
//             </SelectTrigger>
//             <SelectContent
//               position="popper"
//               sideOffset={5}
//               className="z-[9999] bg-white"
//             >
//               <SelectItem value="all">All Categories</SelectItem>
//               {categories.map((cat) => (
//                 <SelectItem key={cat.id} value={cat.id}>
//                   {cat.name}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>

//           <Select value={sortBy} onValueChange={setSortBy}>
//             <SelectTrigger data-testid="sort-filter">
//               <SelectValue placeholder="Sort by" />
//             </SelectTrigger>
//             <SelectContent
//               position="popper"
//               sideOffset={5}
//               className="z-[9999] bg-white"
//             >
//               <SelectItem value="created_at">Newest</SelectItem>
//               <SelectItem value="base_price">Price: Low to High</SelectItem>
//               <SelectItem value="title">Name: A to Z</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//       {/* Products Grid */}
//       {loading ? (
//         <div className="text-center py-20" data-testid="loading-state">
//           <div className="inline-block w-8 h-8 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin"></div>
//         </div>
//       ) : products.length === 0 ? (
//         <div
//           className="text-center py-20 bg-white border border-[#F2F0EB]"
//           data-testid="no-results-state"
//         >
//           <Filter className="w-12 h-12 text-gray-300 mx-auto mb-4" />
//           <p className="text-gray-500 text-lg">No products found.</p>
//           <p className="text-sm text-gray-400 mt-2">
//             Try adjusting your search or filters.
//           </p>
//         </div>
//       ) : (
//         <>
//           <div
//             className="mb-6 text-sm text-gray-500"
//             data-testid="results-count"
//           >
//             Showing {products.length} product{products.length !== 1 ? "s" : ""}
//           </div>
//           <div
//             className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 sm:gap-x-8 gap-y-8 sm:gap-y-12"
//             data-testid="products-grid"
//           >
//             {products.map((product) => (
//               <ProductCard key={product.id} product={product} />
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default Catalog;




// import React, { useEffect, useState } from "react";
// import { useSearchParams } from "react-router-dom";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import ProductCard from "../components/ProductCard";
// import api from "../lib/api.jsx";
// import { Search, SlidersHorizontal, X } from "lucide-react";

// const Catalog = () => {
//   const [searchParams, setSearchParams] = useSearchParams();

//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");
//   const [categoryId, setCategoryId] = useState(
//     searchParams.get("category_id") || "",
//   );
//   const [sortBy, setSortBy] = useState("created_at");

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   useEffect(() => {
//     fetchProducts();
//   }, [search, categoryId, sortBy]);

//   useEffect(() => {
//     const urlCat = searchParams.get("category_id") || "";
//     setCategoryId(urlCat);
//   }, [searchParams]);

//   const fetchCategories = async () => {
//     try {
//       const response = await api.get("/categories");
//       setCategories(response.data);
//     } catch (error) {
//       console.error("Failed to fetch categories:", error);
//     }
//   };

//   const fetchProducts = async () => {
//     setLoading(true);
//     try {
//       const params = new URLSearchParams();
//       if (search) params.append("search", search);
//       if (categoryId && categoryId !== "all")
//         params.append("category_id", categoryId);
//       params.append("sort_by", sortBy);
//       params.append("limit", "50");

//       const response = await api.get(`/products?${params.toString()}`);
//       setProducts(response.data);
//     } catch (error) {
//       console.error("Failed to fetch products:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCategoryChange = (value) => {
//     setCategoryId(value);
//     if (value && value !== "all") {
//       setSearchParams({ category_id: value });
//     } else {
//       setSearchParams({});
//     }
//   };

//   const clearFilters = () => {
//     setSearch("");
//     handleCategoryChange("all");
//   };

//   return (
//     <div className="min-h-screen bg-[#FCFAF8]">
//       {/* ─── HEADER SECTION ─── */}
//       <header className="relative py-20 md:py-32 bg-white border-b border-gray-100 overflow-hidden">
//         <div className="absolute top-0 right-0 w-1/3 h-full bg-[#FDF8F0] -skew-x-12 translate-x-1/2 opacity-50" />
//         <div className="container mx-auto px-6 md:px-12 lg:px-24 relative z-10 text-center md:text-left">
//           <span className="inline-block text-[#C5A059] font-bold tracking-[0.3em] uppercase text-[10px] mb-4">
//             The GM Bastralaya Collection
//           </span>
//           <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-light leading-none text-[#2C2C2C]">
//             Our <span className="font-serif italic text-[#C5A059]">Catalog.</span>
//           </h1>
//         </div>
//       </header>

//       <main className="container mx-auto px-6 md:px-12 lg:px-24 py-12">
//         {/* ─── FILTERS BAR ─── */}
//         <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-16 pb-8 border-b border-gray-100">
          
//           {/* Left: Search Bar */}
//           <div className="w-full lg:max-w-md relative group">
//             <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#C5A059] transition-colors" />
//             <input
//               type="text"
//               placeholder="SEARCH THE COLLECTION..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="w-full pl-8 py-3 bg-transparent border-b border-gray-200 focus:border-[#C5A059] outline-none text-[10px] tracking-widest uppercase transition-all"
//             />
//           </div>

//           {/* Right: Dropdowns & Stats */}
//           <div className="w-full lg:w-auto flex flex-wrap items-center gap-4 sm:gap-6">
//             <div className="flex items-center gap-2 text-[10px] tracking-widest uppercase text-gray-400 font-bold mr-2">
//               <SlidersHorizontal className="w-3 h-3" />
//               Filter By:
//             </div>
            
//             <div className="flex flex-1 sm:flex-none gap-4">
//               <Select value={categoryId || "all"} onValueChange={handleCategoryChange}>
//                 <SelectTrigger className="w-full sm:w-[180px] h-10 rounded-none border-gray-200 text-[10px] uppercase tracking-widest font-bold focus:ring-0 focus:border-[#C5A059]">
//                   <SelectValue placeholder="CATEGORY" />
//                 </SelectTrigger>
//                 <SelectContent className="rounded-none border-gray-100 bg-white">
//                   <SelectItem value="all" className="text-[10px] uppercase tracking-widest">All Categories</SelectItem>
//                   {categories.map((cat) => (
//                     <SelectItem key={cat.id} value={cat.id} className="text-[10px] uppercase tracking-widest">
//                       {cat.name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>

//               <Select value={sortBy} onValueChange={setSortBy}>
//                 <SelectTrigger className="w-full sm:w-[180px] h-10 rounded-none border-gray-200 text-[10px] uppercase tracking-widest font-bold focus:ring-0 focus:border-[#C5A059]">
//                   <SelectValue placeholder="SORT" />
//                 </SelectTrigger>
//                 <SelectContent className="rounded-none border-gray-100 bg-white">
//                   <SelectItem value="created_at" className="text-[10px] uppercase tracking-widest">Newest First</SelectItem>
//                   <SelectItem value="base_price" className="text-[10px] uppercase tracking-widest">Price: Low to High</SelectItem>
//                   <SelectItem value="title" className="text-[10px] uppercase tracking-widest">Name: A to Z</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             {(search || (categoryId && categoryId !== "all")) && (
//               <button 
//                 onClick={clearFilters}
//                 className="flex items-center gap-1 text-[9px] uppercase tracking-tighter font-bold text-red-400 hover:text-red-600 transition-colors"
//               >
//                 <X className="w-3 h-3" /> Clear
//               </button>
//             )}
//           </div>
//         </div>

//         {/* ─── PRODUCT STATUS & GRID ─── */}
//         {loading ? (
//           <div className="flex flex-col items-center justify-center py-40">
//             <div className="w-12 h-12 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin mb-4" />
//             <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400">Loading Collection</span>
//           </div>
//         ) : products.length === 0 ? (
//           <div className="text-center py-40 bg-white border border-dashed border-gray-100 rounded-lg">
//             <p className="font-serif italic text-2xl text-gray-300 mb-4">No results for this selection</p>
//             <button onClick={clearFilters} className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#C5A059] hover:text-[#2C2C2C] transition-colors">
//               Reset Filters
//             </button>
//           </div>
//         ) : (
//           <>
//             <div className="mb-10 flex items-center gap-4">
//               <span className="text-[10px] uppercase tracking-widest font-bold text-gray-300">
//                 {products.length} Items Found
//               </span>
//               <div className="h-[1px] flex-1 bg-gray-100" />
//             </div>

//             <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
//               {products.map((product) => (
//                 <ProductCard key={product.id} product={product} />
//               ))}
//             </div>
//           </>
//         )}
//       </main>
//     </div>
//   );
// };

// export default Catalog;





import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProductCard from "../components/ProductCard";
import api from "../lib/api.jsx";
import { Search, SlidersHorizontal, X } from "lucide-react";

// NOTE: Ensure your image is in the public folder or imported correctly
// If it's in public/images/heroAbout1.jpg, use "/images/heroAbout1.jpg"
const HERO_IMAGE = "/heroCatlog1.png"; 

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState(
    searchParams.get("category_id") || "",
  );
  const [sortBy, setSortBy] = useState("created_at");

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [search, categoryId, sortBy]);

  useEffect(() => {
    const urlCat = searchParams.get("category_id") || "";
    setCategoryId(urlCat);
  }, [searchParams]);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (categoryId && categoryId !== "all")
        params.append("category_id", categoryId);
      params.append("sort_by", sortBy);
      params.append("limit", "50");

      const response = await api.get(`/products?${params.toString()}`);
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (value) => {
    setCategoryId(value);
    if (value && value !== "all") {
      setSearchParams({ category_id: value });
    } else {
      setSearchParams({});
    }
  };

  const clearFilters = () => {
    setSearch("");
    handleCategoryChange("all");
  };

  return (
    <div className="min-h-screen bg-[#FCFAF8]">
      {/* ─── HERO SECTION ─── */}
      <header className="relative h-[50vh] md:h-[65vh] w-full flex items-center justify-center overflow-hidden">
        {/* Background Image Wrapper */}
        <div className="absolute inset-0 z-0">
          <img 
            src={HERO_IMAGE} 
            alt="Handloom Weaver's Loom"
            className="w-full h-full object-cover object-center scale-105"
          />
          {/* Overlays for depth and readability */}
          <div className="absolute inset-0 bg-black/40" /> 
          <div className="absolute inset-0 bg-gradient-to-t from-[#FCFAF8] via-transparent to-black/20" />
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-6 relative z-10 text-center">
          <span className="inline-block text-[#C5A059] font-bold tracking-[0.5em] uppercase text-[10px] md:text-xs mb-4 drop-shadow-md">
            The GM Bastralaya Collection
          </span>
          <h1 className="font-heading text-6xl md:text-8xl lg:text-9xl font-light leading-none text-white drop-shadow-xl">
            Our <span className="font-serif italic text-[#C5A059]">Catalog.</span>
          </h1>
          <div className="w-20 h-[1px] bg-[#C5A059] mx-auto mt-8 opacity-80" />
        </div>
      </header>

      <main className="container mx-auto px-6 md:px-12 lg:px-24 py-12">
        {/* ─── FILTERS BAR ─── */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-16 pb-8 border-b border-gray-100">
          
          {/* Left: Search Bar */}
          <div className="w-full lg:max-w-md relative group">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#C5A059] transition-colors" />
            <input
              type="text"
              placeholder="SEARCH THE COLLECTION..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 py-3 bg-transparent border-b border-gray-200 focus:border-[#C5A059] outline-none text-[10px] tracking-widest uppercase transition-all"
            />
          </div>

          {/* Right: Dropdowns & Stats */}
          <div className="w-full lg:w-auto flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2 text-[10px] tracking-widest uppercase text-gray-400 font-bold mr-2">
              <SlidersHorizontal className="w-3 h-3" />
              Filter By:
            </div>
            
            <div className="flex flex-1 sm:flex-none gap-4">
              <Select value={categoryId || "all"} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-full sm:w-[180px] h-10 rounded-none border-gray-200 text-[10px] uppercase tracking-widest font-bold focus:ring-0 focus:border-[#C5A059] bg-white">
                  <SelectValue placeholder="CATEGORY" />
                </SelectTrigger>
                <SelectContent className="rounded-none border-gray-100 bg-white z-[100]">
                  <SelectItem value="all" className="text-[10px] uppercase tracking-widest">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id} className="text-[10px] uppercase tracking-widest">
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[180px] h-10 rounded-none border-gray-200 text-[10px] uppercase tracking-widest font-bold focus:ring-0 focus:border-[#C5A059] bg-white">
                  <SelectValue placeholder="SORT" />
                </SelectTrigger>
                <SelectContent className="rounded-none border-gray-100 bg-white z-[100]">
                  <SelectItem value="created_at" className="text-[10px] uppercase tracking-widest">Newest First</SelectItem>
                  <SelectItem value="base_price" className="text-[10px] uppercase tracking-widest">Price: Low to High</SelectItem>
                  <SelectItem value="title" className="text-[10px] uppercase tracking-widest">Name: A to Z</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(search || (categoryId && categoryId !== "all")) && (
              <button 
                onClick={clearFilters}
                className="flex items-center gap-1 text-[9px] uppercase tracking-tighter font-bold text-red-400 hover:text-red-600 transition-colors"
              >
                <X className="w-3 h-3" /> Clear
              </button>
            )}
          </div>
        </div>

        {/* ─── PRODUCT STATUS & GRID ─── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <div className="w-12 h-12 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin mb-4" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400">Loading Collection</span>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-40 bg-white border border-dashed border-gray-100 rounded-lg">
            <p className="font-serif italic text-2xl text-gray-300 mb-4">No results for this selection</p>
            <button onClick={clearFilters} className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#C5A059] hover:text-[#2C2C2C] transition-colors">
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div className="mb-10 flex items-center gap-4">
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-300">
                {products.length} Items Found
              </span>
              <div className="h-[1px] flex-1 bg-gray-100" />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Catalog;