import { ArticleCard } from "@/components/content/ArticleCard";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { blogArticleMap } from "@/content/blog-articles";
import { Reveal } from "@/components/motion";

const resources = [
  {
    title: "ITIN Application Checklist: Everything You Need",
    excerpt: "A complete checklist of documents and information required for a successful ITIN application.",
    href: "/blog/itin-requirements-and-documents",
    tag: "Guide",
  },
  {
    title: "ITIN vs SSN: What's the Difference?",
    excerpt: "Understand the key differences between an ITIN and a Social Security Number for your situation.",
    href: "/blog/itin-vs-ssn",
    tag: "Article",
  },
  {
    title: "When Does My ITIN Expire?",
    excerpt: "ITINs issued before 2013 or unused for three consecutive years may have expired. Learn how to renew.",
    href: "/blog/itin-renewal-guide",
    tag: "Guide",
  },
];

export function ResourcesSection() {
  return (
    <SectionContainer id="resources" className="bg-white">
      <div className="section-stack">
        <Reveal>
          <SectionHeading
            eyebrow="Resources"
            title="Learn about ITINs"
            subtitle="Free guides and articles to help you understand the ITIN process."
          />
        </Reveal>

        <Reveal
          stagger
          className="grid grid-cols-1 items-stretch gap-x-[clamp(1.25rem,2vw,2rem)] gap-y-[clamp(1.5rem,2.5vw,2.5rem)] md:grid-cols-2 xl:grid-cols-3">
          {resources.map((resource) => {
            const article = blogArticleMap.get(resource.href.replace("/blog/", ""));

            if (!article) return null;

            return (
              <ArticleCard
                key={resource.href}
                article={article}
                title={resource.title}
                excerpt={resource.excerpt}
                category={resource.tag}
                headingLevel="h3"
              />
            );
          })}
        </Reveal>
      </div>
    </SectionContainer>
  );
}
