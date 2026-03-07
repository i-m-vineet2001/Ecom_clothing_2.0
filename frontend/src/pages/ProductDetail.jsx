// import React, { useEffect, useState, useCallback } from "react";
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
//   ZoomIn,
// } from "lucide-react";
// import {
//   formatPrice,
//   maskPhoneNumber,
//   generateWhatsAppLink,
// } from "../lib/utils";
// import api from "../lib/api.jsx";
// import { toast } from "sonner";
// import { useAuth } from "../contexts/AuthContext";

// // ── Accordion Section ──────────────────────────────────────────────────────────
// const Accordion = ({ title, children, defaultOpen = false }) => {
//   const [open, setOpen] = useState(defaultOpen);
//   return (
//     <div className="border-t border-gray-200">
//       <button
//         onClick={() => setOpen((o) => !o)}
//         className="w-full flex items-center justify-between py-5 text-left group"
//       >
//         <span className="font-heading text-base font-semibold text-[#2C2C2C] group-hover:text-[#C5A059] transition-colors">
//           {title}
//         </span>
//         {open ? (
//           <Minus className="w-4 h-4 text-gray-400 shrink-0" />
//         ) : (
//           <Plus className="w-4 h-4 text-gray-400 shrink-0" />
//         )}
//       </button>
//       {open && (
//         <div className="pb-6 text-gray-700 text-sm leading-relaxed space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
//           {children}
//         </div>
//       )}
//     </div>
//   );
// };

// // ── Related Product Card ───────────────────────────────────────────────────────
// const RelatedCard = ({ product }) => {
//   const navigate = useNavigate();
//   const cover = product.images?.[0]?.url;
//   const imgCount = product.images?.length ?? 0;
//   const hasDiscount = product.discount?.active;

//   return (
//     <div
//       onClick={() => {
//         navigate(`/product/${product.id}`);
//         window.scrollTo(0, 0);
//       }}
//       className="cursor-pointer group flex-shrink-0 w-[280px] md:w-[320px]"
//     >
//       <div className="relative aspect-[3/4] bg-[#F2F0EB] overflow-hidden mb-3">
//         {cover ? (
//           <img
//             src={cover}
//             alt={product.title}
//             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//           />
//         ) : (
//           <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
//             No image
//           </div>
//         )}
//         {hasDiscount && (
//           <span className="absolute top-3 left-3 bg-[#C5A059] text-white text-xs font-bold px-2 py-0.5">
//             {product.discount.type === "percentage"
//               ? `-${product.discount.value}%`
//               : `-₹${product.discount.value}`}
//           </span>
//         )}
//         {imgCount > 1 && (
//           <div className="absolute bottom-3 right-3 flex gap-1">
//             {product.images.slice(0, 3).map((img, i) => (
//               <div
//                 key={i}
//                 className="w-8 h-8 border border-white overflow-hidden bg-[#F2F0EB]"
//               >
//                 <img
//                   src={img.url}
//                   alt=""
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//             ))}
//             {imgCount > 3 && (
//               <div className="w-8 h-8 border border-white bg-black/50 flex items-center justify-center">
//                 <span className="text-white text-[9px] font-bold">
//                   +{imgCount - 3}
//                 </span>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//       <p className="font-heading text-sm font-semibold text-[#2C2C2C] group-hover:text-[#C5A059] transition-colors mb-1 line-clamp-1">
//         {product.title}
//       </p>
//       <div className="flex items-baseline gap-2">
//         <span className="text-sm font-bold text-[#2C2C2C]">
//           {formatPrice(product.final_price)}
//         </span>
//         {hasDiscount && (
//           <span className="text-xs text-gray-400 line-through">
//             {formatPrice(product.base_price)}
//           </span>
//         )}
//       </div>
//     </div>
//   );
// };

// // ── Main Component ─────────────────────────────────────────────────────────────
// const ProductDetail = () => {
//   const { id } = useParams();
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [product, setProduct] = useState(null);
//   const [related, setRelated] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedImage, setSelectedImage] = useState(0);
//   const [carouselIdx, setCarouselIdx] = useState(0);
//   const [lightboxOpen, setLightboxOpen] = useState(false);

