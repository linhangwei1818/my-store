"use client"
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";

interface ContactFormProps {
  productName?: string;
  productId?: string;
}

export function ContactForm({ productName, productId }: ContactFormProps) {
  const t = useTranslations("contact");
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
        toast.success(t("form.success"));
        (e.target as HTMLFormElement).reset();
      } else {
        const data = await res.json();
        toast.error(data.error || t("form.error"));
      }
    } catch {
      toast.error(t("form.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium mb-1.5">
          {t("form.name")} <span className="text-red-500">*</span>
        </label>
        <Input name="name" required placeholder={t("form.namePlaceholder")} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">
          {t("form.email")} <span className="text-red-500">*</span>
        </label>
        <Input name="email" type="email" required placeholder={t("form.emailPlaceholder")} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">{t("form.subject")}</label>
        <Input
          name="subject"
          placeholder={
            productName
              ? t("form.subjectPlaceholder", { productName })
              : t("form.subjectPlaceholderDefault")
          }
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">
          {t("form.message")} <span className="text-red-500">*</span>
        </label>
        <Textarea
          name="message"
          required
          rows={5}
          placeholder={t("form.messagePlaceholder")}
        />
      </div>

      <Button variant="primary" type="submit" disabled={loading} size="lg">
        {loading ? t("form.sending") : t("form.submit")}
      </Button>
    </form>
  );
}
