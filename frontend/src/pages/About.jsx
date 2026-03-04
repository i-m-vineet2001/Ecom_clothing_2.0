import React from "react";
import {
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Heart,
  Sparkles,
  Target,
} from "lucide-react";

const About = () => {
  // Update this URL with your actual Google Maps share link if you have one
  const googleMapsUrl =
    "https://www.google.com/maps/search/Gangadhar+Meher+Bastralaya+Odisha";

  return (
    <div className="min-h-screen bg-[#FDFCFB]" data-testid="about-page">
      {/* ── Hero Section ─────────────────────────────────────────────── */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-[#2C2C2C]">
        <img
          src="https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=2070"
          alt="Textile Background"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative z-10 text-center px-4">
          <p className="text-[#C5A059] text-xs sm:text-sm tracking-[0.3em] uppercase mb-4 font-bold animate-in fade-in slide-in-from-bottom-4 duration-700">
            Est. 2024
          </p>
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tighter text-white animate-in fade-in slide-in-from-bottom-6 duration-1000">
            GM_<span className="text-[#C5A059]">Bastralaya</span>
          </h1>
          <p className="text-gray-300 mt-6 max-w-xl mx-auto text-sm sm:text-base leading-relaxed animate-in fade-in duration-1000 delay-300">
            Weaving tradition into the fabric of contemporary lifestyle.
            Discover the artistry in every thread.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 -mt-16 relative z-20 pb-20">
        {/* ── Values Grid ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {[
            {
              icon: Target,
              title: "Our Mission",
              desc: "To provide authentic, premium quality textiles that celebrate our rich heritage.",
              color: "bg-white",
            },
            {
              icon: Heart,
              title: "Our Passion",
              desc: "Crafting elegance through meticulous attention to detail and traditional craftsmanship.",
              color: "bg-[#C5A059] text-white",
            },
            {
              icon: Sparkles,
              title: "Our Vision",
              desc: "To become the premier destination for textile connoisseurs worldwide.",
              color: "bg-white",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`${item.color} p-8 rounded-2xl shadow-xl border border-[#F2F0EB] flex flex-col items-center text-center transition-transform hover:-translate-y-2 duration-300`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${item.color.includes("white") ? "bg-[#F9F8F5] text-[#C5A059]" : "bg-white/20 text-white"}`}
              >
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-xl font-bold mb-3">
                {item.title}
              </h3>
              <p
                className={`text-sm leading-relaxed ${item.color.includes("white") ? "text-gray-500" : "text-white/80"}`}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* ── Story Section ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-[#2C2C2C]">
              Every Thread Tells <br />
              <span className="text-[#C5A059]">A Story</span>
            </h2>
            <div className="w-20 h-1 bg-[#C5A059] rounded-full" />
            <p className="text-gray-600 leading-relaxed text-lg">
              Welcome to GM_Bastralaya, your premier destination for exquisite
              fashion textiles and fabrics. We are dedicated to bringing you the
              finest selection of premium quality materials that seamlessly
              blend traditional craftsmanship with contemporary design.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Founded with a passion for excellence, we have been crafting
              elegance in every thread. Our commitment to quality and customer
              satisfaction has made us a trusted name in the fashion textile
              industry.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              {[
                "Premium Fabrics",
                "Local Artistry",
                "Reliable Service",
                "Global Designs",
              ].map((feat) => (
                <div key={feat} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />
                  <span className="text-sm font-medium text-[#2C2C2C]">
                    {feat}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-[#C5A059]/10 rounded-3xl -rotate-2" />
            <img
              src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1972"
              className="relative rounded-2xl shadow-2xl object-cover w-full h-[500px]"
              alt="Artisan at work"
            />
          </div>
        </div>

        {/* ── Contact Card ───────────────────────────────────────────── */}
        <div className="bg-[#2C2C2C] rounded-[2rem] p-8 sm:p-12 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059]/10 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading text-3xl font-semibold mb-4">
                Connect With Us
              </h2>
              <p className="text-gray-400 mb-8 max-w-sm">
                Have questions about our collections? Our style experts are
                available on WhatsApp for instant assistance.

              </p>
              <div className="space-y-4">
                <a
                  href="https://wa.me/919876543210"
                  className="flex items-center gap-4 group w-fit"
                >
                  <div className="w-10 h-10 bg-[#C5A059]/20 rounded-full flex items-center justify-center group-hover:bg-[#C5A059] transition-all duration-300">
                    <Phone className="w-5 h-5 text-[#C5A059] group-hover:text-white" />
                  </div>
                  <span className="text-lg font-medium">+91 98765 43210</span>
                </a>
                <a
                  href="mailto:info@gmbastralaya.com"
                  className="flex items-center gap-4 group w-fit"
                >
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-all duration-300">
                    <Mail className="w-5 h-5 text-gray-400 group-hover:text-white" />
                  </div>
                  <span className="text-lg font-medium">
                    info@gmbastralaya.com
                  </span>
                </a>
                {/* Made location clickable as well */}
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 group w-fit"
                >
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-[#C5A059] transition-all duration-300">
                    <MapPin className="w-5 h-5 text-gray-400 group-hover:text-white" />
                  </div>
                  <span className="text-sm text-gray-400 font-medium group-hover:text-white transition-colors">
                    Odisha, India
                  </span>
                </a>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <h3 className="font-heading text-lg mb-4 text-[#C5A059]">
                Business Hours
              </h3>
              <div className="space-y-3">
                {[
                  { day: "Mon - Sat", time: "09:00 AM - 08:00 PM" },
                  { day: "Sunday", time: "10:00 AM - 02:00 PM" },
                ].map((item) => (
                  <div
                    key={item.day}
                    className="flex justify-between text-sm border-b border-white/5 pb-2"
                  >
                    <span className="text-gray-400">{item.day}</span>
                    <span className="font-bold">{item.time}</span>
                  </div>
                ))}
              </div>

              <a
                href={googleMapsUrl}
                target="_blank"
                // rel="noopener noreferrer"
                className="w-full mt-6 bg-white text-[#2C2C2C] py-3 rounded-xl font-bold hover:bg-[#C5A059] hover:text-white transition-all inline-block text-center"
              >
                Visit Our Outlet
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
