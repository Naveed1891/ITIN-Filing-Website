import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicPage } from "@/components/content/PublicPage";
import { publicPageMap, publicPages } from "@/content/public-pages";
import { createMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return publicPages.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const page = publicPageMap.get(slug);

  if (!page) return {};

  return createMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    path: `/${page.slug}`,
  });
}

export default async function MarketingPage({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const page = publicPageMap.get(slug);

  if (!page) notFound();

  return <PublicPage page={page} />;
}
