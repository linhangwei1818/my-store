export interface ProductWithRelations {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string | null;
  price: number;
  compareAtPrice: number | null;
  sku: string;
  inventory: number;
  isActive: boolean;
  isFeatured: boolean;
  weight: number | null;
  categoryId: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  createdAt: Date;
  updatedAt: Date;
  category: { id: string; name: string; slug: string } | null;
  images: { id: string; url: string; alt: string | null; sortOrder: number }[];
}

export interface CategoryWithCount {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  parentId: string | null;
  sortOrder: number;
  _count: { products: number };
}

export interface OrderWithItems {
  id: string;
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string | null;
  shippingAddress: Record<string, unknown>;
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  status: string;
  paymentStatus: string;
  trackingNumber: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  items: {
    id: string;
    productName: string;
    productSku: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    imageUrl: string | null;
  }[];
}

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  quantity: number;
  maxQuantity: number;
}
