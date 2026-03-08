// import React, { useState } from "react";
// import {
//   Phone,
//   Mail,
//   MapPin,
//   ShieldCheck,
// } from "lucide-react";

// // 1. Define fallbacks outside the component
// const STORY_IMAGES = [
//   "/aboutus.png", // This must be in your frontend/public folder
//   "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=1200",
//   "https://images.unsplash.com/photo-1544441893-675973e31985?w=1200"
// ];

// const HERO_IMAGES = [
//   "/heroAbout2.png",
//   "/heroAbout1.jpg",
//   "/heroAbout.png",
//   // "https://images.unsplash.com/photo-1544441893-675973e31985?w=1800",
// ]

// const About = () => {
//   const googleMapsUrl = "https://maps.app.goo.gl/YourExactStoreLink";

// const [heroIdx, setHeroIdx] = useState(0);
// const [storyIdx, setStoryIdx] = useState(0);

//   const handleHeroError = () => {
//     if (heroIdx < HERO_IMAGES.length - 1) setHeroIdx(heroIdx + 1);
//   };

//   const handleStoryError = () => {
//     if (storyIdx < STORY_IMAGES.length - 1) setStoryIdx(storyIdx + 1);
//   };

//   return (
//     <div className="min-h-screen bg-[#FCFAF8]" data-testid="about-page">
//       {/* ─── EDITORIAL HERO ─── */}
//       <section className="relative h-[60vh] flex items-center overflow-hidden bg-[#2C2C2C]">
//         <div className="absolute inset-0">
//           <img
//             src={HERO_IMAGES[heroIdx]}
//             onError={handleHeroError}
//             alt="Heritage Textile"
//             className="w-full h-full object-cover opacity-50 animate-subtle-zoom"
//           />
//           <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#FCFAF8]" />
//         </div>

//         <div className="container mx-auto px-6 md:px-12 lg:px-24 relative z-10 text-center">
//           <span className="inline-block text-[#C5A059] font-bold tracking-[0.4em] uppercase text-[10px] mb-6">
//             Our Legacy
//           </span>
//           <h1 className="font-heading text-6xl md:text-8xl lg:text-9xl font-light text-white tracking-tighter leading-none mb-8">
//             The <span className="font-serif italic text-[#C5A059]">Artisan</span> <br />
//             <span className="ml-12 md:ml-24">Collective.</span>
//           </h1>
//         </div>
//       </section>

//       <div className="container mx-auto px-6 md:px-12 lg:px-24 -mt-24 relative z-20 pb-24">
//         {/* ─── THE TRINITY VALUES ─── */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           {[
//             { label: "01", title: "THE MISSION", desc: "To preserve and elevate the timeless beauty of Indian handlooms for the modern connoisseur." },
//             { label: "02", title: "THE CRAFT", desc: "Meticulous attention to every thread, ensuring each piece is a wearable masterpiece of history." },
//             { label: "03", title: "THE VISION", desc: "Becoming the global standard for luxury textiles that bridge tradition and contemporary life." },
//           ].map((item, idx) => (
//             <div key={idx} className="bg-white p-10 border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] group hover:border-[#C5A059] transition-all duration-500">
//               <span className="text-[10px] font-bold text-[#C5A059] tracking-widest block mb-6 opacity-30 group-hover:opacity-100 transition-opacity">{item.label}</span>
//               <h3 className="font-heading text-lg font-bold tracking-widest text-[#2C2C2C] mb-4">{item.title}</h3>
//               <p className="text-[11px] uppercase tracking-widest leading-loose text-gray-400">{item.desc}</p>
//             </div>
//           ))}
//         </div>

