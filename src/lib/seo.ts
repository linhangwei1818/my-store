import { Metadata } from "next";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from "./constants";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
}

export function generateSiteMetadata({
  title,
  description,
  image,
  noIndex,
}: SEOProps = {}): Metadata {
  const pageTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} - ${SITE_DESCRIPTION}`;
  const pageDescription = description || SITE_DESCRIPTION;
  const ogImage = image || `${SITE_URL}/og-image.png`;

  return {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      images: [{ url: ogImage }],
      siteName: SITE_NAME,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [ogImage],
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
  };
}

export function productJsonLd(product: {
  name: string;
  description: string;
  images: { url: string }[];
  sku: string;
  price: number;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images[0]?.url,
    sku: product.sku,
    url: `${SITE_URL}/products/${product.slug}`,
    offers: {
      "@type": "Offer",
      price: product.price / 100,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
  };
}
