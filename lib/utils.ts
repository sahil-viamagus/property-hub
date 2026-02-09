import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumSignificantDigits: 3,
  }).format(price);
}

export function getPriceCategory(price: number) {
  if (price < 5000000) return "under-50-lakh";
  if (price < 10000000) return "50-lakh-to-1-crore";
  if (price < 20000000) return "1-crore-to-2-crore";
  return "above-2-crore";
}
