import type { Metadata } from "next";
import { Hanken_Grotesk, Newsreader, Noto_Sans, Playfair_Display } from "next/font/google";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import "./globals.css";
import { cn } from "@/lib/utils";

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
  title: {
    default: "ITINFiling.com | ITIN Application Information",
    template: "%s | ITINFiling.com",
  },
  description:
    "Clear information and private document-preparation support for Form W-7, new ITIN applications and ITIN renewals.",
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    url: SITE_URL,
    title: "ITINFiling.com | ITIN Application Information",
    description:
      "Clear information about Form W-7, ITIN requirements, applications and renewals.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ITINFiling.com | ITIN Application Information",
    description:
      "Clear information about Form W-7, ITIN requirements, applications and renewals.",
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
              name: SITE_NAME,
              url: SITE_URL,
              email: "support@itinfiling.com",
            },
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: SITE_NAME,
              url: SITE_URL,
            },
          ]}
        />
        {children}
      </body>
    </html>
  );
}