//   useEffect(() => {
//     setSelectedImage(0);
//     setCarouselIdx(0);
//     fetchProduct();
//     window.scrollTo(0, 0);
//   }, [id]);

//   const fetchProduct = async () => {
//     setLoading(true);
//     try {
//       const res = await api.get(`/products/${id}`);
//       setProduct(res.data);
//       const catId = res.data.category_id;
//       const relRes = await api.get(
//         `/products?limit=12${catId ? `&category_id=${catId}` : ""}`,
//       );
//       setRelated(relRes.data.filter((p) => p.id !== res.data.id).slice(0, 8));
//     } catch {
//       toast.error("Failed to load product");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleWhatsAppClick = async () => {
//     // ── AUTH GATE ──────────────────────────────────────────
//     if (!user) {
//       navigate("/login", {
//         state: {
//           from: location.pathname,
//           enquireProductId: product.id,
//         },
//       });
//       return;
//     }
//     // ──────────────────────────────────────────────────────

//     if (!product.whatsapp_number) return;
//     try {
//       await api.post("/enquiries", {
//         product_id: product.id,
//         e164_number: product.whatsapp_number.e164_number,
//         message_preview: `Interested in ${product.title}`,
//         source_url: window.location.href,
//       });
//     } catch {}
//     window.open(
//       generateWhatsAppLink(product.whatsapp_number.e164_number, product),
//       "_blank",
//     );
//   };

//   // Auto-trigger WhatsApp after returning from login
//   useEffect(() => {
//     if (user && product && location.state?.autoEnquire === product.id) {
//       window.history.replaceState({}, "");
//       handleWhatsAppClick();
//     }
//   }, [user, product]);

//   const VISIBLE = 3;
//   const maxIdx = Math.max(0, related.length - VISIBLE);
//   const prevCarousel = () => setCarouselIdx((i) => Math.max(0, i - 1));
//   const nextCarousel = () => setCarouselIdx((i) => Math.min(maxIdx, i + 1));

//   const images =
//     product?.images?.length > 0
//       ? product.images
//       : [
//           {
//             url: "https://images.unsplash.com/photo-1683140426885-6c0ce899409c?w=1200",
//             alt: product?.title || "",
//           },
//         ];

//   const prevImage = () =>
//     setSelectedImage((i) => (i > 0 ? i - 1 : images.length - 1));
//   const nextImage = () =>
//     setSelectedImage((i) => (i < images.length - 1 ? i + 1 : 0));

//   React.useEffect(() => {
//     const handler = (e) => {
//       if (!lightboxOpen) return;
//       if (e.key === "ArrowLeft") prevImage();
//       if (e.key === "ArrowRight") nextImage();
//       if (e.key === "Escape") setLightboxOpen(false);
//     };
//     window.addEventListener("keydown", handler);
//     return () => window.removeEventListener("keydown", handler);
//   }, [lightboxOpen, images.length, selectedImage]);

//   if (loading) {
//     return (
//       <div
//         className="min-h-screen flex items-center justify-center"
//         data-testid="loading-state"
//       >
//         <div className="w-8 h-8 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
//       </div>
//     );
//   }

//   if (!product) {
//     return (
//       <div
//         className="min-h-screen flex items-center justify-center"
//         data-testid="error-state"
//       >
//         <div className="text-center">
//           <p className="text-xl text-gray-500 mb-4">Product not found</p>
//           <Link to="/catalog">
//             <Button>Back to Catalog</Button>
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   const hasDiscount = product.discount?.active;
//   const isInStock = product.inventory && product.inventory.quantity > 0;
//   const hasDescription = product.description || product.product_code;
//   const hasSizeFit = product.saree_length || product.blouse_length;
//   const hasCare = product.care_instruction;

