// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { ArrowRight, Star, ShieldCheck, Truck, Award } from "lucide-react";
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

//   const categories = [
//     { name: "Banarsi Collection", img: "/catagoriesBanarsi.png", slug: "banarsi" },
//     { name: "Patola Collection", img: "/catagoriesPatola.png", slug: "silk-sarees" },
//     { name: "Cotton Collection", img: "catagoriesCotton.png", slug: "cotton" },
//   ];

//   return (
//     <div className="min-h-screen bg-[#FCFAF8]">
//       {/* ─── HERO SECTION ─── */}
//       <section className="relative h-[90vh] flex items-center overflow-hidden">
//         <div className="absolute inset-0 z-0">
//           <img
//             src="/heroHome.png"
//             alt="Hero Background"
//             className="w-full h-full object-cover scale-105 animate-subtle-zoom"
//           />
//           <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/40 to-transparent" />
//         </div>

//         <div className="container mx-auto px-6 md:px-12 lg:px-24 relative z-10">
//           <div className="max-w-2xl">
//             <span className="inline-block text-[#C5A059] font-bold tracking-[0.3em] uppercase text-xs mb-4 animate-fade-in-up">
//               Established 1995
//             </span>
//             <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-light leading-[1.1] text-[#2C2C2C] mb-8">
//               Elegance <br />
//               <span className="font-serif italic text-[#C5A059]">Refined.</span>
//             </h1>
//             <p className="font-body text-lg text-gray-600 mb-10 max-w-md leading-relaxed">
//              Experience the timeless heritage of Western Odisha’s handlooms, where ancestral artistry meets modern silhouettes. Every thread tells a story of soulful craftsmanship.
//             </p>
//             <div className="flex gap-4">
//               <Link to="/catalog">
//                 <Button className="bg-[#2C2C2C] text-white hover:bg-[#C5A059] transition-all duration-500 px-10 py-7 rounded-none uppercase text-xs tracking-widest font-bold">
//                   Shop Collection
//                 </Button>
//               </Link>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ─── TRUST STRIP ─── */}
//       <div className="bg-white border-y border-gray-100 py-10">
//         <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
//           {[
//             { icon: Award, text: "Authentic Handlooms" },
//             { icon: Truck, text: "Pan India Delivery" },
//             { icon: ShieldCheck, text: "Secure Checkout" },
//             { icon: Star, text: "Premium Quality" },
//           ].map((item, i) => (
//             <div key={i} className="flex flex-col items-center text-center gap-3">
//               <item.icon className="w-5 h-5 text-[#C5A059]" />
//               <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500">{item.text}</span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ─── CATEGORY SHOWCASE ─── */}
//       <section className="py-24 bg-white">
//         <div className="container mx-auto px-6">
//           <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
//             <div className="max-w-xl">
//               <h2 className="font-heading text-4xl md:text-5xl font-medium text-[#2C2C2C] mb-4">The Collections</h2>
//               <p className="text-gray-500">Curated pieces selected for the modern woman who values tradition.</p>
//             </div>
//             <Link to="/catalog" className="text-[#C5A059] font-bold text-xs tracking-widest uppercase border-b-2 border-[#C5A059] pb-1 hover:text-[#2C2C2C] transition-colors">
//               View All Categories
//             </Link>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {categories.map((cat, i) => (
//               <Link key={i} to={`/catalog?category=${cat.slug}`} className="group relative h-[500px] overflow-hidden">
//                 <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
//                 <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
//                 <div className="absolute bottom-10 left-10 right-10 text-white">
//                   <h3 className="text-2xl font-serif mb-2">{cat.name}</h3>
//                   <p className="text-[10px] uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity duration-500">Explore Now —</p>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ─── FEATURED PRODUCTS ─── */}
//       <section className="py-24 container mx-auto px-6 md:px-12 lg:px-24">
//         <div className="text-center mb-16">
//           <h2 className="font-heading text-4xl md:text-5xl font-medium text-[#2C2C2C] mb-4">Trending Now</h2>
//           <div className="w-20 h-1 bg-[#C5A059] mx-auto" />
//         </div>

//         {loading ? (
//           <div className="flex justify-center py-20">
//             <div className="w-10 h-10 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
//           </div>
//         ) : featuredProducts.length === 0 ? (
//           <div className="text-center py-20 bg-white border border-gray-100 italic text-gray-400">
//             Awaiting new arrivals...
//           </div>
//         ) : (
//           <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
//             {featuredProducts.map((product) => (
//               <ProductCard key={product.id} product={product} />
//             ))}
//           </div>
//         )}
//       </section>

//       {/* ─── NEWSLETTER/CALLOUT ─── */}
//       <section className="bg-[#2C2C2C] py-24 text-center text-white px-6">
//         <div className="max-w-2xl mx-auto">
//           <h2 className="text-3xl md:text-5xl font-serif mb-6 italic">Join the Bastralaya Circle</h2>
//           <p className="text-gray-400 text-sm mb-10 tracking-wide uppercase">Get early access to new drops and heritage stories.</p>
//           <div className="flex flex-col sm:flex-row gap-0 max-w-md mx-auto">
//             <input
//               type="email"
//               placeholder="YOUR EMAIL"
//               className="bg-transparent border border-white/20 px-6 py-4 flex-1 text-xs focus:outline-none focus:border-[#C5A059] transition-colors"
//             />
//             <button className="bg-white text-[#2C2C2C] px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-[#C5A059] hover:text-white transition-all duration-300">
//               Join
//             </button>
//           </div>
//         </div>
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
    {
      name: "Banarsi Collection",
      img: "/catagoriesBanarsi.png",
      slug: "banarsi",
    },
    {
      name: "Patola Collection",
      img: "/catagoriesPatola.png",
      slug: "silk-sarees",
    },
    { name: "Cotton Collection", img: "/catagoriesCotton.png", slug: "cotton" },
  ];

  return (
    <div className="min-h-screen bg-[#FCFAF8]">
      {/* ─── HERO SECTION ─── */}
      <section className="relative overflow-hidden">
        {/* Mobile layout: stacked (image top, text bottom) */}
        <div className="block md:hidden">
          {/* Image fills top portion */}
          <div className="relative h-[55vh] w-full overflow-hidden">
            <img
              src="/heroHome.png"
              alt="Hero"
              className="w-full h-full object-cover object-top scale-105 animate-subtle-zoom"
            />
            {/* subtle bottom fade into content */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#FCFAF8] to-transparent" />
          </div>

          {/* Text block below image */}
          <div className="bg-[#FCFAF8] px-6 pt-6 pb-12">
            <span className="inline-block text-[#C5A059] font-bold tracking-[0.3em] uppercase text-[10px] mb-4">
              Established 1995
            </span>
            <h1 className="font-heading text-5xl font-light leading-[1.05] text-[#2C2C2C] mb-5">
              Elegance <br />
              <span className="font-serif italic text-[#C5A059]">Refined.</span>
            </h1>
            <p className="font-body text-sm text-gray-500 mb-8 leading-relaxed max-w-xs">
              Experience the timeless heritage of Western Odisha's handlooms,
              where ancestral artistry meets modern silhouettes. Every thread
              tells a story of soulful craftsmanship.
            </p>
            <Link to="/catalog">
              <button className="bg-[#2C2C2C] text-white hover:bg-[#C5A059] transition-all duration-500 px-10 py-4 uppercase text-[10px] tracking-widest font-bold w-full sm:w-auto">
                Shop Collection
              </button>
            </Link>
          </div>
        </div>

        {/* Desktop layout: full-height with overlay (original) */}
        <div className="hidden md:flex relative h-[90vh] items-center">
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
              <span className="inline-block text-[#C5A059] font-bold tracking-[0.3em] uppercase text-xs mb-4">
                Established 1995
              </span>
              <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-light leading-[1.1] text-[#2C2C2C] mb-8">
                Elegance <br />
                <span className="font-serif italic text-[#C5A059]">
                  Refined.
                </span>
              </h1>
              <p className="font-body text-lg text-gray-600 mb-10 max-w-md leading-relaxed">
                Experience the timeless heritage of Western Odisha's handlooms,
                where ancestral artistry meets modern silhouettes. Every thread
                tells a story of soulful craftsmanship.
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
        </div>
      </section>

      {/* ─── TRUST STRIP ─── */}
      <div className="bg-white border-y border-gray-100 py-8 md:py-10">
        <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {[
            { icon: Award, text: "Authentic Handlooms" },
            { icon: Truck, text: "Pan India Delivery" },
            { icon: ShieldCheck, text: "Secure Checkout" },
            { icon: Star, text: "Premium Quality" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center gap-2 md:gap-3"
            >
              <item.icon className="w-4 h-4 md:w-5 md:h-5 text-[#C5A059]" />
              <span className="text-[9px] md:text-[10px] uppercase tracking-widest font-bold text-gray-500">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── CATEGORY SHOWCASE ─── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16 gap-4 md:gap-6">
            <div className="max-w-xl">
              <h2 className="font-heading text-3xl md:text-5xl font-medium text-[#2C2C2C] mb-3 md:mb-4">
                The Collections
              </h2>
              <p className="text-gray-500 text-sm">
                Curated pieces selected for the modern woman who values
                tradition.
              </p>
            </div>
            <Link
              to="/catalog"
              className="text-[#C5A059] font-bold text-[10px] tracking-widest uppercase border-b-2 border-[#C5A059] pb-1 hover:text-[#2C2C2C] transition-colors shrink-0"
            >
              View All Categories
            </Link>
          </div>

          {/* Mobile: horizontal scroll / Desktop: grid */}
          <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-6 overflow-x-auto md:overflow-visible pb-2 md:pb-0 -mx-6 px-6 md:mx-0 md:px-0 snap-x snap-mandatory md:snap-none">
            {categories.map((cat, i) => (
              <Link
                key={i}
                to={`/catalog?category=${cat.slug}`}
                className="group relative shrink-0 w-[72vw] sm:w-[60vw] md:w-auto h-[420px] md:h-[500px] overflow-hidden snap-start"
              >
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <h3 className="text-xl md:text-2xl font-serif mb-2">
                    {cat.name}
                  </h3>
                  <p className="text-[10px] uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    Explore Now —
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS ─── */}
      <section className="py-16 md:py-24 container mx-auto px-4 md:px-12 lg:px-24">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="font-heading text-3xl md:text-5xl font-medium text-[#2C2C2C] mb-4">
            Trending Now
          </h2>
          <div className="w-16 md:w-20 h-[2px] bg-[#C5A059] mx-auto" />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white border border-gray-100 italic text-gray-400 text-sm">
            Awaiting new arrivals...
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-8 md:gap-y-12">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* ─── NEWSLETTER/CALLOUT ─── */}
      <section className="bg-[#2C2C2C] py-16 md:py-24 text-center text-white px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-5xl font-serif mb-4 md:mb-6 italic">
            Join the Bastralaya Circle
          </h2>
          <p className="text-gray-400 text-[10px] md:text-sm mb-8 md:mb-10 tracking-wide uppercase">
            Get early access to new drops and heritage stories.
          </p>
          <div className="flex flex-col sm:flex-row gap-0 max-w-md mx-auto">
            <input
              type="email"
              placeholder="YOUR EMAIL"
              className="bg-transparent border border-white/20 px-5 py-4 flex-1 text-xs focus:outline-none focus:border-[#C5A059] transition-colors w-full"
            />
            <button className="bg-white text-[#2C2C2C] px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-[#C5A059] hover:text-white transition-all duration-300 w-full sm:w-auto">
              Join
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;