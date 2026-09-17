import type { Metadata } from "next";
import { ArticleCard } from "@/components/content/ArticleCard";
import { Breadcrumbs } from "@/components/content/Breadcrumbs";
import { blogArticles } from "@/content/blog-articles";
import { Reveal } from "@/components/motion";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "ITIN Application Guides and Resources",
  description:
    "Read original guides about ITIN applications, Form W-7, documents, processing time, renewals and applying from abroad.",
  path: "/blog",
});

export default function BlogPage() {
  return (
    <>
      <section
        className="relative isolate overflow-hidden"
        style={{
          background:
            "radial-gradient(120% 90% at 80% 0%, rgba(32,84,147,.35), transparent 55%), #112E51",
        }}
      >
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
            maskImage:
              "radial-gradient(70% 100% at 30% 40%, black 30%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(70% 100% at 30% 40%, black 30%, transparent 100%)",
          }}
        />
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog" }]} />
        <Reveal
          stagger
          className="site-container pb-[clamp(2.75rem,4vw,4rem)] pt-[clamp(1.5rem,2.5vw,2.5rem)]"
        >
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-gold">
            ITIN resources
          </p>
          <h1 className="mt-4 max-w-[780px] text-[clamp(2.25rem,4vw,4rem)] font-extrabold leading-[1.06] tracking-[-0.025em] text-white">
            ITIN application{" "}
            <em className="font-serif font-bold italic text-gold">guides</em>
          </h1>
          <p className="mt-5 max-w-[760px] text-[15px] leading-[1.7] text-white/70 sm:text-[17px]">
            Practical, current explanations of Form W-7, ITIN requirements,
            documents, renewal and IRS processing.
          </p>
        </Reveal>
      </section>

      <section className="section-padding bg-bg-light">
        <div className="site-container">
          <Reveal
            stagger
            className="grid items-stretch gap-x-[clamp(1.25rem,2vw,2rem)] gap-y-[clamp(1.5rem,2.5vw,2.5rem)] md:grid-cols-2 xl:grid-cols-3"
          >
            {blogArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </Reveal>
        </div>
      </section>
    </>
  );
}
