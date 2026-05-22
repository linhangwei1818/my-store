"use client"
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
  _count: { products: number };
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    sortOrder: "0",
  });

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/categories")
      const data = await res.json()
      setCategories(data.categories)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      slug: form.slug,
      description: form.description || null,
      sortOrder: parseInt(form.sortOrder) || 0,
    };

    try {
      const url = editing
        ? `/api/categories/${editing.id}`
        : "/api/categories";
      const method = editing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(editing ? "分类已更新" : "分类已创建");
        setForm({ name: "", slug: "", description: "", sortOrder: "0" });
        setEditing(null);
        fetchCategories();
      } else {
        toast.error("操作失败");
      }
    } catch {
      toast.error("操作失败");
    }
  };

  const handleEdit = (cat: Category) => {
    setEditing(cat);
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      sortOrder: String(cat.sortOrder),
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除该分类吗？")) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("分类已删除");
        fetchCategories();
      } else {
        toast.error("删除失败");
      }
    } catch {
      toast.error("删除失败");
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = editing
      ? form.slug
      : name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
    setForm({ ...form, name, slug });
  };

  if (loading) {
    return <div className="text-sm text-(--muted-foreground)">加载中...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">分类管理</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-(--border) p-6">
          <h2 className="font-semibold mb-4">
            {editing ? "编辑分类" : "新建分类"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">名称 *</label>
              <Input
                value={form.name}
                onChange={handleNameChange}
                required
                placeholder="分类名称"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Slug *</label>
              <Input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                required
                placeholder="category-slug"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">
                描述
              </label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">
                排序
              </label>
              <Input
                type="number"
                value={form.sortOrder}
                onChange={(e) =>
                  setForm({ ...form, sortOrder: e.target.value })
                }
              />
            </div>
            <div className="flex items-center gap-3">
              <Button variant="primary" type="submit">
                {editing ? "更新" : "创建"}
              </Button>
              {editing && (
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => {
                    setEditing(null);
                    setForm({
                      name: "",
                      slug: "",
                      description: "",
                      sortOrder: "0",
                    });
                  }}
                >
                  取消
                </Button>
              )}
            </div>
          </form>
        </div>

        <div>
          <div className="bg-white rounded-xl border border-(--border) overflow-hidden">
            {categories.length === 0 ? (
              <p className="p-6 text-sm text-(--muted-foreground)">
                暂无分类。
              </p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-(--border) text-left text-(--muted-foreground)">
                    <th className="p-3 font-medium">名称</th>
                    <th className="p-3 font-medium">商品数</th>
                    <th className="p-3 font-medium text-right">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr
                      key={cat.id}
                      className="border-b border-(--border) hover:bg-(--muted)"
                    >
                      <td className="p-3 font-medium">{cat.name}</td>
                      <td className="p-3 text-(--muted-foreground)">
                        {cat._count.products}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(cat)}
                          >
                            <Pencil className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(cat.id)}
                          >
                            <Trash2 className="size-3.5 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
