"use client"
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { slugify } from "@/lib/utils";
import toast from "react-hot-toast";
import { X } from "lucide-react";

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

interface ExistingImage {
  id: string;
  url: string;
  alt: string | null;
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
  existingImages?: ExistingImage[];
}

export function ProductForm({ initialData, categories, existingImages }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>(
    existingImages?.map((img) => img.url) || []
  );
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);
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

  const imageUrlsRef = useRef(imageUrls);
  useEffect(() => { imageUrlsRef.current = imageUrls }, [imageUrls]);

  useEffect(() => {
    if (imageFiles.length === 0) return;

    let cancelled = false;
    const upload = async () => {
      setUploading(true);
      const urls: string[] = [...imageUrlsRef.current];

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
          toast.error("图片上传失败");
        }
      }

      if (!cancelled) {
        setImageUrls(urls);
        setImageFiles([]);
        setUploading(false);
      }
    };
    upload();
    return () => { cancelled = true };
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
        // Delete removed existing images
        if (deletedImageIds.length > 0) {
          for (const imageId of deletedImageIds) {
            await fetch(`/api/products/${data.product.id}/images`, {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ imageId }),
            });
          }
        }

        // Only save newly uploaded images (those not from existingImages)
        const existingUrls = new Set(
          (existingImages || []).map((img) => img.url)
        );
        const newUrls = imageUrls.filter((url) => !existingUrls.has(url));

        if (newUrls.length > 0 && data.product?.id) {
          for (let i = 0; i < newUrls.length; i++) {
            await fetch(`/api/products/${data.product.id}/images`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                url: newUrls[i],
                alt: form.name,
                sortOrder: i,
              }),
            });
          }
        }

        toast.success(
          initialData?.id ? "商品已更新" : "商品已创建"
        );
        router.push("/admin/products");
        router.refresh();
      } else {
        toast.error(data.error || "保存失败");
      }
    } catch {
      toast.error("保存失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      <div className="bg-white rounded-xl border border-(--border) p-6 space-y-4">
        <h2 className="font-semibold">基本信息</h2>

        <div>
          <label className="block text-sm font-medium mb-1.5">名称 *</label>
          <Input name="name" value={form.name} onChange={handleNameChange} required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Slug *</label>
          <Input name="slug" value={form.slug} onChange={handleChange} required />
          <p className="text-xs text-(--muted-foreground) mt-1">
            URL标识符: {form.slug || "product-name"}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            简短描述
          </label>
          <Input
            name="shortDescription"
            value={form.shortDescription}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            详细描述 *
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
              价格 (美分) *
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
              原价 (美分)
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
              库存
            </label>
            <Input
              name="inventory"
              type="number"
              value={form.inventory}
              onChange={handleChange}
            />
            <p className="text-xs text-(--muted-foreground) mt-1">
              -1 = 无限库存
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">重量 (克)</label>
            <Input
              name="weight"
              type="number"
              value={form.weight}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">分类</label>
            <Select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
            >
              <option value="">无</option>
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
            <span className="text-sm">上架</span>
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
            <span className="text-sm">推荐</span>
          </label>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-xl border border-(--border) p-6 space-y-4">
        <h2 className="font-semibold">商品图片</h2>

        {/* Existing images (edit mode) */}
        {existingImages && existingImages.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-(--muted-foreground)">当前图片</p>
            <div className="flex gap-2 flex-wrap">
              {existingImages.map((img) => {
                if (deletedImageIds.includes(img.id)) return null;
                return (
                  <div key={img.id} className="relative group">
                    <img
                      src={img.url}
                      alt={img.alt || "商品图片"}
                      className="size-24 object-cover rounded-lg border border-(--border)"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setDeletedImageIds([...deletedImageIds, img.id]);
                        setImageUrls(imageUrls.filter((u) => u !== img.url));
                      }}
                      className="absolute -top-2 -right-2 size-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      title="删除此图片"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Upload new images */}
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
              上传中...
            </p>
          )}
        </div>

        {/* Newly uploaded images preview */}
        {imageUrls.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {imageUrls.map((url, idx) => (
              <div key={idx} className="relative group">
                <img
                  src={url}
                  alt={`图片 ${idx + 1}`}
                  className="size-24 object-cover rounded-lg border border-(--border)"
                />
                <button
                  type="button"
                  onClick={() => setImageUrls(imageUrls.filter((_, i) => i !== idx))}
                  className="absolute -top-2 -right-2 size-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  title="移除此图片"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SEO */}
      <div className="bg-white rounded-xl border border-(--border) p-6 space-y-4">
        <h2 className="font-semibold">SEO</h2>
        <div>
          <label className="block text-sm font-medium mb-1.5">Meta 标题</label>
          <Input
            name="metaTitle"
            value={form.metaTitle}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">
            Meta 描述
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
          {loading ? "保存中..." : initialData?.id ? "更新商品" : "创建商品"}
        </Button>
        <Button
          variant="outline"
          type="button"
          onClick={() => router.back()}
        >
          取消
        </Button>
      </div>
    </form>
  );
}
