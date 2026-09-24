import type { Metadata } from "next";
import { Hanken_Grotesk, Newsreader, Noto_Sans, Playfair_Display } from "next/font/google";
import { JsonLd } from "@/components/seo/JsonLd";
import { BRAND_ICON_URL, LOGO_URL, OG_IMAGE, SITE_ALTERNATE_NAMES, SITE_NAME, SITE_URL } from "@/lib/seo";
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
    default: "Apply for an ITIN Online | Form W-7 Help | ITINReady",
    template: "%s | ITINReady",
  },
  description:
    "Apply for an ITIN online with Form W-7 preparation, document review and ITIN renewal support for non-US residents, spouses and taxpayers.",
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
    "ITIN application online",
    "apply for ITIN number",
    "ITIN for non-US residents",
    "ITIN processing time",
    "Certified Acceptance Agent",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
      { url: "/icon-96.png", sizes: "96x96", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: [{ url: "/favicon.ico", type: "image/x-icon" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
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
    title: "Apply for an ITIN Online | Form W-7 Help | ITINReady",
    description:
      "Form W-7 preparation, document review and ITIN renewal support for non-US residents, spouses, dependents and US taxpayers.",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "ITINReady - ITIN application and renewal support" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Apply for an ITIN Online | Form W-7 Help | ITINReady",
    description:
      "Form W-7 preparation, document review and ITIN renewal support for non-US residents, spouses, dependents and US taxpayers.",
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
              logo: {
                "@type": "ImageObject",
                url: BRAND_ICON_URL,
                contentUrl: BRAND_ICON_URL,
                width: 512,
                height: 512,
              },
              image: LOGO_URL,
              email: "support@itinfiling.com",
              description:
                "ITIN application and renewal document-preparation support with Form W-7 guidance for international applicants and US taxpayers.",
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
