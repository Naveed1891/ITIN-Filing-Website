import Image from "next/image";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { Badge } from "@/components/ui/Badge";
import { ParallaxLayer, Reveal } from "@/components/motion";

export function WhatIsItin() {
  return (
    <SectionContainer className="bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[clamp(2.5rem,5vw,5rem)] items-center">
        {/* Text */}
        <Reveal direction="right" className="flex flex-col gap-5 sm:gap-6">
          <Badge variant="blue" className="self-start">What is an ITIN?</Badge>
          <h2 className="text-[clamp(1.5rem,3vw,2.75rem)] font-extrabold text-text-dark leading-[1.08] tracking-[-0.02em]">
            An Individual Taxpayer Identification Number for non-U.S. residents
          </h2>
          <div className="reading-width flex flex-col gap-3 sm:gap-4 text-[14px] sm:text-[15px] lg:text-[16px] text-text-mid leading-[1.65]">
            <p>
              An ITIN is a tax processing number issued by the IRS to individuals who are required
              to have a U.S. taxpayer identification number but who do not have, and are not
              eligible to obtain, a Social Security Number.
            </p>
            <p>
              ITINs are issued regardless of immigration status because both resident and
              nonresident aliens may have a U.S. filing or reporting requirement under the
              Internal Revenue Code.
            </p>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              "Required for U.S. tax filing",
              "Does not authorise U.S. work",
              "Not a Social Security Number",
              "Valid for federal tax purposes only",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-[13px] sm:text-[14px] text-text-dark font-medium">
                <span className="flex-shrink-0 text-blue font-bold text-[10px] w-4 h-4 rounded-full bg-blue/10 flex items-center justify-center">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Image */}
        <Reveal
          direction="left"
          className="relative h-[260px] sm:h-[320px] lg:h-[380px] rounded-[18px] overflow-hidden order-first lg:order-last"
        >
          <ParallaxLayer speed={0.25} className="absolute -inset-10">
            <Image
              src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1100"
              alt="Professional reviewing ITIN documents"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 640px"
            />
          </ParallaxLayer>
        </Reveal>
      </div>
    </SectionContainer>
  );
}
