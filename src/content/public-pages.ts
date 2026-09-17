export interface PublicSection {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface PublicPageData {
  slug: string;
  eyebrow: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  sections: PublicSection[];
  faqs?: Array<{ question: string; answer: string }>;
  sources?: Array<{ label: string; href: string }>;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

export const publicPages: PublicPageData[] = [
  {
    slug: "about",
    eyebrow: "About",
    title: "Clear guidance for a careful ITIN application",
    metaTitle: "About ITINFiling.com | ITIN Application Guidance",
    metaDescription:
      "Learn how ITINFiling.com approaches ITIN application guidance, document preparation and clear support for international applicants.",
    intro:
      "ITINFiling.com is a private document-preparation service designed to make the ITIN application process easier to understand. We are not the IRS and do not issue ITINs.",
    sections: [
      {
        id: "our-approach",
        title: "Our approach to ITIN application support",
        paragraphs: [
          "We organize the application into practical steps: confirming the applicant has a federal tax purpose, identifying the correct Form W-7 reason, gathering supporting documents and preparing a complete submission package.",
          "Our public guidance is written in plain language and checked against current official IRS materials. Applicants should always use the latest Form W-7 instructions for their specific facts.",
        ],
      },
      {
        id: "what-we-do",
        title: "What we help with",
        paragraphs: [
          "The service focuses on preparation and process support. The IRS alone decides whether to assign or renew an ITIN.",
        ],
        bullets: [
          "Explaining common ITIN requirements and application routes",
          "Helping applicants organize Form W-7 information",
          "Reviewing document checklists for consistency",
          "Providing status-oriented support during preparation",
        ],
      },
      {
        id: "important-limits",
        title: "Important limits",
        paragraphs: [
          "An ITIN is for U.S. federal tax purposes only. It is not a Social Security number, does not change immigration status and does not authorize employment in the United States.",
          "Information on this website is general professional information, not individualized tax or legal advice.",
        ],
      },
    ],
  },
  {
    slug: "contact",
    eyebrow: "Contact",
    title: "Contact the ITINFiling support team",
    metaTitle: "Contact ITINFiling.com | ITIN Application Support",
    metaDescription:
      "Contact ITINFiling.com for general questions about ITIN application preparation, documents, packages or an existing service request.",
    intro:
      "For general ITIN application questions or help choosing the right preparation package, email our support team. Do not send passports, tax returns or other sensitive documents by ordinary email.",
    sections: [
      {
        id: "email-support",
        title: "Email support",
        paragraphs: [
          "Email support@itinfiling.com with your name and a brief, non-sensitive description of your question. If you already have an order reference, include only that reference number.",
        ],
        bullets: [
          "Package and eligibility questions",
          "Document checklist questions",
          "Help locating an existing application",
          "Website accessibility or technical feedback",
        ],
      },
      {
        id: "before-contacting",
        title: "Before you contact us",
        paragraphs: [
          "For account-specific assistance, use the secure account area where available. Never email a complete passport image, Social Security number, ITIN, payment card number or full tax return.",
        ],
      },
      {
        id: "irs-help",
        title: "When to contact the IRS",
        paragraphs: [
          "Contact the IRS directly for an official application status after the published processing window, a lost ITIN assignment notice, or questions only the agency can resolve.",
        ],
      },
    ],
    primaryCta: { label: "Email support", href: "mailto:support@itinfiling.com" },
    secondaryCta: { label: "Read ITIN FAQs", href: "/faq" },
  },
  {
    slug: "how-it-works",
    eyebrow: "Process",
    title: "How to get an ITIN: the application process",
    metaTitle: "How to Get an ITIN | Application Process Explained",
    metaDescription:
      "Learn how to get an ITIN, from confirming a federal tax purpose through Form W-7, supporting documents and IRS processing.",
    intro:
      "To get an ITIN, an eligible applicant generally completes Form W-7, attaches a federal tax return unless an exception applies, and provides documents that prove identity and foreign status.",
    sections: [
      {
        id: "confirm-purpose",
        title: "1. Confirm why you need an ITIN",
        paragraphs: [
          "An ITIN is available only when you need a U.S. taxpayer identification number for a federal tax purpose and are not eligible for an SSN. The reason selected on Form W-7 must match the application package.",
        ],
      },
      {
        id: "prepare-w7",
        title: "2. Prepare Form W-7",
        paragraphs: [
          "Form W-7 is used for both a new ITIN number application and an ITIN renewal. Complete the name, address, birth, citizenship and supporting-document fields exactly as shown on your evidence.",
        ],
      },
      {
        id: "assemble-package",
        title: "3. Assemble the application package",
        paragraphs: [
          "Most applicants include a completed Form W-7, a paper federal income tax return and original supporting documents or copies certified by the issuing agency. Certain applicants qualify for an exception to attaching a return.",
        ],
      },
      {
        id: "submit",
        title: "4. Choose a submission method",
        paragraphs: [
          "The IRS accepts applications by mail and through in-person options. IRS Taxpayer Assistance Centers and Certifying Acceptance Agents can authenticate most documents, subject to IRS limits.",
        ],
      },
      {
        id: "processing",
        title: "5. Allow for IRS processing",
        paragraphs: [
          "The IRS currently advises allowing 7 weeks for an application-status notice and 9–11 weeks during tax season or when applying from overseas. These are IRS estimates, not guarantees.",
        ],
      },
    ],
    sources: [
      {
        label: "IRS: How to apply for an ITIN",
        href: "https://www.irs.gov/tin/itin/how-to-apply-for-an-itin",
      },
      {
        label: "IRS: Individual taxpayer identification number",
        href: "https://www.irs.gov/tin/itin/individual-taxpayer-identification-number-itin",
      },
    ],
  },
  {
    slug: "eligibility",
    eyebrow: "Eligibility",
    title: "Who needs an ITIN and who is eligible?",
    metaTitle: "Who Needs an ITIN? Eligibility and Federal Tax Purpose",
    metaDescription:
      "Understand who needs an ITIN, the federal tax-purpose requirement and when an SSN should be used instead.",
    intro:
      "You may be eligible for an ITIN if you need a U.S. taxpayer identification number for a federal tax purpose and you do not have, and are not eligible to obtain, an SSN.",
    sections: [
      {
        id: "common-applicants",
        title: "Who needs an ITIN",
        paragraphs: [
          "Eligibility depends on the applicant’s federal tax purpose, not simply on living outside the United States or owning U.S. property.",
        ],
        bullets: [
          "A nonresident alien filing a U.S. federal tax return",
          "A nonresident alien claiming an applicable tax-treaty benefit",
          "A resident alien filing a U.S. federal tax return",
          "An eligible spouse or dependent connected to a federal return",
          "Certain students, professors or researchers with a federal tax purpose",
        ],
      },
      {
        id: "not-eligible",
        title: "When an ITIN is not the right number",
        paragraphs: [
          "Do not apply for an ITIN if you already have an SSN or are eligible to obtain one. An ITIN cannot be used as work authorization, immigration identification or general identification outside the federal tax system.",
        ],
      },
      {
        id: "dependents",
        title: "Special rules for spouses and dependents",
        paragraphs: [
          "A spouse or dependent generally must file their own return or be claimed for an allowable tax benefit. Some dependent applicants must also prove U.S. residency.",
        ],
      },
    ],
    sources: [
      {
        label: "IRS: ITIN eligibility and uses",
        href: "https://www.irs.gov/tin/itin/individual-taxpayer-identification-number-itin",
      },
      {
        label: "IRS: ITIN application FAQs",
        href: "https://www.irs.gov/tin/itin/itin-application-frequently-asked-questions",
      },
    ],
  },
  {
    slug: "requirements",
    eyebrow: "Documents",
    title: "ITIN requirements and documents",
    metaTitle: "ITIN Requirements | Form W-7 and Required Documents",
    metaDescription:
      "Review ITIN requirements, Form W-7, tax-return rules and documents used to prove identity and foreign status.",
    intro:
      "ITIN requirements normally include Form W-7, evidence of a federal tax purpose, and current documents proving identity and foreign status.",
    sections: [
      {
        id: "application-package",
        title: "Core ITIN application requirements",
        paragraphs: [
          "A typical application package contains Form W-7, a U.S. federal income tax return and supporting documents. Applicants relying on a Form W-7 exception must provide the exception documentation described in the current instructions.",
        ],
      },
      {
        id: "identity-documents",
        title: "ITIN documents required",
        paragraphs: [
          "The IRS accepts a passport as the only stand-alone document for most applicants because it can establish both identity and foreign status. Without a passport, applicants generally submit a combination of accepted documents.",
        ],
        bullets: [
          "Documents must be current and unexpired where an expiration date applies",
          "At least one identity document must contain a photograph",
          "Names and biographical details should match Form W-7",
          "Originals or copies certified by the issuing agency are generally required",
          "Notarized copies are not accepted as certified copies",
        ],
      },
      {
        id: "dependent-rules",
        title: "Additional requirements for dependents",
        paragraphs: [
          "Dependent applications can require proof of U.S. residency. A passport without a date-of-entry stamp may not satisfy every dependent-residency requirement, so review the Form W-7 instructions carefully.",
        ],
      },
    ],
    sources: [
      {
        label: "IRS: ITIN supporting documents",
        href: "https://www.irs.gov/tin/itin/itin-supporting-documents",
      },
      {
        label: "IRS: Instructions for Form W-7",
        href: "https://www.irs.gov/instructions/iw7",
      },
    ],
  },
  {
    slug: "faq",
    eyebrow: "FAQ",
    title: "ITIN application frequently asked questions",
    metaTitle: "ITIN Application FAQ | Form W-7, Documents and Timing",
    metaDescription:
      "Answers to common ITIN application questions about eligibility, Form W-7, documents, renewals and IRS processing time.",
    intro:
      "These answers cover common ITIN application questions. Your facts and the current Form W-7 instructions determine the correct filing approach.",
    sections: [
      {
        id: "important-basics",
        title: "Important ITIN basics",
        paragraphs: [
          "An ITIN is a nine-digit IRS tax-processing number for federal tax purposes. It is not an SSN, does not provide immigration status and does not authorize employment.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can I apply for ITIN online?",
        answer:
          "The preparation process can be completed online through a service, but the IRS application package itself is submitted by mail or through an approved in-person option. Form W-7 is not a standard e-filed application.",
      },
      {
        question: "Is Form W-7 used for renewals?",
        answer:
          "Yes. Form W-7 is used to apply for a new ITIN and to renew an existing ITIN. Renewal applicants select the renewal application type and complete the required prior-ITIN fields.",
      },
      {
        question: "How long does it take to get an ITIN?",
        answer:
          "The IRS says to allow 7 weeks for an application-status notice, or 9–11 weeks during tax season and for applications submitted from overseas.",
      },
      {
        question: "Does an ITIN authorize work in the United States?",
        answer:
          "No. An ITIN is for federal tax purposes only and does not provide employment authorization or immigration status.",
      },
      {
        question: "Can a CAA return my passport immediately?",
        answer:
          "A Certifying Acceptance Agent can authenticate most supporting documents and return those authenticated documents, but IRS exceptions apply to certain document types and dependent documents.",
      },
    ],
    sources: [
      {
        label: "IRS: ITIN application FAQs",
        href: "https://www.irs.gov/tin/itin/itin-application-frequently-asked-questions",
      },
    ],
  },
  {
    slug: "privacy-policy",
    eyebrow: "Legal",
    title: "Privacy policy",
    metaTitle: "Privacy Policy | ITINFiling.com",
    metaDescription:
      "Read how ITINFiling.com describes the collection, use, protection and choices associated with personal information.",
    intro:
      "This privacy policy explains the categories of information the website may collect, why that information is used and the choices available to users.",
    sections: [
      {
        id: "information",
        title: "Information we may collect",
        paragraphs: [
          "Information may include contact details, account information, service-request details, documents a user chooses to provide through secure workflows, device information and basic website-usage data.",
        ],
      },
      {
        id: "use",
        title: "How information may be used",
        paragraphs: [
          "Information may be used to provide requested services, communicate about a request, maintain security, prevent misuse, improve the website and meet legal obligations.",
        ],
      },
      {
        id: "sharing",
        title: "Sharing and service providers",
        paragraphs: [
          "Information may be shared with service providers that support hosting, communications, security or requested preparation services, subject to appropriate contractual and legal limits. Information may also be disclosed when required by law.",
        ],
      },
      {
        id: "retention-security",
        title: "Retention and security",
        paragraphs: [
          "Reasonable administrative and technical safeguards should be used for sensitive information. No internet transmission or storage system can be guaranteed completely secure. Information should be retained only as long as reasonably necessary for the relevant purpose and legal obligations.",
        ],
      },
      {
        id: "choices",
        title: "Your choices and contact",
        paragraphs: [
          "Users may contact support@itinfiling.com to ask about access, correction or deletion options that apply to their information. Legal rights vary by location and may be subject to exceptions.",
        ],
      },
    ],
    primaryCta: { label: "Contact support", href: "/contact" },
  },
  {
    slug: "terms-and-conditions",
    eyebrow: "Legal",
    title: "Terms and conditions",
    metaTitle: "Terms and Conditions | ITINFiling.com",
    metaDescription:
      "Review the general terms governing access to ITINFiling.com and use of its private document-preparation services.",
    intro:
      "These terms describe the general conditions for using ITINFiling.com. They should be read together with the privacy and refund policies.",
    sections: [
      {
        id: "service",
        title: "Nature of the service",
        paragraphs: [
          "ITINFiling.com is a private document-preparation service and is not the IRS or another government agency. The IRS makes all decisions about assigning, renewing or rejecting an ITIN.",
        ],
      },
      {
        id: "user-responsibilities",
        title: "User responsibilities",
        paragraphs: [
          "Users are responsible for providing accurate, complete and lawful information, reviewing prepared materials, responding to requests for clarification and protecting account credentials.",
        ],
      },
      {
        id: "fees",
        title: "Fees and third-party costs",
        paragraphs: [
          "Service fees are shown before purchase. Government filing costs, tax-preparation charges or third-party professional fees are separate unless expressly included in the selected package.",
        ],
      },
      {
        id: "no-outcome-guarantee",
        title: "No government-outcome guarantee",
        paragraphs: [
          "No private service can guarantee that the IRS will issue an ITIN or complete processing by a particular date. Published processing windows are estimates and may change.",
        ],
      },
      {
        id: "contact",
        title: "Questions about these terms",
        paragraphs: [
          "Questions may be sent to support@itinfiling.com. These terms may be updated as the website and services change.",
        ],
      },
    ],
    primaryCta: { label: "Contact support", href: "/contact" },
  },
  {
    slug: "refund-policy",
    eyebrow: "Legal",
    title: "Refund policy",
    metaTitle: "Refund Policy | ITINFiling.com",
    metaDescription:
      "Review the general refund-request process and limitations for ITINFiling.com document-preparation services.",
    intro:
      "This policy describes how refund requests are reviewed for private document-preparation services. It does not guarantee an IRS outcome or processing time.",
    sections: [
      {
        id: "request",
        title: "How to request a refund",
        paragraphs: [
          "Send a request to support@itinfiling.com with the order reference and a concise explanation. Do not include full identity documents or payment-card information by email.",
        ],
      },
      {
        id: "review",
        title: "How requests are reviewed",
        paragraphs: [
          "The review may consider the selected package, work already completed, whether requested information was supplied, and the reason the service could not proceed. Any specific refund commitment shown at checkout controls if it conflicts with this general summary.",
        ],
      },
      {
        id: "limits",
        title: "Important limitations",
        paragraphs: [
          "An IRS delay, request for more information or denial does not by itself establish that preparation services were not provided. Government outcomes are outside the control of a private preparation service.",
        ],
      },
      {
        id: "timing",
        title: "Refund timing",
        paragraphs: [
          "Approved refunds are returned to the original payment method where possible. Financial institutions may require additional business days to post the credit.",
        ],
      },
    ],
    primaryCta: { label: "Contact support", href: "/contact" },
  },
  {
    slug: "disclaimer",
    eyebrow: "Legal",
    title: "Professional information disclaimer",
    metaTitle: "Disclaimer | ITINFiling.com",
    metaDescription:
      "Read important limitations about ITINFiling.com, general tax information, government affiliation and application outcomes.",
    intro:
      "ITINFiling.com provides general information and private document-preparation support. It is not the IRS and is not affiliated with the U.S. government.",
    sections: [
      {
        id: "not-advice",
        title: "General information, not individual advice",
        paragraphs: [
          "Website content is educational and does not replace advice from a qualified tax professional or attorney who has reviewed your circumstances.",
        ],
      },
      {
        id: "no-affiliation",
        title: "No government affiliation",
        paragraphs: [
          "References and links to IRS forms are provided for convenience. Government forms and instructions are available free from IRS.gov.",
        ],
      },
      {
        id: "no-guarantee",
        title: "No guaranteed outcome or timing",
        paragraphs: [
          "The IRS controls ITIN eligibility, document review, processing and assignment. No statement on this website should be understood as a guarantee of approval or a fixed processing date.",
        ],
      },
      {
        id: "current-information",
        title: "Use current official guidance",
        paragraphs: [
          "Tax rules and agency procedures can change. Verify important filing decisions against current IRS forms and instructions.",
        ],
      },
    ],
    primaryCta: { label: "View IRS guidance", href: "https://www.irs.gov/tin/itin" },
  },
];

export const publicPageMap = new Map(
  publicPages.map((page) => [page.slug, page])
);
