/**
 * Combines class names intelligently using clsx + tailwind-merge
 * Prevents Tailwind class conflicts
 */
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * @param {...import("clsx").ClassValue} inputs
 * @returns {string}
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a price in Indian Rupees (₹) with proper commas and decimals
 * @param {number|string} price - The price value
 * @param {Object} [options] - Intl.NumberFormat options
 * @param {string} [currencySymbol="₹"] - Currency symbol to use
 * @returns {string}
 */
export function formatPrice(
  price,
  options = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  },
  currencySymbol = "₹",
) {
  const num = typeof price === "string" ? parseFloat(price) : Number(price);

  if (isNaN(num) || num === null || num === undefined) {
    return `${currencySymbol}0.00`;
  }

  return `${currencySymbol}${num.toLocaleString("en-IN", options)}`;
}

/**
 * Masks a phone number, showing only the last N digits
 * @param {string} phone - Phone number (with or without country code)
 * @param {number} [visibleDigits=4] - How many digits to show at the end
 * @returns {string}
 */
export function maskPhoneNumber(phone, visibleDigits = 4) {
  if (!phone || typeof phone !== "string") return "";

  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, "");

  if (digits.length <= visibleDigits) {
    return digits;
  }

  return (
    "*".repeat(digits.length - visibleDigits) + digits.slice(-visibleDigits)
  );
}

/**
 * Generates a WhatsApp "click to chat" link with pre-filled product inquiry
 * @param {string} number - WhatsApp phone number (with or without +)
 * @param {Object} product - Product details
 * @param {string} product.title - Product name
 * @param {string} product.sku - SKU code
 * @param {number} product.final_price - Final price
 * @param {Object} [options] - Optional settings
 * @param {string} [options.customMessage] - Custom message instead of default
 * @param {string} [options.baseUrl] - Base URL (defaults to current page)
 * @returns {string} WhatsApp link
 */
export function generateWhatsAppLink(number, product, options = {}) {
  if (!number || !product?.title || !product?.sku) {
    return "#";
  }

  const {
    customMessage,
    baseUrl = typeof window !== "undefined" ? window.location.href : "",
  } = options;

  const defaultMessage =
    `Hi, I'm interested in ${product.title} (SKU: ${product.sku}). ` +
    `Price: ₹${Number(product.final_price).toFixed(2)}. ` +
    `Link: ${baseUrl}`;

  const message = customMessage || defaultMessage;

  // Clean phone number (remove +, spaces, -, etc.)
  const cleanNumber = number.replace(/[^0-9]/g, "");

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}
