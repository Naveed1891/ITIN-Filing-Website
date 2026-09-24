import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePage } from "@/components/content/ArticlePage";
import { blogArticleMap, blogArticles } from "@/content/blog-articles";
import { createMetadata } from "@/lib/seo";
import { articleImages } from "@/content/article-images";

export const dynamicParams = false;

export function generateStaticParams() {
  return blogArticles.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = blogArticleMap.get(slug);

  if (!article) return {};

  return createMetadata({
    title: article.metaTitle,
    description: article.metaDescription,
    path: `/blog/${article.slug}`,
    type: "article",
    image: articleImages[article.slug]?.src,
    keywords: article.keywords,
    author: article.author ?? "Naveed Aslam",
  });
}

export default async function BlogArticlePage({
  params,
}: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const article = blogArticleMap.get(slug);

  if (!article) notFound();

  return <ArticlePage article={article} />;
}