//         {/* ─── STORYTELLING SECTION ─── */}
//         <section className="py-32 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
//           <div className="lg:col-span-7 relative group">
//              <div className="absolute -inset-4 border border-[#C5A059]/20 translate-x-8 translate-y-8 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700" />
//              <img
//                src={STORY_IMAGES[storyIdx]}
//                onError={handleStoryError}
//                className="relative z-10 w-full h-[600px] object-cover shadow-2xl transition-all duration-1000"
//                alt="Artisanal Weaving"
//              />
//           </div>
//           <div className="lg:col-span-5 space-y-10">
//             <span className="text-[10px] font-bold tracking-[0.3em] text-[#C5A059] uppercase">The Narrative</span>
//             <h2 className="font-heading text-5xl md:text-6xl font-light text-[#2C2C2C] leading-tight tracking-tighter">
//               Woven into <br />
//               <span className="font-serif italic text-[#C5A059]">Excellence.</span>
//             </h2>
//             <div className="h-[1px] w-20 bg-[#C5A059]" />
//             <p className="font-body text-lg text-gray-600 leading-relaxed italic">
//               "GM_Bastralaya was born from a simple belief: that luxury should be felt in the texture of tradition."
//             </p>
//             <p className="text-sm text-gray-500 leading-loose tracking-wide">
//               Established with a deep reverence for Indian textiles, we curate collections that celebrate local artisans.
//               Our journey is defined by a commitment to the "slow fashion" movement—where quality outweighs quantity.
//             </p>
//             <div className="grid grid-cols-2 gap-6 pt-6">
//                <div className="flex items-center gap-3 text-[10px] font-bold tracking-widest text-[#2C2C2C] uppercase">
//                  <ShieldCheck className="w-4 h-4 text-[#C5A059]" /> Pure Handloom
//                </div>
//                <div className="flex items-center gap-3 text-[10px] font-bold tracking-widest text-[#2C2C2C] uppercase">
//                  <ShieldCheck className="w-4 h-4 text-[#C5A059]" /> Fair Trade
//                </div>
//             </div>
//           </div>
//         </section>

//         {/* ─── THE ATELIER CONTACT ─── */}
//         <div className="bg-[#1A1A1A] text-white overflow-hidden relative p-12 lg:p-24">
//           <div className="absolute top-0 right-0 w-1/3 h-full bg-[#C5A059]/5 -skew-x-12 translate-x-1/2" />

//           <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20">
//             <div>
//               <span className="text-[10px] font-bold tracking-[0.3em] text-[#C5A059] uppercase mb-8 block">Connect</span>
//               <h2 className="font-heading text-4xl md:text-5xl font-light mb-10 tracking-tight">Visit the <span className="font-serif italic">Atelier.</span></h2>

//               <div className="space-y-12">
//                 <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="group flex items-center gap-6">
//                   <div className="w-12 h-12 border border-white/10 flex items-center justify-center group-hover:border-[#C5A059] transition-all">
//                     <Phone className="w-4 h-4 text-[#C5A059]" />
//                   </div>
//                   <div>
//                     <p className="text-[9px] uppercase tracking-[0.3em] text-white/30 mb-1">WhatsApp</p>
//                     <p className="text-sm tracking-widest">+91 98765 43210</p>
//                   </div>
//                 </a>

//                 <a href="mailto:info@gmbastralaya.com" className="group flex items-center gap-6">
//                   <div className="w-12 h-12 border border-white/10 flex items-center justify-center group-hover:border-[#C5A059] transition-all">
//                     <Mail className="w-4 h-4 text-[#C5A059]" />
//                   </div>
//                   <div>
//                     <p className="text-[9px] uppercase tracking-[0.3em] text-white/30 mb-1">Electronic Mail</p>
//                     <p className="text-sm tracking-widest uppercase">info@gmbastralaya.com</p>
//                   </div>
//                 </a>

//                 <div className="group flex items-center gap-6">
//                   <div className="w-12 h-12 border border-white/10 flex items-center justify-center">
//                     <MapPin className="w-4 h-4 text-[#C5A059]" />
//                   </div>
//                   <div>
//                     <p className="text-[9px] uppercase tracking-[0.3em] text-white/30 mb-1">Our Location</p>
//                     <p className="text-sm tracking-widest uppercase">Odisha, India</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-12">
//               <h3 className="text-[11px] font-bold tracking-[0.3em] text-[#C5A059] uppercase mb-10">Business Hours</h3>
//               <div className="space-y-6 mb-12">
//                 <div className="flex justify-between border-b border-white/5 pb-4">
//                   <span className="text-[10px] uppercase tracking-widest text-white/40">Mon — Sat</span>
//                   <span className="text-[10px] uppercase tracking-widest">09:00 AM — 08:00 PM</span>
//                 </div>
//                 <div className="flex justify-between border-b border-white/5 pb-4">
//                   <span className="text-[10px] uppercase tracking-widest text-white/40">Sunday</span>
//                   <span className="text-[10px] uppercase tracking-widest">10:00 AM — 09:00 PM</span>
//                 </div>
//               </div>

