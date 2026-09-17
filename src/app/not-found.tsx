import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="section-padding bg-bg-light">
      <div className="site-container flex min-h-[55vh] flex-col items-center justify-center text-center">
        <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-blue">
          404
        </p>
        <h1 className="mt-3 text-[clamp(2rem,5vw,4rem)] font-extrabold text-text-dark">
          Page not found
        </h1>
        <p className="mt-4 max-w-[560px] text-[15px] leading-[1.7] text-text-mid sm:text-[16px]">
          The page may have moved or the address may be incorrect. Use the links
          below to continue.
        </p>
        <div className="mt-7 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Link href="/">
            <Button size="lg" fullWidth>
              Return home
            </Button>
          </Link>
          <Link href="/blog">
            <Button variant="outline" size="lg" fullWidth>
              Browse ITIN guides
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
