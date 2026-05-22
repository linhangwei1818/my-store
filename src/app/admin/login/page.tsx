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
      setError("Invalid email or password")
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
          <h1 className="text-xl font-bold text-center mb-6">Admin Login</h1>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <Input
                name="email"
                type="email"
                required
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Password</label>
              <Input
                name="password"
                type="password"
                required
                placeholder="Enter password"
              />
            </div>
            <Button
              variant="primary"
              className="w-full"
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
