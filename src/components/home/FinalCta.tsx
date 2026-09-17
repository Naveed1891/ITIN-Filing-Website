import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Magnetic, Reveal } from "@/components/motion";

export function FinalCta() {
  return (
    <section
      className="section-padding relative isolate overflow-hidden"
      style={{
        background:
          "radial-gradient(100% 80% at 15% 0%, rgba(32,84,147,.4), transparent 55%), #112E51",
      }}
    >
      {/* Texture + glow */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
          maskImage:
            "radial-gradient(70% 90% at 50% 50%, black 30%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(70% 90% at 50% 50%, black 30%, transparent 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute -top-32 right-[20%] -z-10 h-[24rem] w-[24rem] rounded-full bg-gold/[0.08] blur-[110px]"
      />

      <div className="site-container">
        <Reveal
          stagger
          className="flex flex-col items-center gap-[clamp(1.5rem,3vw,2rem)] text-center"
        >
          <div className="flex flex-col items-center gap-3 sm:gap-4">
            <h2 className="max-w-[640px] text-[clamp(1.75rem,3.5vw,3.25rem)] font-extrabold leading-[1.05] tracking-[-0.025em] text-white">
              Ready to get your{" "}
              <em className="font-serif font-bold italic text-gold">ITIN</em>?
            </h2>
            <p className="reading-width text-[14px] leading-[1.65] text-white/65 sm:text-[15px] lg:text-[17px]">
              Review eligibility, organize your Form W-7 information, and
              understand the available IRS submission methods.
            </p>
          </div>

          <div className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
            <Magnetic className="sm:flex-none">
              <Link href="/packages" className="block">
                <Button variant="primary" size="lg" fullWidth>
                  Get started — $225
                </Button>
              </Link>
            </Magnetic>
            <Link href="/eligibility" className="sm:flex-none">
              <Button
                variant="ghost"
                size="lg"
                fullWidth
                className="text-white/85 hover:bg-white/10 hover:text-white"
              >
                Check eligibility first
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-1 sm:gap-6">
            {[
              "Federal tax purpose required",
              "Form W-7 for applications and renewals",
              "IRS makes the final decision",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-1.5 text-[12px] font-medium text-white/50 sm:text-[13px]"
              >
                <span className="text-[10px] text-gold">✓</span>
                {item}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