//               <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="block w-full">
//                 <button className="w-full bg-white text-[#1A1A1A] py-5 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#C5A059] hover:text-white transition-all duration-500 shadow-lg">
//                   Visit our Outlet
//                 </button>
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
import { Phone, Mail, MapPin, ShieldCheck } from "lucide-react";

const STORY_IMAGES = [
  "/aboutus.png",
  "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=1200",
  "https://images.unsplash.com/photo-1544441893-675973e31985?w=1200",
];

const HERO_IMAGES = ["/heroAbout2.png", "/heroAbout1.jpg", "/heroAbout.png"];

const About = () => {
  const googleMapsUrl = "https://maps.app.goo.gl/YourExactStoreLink";
  const [heroIdx, setHeroIdx] = useState(0);
  const [storyIdx, setStoryIdx] = useState(0);

  return (
    <div className="min-h-screen bg-[#FCFAF8]" data-testid="about-page">
      {/* ─── HERO ─── */}
      <section className="relative h-[50vh] md:h-[60vh] flex items-center overflow-hidden bg-[#2C2C2C]">
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGES[heroIdx]}
            onError={() =>
              heroIdx < HERO_IMAGES.length - 1 && setHeroIdx(heroIdx + 1)
            }
            alt="Heritage Textile"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#FCFAF8]" />
        </div>

        <div className="container mx-auto px-6 md:px-12 lg:px-24 relative z-10 text-center">
          <span className="inline-block text-[#C5A059] font-bold tracking-[0.4em] uppercase text-[10px] mb-4 md:mb-6">
            Our Legacy
          </span>
          <h1 className="font-heading text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-light text-white tracking-tighter leading-none mb-4 md:mb-8">
            The{" "}
            <span className="font-serif italic text-[#C5A059]">Artisan</span>
            <br />
            <span className="ml-6 md:ml-24">Collective.</span>
          </h1>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-12 lg:px-24 -mt-16 md:-mt-24 relative z-20 pb-16 md:pb-24">
        {/* ─── TRINITY VALUES ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8">
          {[
            {
              label: "01",
              title: "THE MISSION",
              desc: "To preserve and elevate the timeless beauty of Indian handlooms for the modern connoisseur.",
            },
            {
              label: "02",
              title: "THE CRAFT",
              desc: "Meticulous attention to every thread, ensuring each piece is a wearable masterpiece of history.",
            },
            {
              label: "03",
              title: "THE VISION",
              desc: "Becoming the global standard for luxury textiles that bridge tradition and contemporary life.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-6 md:p-10 border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] group hover:border-[#C5A059] transition-all duration-500"
            >
              <span className="text-[10px] font-bold text-[#C5A059] tracking-widest block mb-4 md:mb-6 opacity-30 group-hover:opacity-100 transition-opacity">
                {item.label}
              </span>
              <h3 className="font-heading text-sm md:text-lg font-bold tracking-widest text-[#2C2C2C] mb-3 md:mb-4">
                {item.title}
              </h3>
              <p className="text-[11px] uppercase tracking-widest leading-loose text-gray-400">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* ─── STORYTELLING SECTION ─── */}
        <section className="py-16 md:py-32 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 items-center">
          {/* Image */}
          <div className="lg:col-span-7 relative group">
            <div className="hidden md:block absolute -inset-4 border border-[#C5A059]/20 translate-x-8 translate-y-8 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700" />
            <img
              src={STORY_IMAGES[storyIdx]}
              onError={() =>
                storyIdx < STORY_IMAGES.length - 1 && setStoryIdx(storyIdx + 1)
              }
              className="relative z-10 w-full h-64 sm:h-80 md:h-[500px] lg:h-[600px] object-cover shadow-2xl"
              alt="Artisanal Weaving"
            />
          </div>

          {/* Text */}
          <div className="lg:col-span-5 space-y-6 md:space-y-10">
            <span className="text-[10px] font-bold tracking-[0.3em] text-[#C5A059] uppercase">
              The Narrative
            </span>
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-light text-[#2C2C2C] leading-tight tracking-tighter">
              Woven into <br />
              <span className="font-serif italic text-[#C5A059]">
                Excellence.
              </span>
            </h2>
            <div className="h-[1px] w-16 md:w-20 bg-[#C5A059]" />
            <p className="font-body text-base md:text-lg text-gray-600 leading-relaxed italic">
              "GM_Bastralaya was born from a simple belief: that luxury should
              be felt in the texture of tradition."
            </p>
            <p className="text-sm text-gray-500 leading-loose tracking-wide">
              Established with a deep reverence for Indian textiles, we curate
              collections that celebrate local artisans. Our journey is defined
              by a commitment to the "slow fashion" movement—where quality
              outweighs quantity.
            </p>
            <div className="grid grid-cols-2 gap-4 md:gap-6 pt-2 md:pt-6">
              <div className="flex items-center gap-3 text-[10px] font-bold tracking-widest text-[#2C2C2C] uppercase">
                <ShieldCheck className="w-4 h-4 text-[#C5A059] shrink-0" /> Pure
                Handloom
              </div>
              <div className="flex items-center gap-3 text-[10px] font-bold tracking-widest text-[#2C2C2C] uppercase">
                <ShieldCheck className="w-4 h-4 text-[#C5A059] shrink-0" /> Fair
                Trade
              </div>
            </div>
          </div>
        </section>

        {/* ─── CONTACT / ATELIER ─── */}
        <div className="bg-[#1A1A1A] text-white overflow-hidden relative p-6 sm:p-10 md:p-16 lg:p-24">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-[#C5A059]/5 -skew-x-12 translate-x-1/2" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20">
            {/* Left: contact info */}
            <div>
              <span className="text-[10px] font-bold tracking-[0.3em] text-[#C5A059] uppercase mb-6 md:mb-8 block">
                Connect
              </span>
              <h2 className="font-heading text-3xl md:text-5xl font-light mb-8 md:mb-10 tracking-tight">
                Visit the <span className="font-serif italic">Atelier.</span>
              </h2>

              <div className="space-y-8 md:space-y-12">
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-4 md:gap-6"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-[#C5A059] transition-all">
                    <Phone className="w-4 h-4 text-[#C5A059]" />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.3em] text-white/30 mb-1">
                      WhatsApp
                    </p>
                    <p className="text-sm tracking-widest">+91 98765 43210</p>
                  </div>
                </a>

                <a
                  href="mailto:info@gmbastralaya.com"
                  className="group flex items-center gap-4 md:gap-6"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-[#C5A059] transition-all">
                    <Mail className="w-4 h-4 text-[#C5A059]" />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.3em] text-white/30 mb-1">
                      Electronic Mail
                    </p>
                    <p className="text-sm tracking-widest break-all">
                      info@gmbastralaya.com
                    </p>
                  </div>
                </a>

                <div className="flex items-center gap-4 md:gap-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 border border-white/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-[#C5A059]" />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.3em] text-white/30 mb-1">
                      Our Location
                    </p>
                    <p className="text-sm tracking-widest uppercase">
                      Odisha, India
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: hours + CTA */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 md:p-12">
              <h3 className="text-[11px] font-bold tracking-[0.3em] text-[#C5A059] uppercase mb-6 md:mb-10">
                Business Hours
              </h3>
              <div className="space-y-4 md:space-y-6 mb-8 md:mb-12">
                <div className="flex justify-between border-b border-white/5 pb-4">
                  <span className="text-[10px] uppercase tracking-widest text-white/40">
                    Mon — Sat
                  </span>
                  <span className="text-[10px] uppercase tracking-widest">
                    09:00 AM — 08:00 PM
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-4">
                  <span className="text-[10px] uppercase tracking-widest text-white/40">
                    Sunday
                  </span>
                  <span className="text-[10px] uppercase tracking-widest">
                    10:00 AM — 09:00 PM
                  </span>
                </div>
              </div>

              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full"
              >
                <button className="w-full bg-white text-[#1A1A1A] py-4 md:py-5 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#C5A059] hover:text-white transition-all duration-500 shadow-lg">
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