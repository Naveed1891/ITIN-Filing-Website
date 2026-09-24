import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { JsonLd } from "@/components/seo/JsonLd";
import { Magnetic, Reveal } from "@/components/motion";
import { createMetadata, SITE_NAME, SITE_URL } from "@/lib/seo";
import { getMarketingPackage } from "@/server/marketing-catalog";
import { packageDefinitions } from "@/server/packages";

const packageCopy = {
  "new-itin-application": {
    badge: "Most popular",
    intro:
      "Prepare a first Form W-7 application with guidance on the application reason, supporting documents, and IRS submission methods.",
    includes: [
      "Form W-7 preparation guidance",
      "Application-reason checklist",
      "Document requirements checklist",
      "Information consistency review",
      "Tax-return or exception reminder",
      "IRS submission-method guidance",
      "General email support",
    ],
    timeline: "IRS estimate: 7 or 9–11 weeks",
    faq: [
      {
        q: "Do I need to mail my passport?",
        a: "Not always. IRS options include originals, issuing-agency-certified copies, eligible documents authenticated by a Certified Acceptance Agent, or an appointment at a participating Taxpayer Assistance Center.",
      },
      {
        q: "Who decides whether an ITIN is issued?",
        a: "The IRS determines eligibility and whether the application and supporting documents are sufficient. A private preparation service cannot guarantee issuance or processing time.",
      },
    ],
  },
  "itin-renewal": {
    badge: null as string | null,
    intro:
      "Prepare Form W-7 to renew an expired ITIN when you need to file a U.S. federal tax return.",
    includes: [
      "Renewal eligibility checklist",
      "Form W-7 preparation guidance",
      "Document requirements checklist",
      "Information consistency review",
      "Tax-return filing reminder",
      "IRS submission-method guidance",
      "General email support",
    ],
    timeline: "IRS estimate: 7 or 9–11 weeks",
    faq: [
      {
        q: "How do I know if my ITIN has expired?",
        a: "An ITIN expires if it was not used on a U.S. federal tax return at least once during the previous three consecutive tax years. Renew only when you need to file a return.",
      },
      {
        q: "What documents do I need to renew?",
        a: "The same identity documents required for a new application, typically a valid passport or combination of IDs.",
      },
    ],
  },
} as const;

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export function generateStaticParams() {
  return packageDefinitions.map((pkg) => ({ slug: pkg.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/packages/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const { live, local } = await getMarketingPackage(slug);
  const name = live?.name ?? local?.name;
  if (!name) return {};

  return createMetadata({
    title: `${name} Preparation Package`,
    description:
      slug === "itin-renewal"
        ? "Review an ITIN renewal preparation package with Form W-7 guidance, document checks and application support."
        : "Review a new ITIN application preparation package with Form W-7 guidance, document checks and application support.",
    path: `/packages/${slug}`,
  });
}

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { live, local } = await getMarketingPackage(slug);
  const copy = packageCopy[slug as keyof typeof packageCopy];
  if (!live && !local) notFound();

  const name = live?.name ?? local!.name;
  const price = live?.price ?? (local ? (local.salePriceCents ? local.salePriceCents / 100 : local.priceCents / 100) : 0);
  const originalPrice = live?.originalPrice ?? (local?.salePriceCents ? local.priceCents / 100 : undefined);
  const currency = live?.currency ?? local?.currency ?? "USD";
  const sym = currency === "GBP" ? "£" : currency === "EUR" ? "€" : "$";
  const includes =
    live?.features && live.features.length > 0
      ? live.features
      : copy?.includes ?? local?.features ?? [];
  const intro = copy?.intro ?? live?.description ?? local?.description ?? "";
  const badge = copy?.badge ?? (live?.featured ? "Most popular" : null);
  const timeline = copy?.timeline ?? "IRS estimate: 7 or 9–11 weeks";
  const faq = copy?.faq ?? [];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name,
          provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
          serviceType: "ITIN application document preparation",
          url: `${SITE_URL}/packages/${slug}`,
          offers: {
            "@type": "Offer",
            price,
            priceCurrency: "USD",
          },
        }}
      />
      <section
        className="relative isolate overflow-hidden py-16 px-5 md:px-10"
        style={{ background: "radial-gradient(120% 90% at 80% 0%, rgba(32,84,147,.45), transparent 55%), #112E51" }}
      >
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
            maskImage:
              "radial-gradient(70% 100% at 30% 30%, black 30%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(70% 100% at 30% 30%, black 30%, transparent 100%)",
          }}
        />
        <div
          aria-hidden
          className="absolute -top-24 right-[15%] -z-10 h-[22rem] w-[22rem] rounded-full bg-gold/[0.07] blur-[110px]"
        />
        <Reveal
          stagger
          className="max-w-[1180px] mx-auto flex flex-col items-start gap-5"
        >
          {badge && <Badge variant="gold">{badge}</Badge>}
          <h1 className="text-[clamp(2rem,4vw,3.25rem)] font-extrabold text-white leading-[1.05] tracking-[-0.025em] max-w-[560px]">
            {name}
          </h1>
          <p className="text-[17px] text-white/70 leading-[1.6] max-w-[500px]">
            {intro}
          </p>
          <div className="flex flex-col gap-1 pt-2">
            {originalPrice != null && (
              <span className="text-[18px] font-semibold text-white/40 line-through">
                {sym}{originalPrice}
              </span>
            )}
            <div className="flex items-center gap-4">
              <span className="text-[40px] font-extrabold text-white leading-none tracking-[-0.02em]">
                {sym}{price}
              </span>
              <span className="font-serif text-[15px] italic text-white/50">
                one-time
              </span>
            </div>
          </div>
          <Magnetic>
            <Link
              href={`/checkout?package=${slug}`}
              className={cn(buttonVariants({ variant: "primary", size: "lg" }), "mt-2")}
            >
              Get started - {sym}{price}
            </Link>
          </Magnetic>
        </Reveal>
      </section>

      <SectionContainer className="bg-bg-light">
        <div className="grid lg:grid-cols-[1fr_380px] gap-10">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-5">
              <Reveal>
                <h2 className="text-[24px] font-extrabold text-text-dark">
                  What&apos;s{" "}
                  <em className="font-serif font-bold italic text-blue">
                    included
                  </em>
                </h2>
              </Reveal>
              <Reveal stagger as="ul" className="flex flex-col gap-3">
                {includes.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[15px] text-text-dark">
                    <span className="w-5 h-5 rounded-full bg-blue/10 flex items-center justify-center flex-shrink-0 mt-px">
                      <span className="text-blue text-[10px] font-bold">✓</span>
                    </span>
                    {item}
                  </li>
                ))}
              </Reveal>
            </div>

            {faq.length > 0 ? (
              <div className="flex flex-col gap-4">
                <Reveal>
                  <h2 className="text-[24px] font-extrabold text-text-dark">FAQ</h2>
                </Reveal>
                <Reveal stagger className="flex flex-col gap-4">
                  {faq.map((item) => (
                    <div
                      key={item.q}
                      className="flex flex-col gap-2 rounded-[14px] border border-border bg-white p-5 transition-[border-color,transform] duration-300 ease-out hover:-translate-y-0.5 hover:border-gold/50 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                    >
                      <h3 className="text-[15px] font-bold text-text-dark">{item.q}</h3>
                      <p className="text-[14.5px] text-text-mid leading-[1.6]">{item.a}</p>
                    </div>
                  ))}
                </Reveal>
              </div>
            ) : null}
          </div>

          <div className="sticky top-24 self-start bg-white border-2 border-gold/60 rounded-card p-6 flex flex-col gap-5 shadow-[0_32px_64px_-32px_rgba(17,46,81,0.45)]">
            <div className="flex items-end justify-between">
              <h3 className="text-[18px] font-extrabold text-text-dark">{name}</h3>
              <div className="flex flex-col items-end">
                {originalPrice != null && (
                  <span className="text-[14px] font-semibold text-text-muted line-through">{sym}{originalPrice}</span>
                )}
                <span className="text-[28px] font-extrabold text-navy">{sym}{price}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 text-[13px] text-text-mid">
              <div className="flex justify-between">
                <span>Estimated timeline</span>
                <span className="font-semibold text-text-dark">{timeline}</span>
              </div>
              <div className="flex justify-between">
                <span>Decision</span>
                <span className="font-semibold text-text-dark">Determined by IRS</span>
              </div>
            </div>
            <Link
              href={`/checkout?package=${slug}`}
              className={cn(buttonVariants({ variant: "primary", size: "lg", fullWidth: true }))}
            >
              Get started - {sym}{price}
            </Link>
            <p className="text-[12px] text-text-muted text-center">
              Private preparation service · IRS outcome not guaranteed
            </p>
          </div>
        </div>
      </SectionContainer>
    </>
  );
}
