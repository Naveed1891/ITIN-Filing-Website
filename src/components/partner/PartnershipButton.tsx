import Link from "next/link";
import { Handshake } from "lucide-react";

export function PartnershipButton() {
  return <Link href="/become-partner#partner-form" aria-label="Become an ITINReady partner" className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-navy p-3 text-sm font-extrabold text-white shadow-[0_14px_35px_rgba(11,33,56,.35)] transition hover:-translate-y-0.5 hover:bg-blue focus:outline-none focus:ring-4 focus:ring-gold/40 lg:bottom-5 lg:right-5 lg:px-4"><Handshake size={19} className="text-gold" /><span className="hidden lg:inline">Partner with us</span></Link>;
}
