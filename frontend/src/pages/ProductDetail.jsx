import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, ArrowLeft } from "lucide-react";
import {
  formatPrice,
  maskPhoneNumber,
  generateWhatsAppLink,
} from "../lib/utils";
import api from "../lib/api";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error("Failed to fetch product:", error);
      toast.error("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppClick = async () => {
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
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        data-testid="loading-state"
      >
        <div className="w-8 h-8 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin"></div>
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

  const hasDiscount = product.discount && product.discount.active;
  const isInStock = product.inventory && product.inventory.quantity > 0;
  const images =
    product.images && product.images.length > 0
      ? product.images
      : [
          {
            url: "https://images.unsplash.com/photo-1683140426885-6c0ce899409c?w=1200",
            alt: product.title,
          },
        ];

  return (
    <div className="min-h-screen" data-testid="product-detail-page">
      <div className="px-6 md:px-12 lg:px-24 py-12">
        {/* Back Button */}
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#C5A059] mb-8"
          data-testid="back-button"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Catalog
        </Link>

        {/* Product Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="aspect-[3/4] bg-[#F2F0EB] mb-4 overflow-hidden">
              <img
                src={images[selectedImage].url}
                alt={images[selectedImage].alt || product.title}
                className="w-full h-full object-cover"
                data-testid="main-product-image"
              />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square bg-[#F2F0EB] overflow-hidden border-2 transition-colors ${
                      selectedImage === idx
                        ? "border-[#C5A059]"
                        : "border-transparent"
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

          {/* Product Info */}
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
              {!isInStock && (
                <Badge variant="destructive" data-testid="out-of-stock-badge">
                  Out of Stock
                </Badge>
              )}
              {isInStock && (
                <Badge
                  variant="outline"
                  className="border-green-500 text-green-700"
                  data-testid="in-stock-badge"
                >
                  In Stock
                </Badge>
              )}
            </div>

            <h1
              className="font-heading text-4xl md:text-5xl font-semibold tracking-tight text-[#2C2C2C] mb-4"
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
                  <span className="text-3xl font-bold text-[#2C2C2C]">
                    {formatPrice(product.final_price)}
                  </span>
                  <span className="text-xl text-gray-400 line-through">
                    {formatPrice(product.base_price)}
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold text-[#2C2C2C]">
                  {formatPrice(product.base_price)}
                </span>
              )}
            </div>

            <div className="border-t border-b border-gray-200 py-6 mb-6">
              <p
                className="text-gray-700 leading-relaxed"
                data-testid="product-description"
              >
                {product.description || "No description available."}
              </p>
            </div>

            <div className="space-y-2 mb-6">
              <div className="text-sm text-gray-500">
                <span className="font-semibold">SKU:</span> {product.sku}
              </div>
              {product.inventory && (
                <div className="text-sm text-gray-500">
                  <span className="font-semibold">Stock:</span>{" "}
                  {product.inventory.quantity} units
                </div>
              )}
            </div>

            {/* WhatsApp Enquiry */}
            {product.whatsapp_number && (
              <div className="bg-[#F2F0EB] p-6 rounded-md">
                <h3 className="font-bold text-sm uppercase tracking-widest mb-2">
                  Enquire About This Product
                </h3>
                <div
                  className="text-sm text-gray-600 mb-4"
                  data-testid="whatsapp-number"
                >
                  WhatsApp:{" "}
                  {maskPhoneNumber(product.whatsapp_number.e164_number)}
                </div>
                <Button
                  onClick={handleWhatsAppClick}
                  className="w-full bg-[#25D366] text-white hover:bg-[#128C7E] flex items-center justify-center gap-2 px-6 py-3 rounded-md font-medium shadow-md hover:shadow-lg transition-all"
                  data-testid="whatsapp-enquiry-button"
                >
                  <MessageCircle className="w-5 h-5" />
                  Enquire on WhatsApp
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
