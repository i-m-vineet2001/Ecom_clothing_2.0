
// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { ArrowRight } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import ProductCard from "../components/ProductCard";
// import api from "../lib/api.jsx";

// const Home = () => {
//   const [featuredProducts, setFeaturedProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchFeaturedProducts();
//   }, []);

//   const fetchFeaturedProducts = async () => {
//     try {
//       const response = await api.get("/products?limit=8");
//       setFeaturedProducts(response.data);
//     } catch (error) {
//       console.error("Failed to fetch products:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen">
//       {/* Hero Section */}
//       <section
//         className="grid grid-cols-1 md:grid-cols-2 gap-0 min-h-[90vh]"
//         data-testid="hero-section"
//       >
//         {/* Left - Text */}
//         <div className="flex flex-col justify-center px-6 md:px-12 lg:px-24 py-16 md:py-20 order-2 md:order-1">
//           <h1
//             className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-[#2C2C2C] mb-6"
//             data-testid="hero-title"
//           >
//             Crafting Elegance in Every Thread
//           </h1>
//           <p
//             className="font-body text-base md:text-lg leading-relaxed text-gray-600 mb-8"
//             data-testid="hero-subtitle"
//           >
//             Discover premium quality fabrics that blend tradition with
//             contemporary design
//           </p>
//           <Link to="/catalog" className="self-start">
//             <Button
//               className="bg-[#2C2C2C] text-white hover:bg-[#C5A059] hover:text-white transition-all duration-300 px-8 py-3 rounded-none uppercase text-xs tracking-widest font-bold inline-flex items-center gap-2"
//               data-testid="explore-collections-button"
//             >
//               Explore Collections
//               <ArrowRight className="w-4 h-4" />
//             </Button>
//           </Link>
//         </div>

//         {/* Right - Image */}
//         <div className="relative h-[55vw] min-h-[280px] md:h-full md:min-h-0 order-1 md:order-2">
//           <img
//             src="https://images.unsplash.com/photo-1756483509177-bbabd67a3234?w=1200"
//             alt="Elegant fashion"
//             className="w-full h-full object-cover"
//             data-testid="hero-image"
//           />
//         </div>
//       </section>

//       {/* Featured Products */}
//       <section
//         className="px-4 sm:px-6 md:px-12 lg:px-24 py-16 md:py-32"
//         data-testid="featured-products-section"
//       >
//         <div className="text-center mb-12 md:mb-16">
//           <p className="text-xs tracking-widest uppercase text-gray-500 mb-4">
//             Discover
//           </p>
//           <h2 className="font-heading text-3xl md:text-5xl font-medium tracking-tight text-[#2C2C2C]">
//             Featured Products
//           </h2>
//         </div>

//         {loading ? (
//           <div className="text-center py-20" data-testid="loading-state">
//             <div className="inline-block w-8 h-8 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin"></div>
//           </div>
//         ) : featuredProducts.length === 0 ? (
//           <div className="text-center py-20" data-testid="empty-state">
//             <p className="text-gray-500">No products available yet.</p>
//             <Link to="/login">
//               <Button className="mt-4">
//                 Login as Shopowner to Add Products
//               </Button>
//             </Link>
//           </div>
//         ) : (
//           <div
//             className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 sm:gap-x-8 gap-y-8 sm:gap-y-12"
//             data-testid="products-grid"
//           >
//             {featuredProducts.map((product) => (
//               <ProductCard key={product.id} product={product} />
//             ))}
//           </div>
//         )}

//         {featuredProducts.length > 0 && (
//           <div className="text-center mt-12 md:mt-16">
//             <Link to="/catalog">
//               <Button
//                 variant="outline"
//                 className="border-[#2C2C2C] text-[#2C2C2C] hover:bg-[#2C2C2C] hover:text-white transition-all duration-300 px-8 py-3 rounded-none uppercase text-xs tracking-widest font-bold"
//                 data-testid="view-all-button"
//               >
//                 View All Products
//               </Button>
//             </Link>
//           </div>
//         )}
//       </section>
//     </div>
//   );
// };

// export default Home;