//   return (
//     <div className="min-h-screen bg-white" data-testid="product-detail-page">
//       <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-10">
//         <Link
//           to="/catalog"
//           className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#C5A059] mb-8 transition-colors"
//           data-testid="back-button"
//         >
//           <ArrowLeft className="w-4 h-4" />
//           Back to Catalog
//         </Link>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
//           {/* LEFT — Image gallery */}
//           <div className="space-y-3">
//             <div className="relative aspect-[3/4] bg-[#F2F0EB] overflow-hidden group">
//               <img
//                 src={images[selectedImage].url}
//                 alt={images[selectedImage].alt || product.title}
//                 className="w-full h-full object-cover cursor-zoom-in transition-transform duration-300 group-hover:scale-[1.02]"
//                 onClick={() => setLightboxOpen(true)}
//                 data-testid="main-product-image"
//               />
//               <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
//                 <ZoomIn className="w-4 h-4 text-[#2C2C2C]" />
//               </div>
//               {images.length > 1 && (
//                 <>
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       prevImage();
//                     }}
//                     className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-105"
//                   >
//                     <ChevronLeft className="w-5 h-5 text-[#2C2C2C]" />
//                   </button>
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       nextImage();
//                     }}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-105"
//                   >
//                     <ChevronRight className="w-5 h-5 text-[#2C2C2C]" />
//                   </button>
//                   <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
//                     {images.map((_, idx) => (
//                       <button
//                         key={idx}
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           setSelectedImage(idx);
//                         }}
//                         className={`rounded-full transition-all duration-200 ${
//                           selectedImage === idx
//                             ? "w-5 h-1.5 bg-white"
//                             : "w-1.5 h-1.5 bg-white/50 hover:bg-white/80"
//                         }`}
//                       />
//                     ))}
//                   </div>
//                 </>
//               )}
//             </div>

//             {images.length > 1 && (
//               <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
//                 {images.map((img, idx) => (
//                   <button
//                     key={idx}
//                     onClick={() => setSelectedImage(idx)}
//                     className={`shrink-0 w-20 h-20 bg-[#F2F0EB] overflow-hidden border-2 transition-all rounded-sm ${
//                       selectedImage === idx
//                         ? "border-[#C5A059] opacity-100"
//                         : "border-transparent opacity-60 hover:opacity-100 hover:border-gray-300"
//                     }`}
//                     data-testid={`thumbnail-${idx}`}
//                   >
//                     <img
//                       src={img.url}
//                       alt={img.alt}
//                       className="w-full h-full object-cover"
//                     />
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* LIGHTBOX */}
//           {lightboxOpen && (
//             <div
//               className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
//               onClick={() => setLightboxOpen(false)}
//             >
//               <button
//                 onClick={() => setLightboxOpen(false)}
//                 className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-10"
//               >
//                 <X className="w-6 h-6 text-white" />
//               </button>
//               {images.length > 1 && (
//                 <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/10 text-white text-sm px-3 py-1 rounded-full">
//                   {selectedImage + 1} / {images.length}
//                 </div>
//               )}
//               <div
//                 className="relative max-w-4xl max-h-[85vh] w-full mx-8 flex items-center justify-center"
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 <img
//                   src={images[selectedImage].url}
//                   alt={images[selectedImage].alt || product.title}
//                   className="max-w-full max-h-[85vh] object-contain select-none"
//                 />
//               </div>
//               {images.length > 1 && (
//                 <>
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       prevImage();
//                     }}
//                     className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center transition-colors"
//                   >
//                     <ChevronLeft className="w-7 h-7 text-white" />
//                   </button>
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       nextImage();
//                     }}
//                     className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center transition-colors"
//                   >
//                     <ChevronRight className="w-7 h-7 text-white" />
//                   </button>
//                   <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-2xl overflow-x-auto px-4">
//                     {images.map((img, idx) => (
//                       <button
//                         key={idx}
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           setSelectedImage(idx);
//                         }}
//                         className={`shrink-0 w-14 h-14 overflow-hidden transition-all rounded-sm ${
//                           selectedImage === idx
//                             ? "ring-2 ring-[#C5A059] opacity-100"
//                             : "opacity-40 hover:opacity-80"
//                         }`}
//                       >
//                         <img
//                           src={img.url}
//                           alt=""
//                           className="w-full h-full object-cover"
//                         />
//                       </button>
//                     ))}
//                   </div>
//                 </>
//               )}
//             </div>
//           )}

