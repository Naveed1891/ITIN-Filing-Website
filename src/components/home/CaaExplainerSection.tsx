import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CircleCheck,
  CircleX,
  FileCheck2,
  IdCard,
  SearchCheck,
  Send,
  ShieldCheck,
} from "lucide-react";
import { Reveal } from "@/components/motion";
import { SectionContainer } from "@/components/ui/SectionContainer";

const capabilities = [
  {
    icon: SearchCheck,
    title: "Identity document review",
    text: "We examine eligible identity and foreign-status documents against the Form W-7 information.",
  },
  {
    icon: FileCheck2,
    title: "Certified document copies",
    text: "As a CAA, we can authenticate most eligible supporting documents and prepare the required certification.",
  },
  {
    icon: Send,
    title: "IRS-ready submission",
    text: "Your Form W-7 package is checked for consistency before it is submitted for IRS processing.",
  },
];

const directItems = [
  "Original passport may need to be mailed",
  "Document return can take additional time",
  "Errors may trigger IRS correspondence",
  "You manage the submission yourself",
];

const caaItems = [
  "Eligible documents are authenticated by our CAA",
  "Original passport does not need to be mailed to the IRS",
  "Form W-7 and documents receive an expert review",
  "Clear support through preparation and submission",
];

export function CaaExplainerSection() {
  return (
    <SectionContainer id="caa-service" className="relative isolate overflow-hidden bg-white">
      <div aria-hidden className="absolute -right-32 top-10 -z-10 h-80 w-80 rounded-full bg-gold/10 blur-[100px] sm:h-[30rem] sm:w-[30rem]" />
      <div aria-hidden className="absolute -left-40 bottom-0 -z-10 h-80 w-80 rounded-full bg-blue/[0.07] blur-[110px] sm:h-[34rem] sm:w-[34rem]" />

      <div className="grid items-start gap-[clamp(2.5rem,5vw,7rem)] xl:grid-cols-[minmax(0,1.08fr)_minmax(520px,0.92fr)]">
        <Reveal direction="right" className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/50 bg-gold/10 px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-navy">
            <BadgeCheck size={16} className="text-blue" aria-hidden="true" />
            IRS Certified Acceptance Agent
          </div>

          <h2 className="mt-5 max-w-[1050px] text-[clamp(1.75rem,3.25vw,4rem)] font-extrabold leading-[1.06] tracking-[-0.028em] text-text-dark">
            Apply with an <span className="text-blue">experienced CAA</span>
          </h2>
          <p className="mt-5 max-w-[82ch] text-[15px] leading-[1.75] text-text-mid sm:text-[16px] lg:text-[18px]">
            ITINReady is a Certified Acceptance Agent. We help prepare Form W-7,
            review eligible identity documents and certify qualifying copies for
            an ITIN application. The IRS still makes the final decision on every
            application.
          </p>

          <Reveal stagger className="mt-8 grid gap-3 sm:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3">
            {capabilities.map(({ icon: Icon, title, text }) => (
              <article key={title} className="group rounded-[18px] border border-border bg-bg-light/80 p-5 transition duration-300 hover:-translate-y-1 hover:border-gold/60 hover:bg-white hover:shadow-[0_24px_50px_-34px_rgba(17,46,81,0.5)] motion-reduce:transform-none motion-reduce:transition-none">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy text-gold transition-colors group-hover:bg-blue">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-[15px] font-extrabold text-text-dark sm:text-[16px]">{title}</h3>
                <p className="mt-2 text-[13px] leading-[1.65] text-text-mid sm:text-[14px]">{text}</p>
              </article>
            ))}
          </Reveal>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/blog/certified-acceptance-agent" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-btn bg-navy px-5 py-3 text-[14px] font-bold text-white transition hover:bg-blue focus-visible:outline-offset-4">
              How our CAA service works
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <Link href="/eligibility" className="inline-flex min-h-11 items-center justify-center rounded-btn border border-border-mid bg-white px-5 py-3 text-[14px] font-bold text-navy transition hover:border-blue hover:text-blue">
              Check ITIN eligibility
            </Link>
          </div>
        </Reveal>

        <Reveal direction="left" className="relative grid min-w-0 items-stretch gap-4 sm:grid-cols-2">
          <article className="relative h-full overflow-hidden rounded-[22px] border border-red-200/80 bg-[#fff7f6] p-[clamp(1.25rem,2.2vw,2rem)] shadow-[0_28px_70px_-48px_rgba(112,28,28,0.55)]">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                <CircleX size={21} aria-hidden="true" />
              </span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-red-500">Direct application</p>
                <h3 className="mt-0.5 text-[17px] font-extrabold text-text-dark">Without a CAA</h3>
              </div>
            </div>
            <ul className="mt-6 divide-y divide-red-200/70">
              {directItems.map((item) => (
                <li key={item} className="flex gap-3 py-3.5 text-[13px] font-medium leading-[1.55] text-text-mid sm:text-[14px]">
                  <CircleX size={16} className="mt-0.5 shrink-0 text-red-400" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </article>

          <article className="relative h-full overflow-hidden rounded-[22px] border border-emerald-200 bg-emerald-50 p-[clamp(1.25rem,2.2vw,2rem)] shadow-[0_32px_80px_-48px_rgba(17,94,89,0.65)]">
            <div aria-hidden className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-200/50 blur-2xl" />
            <div className="relative flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
                <ShieldCheck size={21} aria-hidden="true" />
              </span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-emerald-700">ITINReady service</p>
                <h3 className="mt-0.5 text-[17px] font-extrabold text-text-dark">With ITINReady CAA</h3>
              </div>
            </div>
            <ul className="relative mt-6 divide-y divide-emerald-200/80">
              {caaItems.map((item) => (
                <li key={item} className="flex gap-3 py-3.5 text-[13px] font-semibold leading-[1.55] text-text-dark sm:text-[14px]">
                  <CircleCheck size={16} className="mt-0.5 shrink-0 text-emerald-600" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="relative mt-5 flex items-center gap-3 rounded-xl border border-emerald-200 bg-white/80 p-3 text-[12px] font-semibold leading-[1.45] text-emerald-900">
              <IdCard size={18} className="shrink-0" aria-hidden="true" />
              Keep your original passport out of the mail when it is eligible for CAA authentication.
            </div>
          </article>
        </Reveal>
      </div>
    </SectionContainer>
  );
}
