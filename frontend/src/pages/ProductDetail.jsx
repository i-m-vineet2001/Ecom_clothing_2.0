// import React, { useEffect, useState, useCallback } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
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
// import api from "../lib/api";
// import { toast } from "sonner";

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
//       {/* Image */}
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
//       {/* Info */}
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
//       // Fetch related (same category, exclude self)
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

//   // Carousel helpers
//   const VISIBLE = 3;
//   const maxIdx = Math.max(0, related.length - VISIBLE);
//   const prevCarousel = () => setCarouselIdx((i) => Math.max(0, i - 1));
//   const nextCarousel = () => setCarouselIdx((i) => Math.min(maxIdx, i + 1));

//   // Image nav helpers + keyboard — defined after images (see below in render)

//   // ── images defined early so nav helpers can use it ─────────────────────
//   const images =
//     product?.images?.length > 0
//       ? product.images
//       : [
//           {
//             url: "https://images.unsplash.com/photo-1683140426885-6c0ce899409c?w=1200",
//             alt: product?.title || "",
//           },
//         ];

//   // Image nav helpers — images is now defined above
//   const prevImage = () =>
//     setSelectedImage((i) => (i > 0 ? i - 1 : images.length - 1));
//   const nextImage = () =>
//     setSelectedImage((i) => (i < images.length - 1 ? i + 1 : 0));

//   // Keyboard nav for lightbox
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

//   // ── Loading ──────────────────────────────────────────────────────────────
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
//   // images already defined above

//   // Accordion visibility
//   const hasDescription = product.description || product.product_code;
//   const hasSizeFit = product.saree_length || product.blouse_length;
//   const hasCare = product.care_instruction;

//   return (
//     <div className="min-h-screen bg-white" data-testid="product-detail-page">
//       <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-10">
//         {/* Back */}
//         <Link
//           to="/catalog"
//           className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#C5A059] mb-8 transition-colors"
//           data-testid="back-button"
//         >
//           <ArrowLeft className="w-4 h-4" />
//           Back to Catalog
//         </Link>

//         {/* ── Two-column layout ──────────────────────────────── */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
//           {/* LEFT — Image gallery */}
//           <div className="space-y-3">
//             {/* ── Main image with prev/next arrows ──────────── */}
//             <div className="relative aspect-[3/4] bg-[#F2F0EB] overflow-hidden group">
//               <img
//                 src={images[selectedImage].url}
//                 alt={images[selectedImage].alt || product.title}
//                 className="w-full h-full object-cover cursor-zoom-in transition-transform duration-300 group-hover:scale-[1.02]"
//                 onClick={() => setLightboxOpen(true)}
//                 data-testid="main-product-image"
//               />

//               {/* Zoom hint */}
//               <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
//                 <ZoomIn className="w-4 h-4 text-[#2C2C2C]" />
//               </div>

//               {/* Prev / Next arrows — only if multiple images */}
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

//                   {/* Dot indicators */}
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

//             {/* ── Thumbnail strip ────────────────────────────── */}
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

//           {/* ── LIGHTBOX ─────────────────────────────────────── */}
//           {lightboxOpen && (
//             <div
//               className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
//               onClick={() => setLightboxOpen(false)}
//             >
//               {/* Close button */}
//               <button
//                 onClick={() => setLightboxOpen(false)}
//                 className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-10"
//               >
//                 <X className="w-6 h-6 text-white" />
//               </button>

//               {/* Counter */}
//               {images.length > 1 && (
//                 <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/10 text-white text-sm px-3 py-1 rounded-full">
//                   {selectedImage + 1} / {images.length}
//                 </div>
//               )}

//               {/* Main lightbox image */}
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

//               {/* Prev arrow */}
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

//                   {/* Thumbnail strip in lightbox */}
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
//             {/* Badges */}
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
//                 <Badge variant="destructive" data-testid="out-of-stock-badge">
//                   Out of Stock
//                 </Badge>
//               )}
//             </div>

//             {/* Title */}
//             <h1
//               className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-[#2C2C2C] mb-5"
//               data-testid="product-title"
//             >
//               {product.title}
//             </h1>

//             {/* Price */}
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

//             {/* SKU + Stock */}
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

//             {/* ── Accordions ──────────────────────────────────── */}
//             <div className="border-b border-gray-200">
//               {/* Description — always shown, open by default */}
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

//               {/* Size & Fit */}
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

//               {/* Care Instruction */}
//               {hasCare && (
//                 <Accordion title="Care Instruction" defaultOpen={false}>
//                   <p className="text-gray-600 leading-relaxed">
//                     {product.care_instruction}
//                   </p>
//                 </Accordion>
//               )}