//           {/* RIGHT — Product info */}
//           <div>
//             <div className="flex gap-2 mb-4">
//               {hasDiscount && (
//                 <Badge
//                   className="bg-[#C5A059] text-white border-none"
//                   data-testid="discount-badge"
//                 >
//                   {product.discount.type === "percentage"
//                     ? `-${product.discount.value}%`
//                     : `-₹${product.discount.value}`}
//                 </Badge>
//               )}
//               {isInStock ? (
//                 <Badge
//                   variant="outline"
//                   className="border-green-500 text-green-700"
//                   data-testid="in-stock-badge"
//                 >
//                   In Stock
//                 </Badge>
//               ) : (
//                 <Badge variant="inline"
//                 data-testid="out-of-stock-badge"
//                 className = "text-red border-red"
//                 >
//                   Out of Stock
//                 </Badge>
//               )}
//             </div>

//             <h1
//               className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-[#2C2C2C] mb-5"
//               data-testid="product-title"
//             >
//               {product.title}
//             </h1>

//             <div
//               className="flex items-baseline gap-3 mb-6"
//               data-testid="product-price"
//             >
//               {hasDiscount ? (
//                 <>
//                   <span className="text-2xl font-bold text-[#2C2C2C]">
//                     {formatPrice(product.final_price)}
//                   </span>
//                   <span className="text-lg text-gray-400 line-through">
//                     {formatPrice(product.base_price)}
//                   </span>
//                 </>
//               ) : (
//                 <span className="text-2xl font-bold text-[#2C2C2C]">
//                   {formatPrice(product.base_price)}
//                 </span>
//               )}
//             </div>

//             <div className="flex gap-6 text-sm text-gray-500 mb-6">
//               <span>
//                 <strong className="text-[#2C2C2C]">SKU:</strong> {product.sku}
//               </span>
//               {product.inventory && (
//                 <span>
//                   <strong className="text-[#2C2C2C]">Stock:</strong>{" "}
//                   {product.inventory.quantity} units
//                 </span>
//               )}
//             </div>

//             {/* WhatsApp CTA */}
//             {product.whatsapp_number && (
//               <div className="bg-[#F9F8F5] border border-[#F2F0EB] p-5 rounded-sm mb-8">
//                 <h3 className="font-bold text-xs uppercase tracking-widest text-[#2C2C2C] mb-1">
//                   Enquire About This Product
//                 </h3>
//                 <p
//                   className="text-sm text-gray-500 mb-4"
//                   data-testid="whatsapp-number"
//                 >
//                   WhatsApp:{" "}
//                   {maskPhoneNumber(product.whatsapp_number.e164_number)}
//                 </p>
//                 <Button
//                   onClick={handleWhatsAppClick}
//                   className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white flex items-center justify-center gap-2 py-3 font-semibold rounded-sm transition-colors"
//                   data-testid="whatsapp-enquiry-button"
//                 >
//                   <MessageCircle className="w-5 h-5" />
//                   Enquire on WhatsApp
//                 </Button>
//               </div>
//             )}

//             {/* Accordions */}
//             <div className="border-b border-gray-200">
//               {hasDescription && (
//                 <Accordion title="Description" defaultOpen={true}>
//                   {product.product_code && (
//                     <p className="text-sm">
//                       <strong className="text-[#2C2C2C]">Product Code:</strong>{" "}
//                       {product.product_code}
//                     </p>
//                   )}
//                   {product.description && (
//                     <p
//                       className="text-gray-600 leading-relaxed"
//                       data-testid="product-description"
//                     >
//                       {product.description}
//                     </p>
//                   )}
//                 </Accordion>
//               )}
//               {hasSizeFit && (
//                 <Accordion title="Size & Fit" defaultOpen={true}>
//                   {product.saree_length && (
//                     <p>
//                       <strong className="text-[#2C2C2C]">Saree Length:</strong>{" "}
//                       {product.saree_length}
//                     </p>
//                   )}
//                   {product.blouse_length && (
//                     <p>
//                       <strong className="text-[#2C2C2C]">
//                         Blouse Piece Length:
//                       </strong>{" "}
//                       {product.blouse_length}
//                     </p>
//                   )}
//                 </Accordion>
//               )}
//               {hasCare && (
//                 <Accordion title="Care Instruction" defaultOpen={false}>
//                   <p className="text-gray-600 leading-relaxed">
//                     {product.care_instruction}
//                   </p>
//                 </Accordion>
//               )}
//               {!hasDescription &&
//                 !hasSizeFit &&
//                 !hasCare &&
//                 product.description && (
//                   <Accordion title="Description" defaultOpen={true}>
//                     <p className="text-gray-600 leading-relaxed">
//                       {product.description}
//                     </p>
//                   </Accordion>
//                 )}
//             </div>
//           </div>
//         </div>

