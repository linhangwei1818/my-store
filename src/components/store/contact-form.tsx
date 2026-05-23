"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";

interface ContactFormProps {
  productName?: string;
  productId?: string;
}

export function ContactForm({ productName, productId }: ContactFormProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          subject: formData.get("subject"),
          message: formData.get("message"),
          productId: productId || undefined,
        }),
      });

      if (res.ok) {
        toast.success("消息已发送，我们会尽快回复您！");
        (e.target as HTMLFormElement).reset();
      } else {
        const data = await res.json();
        toast.error(data.error || "发送失败，请稍后重试");
      }
    } catch {
      toast.error("发送失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium mb-1.5">
          姓名 <span className="text-red-500">*</span>
        </label>
        <Input name="name" required placeholder="您的姓名" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">
          邮箱 <span className="text-red-500">*</span>
        </label>
        <Input name="email" type="email" required placeholder="your@email.com" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">主题</label>
        <Input
          name="subject"
          placeholder={
            productName
              ? `关于 ${productName} 的咨询`
              : "关于产品的咨询"
          }
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">
          消息 <span className="text-red-500">*</span>
        </label>
        <Textarea
          name="message"
          required
          rows={5}
          placeholder="请描述您的问题或需求..."
        />
      </div>

      <Button variant="primary" type="submit" disabled={loading} size="lg">
        {loading ? "发送中..." : "发送消息"}
      </Button>
    </form>
  );
}
