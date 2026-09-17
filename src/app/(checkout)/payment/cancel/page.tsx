import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function PaymentCancelPage({
  searchParams,
}: {
  searchParams: Promise<{ package?: string }>;
}) {
  void searchParams;
  return (
    <div className="min-h-screen bg-bg-light">
      <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-5 text-center">
        <h1 className="text-2xl font-extrabold text-text-dark">Payment was not completed</h1>
        <p className="mt-3 text-sm leading-6 text-text-mid">
          Payment was not completed. You can restart checkout when ready. No order appears in your dashboard.
        </p>
        <Link href="/checkout" className="mt-6">
          <Button size="md">Return to checkout</Button>
        </Link>
      </main>
    </div>
  );
}