import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, ShieldCheck, Truck, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "../components/ProductCard";
import api from "../lib/api.jsx";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await api.get("/products?limit=8");
      setFeaturedProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { name: "Banarsi Collection", img: "/catagoriesBanarsi.png", slug: "banarsi" },
    { name: "Patola Collection", img: "/catagoriesPatola.png", slug: "silk-sarees" },
    { name: "Cotton Collection", img: "catagoriesCotton.png", slug: "cotton" },
  ];

  return (
    <div className="min-h-screen bg-[#FCFAF8]">
      {/* ─── HERO SECTION ─── */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/heroHome.png"
            alt="Hero Background"
            className="w-full h-full object-cover scale-105 animate-subtle-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/40 to-transparent" />
        </div>

        <div className="container mx-auto px-6 md:px-12 lg:px-24 relative z-10">
          <div className="max-w-2xl">
            <span className="inline-block text-[#C5A059] font-bold tracking-[0.3em] uppercase text-xs mb-4 animate-fade-in-up">
              Established 1995
            </span>
            <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-light leading-[1.1] text-[#2C2C2C] mb-8">
              Elegance <br />
              <span className="font-serif italic text-[#C5A059]">Refined.</span>
            </h1>
            <p className="font-body text-lg text-gray-600 mb-10 max-w-md leading-relaxed">
             Experience the timeless heritage of Western Odisha’s handlooms, where ancestral artistry meets modern silhouettes. Every thread tells a story of soulful craftsmanship.
            </p>
            <div className="flex gap-4">
              <Link to="/catalog">
                <Button className="bg-[#2C2C2C] text-white hover:bg-[#C5A059] transition-all duration-500 px-10 py-7 rounded-none uppercase text-xs tracking-widest font-bold">
                  Shop Collection
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TRUST STRIP ─── */}
      <div className="bg-white border-y border-gray-100 py-10">
        <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: Award, text: "Authentic Handlooms" },
            { icon: Truck, text: "Pan India Delivery" },
            { icon: ShieldCheck, text: "Secure Checkout" },
            { icon: Star, text: "Premium Quality" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-3">
              <item.icon className="w-5 h-5 text-[#C5A059]" />
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── CATEGORY SHOWCASE ─── */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-xl">
              <h2 className="font-heading text-4xl md:text-5xl font-medium text-[#2C2C2C] mb-4">The Collections</h2>
              <p className="text-gray-500">Curated pieces selected for the modern woman who values tradition.</p>
            </div>
            <Link to="/catalog" className="text-[#C5A059] font-bold text-xs tracking-widest uppercase border-b-2 border-[#C5A059] pb-1 hover:text-[#2C2C2C] transition-colors">
              View All Categories
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((cat, i) => (
              <Link key={i} to={`/catalog?category=${cat.slug}`} className="group relative h-[500px] overflow-hidden">
                <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
                <div className="absolute bottom-10 left-10 right-10 text-white">
                  <h3 className="text-2xl font-serif mb-2">{cat.name}</h3>
                  <p className="text-[10px] uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity duration-500">Explore Now —</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS ─── */}
      <section className="py-24 container mx-auto px-6 md:px-12 lg:px-24">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-medium text-[#2C2C2C] mb-4">Trending Now</h2>
          <div className="w-20 h-1 bg-[#C5A059] mx-auto" />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white border border-gray-100 italic text-gray-400">
            Awaiting new arrivals...
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* ─── NEWSLETTER/CALLOUT ─── */}
      <section className="bg-[#2C2C2C] py-24 text-center text-white px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-serif mb-6 italic">Join the Bastralaya Circle</h2>
          <p className="text-gray-400 text-sm mb-10 tracking-wide uppercase">Get early access to new drops and heritage stories.</p>
          <div className="flex flex-col sm:flex-row gap-0 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="YOUR EMAIL" 
              className="bg-transparent border border-white/20 px-6 py-4 flex-1 text-xs focus:outline-none focus:border-[#C5A059] transition-colors"
            />
            <button className="bg-white text-[#2C2C2C] px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-[#C5A059] hover:text-white transition-all duration-300">
              Join
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;