//               {/* Always show if no fields filled at all — graceful fallback */}
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

//         {/* ── You May Also Like ──────────────────────────────── */}
//         {related.length > 0 && (
//           <div className="mt-20">
//             <h2 className="font-heading text-2xl font-semibold text-[#2C2C2C] mb-8">
//               You may also like
//             </h2>
//             <div className="relative">
//               {/* Carousel track */}
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

//               {/* Prev/Next buttons */}
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

import React, { useEffect, useState, useCallback } from "react";
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
  ZoomIn,
} from "lucide-react";
import {
  formatPrice,
  maskPhoneNumber,
  generateWhatsAppLink,
} from "../lib/utils";
import api from "../lib/api";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";

// ── Accordion Section ──────────────────────────────────────────────────────────
const Accordion = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-t border-gray-200">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="font-heading text-base font-semibold text-[#2C2C2C] group-hover:text-[#C5A059] transition-colors">
          {title}
        </span>
        {open ? (
          <Minus className="w-4 h-4 text-gray-400 shrink-0" />
        ) : (
          <Plus className="w-4 h-4 text-gray-400 shrink-0" />
        )}
      </button>
      {open && (
        <div className="pb-6 text-gray-700 text-sm leading-relaxed space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
          {children}
        </div>
      )}
    </div>
  );
};

