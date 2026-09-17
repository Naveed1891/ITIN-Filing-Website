import {
  ClipboardCheck,
  Globe2,
  MessagesSquare,
  ShieldCheck,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion";

const features: Array<{
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  description: string;
}> = [
  {
    icon: ClipboardCheck,
    title: "Structured preparation",
    description:
      "Follow a clear sequence for Form W-7 information, documents, and submission planning.",
  },
  {
    icon: Globe2,
    title: "Designed for applicants abroad",
    description:
      "Guidance covers common overseas mailing, address, and document considerations.",
  },
  {
    icon: MessagesSquare,
    title: "Plain-language guidance",
    description:
      "Understand each preparation step without unnecessary jargon or unsupported promises.",
  },
  {
    icon: ShieldCheck,
    title: "Clear service limits",
    description:
      "The IRS alone determines eligibility, assignment, and processing time.",
  },
];

export function WhyChooseUs() {
  return (
    <section
      className="section-padding relative isolate overflow-hidden"
      style={{
        background:
          "radial-gradient(120% 90% at 80% 0%, rgba(32,84,147,.45), transparent 55%), #112E51",
      }}
    >
      {/* Texture + glow */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
          maskImage:
            "radial-gradient(80% 70% at 50% 40%, black 30%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(80% 70% at 50% 40%, black 30%, transparent 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute -bottom-40 left-[15%] -z-10 h-[26rem] w-[26rem] rounded-full bg-gold/[0.06] blur-[120px]"
      />

      <div className="site-container section-stack">
        <SectionHeading
          eyebrow="Why us"
          title={
            <>
              Why thousands choose{" "}
              <em className="font-serif font-bold italic text-gold">
                ITINFiling.com
              </em>
            </>
          }
          subtitle="We combine technology and human expertise to make ITIN filing fast, accurate, and stress-free."
          light
        />

        <Reveal
          stagger
          className="grid grid-cols-1 items-stretch gap-[clamp(1rem,2vw,2rem)] sm:grid-cols-2 xl:grid-cols-4"
        >
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group flex h-full w-full min-w-0 flex-col gap-4 rounded-card border border-white/12 bg-white/6 p-[clamp(1.25rem,2vw,2rem)] backdrop-blur-sm transition-[transform,border-color,background-color] duration-300 ease-out hover:-translate-y-1 hover:border-gold/40 hover:bg-white/[0.09] motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:gap-5"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/15 text-gold transition-colors duration-300 group-hover:bg-gold group-hover:text-navy-deep">
                <feature.icon className="h-5 w-5" strokeWidth={1.8} />
              </div>
              <div className="flex flex-col gap-1.5 sm:gap-2">
                <h3 className="text-[15px] font-bold leading-[1.2] text-white sm:text-[17px]">
                  {feature.title}
                </h3>
                <p className="text-[12.5px] leading-[1.6] text-white/60 sm:text-[13.5px]">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
