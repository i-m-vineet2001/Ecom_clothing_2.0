
// import React from "react";
// import {
//   Phone,
//   Mail,
//   MapPin,
//   CheckCircle2,
//   Heart,
//   Sparkles,
//   Target,
// } from "lucide-react";

// const About = () => {
//   const googleMapsUrl =
//     "https://www.google.com/maps/search/Gangadhar+Meher+Bastralaya+Odisha";

//   return (
//     <div className="min-h-screen bg-[#FDFCFB]" data-testid="about-page">
//       {/* ── Hero Section ─────────────────────────────────────────────── */}
//       <section className="relative h-[50vh] sm:h-[60vh] flex items-center justify-center overflow-hidden bg-[#2C2C2C]">
//         <img
//           src="https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=2070"
//           alt="Textile Background"
//           className="absolute inset-0 w-full h-full object-cover opacity-40"
//         />
//         <div className="relative z-10 text-center px-4">
//           <p className="text-[#C5A059] text-xs sm:text-sm tracking-[0.3em] uppercase mb-4 font-bold">
//             Est. 2024
//           </p>
//           <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tighter text-white">
//             GM_<span className="text-[#C5A059]">Bastralaya</span>
//           </h1>
//           <p className="text-gray-300 mt-4 sm:mt-6 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
//             Weaving tradition into the fabric of contemporary lifestyle.
//             Discover the artistry in every thread.
//           </p>
//         </div>
//       </section>

//       <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 -mt-12 sm:-mt-16 relative z-20 pb-16 sm:pb-20">
//         {/* ── Values Grid ────────────────────────────────────────────── */}
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-16 sm:mb-20">
//           {[
//             {
//               icon: Target,
//               title: "Our Mission",
//               desc: "To provide authentic, premium quality textiles that celebrate our rich heritage.",
//               color: "bg-white",
//             },
//             {
//               icon: Heart,
//               title: "Our Passion",
//               desc: "Crafting elegance through meticulous attention to detail and traditional craftsmanship.",
//               color: "bg-[#C5A059] text-white",
//             },
//             {
//               icon: Sparkles,
//               title: "Our Vision",
//               desc: "To become the premier destination for textile connoisseurs worldwide.",
//               color: "bg-white",
//             },
//           ].map((item, idx) => (
//             <div
//               key={idx}
//               className={`${item.color} p-6 sm:p-8 rounded-2xl shadow-xl border border-[#F2F0EB] flex flex-col items-center text-center transition-transform hover:-translate-y-2 duration-300`}
//             >
//               <div
//                 className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${item.color.includes("white") ? "bg-[#F9F8F5] text-[#C5A059]" : "bg-white/20 text-white"}`}
//               >
//                 <item.icon className="w-6 h-6" />
//               </div>
//               <h3 className="font-heading text-xl font-bold mb-3">
//                 {item.title}
//               </h3>
//               <p
//                 className={`text-sm leading-relaxed ${item.color.includes("white") ? "text-gray-500" : "text-white/80"}`}
//               >
//                 {item.desc}
//               </p>
//             </div>
//           ))}
//         </div>

//         {/* ── Story Section ──────────────────────────────────────────── */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center mb-16 sm:mb-20">
//           <div className="space-y-5 sm:space-y-6">
//             <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-[#2C2C2C]">
//               Every Thread Tells <br />
//               <span className="text-[#C5A059]">A Story</span>
//             </h2>
//             <div className="w-20 h-1 bg-[#C5A059] rounded-full" />
//             <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
//               Welcome to GM_Bastralaya, your premier destination for exquisite
//               fashion textiles and fabrics. We are dedicated to bringing you the
//               finest selection of premium quality materials that seamlessly
//               blend traditional craftsmanship with contemporary design.
//             </p>
//             <p className="text-gray-600 leading-relaxed">
//               Founded with a passion for excellence, we have been crafting
//               elegance in every thread. Our commitment to quality and customer
//               satisfaction has made us a trusted name in the fashion textile
//               industry.
//             </p>

