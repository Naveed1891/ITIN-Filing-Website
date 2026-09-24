import type { Metadata } from "next";

export const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL || "https://itinready.com").replace(/\/$/, "");
export const SITE_NAME = "ITINReady";
export const SITE_ALTERNATE_NAMES = ["ITIN Ready", "ITINReady.com", "Ready ITIN"];
export const OG_IMAGE = "/images/brand/og-image.png";
export const LOGO_URL = `${SITE_URL}/images/brand/itinReadyLogo.png`;

interface MetadataInput {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  image?: string;
  keywords?: string[];
  author?: string;
}

export function createMetadata({
  title,
  description,
  path,
  type = "website",
  image = OG_IMAGE,
  keywords,
  author,
}: MetadataInput): Metadata {
  const canonical = path === "/" ? SITE_URL : `${SITE_URL}${path}`;

  return {
    title: { absolute: /ITINReady/i.test(title) ? title : `${title} | ${SITE_NAME}` },
    description,
    keywords,
    authors: author ? [{ name: author }] : undefined,
    alternates: { canonical },
    openGraph: {
      type,
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: "en_US",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export function serializeJsonLd(value: object) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
