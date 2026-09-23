import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Counter, Reveal } from "@/components/motion";

export interface PricingCardData {
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  currency?: string;
  description: string;
  features: string[];
  cta: string;
  featured?: boolean;
}

interface PricingCardProps {
  pkg: PricingCardData;
  href: string;
}

/**
 * Premium pricing card. The featured package renders as a dark navy card
 * with a gold rim and floating "Most popular" pill; secondary packages
 * render light. Price counts up on scroll; features check in staggered.
 */
export function PricingCard({ pkg, href }: PricingCardProps) {
  const featured = Boolean(pkg.featured);
  const sym = pkg.currency === "GBP" ? "£" : pkg.currency === "EUR" ? "€" : "$";

  return (
    <div className="group relative h-full">
      {featured && (
        <div className="absolute -top-3.5 left-1/2 z-10 -translate-x-1/2">
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-pill bg-gold px-4 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.14em] text-navy-deep shadow-[0_10px_24px_-8px_rgba(242,201,105,0.65)]">
            ✦ Most popular
          </span>
        </div>
      )}

      {/* Gold rim (featured) / hairline border (secondary) */}
      <div
        className={`h-full rounded-[22px] p-px transition-[transform,box-shadow] duration-300 ease-out group-hover:-translate-y-2 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 ${
          featured
            ? "bg-gradient-to-b from-gold/70 via-gold/25 to-gold/5 shadow-[0_32px_70px_-38px_rgba(11,33,56,0.8)] group-hover:shadow-[0_46px_90px_-40px_rgba(242,201,105,0.35)]"
            : "bg-border shadow-[0_24px_50px_-34px_rgba(13,58,43,0.45)] group-hover:bg-gold/40 group-hover:shadow-[0_38px_70px_-36px_rgba(17,46,81,0.4)]"
        }`}
      >
        <div
          className={`relative flex h-full flex-col overflow-hidden rounded-[21px] p-[clamp(1.5rem,2.5vw,2.25rem)] ${
            featured ? "" : "bg-white"
          }`}
          style={
            featured
              ? {
                  background:
                    "radial-gradient(120% 80% at 85% 0%, rgba(32,84,147,.55), transparent 55%), #0B2138",
                }
              : undefined
          }
        >
          {/* Inner glow, featured only */}
          {featured && (
            <div
              aria-hidden
              className="absolute -top-24 right-[-10%] h-64 w-64 rounded-full bg-gold/10 blur-[90px]"
            />
          )}

          {/* Name + description */}
          <div className="relative flex flex-col gap-2">
            <h3
              className={`text-[20px] font-extrabold leading-[1.15] sm:text-[22px] ${
                featured ? "text-white" : "text-text-dark"
              }`}
            >
              {pkg.name}
            </h3>
            <p
              className={`text-[13.5px] leading-[1.6] sm:text-[14px] ${
                featured ? "text-white/60" : "text-text-mid"
              }`}
            >
              {pkg.description}
            </p>
          </div>

          {/* Price */}
          <div className="relative mt-6 flex flex-col gap-1">
            {pkg.originalPrice != null && (
              <span
                className={`text-[16px] font-semibold line-through ${
                  featured ? "text-white/40" : "text-text-muted"
                }`}
              >
                {sym}{pkg.originalPrice}
              </span>
            )}
            <div className="flex items-baseline gap-1.5">
              <span
                className={`text-[20px] font-bold ${
                  featured ? "text-gold" : "text-blue"
                }`}
              >
                {sym}
              </span>
              <Counter
                value={pkg.price}
                className={`text-[clamp(2.5rem,3.5vw,3.25rem)] font-extrabold leading-none tracking-[-0.03em] ${
                  featured ? "text-white" : "text-navy"
                }`}
              />
              <span
                className={`ml-1.5 font-serif text-[14px] italic ${
                  featured ? "text-white/45" : "text-text-muted"
                }`}
              >
                one-time
              </span>
            </div>
          </div>

          <div
            aria-hidden
            className={`my-6 h-px w-full ${
              featured ? "bg-white/10" : "bg-border"
            }`}
          />

          {/* Features check in one by one */}
          <Reveal stagger as="ul" className="relative flex flex-col gap-3">
            {pkg.features.map((feature) => (
              <li
                key={feature}
                className={`flex items-start gap-3 text-[13.5px] sm:text-[14px] ${
                  featured ? "text-white/85" : "text-text-dark"
                }`}
              >
                <span
                  className={`mt-px flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${
                    featured ? "bg-gold/15 text-gold" : "bg-blue/10 text-blue"
                  }`}
                >
                  <span className="text-[10px] font-bold">✓</span>
                </span>
                {feature}
              </li>
            ))}
          </Reveal>

          {/* CTA */}
          <div className="relative mt-auto pt-7">
            <Link
              href={href}
              className={cn(
                buttonVariants({
                  variant: featured ? "primary" : "outline",
                  size: "lg",
                  fullWidth: true,
                }),
                featured
                  ? "shadow-[0_14px_30px_-12px_rgba(242,201,105,0.55)]"
                  : "hover:border-navy hover:bg-navy hover:text-white",
              )}
            >
              {pkg.cta} — {sym}{pkg.price}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
