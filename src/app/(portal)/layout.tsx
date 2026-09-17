import type { Metadata } from "next";
import { CheckoutHeader } from "@/components/layout/CheckoutHeader";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <CheckoutHeader />
      <main className="flex-1">{children}</main>
    </>
  );
}
