import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticUrls = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${SITE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
  ]

  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    })

    const categories = await prisma.category.findMany({
      select: { slug: true, updatedAt: true },
    })

    const productUrls = products.map((p) => ({
      url: `${SITE_URL}/products/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "daily" as const,
      priority: 0.8,
    }))

    const categoryUrls = categories.map((c) => ({
      url: `${SITE_URL}/categories/${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }))

    return [...staticUrls, ...productUrls, ...categoryUrls]
  } catch {
    return staticUrls
  }
}
