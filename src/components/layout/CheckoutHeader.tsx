import Link from "next/link";
import Image from "next/image";
import { ShieldCheck } from "lucide-react";

export function CheckoutHeader() {
  return (
    <header className="w-full border-b border-[#173A6B] bg-[#112E51]">
      <div className="site-container h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex shrink-0 items-center"
        >
          <Image
            src="/images/brand/itinReadyLogo.png"
            alt="ITINReady"
            width={4032}
            height={719}
            priority
            className="h-auto w-[132px] object-contain sm:w-[160px]"
            sizes="(max-width: 639px) 132px, 160px"
          />
        </Link>
        <div className="flex items-center gap-1.5 text-[11.5px] font-semibold text-white sm:gap-2 sm:text-[12.5px]">
          <ShieldCheck size={16} className="shrink-0 text-white" />
          Secure checkout
        </div>
      </div>
    </header>
  );
}
