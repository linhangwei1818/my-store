export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "MyStore";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export const SITE_DESCRIPTION = "Quality products at great prices. Shop now for fast shipping and excellent customer service.";

export const CURRENCY = "usd";
export const CURRENCY_SYMBOL = "$";

export const SHIPPING_FLAT_RATE = 499; // $4.99 in cents
export const FREE_SHIPPING_THRESHOLD = 5000; // $50.00 in cents

export const PRODUCTS_PER_PAGE = 12;

export const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];
