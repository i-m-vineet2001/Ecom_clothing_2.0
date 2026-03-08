// import React, { useEffect, useState } from "react";
// import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   MessageCircle,
//   ArrowLeft,
//   ChevronLeft,
//   ChevronRight,
//   Plus,
//   Minus,
//   X,
//   Maximize2,
//   ShieldCheck,
//   Award,
// } from "lucide-react";
// import { formatPrice, maskPhoneNumber, generateWhatsAppLink } from "../lib/utils";
// import api from "../lib/api.jsx";
// import { toast } from "sonner";
// import { useAuth } from "../contexts/AuthContext";

// // --- Stylized Boutique Accordion ---
// const Accordion = ({ title, children, defaultOpen = false }) => {
//   const [open, setOpen] = useState(defaultOpen);
//   return (
//     <div className="border-t border-gray-100">
//       <button
//         onClick={() => setOpen((o) => !o)}
//         className="w-full flex items-center justify-between py-6 text-left group"
//       >
//         <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#2C2C2C] group-hover:text-[#C5A059] transition-colors">
//           {title}
//         </span>
//         {open ? <Minus className="w-3 h-3 text-gray-400" /> : <Plus className="w-3 h-3 text-gray-400" />}
//       </button>
//       <div className={`overflow-hidden transition-all duration-500 ease-in-out ${open ? 'max-h-[500px] pb-6' : 'max-h-0'}`}>
//         <div className="text-gray-500 text-sm leading-relaxed font-light">{children}</div>
//       </div>
//     </div>
//   );
// };

// const ProductDetail = () => {
//   const { id } = useParams();
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [product, setProduct] = useState(null);
//   const [related, setRelated] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedImage, setSelectedImage] = useState(0);
//   const [lightboxOpen, setLightboxOpen] = useState(false);

//   useEffect(() => {
//     fetchProduct();
//     window.scrollTo(0, 0);
//   }, [id]);

//   const fetchProduct = async () => {
//     setLoading(true);
//     try {
//       const res = await api.get(`/products/${id}`);
//       setProduct(res.data);
//       const catId = res.data.category_id;
//       const relRes = await api.get(`/products?limit=12${catId ? `&category_id=${catId}` : ""}`);
//       setRelated(relRes.data.filter((p) => p.id !== res.data.id).slice(0, 8));
//     } catch { toast.error("Failed to load product"); }
//     finally { setLoading(false); }
//   };

//   const handleWhatsAppClick = async () => {
//     if (!user) {
//       navigate("/login", { state: { from: location.pathname, enquireProductId: id } });
//       return;
//     }
//     if (!product.whatsapp_number) return;
//     try {
//       await api.post("/enquiries", {
//         product_id: product.id,
//         e164_number: product.whatsapp_number.e164_number,
//         message_preview: `Interested in ${product.title}`,
//         source_url: window.location.href,
//       });
//     } catch {}
//     window.open(generateWhatsAppLink(product.whatsapp_number.e164_number, product), "_blank");
//   };

//   if (loading) return (
//     <div className="min-h-screen flex items-center justify-center bg-white">
//       <div className="w-12 h-12 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
//     </div>
//   );

//   if (!product) return null;

//   const images = product.images?.length > 0 ? product.images : [{ url: "https://via.placeholder.com/1200x1600" }];

//   return (
//     <div className="min-h-screen bg-[#FCFAF8] pb-20 md:pb-0">
//       <div className="container mx-auto px-6 md:px-12 lg:px-24 py-10">

//         {/* Navigation Breadcrumb */}
//         <div className="flex items-center gap-4 mb-12 group">
//           <Link to="/catalog" className="text-[10px] tracking-[0.3em] uppercase font-bold text-gray-400 hover:text-[#C5A059] flex items-center gap-2 transition-all">
//             <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" /> Back to Archive
//           </Link>
//           <div className="h-[1px] flex-1 bg-gray-100" />
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

//           {/* LEFT — GALLERY (7 Columns) */}
//           <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-6">
//             {/* Thumbnails Vertical */}
//             <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible scrollbar-hide py-2">
//               {images.map((img, idx) => (
//                 <button
//                   key={idx}
//                   onClick={() => setSelectedImage(idx)}
//                   className={`relative shrink-0 w-16 h-20 md:w-24 md:h-32 border overflow-hidden transition-all duration-500 shadow-sm ${selectedImage === idx ? 'border-[#C5A059] opacity-100' : 'border-transparent opacity-40 hover:opacity-80'}`}
//                 >
//                   <img src={img.url} className="w-full h-full object-cover" alt="Product view" />
//                 </button>
//               ))}
//             </div>

