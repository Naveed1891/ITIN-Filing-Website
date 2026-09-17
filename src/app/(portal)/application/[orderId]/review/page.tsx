import { redirect } from "next/navigation";

export default async function ApplicationReviewPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  redirect(`/application/${orderId}`);
}
