import Link from "next/link";
import { Handshake } from "lucide-react";

export function PartnershipButton() {
  return <Link href="/become-partner#partner-form" aria-label="Become an ITINReady partner" className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-navy px-4 py-3 text-sm font-extrabold text-white shadow-[0_14px_35px_rgba(11,33,56,.35)] transition hover:-translate-y-0.5 hover:bg-blue focus:outline-none focus:ring-4 focus:ring-gold/40"><Handshake size={19} className="text-gold" /><span className="hidden sm:inline">Partner with us</span></Link>;
}
