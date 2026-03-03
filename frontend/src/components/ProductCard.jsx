import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  formatPrice,
  maskPhoneNumber,
  generateWhatsAppLink,
} from "../lib/utils";
import api from "../lib/api";
import { toast } from "sonner";

const FALLBACK =
  "https://images.unsplash.com/photo-1683140426885-6c0ce899409c?w=800";

const ProductCard = ({ product }) => {
  const hasDiscount = product.discount && product.discount.active;
  const isInStock = product.inventory && product.inventory.quantity > 0;

  // All images; fallback to single placeholder
  const images =
    product.images && product.images.length > 0
      ? product.images
      : [{ url: FALLBACK, alt: product.title }];

  const [activeIdx, setActiveIdx] = useState(0);
  const intervalRef = useRef(null);

  const handleMouseEnter = () => {
    if (images.length < 2) return;
    let idx = 0;
    // Start cycling immediately
    intervalRef.current = setInterval(() => {
      idx = (idx + 1) % images.length;
      setActiveIdx(idx);
    }, 1200); // change image every 700ms
  };

  const handleMouseLeave = () => {
    clearInterval(intervalRef.current);
    setActiveIdx(0); // reset to cover image
  };

  const handleWhatsAppClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.whatsapp_number) {
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
    } else {
      toast.error("WhatsApp number not available");
    }
  };

  return (
    <div
      className="group relative bg-white"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-testid="product-card"
    >
      {/* Image area */}
      <Link
        to={`/product/${product.id}`}
        className="block aspect-[3/4] overflow-hidden bg-[#F2F0EB] relative"
      >
        {/* Stack both images, cross-fade on hover */}
        {images.slice(0, 2).map((img, idx) => (
          <img
            key={idx}
            src={img.url}
            alt={img.alt || product.title}
            className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-500 ${
              activeIdx === idx ? "opacity-100" : "opacity-0"
            }`}
            data-testid={idx === 0 ? "product-image" : undefined}
          />
        ))}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {hasDiscount && (
            <Badge
              className="bg-[#C5A059] text-white border-none text-[10px] px-2 py-0.5"
              data-testid="discount-badge"
            >
              {product.discount.type === "percentage"
                ? `-${product.discount.value}%`
                : `-\u20b9${product.discount.value}`}
            </Badge>
          )}
          {!isInStock && (
            <Badge
              // variant="destructive"
              // className="text-[10px] px-2 py-0.5"
              // data-testid="out-of-stock-badge"
              className="bg-red-600 text-white border-none text-[10px] px-2 py-0.5"
              data-testid="out-of-stock-badge"
            >
              Out of Stock
            </Badge>
          )}
        </div>

        {/* Image count badge */}
        {images.length > 2 && (
          <div className="absolute top-3 right-3 bg-black/50 text-white text-[10px] font-bold px-2 py-0.5 z-10">
            +{images.length - 1}
          </div>
        )}
      </Link>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-1.5 mt-2 overflow-x-auto">
          {images.slice(0, 4).map((img, idx) => (
            <button
              key={idx}
              onMouseEnter={() => setActiveIdx(idx)}
              onMouseLeave={() => {}}
              onClick={(e) => {
                e.preventDefault();
                setActiveIdx(idx);
              }}
              className={`shrink-0 w-10 h-10 overflow-hidden border transition-all duration-150 ${
                activeIdx === idx
                  ? "border-[#C5A059] opacity-100"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={img.url}
                alt=""
                className="w-full h-full object-cover object-top"
              />
            </button>
          ))}
          {images.length > 4 && (
            <div className="shrink-0 w-10 h-10 bg-[#F2F0EB] flex items-center justify-center">
              <span className="text-[9px] font-bold text-gray-500">
                +{images.length - 4}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Product info */}
      <div className="pt-3 pb-2">
        <Link to={`/product/${product.id}`}>
          <h3
            className="font-heading text-base text-gray-900 hover:text-[#C5A059] transition-colors mb-1.5 leading-snug"
            data-testid="product-title"
          >
            {product.title}
          </h3>
        </Link>

        <div
          className="flex items-baseline gap-2 mb-3"
          data-testid="product-price"
        >
          {hasDiscount ? (
            <>
              <span className="text-base font-bold text-[#2C2C2C]">
                {formatPrice(product.final_price)}
              </span>
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.base_price)}
              </span>
            </>
          ) : (
            <span className="text-base font-bold text-[#2C2C2C]">
              {formatPrice(product.base_price)}
            </span>
          )}
        </div>

        {product.whatsapp_number && (
          <div className="space-y-1.5">
            <div
              className="text-xs text-gray-400"
              data-testid="whatsapp-number"
            >
              WhatsApp: {maskPhoneNumber(product.whatsapp_number.e164_number)}
            </div>
            <Button
              onClick={handleWhatsAppClick}
              className="w-full bg-[#25D366] text-white hover:bg-[#128C7E] flex items-center justify-center gap-2 py-2.5 rounded-none font-medium text-sm transition-colors"
              data-testid="whatsapp-enquiry-button"
            >
              <MessageCircle className="w-4 h-4" />
              Enquire on WhatsApp
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;

// import React, { useState, useRef } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { MessageCircle } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   formatPrice,
//   maskPhoneNumber,
//   generateWhatsAppLink,
// } from "../lib/utils";
// import api from "../lib/api.jsx";
// import { toast } from "sonner";
// import { useAuth } from "../contexts/AuthContext";

// const FALLBACK =
//   "https://images.unsplash.com/photo-1683140426885-6c0ce899409c?w=800";

// const ProductCard = ({ product }) => {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const hasDiscount = product.discount && product.discount.active;
//   const isInStock = product.inventory && product.inventory.quantity > 0;

//   const images =
//     product.images && product.images.length > 0
//       ? product.images
//       : [{ url: FALLBACK, alt: product.title }];

//   const [activeIdx, setActiveIdx] = useState(0);
//   const intervalRef = useRef(null);

//   const handleMouseEnter = () => {
//     if (images.length < 2) return;
//     let idx = 0;
//     intervalRef.current = setInterval(() => {
//       idx = (idx + 1) % images.length;
//       setActiveIdx(idx);
//     }, 1200);
//   };

//   const handleMouseLeave = () => {
//     clearInterval(intervalRef.current);
//     setActiveIdx(0);
//   };

//   const handleWhatsAppClick = async (e) => {
//     e.preventDefault();
//     e.stopPropagation();

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

//     if (product.whatsapp_number) {
//       try {
//         await api.post("/enquiries", {
//           product_id: product.id,
//           e164_number: product.whatsapp_number.e164_number,
//           message_preview: `Interested in ${product.title}`,
//           source_url: window.location.href,
//         });
//       } catch {}
//       window.open(
//         generateWhatsAppLink(product.whatsapp_number.e164_number, product),
//         "_blank",
//       );
//     } else {
//       toast.error("WhatsApp number not available");
//     }
//   };

//   return (
//     <div
//       className="group relative bg-white"
//       onMouseEnter={handleMouseEnter}
//       onMouseLeave={handleMouseLeave}
//       data-testid="product-card"
//     >
//       {/* Image area */}
//       <Link
//         to={`/product/${product.id}`}
//         className="block aspect-[3/4] overflow-hidden bg-[#F2F0EB] relative"
//       >
//         {images.slice(0, 2).map((img, idx) => (
//           <img
//             key={idx}
//             src={img.url}
//             alt={img.alt || product.title}
//             className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-500 ${
//               activeIdx === idx ? "opacity-100" : "opacity-0"
//             }`}
//             data-testid={idx === 0 ? "product-image" : undefined}
//           />
//         ))}

//         <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
//           {hasDiscount && (
//             <Badge
//               className="bg-[#C5A059] text-white border-none text-[10px] px-2 py-0.5"
//               data-testid="discount-badge"
//             >
//               {product.discount.type === "percentage"
//                 ? `-${product.discount.value}%`
//                 : `-₹${product.discount.value}`}
//             </Badge>
//           )}
//           {!isInStock && (
//             <Badge
//               variant="destructive"
//               className="text-[10px] px-2 py-0.5"
//               data-testid="out-of-stock-badge"
//             >
//               Out of Stock
//             </Badge>
//           )}
//         </div>

//         {images.length > 2 && (
//           <div className="absolute top-3 right-3 bg-black/50 text-white text-[10px] font-bold px-2 py-0.5 z-10">
//             +{images.length - 1}
//           </div>
//         )}
//       </Link>

//       {/* Thumbnail strip */}
//       {images.length > 1 && (
//         <div className="flex gap-1.5 mt-2 overflow-x-auto">
//           {images.slice(0, 4).map((img, idx) => (
//             <button
//               key={idx}
//               onMouseEnter={() => setActiveIdx(idx)}
//               onMouseLeave={() => {}}
//               onClick={(e) => {
//                 e.preventDefault();
//                 setActiveIdx(idx);
//               }}
//               className={`shrink-0 w-10 h-10 overflow-hidden border transition-all duration-150 ${
//                 activeIdx === idx
//                   ? "border-[#C5A059] opacity-100"
//                   : "border-transparent opacity-60 hover:opacity-100"
//               }`}
//             >
//               <img
//                 src={img.url}
//                 alt=""
//                 className="w-full h-full object-cover object-top"
//               />
//             </button>
//           ))}
//           {images.length > 4 && (
//             <div className="shrink-0 w-10 h-10 bg-[#F2F0EB] flex items-center justify-center">
//               <span className="text-[9px] font-bold text-gray-500">
//                 +{images.length - 4}
//               </span>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Product info */}
//       <div className="pt-3 pb-2">
//         <Link to={`/product/${product.id}`}>
//           <h3
//             className="font-heading text-base text-gray-900 hover:text-[#C5A059] transition-colors mb-1.5 leading-snug"
//             data-testid="product-title"
//           >
//             {product.title}
//           </h3>
//         </Link>

//         <div
//           className="flex items-baseline gap-2 mb-3"
//           data-testid="product-price"
//         >
//           {hasDiscount ? (
//             <>
//               <span className="text-base font-bold text-[#2C2C2C]">
//                 {formatPrice(product.final_price)}
//               </span>
//               <span className="text-sm text-gray-400 line-through">
//                 {formatPrice(product.base_price)}
//               </span>
//             </>
//           ) : (
//             <span className="text-base font-bold text-[#2C2C2C]">
//               {formatPrice(product.base_price)}
//             </span>
//           )}
//         </div>

//         {product.whatsapp_number && (
//           <div className="space-y-1.5">
//             <div
//               className="text-xs text-gray-400"
//               data-testid="whatsapp-number"
//             >
//               WhatsApp: {maskPhoneNumber(product.whatsapp_number.e164_number)}
//             </div>
//             <Button
//               onClick={handleWhatsAppClick}
//               className="w-full bg-[#25D366] text-white hover:bg-[#128C7E] flex items-center justify-center gap-2 py-2.5 rounded-none font-medium text-sm transition-colors"
//               data-testid="whatsapp-enquiry-button"
//             >
//               <MessageCircle className="w-4 h-4" />
//               Enquire on WhatsApp
//             </Button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProductCard;