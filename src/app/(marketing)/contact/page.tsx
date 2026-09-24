import type { Metadata } from "next";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion";
import { ContactForm } from "@/components/contact/ContactForm";
import { createMetadata } from "@/lib/seo";
import { Mail, ShieldCheck, Clock } from "lucide-react";

export const metadata: Metadata = createMetadata({
  title: "Contact ITINReady | ITIN Application Support",
  description:
    "Contact ITINReady for general questions about ITIN application preparation, documents, packages or an existing service request.",
  path: "/contact",
});

function InfoCard({ icon: Icon, title, text }: { icon: typeof Mail; title: string; text: string }) {
  return (
    <div className="rounded-[14px] border border-border bg-white p-5">
      <div className="flex size-10 items-center justify-center rounded-full bg-blue/10 text-blue">
        <Icon size={20} />
      </div>
      <h3 className="mt-3 text-sm font-extrabold text-text-dark">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-text-mid">{text}</p>
    </div>
  );
}

export default function ContactPage() {
  return (
    <>
      <section
        className="relative isolate overflow-hidden px-5 py-16 md:px-10"
        style={{
          background:
            "radial-gradient(120% 90% at 80% 0%, rgba(32,84,147,.45), transparent 55%), #112E51",
        }}
      >
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
            maskImage: "radial-gradient(80% 90% at 50% 20%, black 30%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(80% 90% at 50% 20%, black 30%, transparent 100%)",
          }}
        />
        <div className="mx-auto max-w-[1180px]">
          <Reveal>
            <SectionHeading
              eyebrow="Contact"
              title={<>Get in <em className="font-serif italic text-gold">touch</em></>}
              subtitle="Have a question about ITIN application preparation? Send us a message and our team will respond within one working day."
              align="center"
              light
            />
          </Reveal>
        </div>
      </section>

      <SectionContainer className="py-12 md:py-16">
        <div className="mx-auto grid max-w-[1080px] gap-8 lg:grid-cols-[1fr_380px]">
          <Reveal>
            <div className="rounded-[18px] border border-border bg-white p-6 shadow-card sm:p-8">
              <h2 className="text-xl font-extrabold text-text-dark">Send us a message</h2>
              <p className="mt-1 text-sm text-text-mid">
                Fill in the form below and we&apos;ll get back to you as soon as possible.
              </p>
              <ContactForm />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex flex-col gap-4">
              <InfoCard icon={Mail} title="Email support" text="For urgent matters, email support@itinfiling.com directly with your name and order reference." />
              <InfoCard icon={Clock} title="Response time" text="We typically respond within one working day. For existing customers, use the support page in your dashboard for faster assistance." />
              <InfoCard icon={ShieldCheck} title="Privacy notice" text="Never send sensitive documents such as passports, SSN, ITIN or tax returns via this form or email. Use the secure upload area in your account." />
            </div>
          </Reveal>
        </div>
      </SectionContainer>
    </>
  );
}