// ── Related Product Card ───────────────────────────────────────────────────────
const RelatedCard = ({ product }) => {
  const navigate = useNavigate();
  const cover = product.images?.[0]?.url;
  const imgCount = product.images?.length ?? 0;
  const hasDiscount = product.discount?.active;

  return (
    <div
      onClick={() => {
        navigate(`/product/${product.id}`);
        window.scrollTo(0, 0);
      }}
      className="cursor-pointer group flex-shrink-0 w-[280px] md:w-[320px]"
    >
      <div className="relative aspect-[3/4] bg-[#F2F0EB] overflow-hidden mb-3">
        {cover ? (
          <img
            src={cover}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
            No image
          </div>
        )}
        {hasDiscount && (
          <span className="absolute top-3 left-3 bg-[#C5A059] text-white text-xs font-bold px-2 py-0.5">
            {product.discount.type === "percentage"
              ? `-${product.discount.value}%`
              : `-₹${product.discount.value}`}
          </span>
        )}
        {imgCount > 1 && (
          <div className="absolute bottom-3 right-3 flex gap-1">
            {product.images.slice(0, 3).map((img, i) => (
              <div
                key={i}
                className="w-8 h-8 border border-white overflow-hidden bg-[#F2F0EB]"
              >
                <img
                  src={img.url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {imgCount > 3 && (
              <div className="w-8 h-8 border border-white bg-black/50 flex items-center justify-center">
                <span className="text-white text-[9px] font-bold">
                  +{imgCount - 3}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
      <p className="font-heading text-sm font-semibold text-[#2C2C2C] group-hover:text-[#C5A059] transition-colors mb-1 line-clamp-1">
        {product.title}
      </p>
      <div className="flex items-baseline gap-2">
        <span className="text-sm font-bold text-[#2C2C2C]">
          {formatPrice(product.final_price)}
        </span>
        {hasDiscount && (
          <span className="text-xs text-gray-400 line-through">
            {formatPrice(product.base_price)}
          </span>
        )}
      </div>
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────────
const ProductDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    setSelectedImage(0);
    setCarouselIdx(0);
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
    // ── AUTH GATE ──────────────────────────────────────────
    if (!user) {
      navigate("/login", {
        state: {
          from: location.pathname,
          enquireProductId: product.id,
        },
      });
      return;
    }
    // ──────────────────────────────────────────────────────

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

  // Auto-trigger WhatsApp after returning from login
  useEffect(() => {
    if (user && product && location.state?.autoEnquire === product.id) {
      window.history.replaceState({}, "");
      handleWhatsAppClick();
    }
  }, [user, product]);

  const VISIBLE = 3;
  const maxIdx = Math.max(0, related.length - VISIBLE);
  const prevCarousel = () => setCarouselIdx((i) => Math.max(0, i - 1));
  const nextCarousel = () => setCarouselIdx((i) => Math.min(maxIdx, i + 1));

  const images =
    product?.images?.length > 0
      ? product.images
      : [
          {
            url: "https://images.unsplash.com/photo-1683140426885-6c0ce899409c?w=1200",
            alt: product?.title || "",
          },
        ];

  const prevImage = () =>
    setSelectedImage((i) => (i > 0 ? i - 1 : images.length - 1));
  const nextImage = () =>
    setSelectedImage((i) => (i < images.length - 1 ? i + 1 : 0));

  React.useEffect(() => {
    const handler = (e) => {
      if (!lightboxOpen) return;
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "Escape") setLightboxOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxOpen, images.length, selectedImage]);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        data-testid="loading-state"
      >
        <div className="w-8 h-8 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        data-testid="error-state"
      >
        <div className="text-center">
          <p className="text-xl text-gray-500 mb-4">Product not found</p>
          <Link to="/catalog">
            <Button>Back to Catalog</Button>
          </Link>
        </div>
      </div>
    );
  }

  const hasDiscount = product.discount?.active;
  const isInStock = product.inventory && product.inventory.quantity > 0;
  const hasDescription = product.description || product.product_code;
  const hasSizeFit = product.saree_length || product.blouse_length;
  const hasCare = product.care_instruction;

  return (
    <div className="min-h-screen bg-white" data-testid="product-detail-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-10">
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#C5A059] mb-8 transition-colors"
          data-testid="back-button"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Catalog
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          {/* LEFT — Image gallery */}
          <div className="space-y-3">
            <div className="relative aspect-[3/4] bg-[#F2F0EB] overflow-hidden group">
              <img
                src={images[selectedImage].url}
                alt={images[selectedImage].alt || product.title}
                className="w-full h-full object-cover cursor-zoom-in transition-transform duration-300 group-hover:scale-[1.02]"
                onClick={() => setLightboxOpen(true)}
                data-testid="main-product-image"
              />
              <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <ZoomIn className="w-4 h-4 text-[#2C2C2C]" />
              </div>
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-105"
                  >
                    <ChevronLeft className="w-5 h-5 text-[#2C2C2C]" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-105"
                  >
                    <ChevronRight className="w-5 h-5 text-[#2C2C2C]" />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedImage(idx);
                        }}
                        className={`rounded-full transition-all duration-200 ${
                          selectedImage === idx
                            ? "w-5 h-1.5 bg-white"
                            : "w-1.5 h-1.5 bg-white/50 hover:bg-white/80"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`shrink-0 w-20 h-20 bg-[#F2F0EB] overflow-hidden border-2 transition-all rounded-sm ${
                      selectedImage === idx
                        ? "border-[#C5A059] opacity-100"
                        : "border-transparent opacity-60 hover:opacity-100 hover:border-gray-300"
                    }`}
                    data-testid={`thumbnail-${idx}`}
                  >
                    <img
                      src={img.url}
                      alt={img.alt}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* LIGHTBOX */}
          {lightboxOpen && (
            <div
              className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
              onClick={() => setLightboxOpen(false)}
            >
              <button
                onClick={() => setLightboxOpen(false)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-10"
              >
                <X className="w-6 h-6 text-white" />
              </button>
              {images.length > 1 && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/10 text-white text-sm px-3 py-1 rounded-full">
                  {selectedImage + 1} / {images.length}
                </div>
              )}
              <div
                className="relative max-w-4xl max-h-[85vh] w-full mx-8 flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={images[selectedImage].url}
                  alt={images[selectedImage].alt || product.title}
                  className="max-w-full max-h-[85vh] object-contain select-none"
                />
              </div>
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center transition-colors"
                  >
                    <ChevronLeft className="w-7 h-7 text-white" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center transition-colors"
                  >
                    <ChevronRight className="w-7 h-7 text-white" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-2xl overflow-x-auto px-4">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedImage(idx);
                        }}
                        className={`shrink-0 w-14 h-14 overflow-hidden transition-all rounded-sm ${
                          selectedImage === idx
                            ? "ring-2 ring-[#C5A059] opacity-100"
                            : "opacity-40 hover:opacity-80"
                        }`}
                      >
                        <img
                          src={img.url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* RIGHT — Product info */}
          <div>
            <div className="flex gap-2 mb-4">
              {hasDiscount && (
                <Badge
                  className="bg-[#C5A059] text-white border-none"
                  data-testid="discount-badge"
                >
                  {product.discount.type === "percentage"
                    ? `-${product.discount.value}%`
                    : `-₹${product.discount.value}`}
                </Badge>
              )}
              {isInStock ? (
                <Badge
                  variant="outline"
                  className="border-green-500 text-green-700"
                  data-testid="in-stock-badge"
                >
                  In Stock
                </Badge>
              ) : (
                <Badge variant="destructive" data-testid="out-of-stock-badge">
                  Out of Stock
                </Badge>
              )}
            </div>

            <h1
              className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-[#2C2C2C] mb-5"
              data-testid="product-title"
            >
              {product.title}
            </h1>

            <div
              className="flex items-baseline gap-3 mb-6"
              data-testid="product-price"
            >
              {hasDiscount ? (
                <>
                  <span className="text-2xl font-bold text-[#2C2C2C]">
                    {formatPrice(product.final_price)}
                  </span>
                  <span className="text-lg text-gray-400 line-through">
                    {formatPrice(product.base_price)}
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold text-[#2C2C2C]">
                  {formatPrice(product.base_price)}
                </span>
              )}
            </div>

            <div className="flex gap-6 text-sm text-gray-500 mb-6">
              <span>
                <strong className="text-[#2C2C2C]">SKU:</strong> {product.sku}
              </span>
              {product.inventory && (
                <span>
                  <strong className="text-[#2C2C2C]">Stock:</strong>{" "}
                  {product.inventory.quantity} units
                </span>
              )}
            </div>

            {/* WhatsApp CTA */}
            {product.whatsapp_number && (
              <div className="bg-[#F9F8F5] border border-[#F2F0EB] p-5 rounded-sm mb-8">
                <h3 className="font-bold text-xs uppercase tracking-widest text-[#2C2C2C] mb-1">
                  Enquire About This Product
                </h3>
                <p
                  className="text-sm text-gray-500 mb-4"
                  data-testid="whatsapp-number"
                >
                  WhatsApp:{" "}
                  {maskPhoneNumber(product.whatsapp_number.e164_number)}
                </p>
                <Button
                  onClick={handleWhatsAppClick}
                  className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white flex items-center justify-center gap-2 py-3 font-semibold rounded-sm transition-colors"
                  data-testid="whatsapp-enquiry-button"
                >
                  <MessageCircle className="w-5 h-5" />
                  Enquire on WhatsApp
                </Button>
              </div>
            )}

            {/* Accordions */}
            <div className="border-b border-gray-200">
              {hasDescription && (
                <Accordion title="Description" defaultOpen={true}>
                  {product.product_code && (
                    <p className="text-sm">
                      <strong className="text-[#2C2C2C]">Product Code:</strong>{" "}
                      {product.product_code}
                    </p>
                  )}
                  {product.description && (
                    <p
                      className="text-gray-600 leading-relaxed"
                      data-testid="product-description"
                    >
                      {product.description}
                    </p>
                  )}
                </Accordion>
              )}
              {hasSizeFit && (
                <Accordion title="Size & Fit" defaultOpen={true}>
                  {product.saree_length && (
                    <p>
                      <strong className="text-[#2C2C2C]">Saree Length:</strong>{" "}
                      {product.saree_length}
                    </p>
                  )}
                  {product.blouse_length && (
                    <p>
                      <strong className="text-[#2C2C2C]">
                        Blouse Piece Length:
                      </strong>{" "}
                      {product.blouse_length}
                    </p>
                  )}
                </Accordion>
              )}
              {hasCare && (
                <Accordion title="Care Instruction" defaultOpen={false}>
                  <p className="text-gray-600 leading-relaxed">
                    {product.care_instruction}
                  </p>
                </Accordion>
              )}
              {!hasDescription &&
                !hasSizeFit &&
                !hasCare &&
                product.description && (
                  <Accordion title="Description" defaultOpen={true}>
                    <p className="text-gray-600 leading-relaxed">
                      {product.description}
                    </p>
                  </Accordion>
                )}
            </div>
          </div>
        </div>

        {/* You May Also Like */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="font-heading text-2xl font-semibold text-[#2C2C2C] mb-8">
              You may also like
            </h2>
            <div className="relative">
              <div className="overflow-hidden">
                <div
                  className="flex gap-5 transition-transform duration-400 ease-in-out"
                  style={{
                    transform: `translateX(calc(-${carouselIdx} * (320px + 20px)))`,
                  }}
                >
                  {related.map((p) => (
                    <RelatedCard key={p.id} product={p} />
                  ))}
                </div>
              </div>
              {carouselIdx > 0 && (
                <button
                  onClick={prevCarousel}
                  className="absolute left-0 top-[40%] -translate-y-1/2 -translate-x-4 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center hover:border-[#C5A059] hover:text-[#C5A059] transition-all z-10"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              {carouselIdx < maxIdx && (
                <button
                  onClick={nextCarousel}
                  className="absolute right-0 top-[40%] -translate-y-1/2 translate-x-4 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center hover:border-[#C5A059] hover:text-[#C5A059] transition-all z-10"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;