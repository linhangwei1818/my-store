"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    const result = await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirect: false,
    })

    if (result?.error) {
      setError("邮箱或密码错误")
      setLoading(false)
    } else {
      router.push("/admin")
      router.refresh()
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-(--muted) p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-xl border border-(--border) p-8 shadow-sm">
          <h1 className="text-xl font-bold text-center mb-6">后台登录</h1>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">邮箱</label>
              <Input
                name="email"
                type="email"
                required
                placeholder="请输入邮箱"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">密码</label>
              <Input
                name="password"
                type="password"
                required
                placeholder="请输入密码"
              />
            </div>
            <Button
              variant="primary"
              className="w-full"
              type="submit"
              disabled={loading}
            >
              {loading ? "登录中..." : "登录"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
