"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { slugify } from "@/lib/utils";
import toast from "react-hot-toast";

interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: string;
  compareAtPrice: string;
  sku: string;
  inventory: string;
  isActive: boolean;
  isFeatured: boolean;
  weight: string;
  categoryId: string;
  metaTitle: string;
  metaDescription: string;
}

interface Category {
  id: string;
  name: string;
}

interface ProductFormProps {
  initialData?: {
    id?: string;
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
    weight: string | null;
    categoryId: string | null;
    metaTitle: string | null;
    metaDescription: string | null;
  };
  categories: Category[];
}

export function ProductForm({ initialData, categories }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState<ProductFormData>({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    shortDescription: initialData?.shortDescription || "",
    price: initialData?.price ? String(initialData.price) : "",
    compareAtPrice: initialData?.compareAtPrice
      ? String(initialData.compareAtPrice)
      : "",
    sku: initialData?.sku || "",
    inventory: initialData?.inventory?.toString() || "0",
    isActive: initialData?.isActive ?? true,
    isFeatured: initialData?.isFeatured ?? false,
    weight: initialData?.weight || "",
    categoryId: initialData?.categoryId || "",
    metaTitle: initialData?.metaTitle || "",
    metaDescription: initialData?.metaDescription || "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setForm({ ...form, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = initialData?.slug ? form.slug : slugify(name);
    setForm({ ...form, name, slug });
  };

  const handleImageUpload = async () => {
    if (imageFiles.length === 0) return;

    setUploading(true);
    const urls: string[] = [...imageUrls];

    for (const file of imageFiles) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.url) urls.push(data.url);
      } catch {
        toast.error("Failed to upload image");
      }
    }

    setImageUrls(urls);
    setImageFiles([]);
    setUploading(false);
  };

  useEffect(() => {
    if (imageFiles.length > 0) {
      handleImageUpload();
    }
  }, [imageFiles]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...form,
      price: parseInt(form.price) || 0,
      compareAtPrice: form.compareAtPrice
        ? parseInt(form.compareAtPrice)
        : null,
      inventory: parseInt(form.inventory) || 0,
      weight: form.weight ? parseFloat(form.weight) : null,
      categoryId: form.categoryId || null,
    };

    try {
      const url = initialData?.id
        ? `/api/products/${initialData.id}`
        : "/api/products";
      const method = initialData?.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        // Save images
        if (imageUrls.length > 0 && data.product?.id) {
          for (let i = 0; i < imageUrls.length; i++) {
            await fetch(`/api/products/${data.product.id}/images`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                url: imageUrls[i],
                alt: form.name,
                sortOrder: i,
              }),
            });
          }
        }

        toast.success(
          initialData?.id ? "Product updated" : "Product created"
        );
        router.push("/admin/products");
        router.refresh();
      } else {
        toast.error(data.error || "Failed to save product");
      }
    } catch {
      toast.error("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      <div className="bg-white rounded-xl border border-(--border) p-6 space-y-4">
        <h2 className="font-semibold">Basic Information</h2>

        <div>
          <label className="block text-sm font-medium mb-1.5">Name *</label>
          <Input name="name" value={form.name} onChange={handleNameChange} required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Slug *</label>
          <Input name="slug" value={form.slug} onChange={handleChange} required />
          <p className="text-xs text-(--muted-foreground) mt-1">
            URL-friendly identifier: {form.slug || "product-name"}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            Short Description
          </label>
          <Input
            name="shortDescription"
            value={form.shortDescription}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            Description *
          </label>
          <Textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={5}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Price (cents) *
            </label>
            <Input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Compare-at Price (cents)
            </label>
            <Input
              name="compareAtPrice"
              type="number"
              value={form.compareAtPrice}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">SKU *</label>
            <Input name="sku" value={form.sku} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Inventory
            </label>
            <Input
              name="inventory"
              type="number"
              value={form.inventory}
              onChange={handleChange}
            />
            <p className="text-xs text-(--muted-foreground) mt-1">
              -1 = unlimited
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Weight (g)</label>
            <Input
              name="weight"
              type="number"
              value={form.weight}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Category</label>
            <Select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
            >
              <option value="">None</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={(e) =>
                setForm({ ...form, isActive: e.target.checked })
              }
              className="rounded"
            />
            <span className="text-sm">Active</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isFeatured"
              checked={form.isFeatured}
              onChange={(e) =>
                setForm({ ...form, isFeatured: e.target.checked })
              }
              className="rounded"
            />
            <span className="text-sm">Featured</span>
          </label>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-xl border border-(--border) p-6 space-y-4">
        <h2 className="font-semibold">Images</h2>
        <div>
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              if (e.target.files) {
                setImageFiles(Array.from(e.target.files));
              }
            }}
          />
          {uploading && (
            <p className="text-sm text-(--muted-foreground) mt-2">
              Uploading...
            </p>
          )}
        </div>
        {imageUrls.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {imageUrls.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`Image ${idx + 1}`}
                className="size-20 object-cover rounded-lg border border-(--border)"
              />
            ))}
          </div>
        )}
      </div>

      {/* SEO */}
      <div className="bg-white rounded-xl border border-(--border) p-6 space-y-4">
        <h2 className="font-semibold">SEO</h2>
        <div>
          <label className="block text-sm font-medium mb-1.5">Meta Title</label>
          <Input
            name="metaTitle"
            value={form.metaTitle}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">
            Meta Description
          </label>
          <Textarea
            name="metaDescription"
            value={form.metaDescription}
            onChange={handleChange}
            rows={2}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="primary" type="submit" disabled={loading || uploading}>
          {loading ? "Saving..." : initialData?.id ? "Update Product" : "Create Product"}
        </Button>
        <Button
          variant="outline"
          type="button"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
