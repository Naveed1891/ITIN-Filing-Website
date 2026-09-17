import Image from "next/image";
import Link from "next/link";
import type { BlogArticle } from "@/content/blog-articles";
import { articleImages } from "@/content/article-images";

interface ArticleCardProps {
  article: BlogArticle;
  title?: string;
  excerpt?: string;
  category?: string;
  headingLevel?: "h2" | "h3";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export function ArticleCard({
  article,
  title = article.title,
  excerpt = article.excerpt,
  category = article.category,
  headingLevel: Heading = "h2",
}: ArticleCardProps) {
  const href = `/blog/${article.slug}`;
  const image = articleImages[article.slug];

  return (
    <article className="group flex h-full min-w-0 flex-col rounded-[18px] border border-border/80 bg-white p-3 shadow-[0_16px_35px_-30px_rgba(13,58,43,0.45)] transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_28px_50px_-30px_rgba(13,58,43,0.55)] motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <Link
        href={href}
        className="relative block aspect-[16/10] min-w-0 overflow-hidden rounded-[13px] bg-bg-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.025] motion-reduce:transition-none"
          style={{ objectPosition: image.objectPosition }}
          sizes="(max-width: 767px) calc(100vw - 56px), (max-width: 1279px) 46vw, 31vw"
        />
        <span className="absolute left-3 top-3 rounded-full bg-navy/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-white shadow-sm">
          {category}
        </span>
      </Link>

      <div className="flex flex-1 flex-col px-2 pb-2 pt-5 sm:px-3 sm:pb-3">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11.5px] font-medium text-text-muted">
          <time dateTime={article.published}>{formatDate(article.published)}</time>
          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-gold" />
          <span>{article.readingTime}</span>
        </div>

        <Heading className="mt-3 text-[18px] font-extrabold leading-[1.28] tracking-[-0.012em] text-text-dark sm:text-[19px]">
          <Link
            href={href}
            className="transition-colors hover:text-blue"
          >
            {title}
          </Link>
        </Heading>

        <p className="mt-3 line-clamp-3 flex-1 text-[13.5px] leading-[1.65] text-text-mid sm:text-[14px]">
          {excerpt}
        </p>

        <Link
          href={href}
          className="mt-5 inline-flex items-center gap-1.5 self-start text-[12.5px] font-bold text-navy transition-colors hover:text-blue"
        >
          Read guide{" "}
          <span
            aria-hidden="true"
            className="transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:transition-none"
          >
            →
          </span>
        </Link>
      </div>
    </article>
  );
}
