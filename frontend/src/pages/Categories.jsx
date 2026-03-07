
// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import api from "../lib/api.jsx";
// import { Layers } from "lucide-react";

// const FALLBACK_IMAGES = [
//   "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800",
//   "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800",
//   "https://images.unsplash.com/photo-1617627143233-4af8cfca1be3?w=800",
//   "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800",
//   "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800",
//   "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800",
// ];

// const Categories = () => {
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     api
//       .get("/categories")
//       .then((r) => setCategories(r.data))
//       .catch(() => {})
//       .finally(() => setLoading(false));
//   }, []);

//   return (
//     <div className="min-h-screen" data-testid="categories-page">
//       {/* Header */}
//       <div className="px-6 md:px-12 lg:px-24 pt-20 pb-16 text-center">
//         <p className="text-xs tracking-widest uppercase text-gray-500 mb-4">
//           Browse
//         </p>
//         <h1 className="font-heading text-4xl md:text-6xl font-semibold tracking-tight text-[#2C2C2C]">
//           All Categories
//         </h1>
//         <p className="mt-6 text-gray-500 text-base max-w-md mx-auto font-body leading-relaxed">
//           Explore our curated collections of premium textiles and fabrics
//         </p>
//       </div>

//       {/* Grid */}
//       <div className="px-6 md:px-12 lg:px-24 pb-24">
//         {loading ? (
//           <div className="text-center py-20" data-testid="loading-state">
//             <div className="inline-block w-8 h-8 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
//           </div>
//         ) : categories.length === 0 ? (
//           <div
//             className="text-center py-24 bg-white border border-[#F2F0EB]"
//             data-testid="empty-state"
//           >
//             <Layers className="w-14 h-14 text-gray-200 mx-auto mb-5" />
//             <p className="text-gray-500 text-lg font-body">
//               No categories available yet.
//             </p>
//             <p className="text-sm text-gray-400 mt-2 font-body">
//               Categories will appear here once added by the shop owner.
//             </p>
//           </div>
//         ) : (
//           <div
//             className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
//             data-testid="categories-grid"
//           >
//             {categories.map((category, index) => (
//               <Link
//                 key={category.id}
//                 to={`/category/${category.slug || category.id}`}
//                 className="group relative overflow-hidden bg-[#F2F0EB] block no-underline"
//                 data-testid="category-card"
//               >
//                 <div className="aspect-[4/3] overflow-hidden relative">
//                   <img
//                     src={
//                       category.image_url ||
//                       FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]
//                     }
//                     alt={category.name}
//                     className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
//                   />
//                   <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />
//                 </div>
//                 <div className="p-5 bg-white border-t border-[#F2F0EB]">
//                   <h2 className="font-heading text-xl font-medium text-[#2C2C2C] group-hover:text-[#C5A059] transition-colors duration-200">
//                     {category.name}
//                   </h2>
//                   {category.description && (
//                     <p className="text-sm text-gray-500 mt-1.5 font-body leading-relaxed line-clamp-2">
//                       {category.description}
//                     </p>
//                   )}
//                   <div className="mt-3 flex items-center gap-1.5 text-xs font-body tracking-widest uppercase text-[#C5A059] font-bold">
//                     Shop Now
//                     <span className="transition-transform duration-200 group-hover:translate-x-1">
//                       →
//                     </span>
//                   </div>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Categories;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api.jsx";
import { ArrowRight, ShoppingBag } from "lucide-react";

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800",
  "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800",
  "https://images.unsplash.com/photo-1617627143233-4af8cfca1be3?w=800",
  "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800",
];

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/categories")
      .then((r) => setCategories(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#FCFAF8]" data-testid="categories-page">
      {/* ─── EDITORIAL HEADER ─── */}
      <div className="relative pt-32 pb-24 overflow-hidden border-b border-gray-100 bg-white">
        <div className="absolute top-0 right-0 w-1/4 h-full bg-[#FDF8F0] hidden lg:block" />
        <div className="container mx-auto px-6 md:px-12 lg:px-24 relative z-10">
          <span className="inline-block text-[#C5A059] font-bold tracking-[0.4em] uppercase text-[10px] mb-6">
            Heritage Collections
          </span>
          <h1 className="font-heading text-6xl md:text-8xl font-light tracking-tighter text-[#2C2C2C] leading-none mb-8">
            The <span className="font-serif italic text-[#C5A059]">Archive.</span>
          </h1>
          <p className="font-body text-gray-500 text-lg max-w-xl leading-relaxed italic">
            "A curation of India's finest handlooms, from the looms of Sambalpur to the streets of Banaras."
          </p>
        </div>
      </div>

      {/* ─── CATEGORY GRID ─── */}
      <div className="container mx-auto px-6 md:px-12 lg:px-24 py-24">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <div className="w-12 h-12 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin mb-6" />
            <span className="text-[10px] uppercase tracking-widest text-gray-400">Loading Archives</span>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-40 border border-dashed border-gray-200 rounded-2xl bg-white">
            <ShoppingBag className="w-12 h-12 text-gray-200 mx-auto mb-6" />
            <p className="font-serif italic text-2xl text-gray-400">New arrivals coming soon...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                to={`/category/${category.slug || category.id}`}
                className="group relative flex flex-col"
              >
                {/* Image Container */}
                <div className="aspect-[4/5] overflow-hidden bg-[#F2F0EB] relative shadow-sm transition-shadow duration-500 group-hover:shadow-xl">
                  <img
                    src={category.image_url || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]}
                    alt={category.name}
                    className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:grayscale-[20%]"
                  />
                  {/* Floating Label */}
                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-2">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-[#2C2C2C]">
                      Vol. {index + 1}
                    </span>
                  </div>
                </div>

                {/* Text Content */}
                <div className="pt-8 relative">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="font-heading text-3xl font-medium text-[#2C2C2C] tracking-tight group-hover:text-[#C5A059] transition-colors duration-300">
                      {category.name}
                    </h2>
                    <ArrowRight className="w-5 h-5 text-gray-300 -rotate-45 group-hover:rotate-0 group-hover:text-[#C5A059] transition-all duration-300" />
                  </div>
                  
                  {category.description && (
                    <p className="text-sm text-gray-500 font-body leading-relaxed line-clamp-2 pr-10 mb-6">
                      {category.description}
                    </p>
                  )}

                  <div className="inline-block relative overflow-hidden">
                    <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#C5A059]">
                      View Collection
                    </span>
                    <div className="h-[1px] w-full bg-[#C5A059] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* ─── FOOTER CALLOUT ─── */}
      <section className="bg-white py-24 border-t border-gray-100">
        <div className="container mx-auto px-6 text-center">
          <p className="font-serif italic text-3xl text-[#2C2C2C] mb-8">Can't find what you're looking for?</p>
          <Link to="/catalog">
            <button className="text-[10px] uppercase tracking-widest font-bold border-2 border-[#2C2C2C] px-10 py-5 hover:bg-[#2C2C2C] hover:text-white transition-all duration-500">
              Browse Entire Catalog
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Categories;