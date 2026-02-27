// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { MessageCircle } from "lucide-react";
// import { Button } from "@/Components/ui/button";
// import { Badge } from "@/Components/ui/badge";
// import {
//   formatPrice,
//   maskPhoneNumber,
//   generateWhatsAppLink,
// } from "../lib/utils";
// import api from "../lib/api";
// import { toast } from "sonner";

// const ProductCard = ({ product }) => {
//   const hasDiscount = product.discount && product.discount.active;
//   const isInStock = product.inventory && product.inventory.quantity > 0;
//   const mainImage =
//     product.images && product.images.length > 0
//       ? product.images[0].url
//       : "https://images.unsplash.com/photo-1683140426885-6c0ce899409c?w=800";

//   const handleWhatsAppClick = async () => {
//     if (product.whatsapp_number) {
//       try {
//         await api.post("/enquiries", {
//           product_id: product.id,
//           e164_number: product.whatsapp_number.e164_number,
//           message_preview: `Interested in ${product.title}`,
//           source_url: window.location.href,
//         });
//       } catch (error) {
//         console.error("Failed to log enquiry:", error);
//       }
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
//       className="group relative bg-white border border-transparent hover:border-[#F2F0EB] transition-all duration-500 overflow-hidden"
//       data-testid="product-card"
//     >
//       {/* Product Image */}
//       <Link
//         to={`/product/${product.id}`}
//         className="block aspect-[3/4] overflow-hidden bg-[#F2F0EB]"
//       >
//         <img
//           src={mainImage}
//           alt={product.title}
//           className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
//           data-testid="product-image"
//         />
//       </Link>

//       {/* Badges */}
//       <div className="absolute top-4 left-4 flex flex-col gap-2">
//         {hasDiscount && (
//           <Badge
//             className="bg-[#C5A059] text-white border-none"
//             data-testid="discount-badge"
//           >
//             {product.discount.type === "percentage"
//               ? `-${product.discount.value}%`
//               : `-₹${product.discount.value}`}
//           </Badge>
//         )}
//         {!isInStock && (
//           <Badge variant="destructive" data-testid="out-of-stock-badge">
//             Out of Stock
//           </Badge>
//         )}
//       </div>

//       {/* Product Info */}
//       <div className="pt-4 pb-2 px-4">
//         <Link to={`/product/${product.id}`}>
//           <h3
//             className="font-heading text-lg text-gray-900 group-hover:text-[#C5A059] transition-colors mb-2"
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
//               <span className="text-lg font-bold text-[#2C2C2C]">
//                 {formatPrice(product.final_price)}
//               </span>
//               <span className="text-sm text-gray-400 line-through">
//                 {formatPrice(product.base_price)}
//               </span>
//             </>
//           ) : (
//             <span className="text-lg font-bold text-[#2C2C2C]">
//               {formatPrice(product.base_price)}
//             </span>
//           )}
//         </div>

//         {product.whatsapp_number && (
//           <div className="space-y-2">
//             <div
//               className="text-xs text-gray-500"
//               data-testid="whatsapp-number"
//             >
//               WhatsApp: {maskPhoneNumber(product.whatsapp_number.e164_number)}
//             </div>
//             <Button
//               onClick={handleWhatsAppClick}
//               className="w-full bg-[#25D366] text-white hover:bg-[#128C7E] flex items-center justify-center gap-2 px-6 py-3 rounded-md font-medium shadow-md hover:shadow-lg transition-all"
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

import React from "react";
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

const ProductCard = ({ product }) => {
  const hasDiscount = product.discount && product.discount.active;
  const isInStock = product.inventory && product.inventory.quantity > 0;
  const mainImage =
    product.images && product.images.length > 0
      ? product.images[0].url
      : "https://images.unsplash.com/photo-1683140426885-6c0ce899409c?w=800";

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
      } catch (error) {
        console.error("Failed to log enquiry:", error);
      }
      window.open(
        generateWhatsAppLink(product.whatsapp_number.e164_number, product),
        "_blank",
      );
    } else {
      toast.error("WhatsApp number not available");
    }
  };

  return (
    <div className="group relative" data-testid="product-card">
      {/* Product Image */}
      <Link
        to={`/product/${product.id}`}
        className="block relative aspect-[3/4] overflow-hidden bg-[#F2F0EB] mb-4"
      >
        <img
          src={mainImage}
          alt={product.title}
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
          data-testid="product-image"
        />

        {/* Badges - absolute over image, top-left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {hasDiscount && (
            <Badge
              className="bg-[#C5A059] text-white border-none text-[0.65rem] px-2 py-0.5 rounded-sm font-body"
              data-testid="discount-badge"
            >
              {product.discount.type === "percentage"
                ? `-${product.discount.value}%`
                : `-₹${product.discount.value}`}
            </Badge>
          )}
          {!isInStock && (
            <Badge
              className="bg-[#e53e3e] text-white border-none text-[0.65rem] px-2 py-0.5 rounded-sm font-body"
              data-testid="out-of-stock-badge"
            >
              Out of Stock
            </Badge>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div>
        <Link to={`/product/${product.id}`} className="no-underline">
          <h3
            className="font-heading text-[1.05rem] font-normal text-[#2C2C2C] mb-1.5 hover:text-[#C5A059] transition-colors"
            data-testid="product-title"
          >
            {product.title}
          </h3>
        </Link>

        <div
          className="flex items-baseline gap-2 mb-1.5"
          data-testid="product-price"
        >
          {hasDiscount ? (
            <>
              <span className="text-[1rem] font-semibold text-[#2C2C2C] font-body">
                {formatPrice(product.final_price)}
              </span>
              <span className="text-sm text-gray-400 line-through font-body">
                {formatPrice(product.base_price)}
              </span>
            </>
          ) : (
            <span className="text-[1rem] font-semibold text-[#2C2C2C] font-body">
              {formatPrice(product.base_price)}
            </span>
          )}
        </div>

        {product.whatsapp_number && (
          <div className="space-y-2">
            <div
              className="text-[0.78rem] text-gray-500 font-body"
              data-testid="whatsapp-number"
            >
              WhatsApp: {maskPhoneNumber(product.whatsapp_number.e164_number)}
            </div>
            <Button
              onClick={handleWhatsAppClick}
              className="w-full bg-[#25D366] text-white hover:bg-[#128C7E] flex items-center justify-center gap-2 py-2.5 rounded font-body font-semibold text-sm transition-all shadow-sm hover:shadow-md"
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