//             <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-2 sm:pt-4">
//               {[
//                 "Premium Fabrics",
//                 "Local Artistry",
//                 "Reliable Service",
//                 "Global Designs",
//               ].map((feat) => (
//                 <div key={feat} className="flex items-center gap-2">
//                   <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0" />
//                   <span className="text-sm font-medium text-[#2C2C2C]">
//                     {feat}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="relative mt-4 lg:mt-0">
//             <div className="absolute -inset-3 sm:-inset-4 bg-[#C5A059]/10 rounded-3xl -rotate-2" />
//             <img
//               src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1972"
//               className="relative rounded-2xl shadow-2xl object-cover w-full h-[280px] sm:h-[380px] lg:h-[500px]"
//               alt="Artisan at work"
//             />
//           </div>
//         </div>

//         {/* ── Contact Card ───────────────────────────────────────────── */}
//         <div className="bg-[#2C2C2C] rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 md:p-12 text-white overflow-hidden relative">
//           <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059]/10 rounded-full blur-3xl -mr-32 -mt-32" />
//           <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
//             <div>
//               <h2 className="font-heading text-2xl sm:text-3xl font-semibold mb-3 sm:mb-4">
//                 Connect With Us
//               </h2>
//               <p className="text-gray-400 mb-6 sm:mb-8 max-w-sm text-sm sm:text-base">
//                 Have questions about our collections? Our style experts are
//                 available on WhatsApp for instant assistance.
//               </p>
//               <div className="space-y-4">
//                 <a
//                   href="https://wa.me/919876543210"
//                   className="flex items-center gap-4 group w-fit"
//                 >
//                   <div className="w-10 h-10 bg-[#C5A059]/20 rounded-full flex items-center justify-center group-hover:bg-[#C5A059] transition-all duration-300 shrink-0">
//                     <Phone className="w-5 h-5 text-[#C5A059] group-hover:text-white" />
//                   </div>
//                   <span className="text-base sm:text-lg font-medium">
//                     +91 98765 43210
//                   </span>
//                 </a>
//                 <a
//                   href="mailto:info@gmbastralaya.com"
//                   className="flex items-center gap-4 group w-fit"
//                 >
//                   <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-all duration-300 shrink-0">
//                     <Mail className="w-5 h-5 text-gray-400 group-hover:text-white" />
//                   </div>
//                   <span className="text-base sm:text-lg font-medium break-all">
//                     info@gmbastralaya.com
//                   </span>
//                 </a>
//                 <a
//                   href={googleMapsUrl}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="flex items-center gap-4 group w-fit"
//                 >
//                   <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-[#C5A059] transition-all duration-300 shrink-0">
//                     <MapPin className="w-5 h-5 text-gray-400 group-hover:text-white" />
//                   </div>
//                   <span className="text-sm text-gray-400 font-medium group-hover:text-white transition-colors">
//                     Odisha, India
//                   </span>
//                 </a>
//               </div>
//             </div>

//             <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-white/10">
//               <h3 className="font-heading text-lg mb-4 text-[#C5A059]">
//                 Business Hours
//               </h3>
//               <div className="space-y-3">
//                 {[
//                   { day: "Mon - Sat", time: "09:00 AM - 08:00 PM" },
//                   { day: "Sunday", time: "10:00 AM - 02:00 PM" },
//                 ].map((item) => (
//                   <div
//                     key={item.day}
//                     className="flex justify-between text-sm border-b border-white/5 pb-2"
//                   >
//                     <span className="text-gray-400">{item.day}</span>
//                     <span className="font-bold">{item.time}</span>
//                   </div>
//                 ))}
//               </div>

