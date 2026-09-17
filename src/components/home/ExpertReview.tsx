import Image from "next/image";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { Badge } from "@/components/ui/Badge";
import { ParallaxLayer, Reveal } from "@/components/motion";

const blocks = [
  {
    eyebrow: "Preparation review",
    title: "A structured check before you choose a submission method",
    body: "Review Form W-7 entries, the selected application reason, and the supporting-document checklist for consistency. The IRS makes the final decision on every ITIN application.",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1100",
    imageAlt: "Professionals reviewing application documents",
    imageRight: true,
  },
  {
    eyebrow: "Global support",
    title: "Multilingual support for applicants around the world",
    body: "Applicants preparing Form W-7 from abroad can review common address, document, mailing, and IRS processing considerations in clear language.",
    image: "/images/multilingual-support.jpg",
    imageAlt:
      "Smiling multilingual customer support specialist wearing a headset in a modern office",
    imageRight: false,
  },
];

export function ExpertReview() {
  return (
    <SectionContainer className="bg-white">
      <div className="flex flex-col gap-[clamp(3.5rem,6vw,5rem)]">
        {blocks.map((block, i) => (
          <div
            key={block.title}
            className="grid grid-cols-1 items-center gap-[clamp(2rem,5vw,5rem)] lg:grid-cols-2"
          >
            <Reveal
              direction={i % 2 === 1 ? "left" : "right"}
              className={`flex flex-col gap-4 sm:gap-5 ${
                i % 2 === 1 ? "lg:order-2" : "lg:order-1"
              }`}
            >
              <Badge variant="blue" className="self-start">
                {block.eyebrow}
              </Badge>
              <h2 className="text-[clamp(1.375rem,2.5vw,2.25rem)] font-extrabold leading-[1.1] tracking-[-0.02em] text-text-dark">
                {block.title}
              </h2>
              <p className="reading-width text-[14px] leading-[1.65] text-text-mid sm:text-[15px] lg:text-[16px]">
                {block.body}
              </p>
            </Reveal>

            <Reveal
              direction={i % 2 === 1 ? "right" : "left"}
              className={`relative ${i % 2 === 1 ? "lg:order-1" : "lg:order-2"}`}
            >
              {/* Offset gold frame */}
              <div
                aria-hidden
                className={`absolute -bottom-3 hidden h-full w-full rounded-[18px] border border-gold/40 lg:block ${
                  i % 2 === 1 ? "-left-3" : "-right-3"
                }`}
              />
              <div className="relative h-[240px] overflow-hidden rounded-[18px] sm:h-[300px] lg:h-[360px]">
                <ParallaxLayer speed={0.25} className="absolute -inset-10">
                  <Image
                    src={block.image}
                    alt={block.imageAlt}
                    fill
                    className={`object-cover ${
                      i === 1 ? "object-[center_22%]" : "object-center"
                    }`}
                    sizes="(max-width: 1024px) 100vw, 640px"
                  />
                </ParallaxLayer>
              </div>
            </Reveal>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}