//         {/* You May Also Like */}
//         {related.length > 0 && (
//           <div className="mt-20">
//             <h2 className="font-heading text-2xl font-semibold text-[#2C2C2C] mb-8">
//               You may also like
//             </h2>
//             <div className="relative">
//               <div className="overflow-hidden">
//                 <div
//                   className="flex gap-5 transition-transform duration-400 ease-in-out"
//                   style={{
//                     transform: `translateX(calc(-${carouselIdx} * (320px + 20px)))`,
//                   }}
//                 >
//                   {related.map((p) => (
//                     <RelatedCard key={p.id} product={p} />
//                   ))}
//                 </div>
//               </div>
//               {carouselIdx > 0 && (
//                 <button
//                   onClick={prevCarousel}
//                   className="absolute left-0 top-[40%] -translate-y-1/2 -translate-x-4 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center hover:border-[#C5A059] hover:text-[#C5A059] transition-all z-10"
//                 >
//                   <ChevronLeft className="w-5 h-5" />
//                 </button>
//               )}
//               {carouselIdx < maxIdx && (
//                 <button
//                   onClick={nextCarousel}
//                   className="absolute right-0 top-[40%] -translate-y-1/2 translate-x-4 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center hover:border-[#C5A059] hover:text-[#C5A059] transition-all z-10"
//                 >
//                   <ChevronRight className="w-5 h-5" />
//                 </button>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProductDetail;



import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  X,
  Maximize2,
  ShieldCheck,
  Award,
} from "lucide-react";
import { formatPrice, maskPhoneNumber, generateWhatsAppLink } from "../lib/utils";
import api from "../lib/api.jsx";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";