//               <a
//                 href={googleMapsUrl}
//                 target="_blank"
//                 className="w-full mt-6 bg-white text-[#2C2C2C] py-3 rounded-xl font-bold hover:bg-[#C5A059] hover:text-white transition-all inline-block text-center text-sm sm:text-base"
//               >
//                 Visit Our Outlet
//               </a>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default About;


import React, { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
} from "lucide-react";

// 1. Define fallbacks outside the component
const STORY_IMAGES = [
  "/aboutus.png", // This must be in your frontend/public folder
  "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=1200",
  "https://images.unsplash.com/photo-1544441893-675973e31985?w=1200"
];

const HERO_IMAGES = [
  "/heroAbout2.png",
  "/heroAbout1.jpg",
  "/heroAbout.png",
  // "https://images.unsplash.com/photo-1544441893-675973e31985?w=1800",
]

const About = () => {
  const googleMapsUrl = "https://maps.app.goo.gl/YourExactStoreLink";

const [heroIdx, setHeroIdx] = useState(0);
const [storyIdx, setStoryIdx] = useState(0);

  const handleHeroError = () => {
    if (heroIdx < HERO_IMAGES.length - 1) setHeroIdx(heroIdx + 1);
  };

  const handleStoryError = () => {
    if (storyIdx < STORY_IMAGES.length - 1) setStoryIdx(storyIdx + 1);
  };

  return (
    <div className="min-h-screen bg-[#FCFAF8]" data-testid="about-page">
      {/* ─── EDITORIAL HERO ─── */}
      <section className="relative h-[60vh] flex items-center overflow-hidden bg-[#2C2C2C]">
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGES[heroIdx]}
            onError={handleHeroError}
            alt="Heritage Textile"
            className="w-full h-full object-cover opacity-50 animate-subtle-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#FCFAF8]" />
        </div>
        
        <div className="container mx-auto px-6 md:px-12 lg:px-24 relative z-10 text-center">
          <span className="inline-block text-[#C5A059] font-bold tracking-[0.4em] uppercase text-[10px] mb-6">
            Our Legacy
          </span>
          <h1 className="font-heading text-6xl md:text-8xl lg:text-9xl font-light text-white tracking-tighter leading-none mb-8">
            The <span className="font-serif italic text-[#C5A059]">Artisan</span> <br />
            <span className="ml-12 md:ml-24">Collective.</span>
          </h1>
        </div>
      </section>

      <div className="container mx-auto px-6 md:px-12 lg:px-24 -mt-24 relative z-20 pb-24">
        {/* ─── THE TRINITY VALUES ─── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: "01", title: "THE MISSION", desc: "To preserve and elevate the timeless beauty of Indian handlooms for the modern connoisseur." },
            { label: "02", title: "THE CRAFT", desc: "Meticulous attention to every thread, ensuring each piece is a wearable masterpiece of history." },
            { label: "03", title: "THE VISION", desc: "Becoming the global standard for luxury textiles that bridge tradition and contemporary life." },
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-10 border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] group hover:border-[#C5A059] transition-all duration-500">
              <span className="text-[10px] font-bold text-[#C5A059] tracking-widest block mb-6 opacity-30 group-hover:opacity-100 transition-opacity">{item.label}</span>
              <h3 className="font-heading text-lg font-bold tracking-widest text-[#2C2C2C] mb-4">{item.title}</h3>
              <p className="text-[11px] uppercase tracking-widest leading-loose text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* ─── STORYTELLING SECTION ─── */}
        <section className="py-32 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 relative group">
             <div className="absolute -inset-4 border border-[#C5A059]/20 translate-x-8 translate-y-8 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700" />
             <img 
               src={STORY_IMAGES[storyIdx]} 
               onError={handleStoryError}
               className="relative z-10 w-full h-[600px] object-cover shadow-2xl transition-all duration-1000" 
               alt="Artisanal Weaving"
             />
          </div>
          <div className="lg:col-span-5 space-y-10">
            <span className="text-[10px] font-bold tracking-[0.3em] text-[#C5A059] uppercase">The Narrative</span>
            <h2 className="font-heading text-5xl md:text-6xl font-light text-[#2C2C2C] leading-tight tracking-tighter">
              Woven into <br />
              <span className="font-serif italic text-[#C5A059]">Excellence.</span>
            </h2>
            <div className="h-[1px] w-20 bg-[#C5A059]" />
            <p className="font-body text-lg text-gray-600 leading-relaxed italic">
              "GM_Bastralaya was born from a simple belief: that luxury should be felt in the texture of tradition."
            </p>
            <p className="text-sm text-gray-500 leading-loose tracking-wide">
              Established with a deep reverence for Indian textiles, we curate collections that celebrate local artisans. 
              Our journey is defined by a commitment to the "slow fashion" movement—where quality outweighs quantity.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-6">
               <div className="flex items-center gap-3 text-[10px] font-bold tracking-widest text-[#2C2C2C] uppercase">
                 <ShieldCheck className="w-4 h-4 text-[#C5A059]" /> Pure Handloom
               </div>
               <div className="flex items-center gap-3 text-[10px] font-bold tracking-widest text-[#2C2C2C] uppercase">
                 <ShieldCheck className="w-4 h-4 text-[#C5A059]" /> Fair Trade
               </div>
            </div>
          </div>
        </section>

        {/* ─── THE ATELIER CONTACT ─── */}
        <div className="bg-[#1A1A1A] text-white overflow-hidden relative p-12 lg:p-24">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-[#C5A059]/5 -skew-x-12 translate-x-1/2" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div>
              <span className="text-[10px] font-bold tracking-[0.3em] text-[#C5A059] uppercase mb-8 block">Connect</span>
              <h2 className="font-heading text-4xl md:text-5xl font-light mb-10 tracking-tight">Visit the <span className="font-serif italic">Atelier.</span></h2>
              
              <div className="space-y-12">
                <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="group flex items-center gap-6">
                  <div className="w-12 h-12 border border-white/10 flex items-center justify-center group-hover:border-[#C5A059] transition-all">
                    <Phone className="w-4 h-4 text-[#C5A059]" />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.3em] text-white/30 mb-1">WhatsApp</p>
                    <p className="text-sm tracking-widest">+91 98765 43210</p>
                  </div>
                </a>
                
                <a href="mailto:info@gmbastralaya.com" className="group flex items-center gap-6">
                  <div className="w-12 h-12 border border-white/10 flex items-center justify-center group-hover:border-[#C5A059] transition-all">
                    <Mail className="w-4 h-4 text-[#C5A059]" />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.3em] text-white/30 mb-1">Electronic Mail</p>
                    <p className="text-sm tracking-widest uppercase">info@gmbastralaya.com</p>
                  </div>
                </a>

                <div className="group flex items-center gap-6">
                  <div className="w-12 h-12 border border-white/10 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-[#C5A059]" />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.3em] text-white/30 mb-1">Our Location</p>
                    <p className="text-sm tracking-widest uppercase">Odisha, India</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-12">
              <h3 className="text-[11px] font-bold tracking-[0.3em] text-[#C5A059] uppercase mb-10">Business Hours</h3>
              <div className="space-y-6 mb-12">
                <div className="flex justify-between border-b border-white/5 pb-4">
                  <span className="text-[10px] uppercase tracking-widest text-white/40">Mon — Sat</span>
                  <span className="text-[10px] uppercase tracking-widest">09:00 AM — 08:00 PM</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-4">
                  <span className="text-[10px] uppercase tracking-widest text-white/40">Sunday</span>
                  <span className="text-[10px] uppercase tracking-widest">10:00 AM — 09:00 PM</span>
                </div>
              </div>
              
              <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="block w-full">
                <button className="w-full bg-white text-[#1A1A1A] py-5 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#C5A059] hover:text-white transition-all duration-500 shadow-lg">
                  Visit our Outlet
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;