//             {/* Main Stage with Subtle Zoom */}
//             <div className="flex-1 relative aspect-[3/4] overflow-hidden bg-white shadow-sm group">
//               <img
//                 src={images[selectedImage].url}
//                 className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110 cursor-zoom-in"
//                 onClick={() => setLightboxOpen(true)}
//                 alt={product.title}
//               />
//               <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
//               <button
//                 onClick={() => setLightboxOpen(true)}
//                 className="absolute top-6 right-6 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#C5A059] hover:text-white"
//               >
//                 <Maximize2 className="w-4 h-4" />
//               </button>
//             </div>
//           </div>

//           {/* RIGHT — INFO (5 Columns) */}
//           <div className="lg:col-span-5 lg:sticky lg:top-24">
//             <div className="flex items-center gap-3 mb-6">
//               <Award className="w-4 h-4 text-[#C5A059]" />
//               <span className="text-[10px] tracking-[0.4em] font-bold text-[#C5A059] uppercase">Heritage Collection</span>
//             </div>

//             <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-light text-[#2C2C2C] mb-4 leading-tight">
//               {product.title}
//             </h1>

//             <div className="flex items-center gap-4 mb-8">
//                 <span className="text-gray-400 text-[10px] tracking-widest uppercase font-medium">SKU: {product.sku}</span>
//                 <div className="h-3 w-[1px] bg-gray-200" />
//                 <span className={`text-[10px] tracking-widest uppercase font-bold ${product.inventory?.quantity > 0 ? 'text-green-600' : 'text-red-500'}`}>
//                     {product.inventory?.quantity > 0 ? 'Available' : 'Sold Out'}
//                 </span>
//             </div>

//             <div className="flex items-baseline gap-4 mb-12">
//               <span className="text-4xl font-serif text-[#2C2C2C]">{formatPrice(product.final_price)}</span>
//               {product.discount?.active && (
//                 <span className="text-xl text-gray-300 line-through font-light">{formatPrice(product.base_price)}</span>
//               )}
//             </div>

//             {/* Premium CTA */}
//             <div className="space-y-4 mb-12">
//               <Button
//                 onClick={handleWhatsAppClick}
//                 className="w-full h-16 bg-[#2C2C2C] hover:bg-[#C5A059] text-white text-[11px] tracking-[0.25em] font-bold uppercase rounded-none transition-all duration-500 flex items-center justify-center gap-3 shadow-xl"
//               >
//                 <MessageCircle className="w-4 h-4" />
//                 Enquire via WhatsApp
//               </Button>
//               <p className="text-[9px] text-center text-gray-400 uppercase tracking-widest">
//                 Safe Payment • Pan-India Shipping • Premium Craftsmanship
//               </p>
//             </div>

//             {/* Informational Accordions */}
//             <div className="mt-12">
//               <Accordion title="The Story" defaultOpen={true}>
//                 {product.description || "Every thread of this masterpiece represents a legacy of Indian weaving, curated specifically for the modern connoisseur of tradition."}
//               </Accordion>
//               {product.saree_length && (
//                 <Accordion title="Specifications">
//                   <div className="grid grid-cols-2 gap-y-2">
//                     <span className="font-bold text-[#2C2C2C]">Saree Length:</span> <span>{product.saree_length}</span>
//                     <span className="font-bold text-[#2C2C2C]">Blouse:</span> <span>{product.blouse_length || "Not included"}</span>
//                   </div>
//                 </Accordion>
//               )}
//               <Accordion title="Care & Maintenance">
//                 {product.care_instruction || "Dry clean only recommended. Store in a cool, dry place wrapped in soft muslin to maintain the luster of the silk."}
//               </Accordion>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* LUXE LIGHTBOX */}
//       {lightboxOpen && (
//         <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300" onClick={() => setLightboxOpen(false)}>
//           <button className="absolute top-8 right-8 text-white hover:text-[#C5A059] transition-colors"><X className="w-8 h-8 font-light" /></button>
//           <img src={images[selectedImage].url} className="max-w-full max-h-full object-contain shadow-2xl" alt="Luxe view" onClick={(e) => e.stopPropagation()} />
//         </div>
//       )}

//       {/* MOBILE STICKY CONTACT */}
//       <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 z-[100] flex items-center justify-between shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
//         <div>
//            <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">Price</p>
//            <p className="text-xl font-serif text-[#2C2C2C]">{formatPrice(product.final_price)}</p>
//         </div>
//         <Button onClick={handleWhatsAppClick} className="bg-[#2C2C2C] px-10 rounded-none text-[10px] font-bold tracking-widest uppercase h-12 shadow-lg">
//           Enquire
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default ProductDetail;