// --- Stylized Boutique Accordion ---
const Accordion = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-t border-gray-100">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-6 text-left group"
      >
        <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#2C2C2C] group-hover:text-[#C5A059] transition-colors">
          {title}
        </span>
        {open ? <Minus className="w-3 h-3 text-gray-400" /> : <Plus className="w-3 h-3 text-gray-400" />}
      </button>
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${open ? 'max-h-[500px] pb-6' : 'max-h-0'}`}>
        <div className="text-gray-500 text-sm leading-relaxed font-light">{children}</div>
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
      const relRes = await api.get(`/products?limit=12${catId ? `&category_id=${catId}` : ""}`);
      setRelated(relRes.data.filter((p) => p.id !== res.data.id).slice(0, 8));
    } catch { toast.error("Failed to load product"); }
    finally { setLoading(false); }
  };

  const handleWhatsAppClick = async () => {
    if (!user) {
      navigate("/login", { state: { from: location.pathname, enquireProductId: id } });
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
    window.open(generateWhatsAppLink(product.whatsapp_number.e164_number, product), "_blank");
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-12 h-12 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!product) return null;

  const images = product.images?.length > 0 ? product.images : [{ url: "https://via.placeholder.com/1200x1600" }];

  return (
    <div className="min-h-screen bg-[#FCFAF8] pb-20 md:pb-0">
      <div className="container mx-auto px-6 md:px-12 lg:px-24 py-10">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-4 mb-12 group">
          <Link to="/catalog" className="text-[10px] tracking-[0.3em] uppercase font-bold text-gray-400 hover:text-[#C5A059] flex items-center gap-2 transition-all">
            <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" /> Back to Archive
          </Link>
          <div className="h-[1px] flex-1 bg-gray-100" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* LEFT — GALLERY (7 Columns) */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-6">
            {/* Thumbnails Vertical */}
            <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible scrollbar-hide py-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative shrink-0 w-16 h-20 md:w-24 md:h-32 border overflow-hidden transition-all duration-500 shadow-sm ${selectedImage === idx ? 'border-[#C5A059] opacity-100' : 'border-transparent opacity-40 hover:opacity-80'}`}
                >
                  <img src={img.url} className="w-full h-full object-cover" alt="Product view" />
                </button>
              ))}
            </div>
            
            {/* Main Stage with Subtle Zoom */}
            <div className="flex-1 relative aspect-[3/4] overflow-hidden bg-white shadow-sm group">
              <img
                src={images[selectedImage].url}
                className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110 cursor-zoom-in"
                onClick={() => setLightboxOpen(true)}
                alt={product.title}
              />
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <button 
                onClick={() => setLightboxOpen(true)}
                className="absolute top-6 right-6 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#C5A059] hover:text-white"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* RIGHT — INFO (5 Columns) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-4 h-4 text-[#C5A059]" />
              <span className="text-[10px] tracking-[0.4em] font-bold text-[#C5A059] uppercase">Heritage Collection</span>
            </div>

            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-light text-[#2C2C2C] mb-4 leading-tight">
              {product.title}
            </h1>
            
            <div className="flex items-center gap-4 mb-8">
                <span className="text-gray-400 text-[10px] tracking-widest uppercase font-medium">SKU: {product.sku}</span>
                <div className="h-3 w-[1px] bg-gray-200" />
                <span className={`text-[10px] tracking-widest uppercase font-bold ${product.inventory?.quantity > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {product.inventory?.quantity > 0 ? 'Available' : 'Sold Out'}
                </span>
            </div>

            <div className="flex items-baseline gap-4 mb-12">
              <span className="text-4xl font-serif text-[#2C2C2C]">{formatPrice(product.final_price)}</span>
              {product.discount?.active && (
                <span className="text-xl text-gray-300 line-through font-light">{formatPrice(product.base_price)}</span>
              )}
            </div>

            {/* Premium CTA */}
            <div className="space-y-4 mb-12">
              <Button
                onClick={handleWhatsAppClick}
                className="w-full h-16 bg-[#2C2C2C] hover:bg-[#C5A059] text-white text-[11px] tracking-[0.25em] font-bold uppercase rounded-none transition-all duration-500 flex items-center justify-center gap-3 shadow-xl"
              >
                <MessageCircle className="w-4 h-4" />
                Enquire via WhatsApp
              </Button>
              <p className="text-[9px] text-center text-gray-400 uppercase tracking-widest">
                Safe Payment • Pan-India Shipping • Premium Craftsmanship
              </p>
            </div>

            {/* Informational Accordions */}
            <div className="mt-12">
              <Accordion title="The Story" defaultOpen={true}>
                {product.description || "Every thread of this masterpiece represents a legacy of Indian weaving, curated specifically for the modern connoisseur of tradition."}
              </Accordion>
              {product.saree_length && (
                <Accordion title="Specifications">
                  <div className="grid grid-cols-2 gap-y-2">
                    <span className="font-bold text-[#2C2C2C]">Saree Length:</span> <span>{product.saree_length}</span>
                    <span className="font-bold text-[#2C2C2C]">Blouse:</span> <span>{product.blouse_length || "Not included"}</span>
                  </div>
                </Accordion>
              )}
              <Accordion title="Care & Maintenance">
                {product.care_instruction || "Dry clean only recommended. Store in a cool, dry place wrapped in soft muslin to maintain the luster of the silk."}
              </Accordion>
            </div>
          </div>
        </div>
      </div>

      {/* LUXE LIGHTBOX */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300" onClick={() => setLightboxOpen(false)}>
          <button className="absolute top-8 right-8 text-white hover:text-[#C5A059] transition-colors"><X className="w-8 h-8 font-light" /></button>
          <img src={images[selectedImage].url} className="max-w-full max-h-full object-contain shadow-2xl" alt="Luxe view" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      {/* MOBILE STICKY CONTACT */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 z-[100] flex items-center justify-between shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <div>
           <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">Price</p>
           <p className="text-xl font-serif text-[#2C2C2C]">{formatPrice(product.final_price)}</p>
        </div>
        <Button onClick={handleWhatsAppClick} className="bg-[#2C2C2C] px-10 rounded-none text-[10px] font-bold tracking-widest uppercase h-12 shadow-lg">
          Enquire
        </Button>
      </div>
    </div>
  );
};

export default ProductDetail;