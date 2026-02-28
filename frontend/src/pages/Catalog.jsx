
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
// import api from "../lib/api";
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

//   // Sync categoryId if URL param changes (e.g. navigating from Categories page)
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
//       className="min-h-screen px-6 md:px-12 lg:px-24 py-20"
//       data-testid="catalog-page"
//     >
//       {/* Header */}
//       <div className="text-center mb-16">
//         <p className="text-xs tracking-widest uppercase text-gray-500 mb-4">
//           Shop
//         </p>
//         <h1
//           className="font-heading text-4xl md:text-6xl font-semibold tracking-tight text-[#2C2C2C]"
//           data-testid="catalog-title"
//         >
//           Our Catalog
//         </h1>
//       </div>

//       {/* Filters */}
//       <div
//         className="bg-white border border-[#F2F0EB] p-6 mb-12"
//         data-testid="filters-section"
//       >
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//           {/* Search */}
//           <form onSubmit={handleSearchSubmit} className="md:col-span-2">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//               <Input
//                 type="text"
//                 placeholder="Search products..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="pl-10 bg-transparent border-b border-gray-300 focus:border-[#C5A059] rounded-none"
//                 data-testid="search-input"
//               />
//             </div>
//           </form>

//           {/* Category Filter */}
//           <Select
//             value={categoryId || "all"}
//             onValueChange={handleCategoryChange}
//           >
//             <SelectTrigger data-testid="category-filter">
//               <SelectValue placeholder="All Categories" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Categories</SelectItem>
//               {categories.map((cat) => (
//                 <SelectItem key={cat.id} value={cat.id}>
//                   {cat.name}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>

//           {/* Sort */}
//           <Select value={sortBy} onValueChange={setSortBy}>
//             <SelectTrigger data-testid="sort-filter">
//               <SelectValue placeholder="Sort by" />
//             </SelectTrigger>
//             <SelectContent>
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
//             className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12"
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
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Slider } from "@/components/ui/slider.jsx";
// import ProductCard from "../components/ProductCard";
// import api from "../lib/api";
// import { Search, Filter } from "lucide-react";

// const Catalog = () => {
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");
//   const [categoryId, setCategoryId] = useState("");
//   const [priceRange, setPriceRange] = useState([0, 10000]);
//   const [sortBy, setSortBy] = useState("created_at");

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   useEffect(() => {
//     fetchProducts();
//   }, [search, categoryId, sortBy]);

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
//       if (categoryId) params.append("category_id", categoryId);
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

//   const handleSearchSubmit = (e) => {
//     e.preventDefault();
//     fetchProducts();
//   };

//   return (
//     <div
//       className="min-h-screen px-6 md:px-12 lg:px-24 py-20"
//       data-testid="catalog-page"
//     >
//       {/* Header */}
//       <div className="text-center mb-16">
//         <p className="text-xs tracking-widest uppercase text-gray-500 mb-4">
//           Shop
//         </p>
//         <h1
//           className="font-heading text-4xl md:text-6xl font-semibold tracking-tight text-[#2C2C2C]"
//           data-testid="catalog-title"
//         >
//           Our Catalog
//         </h1>
//       </div>

//       {/* Filters */}
//       <div
//         className="bg-white border border-[#F2F0EB] p-6 mb-12 relative z-10"
//         data-testid="filters-section"
//       >
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//           {/* Search */}
//           <form onSubmit={handleSearchSubmit} className="md:col-span-2">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//               <Input
//                 type="text"
//                 placeholder="Search products..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="pl-10 bg-transparent border-b border-gray-300 focus:border-[#C5A059] rounded-none"
//                 data-testid="search-input"
//               />
//             </div>
//           </form>

//           {/* Category Filter */}
//           <Select value={categoryId} onValueChange={setCategoryId}>
//             <SelectTrigger data-testid="category-filter">
//               <SelectValue placeholder="All Categories" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Categories</SelectItem>
//               {categories.map((cat) => (
//                 <SelectItem key={cat.id} value={cat.id}>
//                   {cat.name}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>

//           {/* Sort */}
//           <Select value={sortBy} onValueChange={setSortBy}>
//             <SelectTrigger data-testid="sort-filter">
//               <SelectValue placeholder="Sort by" />
//             </SelectTrigger>
//             <SelectContent>
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
//             Showing {products.length} products
//           </div>
//           <div
//             className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12"
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

import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProductCard from "../components/ProductCard";
import api from "../lib/api";
import { Search, Filter } from "lucide-react";

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

  // Sync categoryId if URL param changes (e.g. navigating from Categories page)
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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div
      className="min-h-screen px-6 md:px-12 lg:px-24 py-20"
      data-testid="catalog-page"
    >
      {/* Header */}
      <div className="text-center mb-16">
        <p className="text-xs tracking-widest uppercase text-gray-500 mb-4">
          Shop
        </p>
        <h1
          className="font-heading text-4xl md:text-6xl font-semibold tracking-tight text-[#2C2C2C]"
          data-testid="catalog-title"
        >
          Our Catalog
        </h1>
      </div>

      {/* Filters */}
      <div
        className="bg-white border border-[#F2F0EB] p-6 mb-12 relative z-10"
        data-testid="filters-section"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-transparent border-b border-gray-300 focus:border-[#C5A059] rounded-none"
                data-testid="search-input"
              />
            </div>
          </form>

          {/* Category Filter */}
          <Select
            value={categoryId || "all"}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger data-testid="category-filter">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent
              position="popper"
              sideOffset={5}
              className="z-[9999] bg-white"
            >
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger data-testid="sort-filter">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent
              position="popper"
              sideOffset={5}
              className="z-[9999] bg-white"
            >
              <SelectItem value="created_at">Newest</SelectItem>
              <SelectItem value="base_price">Price: Low to High</SelectItem>
              <SelectItem value="title">Name: A to Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-20" data-testid="loading-state">
          <div className="inline-block w-8 h-8 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : products.length === 0 ? (
        <div
          className="text-center py-20 bg-white border border-[#F2F0EB]"
          data-testid="no-results-state"
        >
          <Filter className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No products found.</p>
          <p className="text-sm text-gray-400 mt-2">
            Try adjusting your search or filters.
          </p>
        </div>
      ) : (
        <>
          <div
            className="mb-6 text-sm text-gray-500"
            data-testid="results-count"
          >
            Showing {products.length} product{products.length !== 1 ? "s" : ""}
          </div>
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12"
            data-testid="products-grid"
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Catalog;