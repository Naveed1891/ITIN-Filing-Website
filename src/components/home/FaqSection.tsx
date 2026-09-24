import { SectionHeading } from "@/components/ui/SectionHeading";
import { FaqAccordion } from "./FaqAccordion";
import { Reveal } from "@/components/motion";
import { JsonLd } from "@/components/seo/JsonLd";
import type { FaqItem } from "@/types";

const faqs: FaqItem[] = [
  {
    question: "What is an ITIN and who needs one?",
    answer:
      "An Individual Taxpayer Identification Number (ITIN) is a tax processing number issued by the IRS to individuals who are not eligible for a Social Security Number but have a U.S. tax filing requirement. This includes non-resident aliens, foreign nationals with U.S. income, and dependents of U.S. visa holders.",
  },
  {
    question: "How long does it take to receive an ITIN?",
    answer:
      "The IRS advises allowing 7 weeks after it receives a complete application. Allow 9 to 11 weeks during its January 15 through April 30 peak period or when applying from overseas. These are estimates, not guaranteed completion dates.",
  },
  {
    question: "What documents do I need to apply?",
    answer:
      "A passport is the only stand-alone document that proves both identity and foreign status. Otherwise, applicants generally need a combination of current documents from the IRS list. The required evidence depends on the applicant and the reason selected on Form W-7.",
  },
  {
    question: "What is a Certified Acceptance Agent?",
    answer:
      "A Certified Acceptance Agent is authorized under an agreement with the IRS to help complete Form W-7 and authenticate most supporting documents. Some documents and dependent cases have authentication limits, and the IRS always makes the final decision.",
  },
  {
    question: "Do I need to mail my original passport?",
    answer:
      "Not necessarily. The IRS accepts original documents, copies certified by the issuing agency, eligible documents authenticated by a Certified Acceptance Agent, or documents presented at a participating IRS Taxpayer Assistance Center. Availability and document limits vary by method.",
  },
  {
    question: "Does an ITIN authorize work or change immigration status?",
    answer:
      "No. An ITIN is issued for U.S. federal tax purposes. It does not provide work authorization, immigration status, eligibility for Social Security benefits, or identification outside the federal tax system.",
  },
  {
    question: "Can I track the status of my application?",
    answer:
      "The IRS does not provide a routine online tracker for Form W-7 applications. If you have not received a notice after the published processing period, use the telephone numbers and instructions on the official IRS ITIN page to ask about status.",
  },
  {
    question: "How should I protect my personal information?",
    answer:
      "Use a trusted device and network, confirm who will receive your documents, and avoid sending identity records through unsecured channels. Review the privacy policy before providing personal information to any private preparation service.",
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="section-padding bg-bg-light">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        }}
      />
      <div className="mx-auto w-full max-w-[1024px] px-4 md:px-6 lg:px-8">
        <div className="section-stack">
          <Reveal>
            <SectionHeading
              eyebrow="FAQ"
              title={
                <>
                  Frequently asked{" "}
                  <em className="font-serif font-bold italic text-blue">
                    questions
                  </em>
                </>
              }
              subtitle="Everything you need to know about the ITIN application process."
            />
          </Reveal>
          <FaqAccordion items={faqs} />
        </div>
      </div>
    </section>
  );
}
