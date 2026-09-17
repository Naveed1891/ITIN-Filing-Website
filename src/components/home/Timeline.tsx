import { SectionContainer } from "@/components/ui/SectionContainer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DrawLine, Reveal } from "@/components/motion";

const steps = [
  {
    label: "Step 1",
    title: "Prepare your application",
    description:
      "Complete the intake form and organize the identity and foreign-status documents relevant to your case.",
  },
  {
    label: "Step 2",
    title: "Review Form W-7",
    description:
      "Check the application reason, tax return or exception documentation, and supporting evidence for consistency.",
  },
  {
    label: "IRS review",
    title: "IRS processing",
    description:
      "The IRS advises allowing 7 weeks, or 9–11 weeks during tax season or when applying from overseas.",
  },
  {
    label: "IRS notice",
    title: "Receive the decision",
    description:
      "The IRS mails a notice with the assigned ITIN or a request for additional information.",
  },
];

export function Timeline() {
  return (
    <SectionContainer className="bg-bg-light">
      <div className="section-stack">
        <Reveal>
        <SectionHeading
          eyebrow="Timeline"
          title={
            <>
              From application{" "}
              <em className="font-serif font-bold italic text-blue">
                to ITIN
              </em>
            </>
          }
          subtitle="Prepare a complete application, choose an IRS-approved submission method, and allow the IRS time to review it."
        />
        </Reveal>

        <div className="relative">
          {/* Connecting track that draws itself on scroll (desktop) */}
          <div
            aria-hidden
            className="absolute left-[6%] right-[6%] top-5 hidden h-px bg-border-mid xl:block"
          />
          <div className="absolute left-[6%] right-[6%] top-5 hidden xl:block">
            <DrawLine axis="x" className="h-px bg-gold" />
          </div>

          <Reveal
            stagger
            className="grid grid-cols-1 items-stretch gap-[clamp(1.25rem,2vw,2rem)] sm:grid-cols-2 xl:grid-cols-4"
          >
            {steps.map((step, i) => (
              <div
                key={step.label}
                className="group flex h-full w-full min-w-0 flex-col gap-4 sm:gap-5"
              >
                <div className="flex items-center gap-3 sm:flex-col sm:items-start">
                  <div className="relative z-10 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-2 border-blue bg-white transition-colors duration-300 group-hover:border-navy group-hover:bg-navy sm:h-10 sm:w-10">
                    <span className="text-[12px] font-bold text-blue transition-colors duration-300 group-hover:text-gold sm:text-[13px]">
                      {i + 1}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-blue sm:mt-2">
                    {step.label}
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-[15px] font-bold leading-[1.25] text-text-dark sm:text-[16px]">
                    {step.title}
                  </h3>
                  <p className="text-[13px] leading-[1.6] text-text-mid sm:text-[13.5px]">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </SectionContainer>
  );
}
