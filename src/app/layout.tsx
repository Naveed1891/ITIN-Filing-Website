import type { Metadata } from "next";
import { Hanken_Grotesk, Newsreader, Noto_Sans, Playfair_Display } from "next/font/google";
import { JsonLd } from "@/components/seo/JsonLd";
import { LOGO_URL, OG_IMAGE, SITE_ALTERNATE_NAMES, SITE_NAME, SITE_URL } from "@/lib/seo";
import "./globals.css";
import { cn } from "@/lib/utils";
import { PartnershipButton } from "@/components/partner/PartnershipButton";

const playfairDisplayHeading = Playfair_Display({subsets:['latin'],variable:'--font-heading'});

const notoSans = Noto_Sans({subsets:['latin'],variable:'--font-sans'});

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: "ITINReady | Apply for an ITIN Online - New ITIN & Renewal Help",
    template: "%s | ITINReady",
  },
  description:
    "ITINReady helps you prepare your ITIN application or renewal. Clear Form W-7 guidance, document checklists and private preparation support.",
  keywords: [
    "ITIN",
    "ITIN Ready",
    "ITINReady",
    "Ready ITIN",
    "apply for ITIN",
    "ITIN application",
    "ITIN renewal",
    "Form W-7",
    "individual taxpayer identification number",
    "ITIN documents",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    url: SITE_URL,
    locale: "en_US",
    title: "ITINReady | Apply for an ITIN Online - New ITIN & Renewal Help",
    description:
      "Clear information about Form W-7, ITIN requirements, applications and renewals.",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "ITINReady - ITIN application and renewal support" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ITINReady | Apply for an ITIN Online - New ITIN & Renewal Help",
    description:
      "Clear information about Form W-7, ITIN requirements, applications and renewals.",
    images: [OG_IMAGE],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", hanken.variable, newsreader.variable, "font-sans", notoSans.variable, playfairDisplayHeading.variable)}
    >
      <body className="min-h-full flex flex-col">
        <JsonLd
          data={[
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": `${SITE_URL}/#organization`,
              name: SITE_NAME,
              alternateName: SITE_ALTERNATE_NAMES,
              url: SITE_URL,
              logo: LOGO_URL,
              image: LOGO_URL,
              email: "support@itinfiling.com",
              description:
                "Private ITIN application and renewal document-preparation support with clear Form W-7 guidance. Not affiliated with the IRS.",
            },
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": `${SITE_URL}/#website`,
              name: SITE_NAME,
              alternateName: SITE_ALTERNATE_NAMES,
              url: SITE_URL,
              inLanguage: "en-US",
              publisher: { "@id": `${SITE_URL}/#organization` },
            },
          ]}
        />
        {children}
        <PartnershipButton />
      </body>
    </html>
  );
}
