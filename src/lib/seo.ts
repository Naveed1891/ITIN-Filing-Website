import type { Metadata } from "next";

export const SITE_URL = "https://itinfiling.com";
export const SITE_NAME = "ITINFiling.com";

interface MetadataInput {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
}

export function createMetadata({
  title,
  description,
  path,
  type = "website",
}: MetadataInput): Metadata {
  const canonical = path === "/" ? SITE_URL : `${SITE_URL}${path}`;

  return {
    title: { absolute: title },
    description,
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
          url: "/images/multilingual-support.jpg",
          width: 1600,
          height: 1067,
          alt: "ITINFiling customer support team",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/multilingual-support.jpg"],
    },
  };
}

export function serializeJsonLd(value: object) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
