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
}

export function createMetadata({
  title,
  description,
  path,
  type = "website",
}: MetadataInput): Metadata {
  const canonical = path === "/" ? SITE_URL : `${SITE_URL}${path}`;

  return {
    title: { absolute: /ITINReady/i.test(title) ? title : `${title} | ${SITE_NAME}` },
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
          url: OG_IMAGE,
          width: 1200,
          height: 630,
          alt: "ITINReady - ITIN application and renewal support",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE],
    },
  };
}

export function serializeJsonLd(value: object) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