import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  MessageCircle,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  X,
  Maximize2,
  Award,
} from "lucide-react";
import {
  formatPrice,
  maskPhoneNumber,
  generateWhatsAppLink,
} from "../lib/utils";
import api from "../lib/api.jsx";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";

const Accordion = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-t border-gray-100">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#2C2C2C] group-hover:text-[#C5A059] transition-colors">
          {title}
        </span>
        {open ? (
          <Minus className="w-3 h-3 text-gray-400" />
        ) : (
          <Plus className="w-3 h-3 text-gray-400" />
        )}
      </button>
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${open ? "max-h-[500px] pb-5" : "max-h-0"}`}
      >
        <div className="text-gray-500 text-sm leading-relaxed font-light">
          {children}
        </div>
      </div>
    </div>
  );
};

const ProductDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [relIdx, setRelIdx] = useState(0);

  useEffect(() => {
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/products/${id}`);
      setProduct(res.data);
      const catId = res.data.category_id;
      const relRes = await api.get(
        `/products?limit=12${catId ? `&category_id=${catId}` : ""}`,
      );
      setRelated(relRes.data.filter((p) => p.id !== res.data.id).slice(0, 8));
    } catch {
      toast.error("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppClick = async () => {
    if (!user) {
      navigate("/login", {
        state: { from: location.pathname, enquireProductId: id },
      });
      return;
    }
    if (!product.whatsapp_number) return;
    try {
      await api.post("/enquiries", {
        product_id: product.id,
        e164_number: product.whatsapp_number.e164_number,
        message_preview: `Interested in ${product.title}`,
        source_url: window.location.href,
      });
    } catch {}
    window.open(
      generateWhatsAppLink(product.whatsapp_number.e164_number, product),
      "_blank",
    );
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (!product) return null;

  const images =
    product.images?.length > 0
      ? product.images
      : [{ url: "https://via.placeholder.com/1200x1600" }];

  return (
    <div className="min-h-screen bg-[#FCFAF8] pb-24 md:pb-0">
      <div className="container mx-auto px-4 md:px-12 lg:px-24 py-6 md:py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-3 mb-8 md:mb-12">
          <Link
            to="/catalog"
            className="text-[10px] tracking-[0.3em] uppercase font-bold text-gray-400 hover:text-[#C5A059] flex items-center gap-2 transition-all"
          >
            <ArrowLeft className="w-3 h-3" /> Archive
          </Link>
          <div className="h-[1px] flex-1 bg-gray-100" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10 lg:gap-16 items-start">
          {/* GALLERY */}
          <div className="lg:col-span-7">
            {/* Main image */}
            <div className="relative aspect-[3/4] overflow-hidden bg-white shadow-sm group mb-3">
              <img
                src={images[selectedImage].url}
                className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105 cursor-zoom-in"
                onClick={() => setLightboxOpen(true)}
                alt={product.title}
              />
              <button
                onClick={() => setLightboxOpen(true)}
                className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#C5A059] hover:text-white"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              {/* Mobile prev/next arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setSelectedImage((i) =>
                        i > 0 ? i - 1 : images.length - 1,
                      )
                    }
                    className="md:hidden absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      setSelectedImage((i) =>
                        i < images.length - 1 ? i + 1 : 0,
                      )
                    }
                    className="md:hidden absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  {/* Dot indicators on mobile */}
                  <div className="md:hidden absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`rounded-full transition-all ${selectedImage === idx ? "w-4 h-1.5 bg-[#C5A059]" : "w-1.5 h-1.5 bg-white/60"}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail strip — hidden on mobile (using swipe arrows instead) */}
            {images.length > 1 && (
              <div className="hidden md:flex gap-3 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`shrink-0 w-20 h-24 border overflow-hidden transition-all duration-300 ${selectedImage === idx ? "border-[#C5A059] opacity-100" : "border-transparent opacity-40 hover:opacity-80"}`}
                  >
                    <img
                      src={img.url}
                      className="w-full h-full object-cover"
                      alt=""
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* INFO */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-4 h-4 text-[#C5A059]" />
              <span className="text-[10px] tracking-[0.4em] font-bold text-[#C5A059] uppercase">
                Heritage Collection
              </span>
            </div>

            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-light text-[#2C2C2C] mb-3 leading-tight">
              {product.title}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-gray-400 text-[10px] tracking-widest uppercase">
                SKU: {product.sku}
              </span>
              <div className="h-3 w-[1px] bg-gray-200" />
              <span
                className={`text-[10px] tracking-widest uppercase font-bold ${product.inventory?.quantity > 0 ? "text-green-600" : "text-red-500"}`}
              >
                {product.inventory?.quantity > 0 ? "Available" : "Sold Out"}
              </span>
            </div>

            <div className="flex items-baseline gap-3 mb-8">
              <span className="text-3xl md:text-4xl font-serif text-[#2C2C2C]">
                {formatPrice(product.final_price)}
              </span>
              {product.discount?.active && (
                <span className="text-lg text-gray-300 line-through font-light">
                  {formatPrice(product.base_price)}
                </span>
              )}
            </div>

            {/* CTA — visible on md+, hidden on mobile (sticky bar handles it) */}
            <div className="hidden md:block space-y-3 mb-10">
              <Button
                onClick={handleWhatsAppClick}
                className="w-full h-14 bg-[#2C2C2C] hover:bg-[#C5A059] text-white text-[11px] tracking-[0.25em] font-bold uppercase rounded-none transition-all duration-500 flex items-center justify-center gap-3 shadow-xl"
              >
                <MessageCircle className="w-4 h-4" />
                Enquire via WhatsApp
              </Button>
              <p className="text-[9px] text-center text-gray-400 uppercase tracking-widest">
                Safe Payment · Pan-India Shipping
              </p>
            </div>

            {/* Accordions */}
            <div>
              <Accordion title="The Story" defaultOpen={true}>
                {product.description ||
                  "Every thread of this masterpiece represents a legacy of Indian weaving, curated specifically for the modern connoisseur of tradition."}
              </Accordion>
              {product.saree_length && (
                <Accordion title="Specifications">
                  <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                    <span className="font-bold text-[#2C2C2C] text-xs">
                      Saree Length:
                    </span>
                    <span className="text-xs">{product.saree_length}</span>
                    <span className="font-bold text-[#2C2C2C] text-xs">
                      Blouse:
                    </span>
                    <span className="text-xs">
                      {product.blouse_length || "Not included"}
                    </span>
                  </div>
                </Accordion>
              )}
              <Accordion title="Care & Maintenance">
                {product.care_instruction ||
                  "Dry clean only recommended. Store in a cool, dry place wrapped in soft muslin."}
              </Accordion>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-16 md:mt-24">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="font-heading text-xl md:text-2xl font-light text-[#2C2C2C] whitespace-nowrap">
                You may also like
              </h2>
              <div className="h-[1px] flex-1 bg-gray-100" />
            </div>
            {/* Horizontal scroll on mobile, grid on desktop */}
            <div className="flex md:grid md:grid-cols-4 gap-4 md:gap-6 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory md:snap-none">
              {related.map((p) => {
                const cover = p.images?.[0]?.url;
                return (
                  <Link
                    key={p.id}
                    to={`/product/${p.id}`}
                    onClick={() => window.scrollTo(0, 0)}
                    className="shrink-0 w-[56vw] sm:w-[42vw] md:w-auto snap-start group"
                  >
                    <div className="aspect-[3/4] bg-[#F2F0EB] overflow-hidden mb-3">
                      {cover ? (
                        <img
                          src={cover}
                          alt={p.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                          No image
                        </div>
                      )}
                    </div>
                    <p className="text-[11px] font-bold tracking-widest uppercase text-gray-500 group-hover:text-[#C5A059] transition-colors truncate mb-1">
                      {p.title}
                    </p>
                    <p className="text-sm font-serif text-[#2C2C2C]">
                      {formatPrice(p.final_price)}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-6"
          onClick={() => setLightboxOpen(false)}
        >
          <button className="absolute top-4 right-4 md:top-8 md:right-8 text-white hover:text-[#C5A059] transition-colors z-10">
            <X className="w-7 h-7" />
          </button>
          <img
            src={images[selectedImage].url}
            className="max-w-full max-h-full object-contain shadow-2xl"
            alt="Full view"
            onClick={(e) => e.stopPropagation()}
          />
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage((i) => (i > 0 ? i - 1 : images.length - 1));
                }}
                className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage((i) => (i < images.length - 1 ? i + 1 : 0));
                }}
                className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </>
          )}
        </div>
      )}

      {/* Mobile sticky CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 z-[100] flex items-center justify-between shadow-[0_-8px_24px_rgba(0,0,0,0.06)]">
        <div>
          <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">
            Price
          </p>
          <p className="text-xl font-serif text-[#2C2C2C]">
            {formatPrice(product.final_price)}
          </p>
        </div>
        <Button
          onClick={handleWhatsAppClick}
          className="bg-[#2C2C2C] hover:bg-[#C5A059] px-8 rounded-none text-[10px] font-bold tracking-widest uppercase h-12 transition-all duration-300"
        >
          <MessageCircle className="w-4 h-4 mr-2" /> Enquire
        </Button>
      </div>
    </div>
  );
};

export default ProductDetail;