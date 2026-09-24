import Link from "next/link";
import { ArticleCard } from "./ArticleCard";
import { Breadcrumbs } from "./Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import {
  blogArticleMap,
  type BlogArticle,
} from "@/content/blog-articles";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export function ArticlePage({ article }: { article: BlogArticle }) {
  const related = article.related
    .map((slug) => blogArticleMap.get(slug))
    .filter((item): item is BlogArticle => Boolean(item));
  const url = `${SITE_URL}/blog/${article.slug}`;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.metaDescription,
    datePublished: article.published,
    dateModified: article.updated,
    mainEntityOfPage: url,
    author: { "@type": "Organization", name: "ITINReady Editorial Team" },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${SITE_URL}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: url,
      },
    ],
  };

  return (
    <>
      <JsonLd data={[articleJsonLd, breadcrumbJsonLd]} />
      <section className="bg-navy">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Blog", href: "/blog" },
            { label: article.title },
          ]}
        />
        <div className="site-container pb-[clamp(3.5rem,6vw,5rem)] pt-[clamp(2rem,4vw,3rem)]">
          <div className="max-w-[1100px]">
            <p className="text-[12px] font-bold uppercase tracking-[0.13em] text-gold">
              {article.category}
            </p>
            <h1 className="mt-4 max-w-[980px] text-[clamp(2rem,4.5vw,4.25rem)] font-extrabold leading-[1.04] tracking-[-0.03em] text-white">
              {article.title}
            </h1>
            <p className="mt-5 max-w-[820px] text-[15px] leading-[1.7] text-white/70 sm:text-[17px]">
              {article.summary}
            </p>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-white/50 sm:text-[13px]">
              <span>By ITINReady Editorial Team</span>
              <span>
                Published{" "}
                <time dateTime={article.published}>
                  {formatDate(article.published)}
                </time>
              </span>
              <span>
                Updated{" "}
                <time dateTime={article.updated}>
                  {formatDate(article.updated)}
                </time>
              </span>
              <span>{article.readingTime}</span>
            </div>
          </div>
        </div>
      </section>

      <article className="section-padding bg-white">
        <div className="mx-auto w-full max-w-[820px] px-4 md:px-6 lg:px-8">
          <nav
            aria-label="Table of contents"
            className="rounded-card border border-border bg-bg-light p-5 sm:p-6"
          >
            <p className="font-bold text-text-dark">Table of contents</p>
            <ol className="mt-3 grid gap-2 sm:grid-cols-2">
              {article.sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="text-[14px] font-medium text-blue hover:underline"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="mt-12 space-y-12">
            {article.sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-28">
                <h2 className="text-[clamp(1.45rem,3vw,2.15rem)] font-extrabold leading-tight text-text-dark">
                  {section.title}
                </h2>
                <div className="mt-4 space-y-4">
                  {section.paragraphs.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="text-[15px] leading-[1.8] text-text-mid sm:text-[16px]"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
                {section.bullets && (
                  <ul className="mt-5 space-y-3">
                    {section.bullets.map((item) => (
                      <li
                        key={item}
                        className="flex gap-3 text-[15px] leading-[1.7] text-text-dark sm:text-[16px]"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

            <section aria-labelledby="article-faq-title">
              <h2
                id="article-faq-title"
                className="text-[clamp(1.45rem,3vw,2.15rem)] font-extrabold text-text-dark"
              >
                Frequently asked questions
              </h2>
              <div className="mt-5 space-y-3">
                {article.faqs.map((faq) => (
                  <details
                    key={faq.question}
                    className="rounded-[14px] border border-border bg-bg-light p-5"
                  >
                    <summary className="cursor-pointer list-none font-semibold text-text-dark">
                      {faq.question}
                    </summary>
                    <p className="mt-3 text-[15px] leading-[1.7] text-text-mid">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </section>

            <aside className="rounded-card border border-gold/50 bg-gold/10 p-5 sm:p-6">
              <h2 className="text-[16px] font-bold text-navy">
                Professional-information disclaimer
              </h2>
              <p className="mt-2 text-[14px] leading-[1.7] text-text-mid">
                This article provides general information, not individualized
                tax or legal advice. ITIN rules can change; use the current IRS
                Form W-7 instructions for your circumstances.
              </p>
            </aside>

            <section>
              <h2 className="text-[18px] font-extrabold text-text-dark">
                Official IRS sources
              </h2>
              <ul className="mt-3 space-y-2">
                {article.sources.map((source) => (
                  <li key={source.href}>
                    <a
                      href={source.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[14px] font-semibold text-blue hover:underline"
                    >
                      {source.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </article>

      <section className="section-padding bg-bg-light">
        <div className="site-container">
          <div className="flex flex-col gap-8">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-blue">
                Continue reading
              </p>
              <h2 className="mt-2 text-[clamp(1.5rem,3vw,2.5rem)] font-extrabold text-text-dark">
                Related ITIN guides
              </h2>
            </div>
            <div className="grid items-stretch gap-5 md:grid-cols-3">
              {related.map((item) => (
                <ArticleCard key={item.slug} article={item} />
              ))}
            </div>
            <div className="flex flex-col items-center gap-4 rounded-card bg-navy p-[clamp(1.5rem,4vw,3rem)] text-center">
              <h2 className="text-[clamp(1.4rem,3vw,2.25rem)] font-extrabold text-white">
                Check your next step
              </h2>
              <p className="max-w-[620px] text-[14px] leading-[1.7] text-white/65 sm:text-[15px]">
                Review eligibility first, then compare preparation packages for
                a new ITIN application or renewal.
              </p>
              <div className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
                <Link href="/eligibility">
                  <Button
                    size="lg"
                    fullWidth
                    className="bg-white text-navy hover:bg-bg-light"
                  >
                    Check eligibility
                  </Button>
                </Link>
                <Link href="/packages">
                  <Button variant="ghost" size="lg" fullWidth>
                    View packages
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
