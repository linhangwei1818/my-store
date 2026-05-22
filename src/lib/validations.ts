import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  description: z.string().min(1, "Description is required"),
  shortDescription: z.string().optional(),
  price: z.coerce.number().int().min(0, "Price must be positive"),
  compareAtPrice: z.coerce.number().int().min(0).optional().nullable(),
  sku: z.string().min(1, "SKU is required"),
  inventory: z.coerce.number().int().min(-1).default(0),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  weight: z.coerce.number().min(0).optional().nullable(),
  categoryId: z.string().optional().nullable(),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
});

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  description: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  parentId: z.string().optional().nullable(),
  sortOrder: z.coerce.number().int().default(0),
});

export const checkoutSchema = z.object({
  customer: z.object({
    email: z.string().email("Valid email is required"),
    name: z.string().min(1, "Name is required"),
    phone: z.string().optional(),
  }),
  shippingAddress: z.object({
    line1: z.string().min(1, "Address is required"),
    line2: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    postal_code: z.string().min(1, "Postal code is required"),
    country: z.string().min(1, "Country is required"),
  }),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().min(1),
  })).min(1, "Cart is empty"),
});
