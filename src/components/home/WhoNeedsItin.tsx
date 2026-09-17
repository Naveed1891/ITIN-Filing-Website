import Image from "next/image";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ParallaxLayer, Reveal } from "@/components/motion";

const groups = [
  "Nonresident aliens filing a U.S. federal return",
  "Nonresident aliens claiming a tax-treaty benefit",
  "Resident aliens filing a return who cannot get an SSN",
  "Eligible spouses or dependents listed on a tax return",
  "Students, professors, or researchers with a federal tax purpose",
  "Applicants with another documented federal tax purpose",
  "People who are not eligible for a Social Security number",
  "Expired ITIN holders who need to file a federal return",
];

export function WhoNeedsItin() {
  return (
    <SectionContainer className="bg-bg-light">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[clamp(2.5rem,5vw,5rem)] items-center">
        {/* Image */}
        <Reveal
          direction="right"
          className="relative h-[260px] sm:h-[320px] lg:h-[380px] rounded-[18px] overflow-hidden"
        >
          <ParallaxLayer speed={0.25} className="absolute -inset-10">
            <Image
              src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1100"
              alt="International professionals who need an ITIN"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 640px"
            />
          </ParallaxLayer>
        </Reveal>

        {/* Text */}
        <div className="flex flex-col gap-5 sm:gap-6">
          <Reveal direction="left">
            <SectionHeading
              eyebrow="Who needs an ITIN"
              title="You may need an ITIN if you are…"
              align="left"
            />
          </Reveal>
          <Reveal
            stagger
            className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5"
          >
            {groups.map((group) => (
              <div
                key={group}
                className="w-full min-w-0 h-full bg-white rounded-[10px] p-[clamp(0.75rem,1.5vw,1rem)] border border-border text-[12.5px] sm:text-[13.5px] font-semibold text-text-dark flex items-center gap-2 transition-[border-color,transform] duration-300 ease-out hover:border-gold/60 hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <span className="text-gold text-[10px] flex-shrink-0">✦</span>
                {group}
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </SectionContainer>
  );
}
