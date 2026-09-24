export interface ArticleSection {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface BlogArticle {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  summary: string;
  category: string;
  published: string;
  updated: string;
  readingTime: string;
  author?: string;
  keywords?: string[];
  sections: ArticleSection[];
  faqs: Array<{ question: string; answer: string }>;
  related: string[];
  sources: Array<{ label: string; href: string }>;
}

const published = "2026-06-29";
const updated = "2026-06-29";
const publisher = "Naveed Aslam";
const newPublished = "2026-09-24";

export const blogArticles: BlogArticle[] = [
  {
    slug: "how-to-apply-for-an-itin",
    title: "How to apply for an ITIN online: a practical guide",
    metaTitle: "How to Apply for an ITIN Online | Step-by-Step Guide",
    metaDescription:
      "Learn how to apply for an ITIN online for preparation, what must be submitted to the IRS, and the steps for Form W-7 and supporting documents.",
    excerpt:
      "A clear path from online preparation to submitting Form W-7, a tax return and identity documents.",
    summary:
      "You can prepare an ITIN application online, but the completed Form W-7 package is generally delivered to the IRS by mail or through an approved in-person option. Most applicants submit Form W-7, a federal tax return and identity/foreign-status documents.",
    category: "Application",
    published,
    updated,
    readingTime: "8 min read",
    sections: [
      {
        id: "online-meaning",
        title: "What “apply for ITIN online” actually means",
        paragraphs: [
          "Online preparation can help you answer eligibility questions, organize information and review a document checklist. The IRS does not treat Form W-7 like a routine electronically filed form. A completed package still follows one of the IRS submission methods.",
          "Be cautious with any website suggesting that an ITIN is instantly issued online. Only the IRS assigns an ITIN, after reviewing the application and evidence.",
        ],
      },
      {
        id: "steps",
        title: "How to apply for an ITIN in six steps",
        paragraphs: [
          "The exact documents depend on your Form W-7 reason, but the following sequence works for most first-time applicants.",
        ],
        bullets: [
          "Confirm you have a federal tax purpose and are not eligible for an SSN",
          "Select the correct reason for submitting Form W-7",
          "Complete Form W-7 using names and dates that match your documents",
          "Prepare Form 1040 or 1040-NR unless a listed exception applies",
          "Provide current evidence of identity and foreign status",
          "Submit by mail, at an eligible IRS center, or through an approved acceptance-agent option",
        ],
      },
      {
        id: "documents",
        title: "Documents commonly included in an ITIN application",
        paragraphs: [
          "A passport is the only stand-alone document accepted for most applicants because it can prove both identity and foreign status. Applicants without a passport generally need two or more documents from the Form W-7 instructions.",
          "The IRS generally requires original documents or copies certified by the issuing agency. A standard notarized photocopy is not the same as an issuing-agency-certified copy.",
        ],
      },
      {
        id: "after-submission",
        title: "What happens after submission",
        paragraphs: [
          "The IRS currently says to allow 7 weeks for an application-status notice. It can take 9–11 weeks during tax season, from January 15 through April 30, or when the application is submitted from overseas.",
          "A CP565 notice confirms assignment. A CP566 requests more information, while a CP567 explains a rejection and the need to resubmit.",
        ],
      },
      {
        id: "avoid-delays",
        title: "How to reduce avoidable delays",
        paragraphs: [
          "Use the current Form W-7, select one accurate application reason, check that every name and date matches, and include the return or exception evidence required for that reason. Keep copies of everything submitted.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can I get an ITIN number entirely online?",
        answer:
          "No. Preparation may happen online, but the IRS application package is submitted by mail or through an approved in-person process.",
      },
      {
        question: "Is there an IRS fee for Form W-7?",
        answer:
          "The IRS does not charge a Form W-7 filing fee. A private preparer, tax professional or acceptance agent may charge for services.",
      },
      {
        question: "Can I e-file the tax return attached to a new Form W-7?",
        answer:
          "The initial return attached to Form W-7 is generally filed on paper. Review current IRS instructions for exceptions and later-year e-filing.",
      },
    ],
    related: [
      "itin-requirements-and-documents",
      "form-w-7-guide",
      "certified-acceptance-agent",
    ],
    sources: [
      {
        label: "IRS: How to apply for an ITIN",
        href: "https://www.irs.gov/tin/itin/how-to-apply-for-an-itin",
      },
      {
        label: "IRS: Form W-7 instructions",
        href: "https://www.irs.gov/instructions/iw7",
      },
    ],
  },
  {
    slug: "itin-requirements-and-documents",
    title: "ITIN requirements and documents: complete checklist",
    metaTitle: "ITIN Requirements and Documents | Complete Checklist",
    metaDescription:
      "Review ITIN requirements, documents required for Form W-7, passport alternatives and special rules for dependent applicants.",
    excerpt:
      "Understand the Form W-7 package, identity evidence, foreign-status proof and dependent-residency rules.",
    summary:
      "The main ITIN requirements are a valid federal tax purpose, Form W-7, a federal tax return unless an exception applies, and current documents proving identity and foreign status.",
    category: "Documents",
    published,
    updated,
    readingTime: "9 min read",
    sections: [
      {
        id: "core-requirements",
        title: "Core ITIN requirements",
        paragraphs: [
          "An applicant must need a U.S. taxpayer identification number for federal tax purposes and must not be eligible for an SSN. The documents in the package should support the reason selected on Form W-7.",
        ],
        bullets: [
          "A completed and signed Form W-7",
          "A federal income tax return, usually Form 1040 or 1040-NR, unless an exception applies",
          "Evidence of identity",
          "Evidence of foreign status",
          "Additional exception or residency evidence when required",
        ],
      },
      {
        id: "passport",
        title: "When a passport is enough",
        paragraphs: [
          "For most applicants, a current passport is the only document that can establish both identity and foreign status by itself. The biographical information must agree with Form W-7.",
          "Dependent applicants can face additional residency rules. A passport without a date-of-entry record does not automatically satisfy every U.S.-residency requirement.",
        ],
      },
      {
        id: "alternatives",
        title: "ITIN documents required without a passport",
        paragraphs: [
          "The Form W-7 instructions list accepted alternatives. Because individual documents prove different facts, an applicant usually needs a combination.",
        ],
        bullets: [
          "National identification card",
          "Civil birth certificate",
          "Foreign driver’s license",
          "U.S. state identification card",
          "Foreign voter registration card",
          "School or medical records for eligible younger dependents",
        ],
      },
      {
        id: "document-form",
        title: "Originals, certified copies and CAA review",
        paragraphs: [
          "Mailed applications generally include original documents or copies certified by the agency that issued them. Notarized copies are not accepted as issuing-agency-certified copies.",
          "A Certifying Acceptance Agent can authenticate most supporting documents and return them, but the IRS excludes certain military identification and some dependent documents from CAA authentication.",
        ],
      },
      {
        id: "quality-check",
        title: "Document checklist before submission",
        paragraphs: [
          "Confirm every document is current, legible and consistent with Form W-7. Check spelling, dates of birth, citizenship, expiration dates and the application reason before assembling the package.",
        ],
      },
    ],
    faqs: [
      {
        question: "Are photocopies acceptable for an ITIN application?",
        answer:
          "Ordinary photocopies are generally not enough. The IRS usually requires originals or copies certified by the issuing agency, unless documents are authenticated through an eligible in-person process.",
      },
      {
        question: "Must one document include a photograph?",
        answer:
          "Yes. The IRS states that at least one identity document must contain a photograph.",
      },
      {
        question: "Can an expired passport support Form W-7?",
        answer:
          "Documents with expiration dates must be current when the Form W-7 application is submitted.",
      },
    ],
    related: [
      "how-to-apply-for-an-itin",
      "apply-for-itin-without-mailing-passport",
      "certified-acceptance-agent",
    ],
    sources: [
      {
        label: "IRS: Topic 857, ITIN",
        href: "https://www.irs.gov/taxtopics/tc857",
      },
      {
        label: "IRS: ITIN application FAQs",
        href: "https://www.irs.gov/tin/itin/itin-application-frequently-asked-questions",
      },
    ],
  },
  {
    slug: "how-long-does-it-take-to-get-an-itin",
    title: "How long does it take to get an ITIN?",
    metaTitle: "How Long Does It Take to Get an ITIN? IRS Timing",
    metaDescription:
      "See the current IRS ITIN processing time, when applications can take 9–11 weeks and what to do if no notice arrives.",
    excerpt:
      "Current IRS timing, seasonal delays, overseas applications and practical status follow-up.",
    summary:
      "The IRS says to allow 7 weeks for an ITIN application-status notice. Allow 9–11 weeks if you apply during tax season or from overseas.",
    category: "Processing",
    published,
    updated,
    readingTime: "6 min read",
    sections: [
      {
        id: "current-time",
        title: "Current ITIN processing time",
        paragraphs: [
          "The published window begins after the IRS receives a complete application. It is an estimate rather than a guaranteed completion date.",
          "Tax season runs from January 15 through April 30 for this timing guidance. Overseas mailing and application handling can also extend the expected window.",
        ],
      },
      {
        id: "timeline",
        title: "What happens during ITIN processing",
        paragraphs: [
          "The IRS reviews Form W-7, the federal tax purpose and supporting evidence. If the package is complete, the agency sends an assignment notice. If information is missing, it may send a request for additional material.",
        ],
        bullets: [
          "Delivery to the IRS and intake",
          "Form W-7 and identity-document review",
          "Review of the tax return or exception evidence",
          "CP565 assignment notice, CP566 information request or CP567 rejection notice",
        ],
      },
      {
        id: "delays",
        title: "Common reasons an ITIN application takes longer",
        paragraphs: [
          "Incomplete forms, inconsistent names, expired documents, missing tax returns, unsupported exception claims and peak-season volume can all delay a decision.",
        ],
      },
      {
        id: "follow-up",
        title: "When and how to follow up",
        paragraphs: [
          "Wait until the applicable IRS window has passed before requesting status. Keep your mailing receipt, a copy of Form W-7 and a list of supporting documents available when contacting the IRS.",
          "If original documents were mailed and have not been returned within 60 days, the IRS advises contacting the agency.",
        ],
      },
    ],
    faqs: [
      {
        question: "Does paying a private service speed up IRS processing?",
        answer:
          "A preparer may help avoid preventable errors, but no private service controls the IRS queue or can guarantee a processing date.",
      },
      {
        question: "Can I track Form W-7 online?",
        answer:
          "The IRS does not provide ordinary package-style online tracking for Form W-7. Use delivery tracking for mailed packages and contact the IRS after the published window.",
      },
      {
        question: "Will a CP566 restart the timeline?",
        answer:
          "A request for more information can extend the overall time because the IRS must receive and review the response.",
      },
    ],
    related: [
      "how-to-apply-for-an-itin",
      "form-w-7-guide",
      "itin-renewal-guide",
    ],
    sources: [
      {
        label: "IRS: Individual taxpayer identification number",
        href: "https://www.irs.gov/tin/itin/individual-taxpayer-identification-number-itin",
      },
      {
        label: "IRS: How to apply for an ITIN",
        href: "https://www.irs.gov/tin/itin/how-to-apply-for-an-itin",
      },
    ],
  },
  {
    slug: "itin-renewal-guide",
    title: "ITIN renewal guide: when and how to renew",
    metaTitle: "ITIN Renewal Guide | When and How to Renew",
    metaDescription:
      "Learn when ITIN renewal is required, how the three-year non-use rule works and how to complete Form W-7 for renewal.",
    excerpt:
      "Check expiration, prepare Form W-7 and avoid filing a return with an expired ITIN.",
    summary:
      "Renew an expired ITIN when it will be included on a U.S. federal tax return. An ITIN expires after it is not used on a federal tax return for three consecutive tax years.",
    category: "Renewal",
    published,
    updated,
    readingTime: "7 min read",
    sections: [
      {
        id: "when",
        title: "When ITIN renewal is required",
        paragraphs: [
          "An expired ITIN must be renewed if it will appear on a federal tax return. If it is used only on information returns such as Form 1099, the IRS says renewal is not currently required.",
          "Do not renew an ITIN after receiving an SSN. Instead, stop using the ITIN and ask the IRS to combine the tax records under the SSN.",
        ],
      },
      {
        id: "expiration",
        title: "How the three-year expiration rule works",
        paragraphs: [
          "If an ITIN is not used on a U.S. federal tax return for three consecutive tax years, it expires on December 31 after the third year of non-use.",
        ],
      },
      {
        id: "steps",
        title: "ITIN renewal steps",
        paragraphs: [
          "The renewal package resembles a new application but identifies the previously assigned ITIN.",
        ],
        bullets: [
          "Select “Renew an existing ITIN” on Form W-7",
          "Choose the reason that applies to the federal tax purpose",
          "Complete lines 6e and 6f with prior ITIN information when known",
          "Include name-change evidence when applicable",
          "Attach the federal return unless a Form W-7 exception applies",
          "Provide current supporting documents",
        ],
      },
      {
        id: "return-impact",
        title: "What happens if you file with an expired ITIN",
        paragraphs: [
          "The IRS warns that return processing can be delayed and certain credits may not be allowed until renewal is completed. That can affect a refund and may contribute to interest or penalties.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can I renew an ITIN before filing a tax return?",
        answer:
          "Renewal applications generally include a federal tax return unless the applicant meets an exception in the Form W-7 instructions.",
      },
      {
        question: "Does an ITIN expire on the printed card or notice date?",
        answer:
          "ITIN expiration is based primarily on federal-return use under the current three-consecutive-year rule, not a conventional expiration date printed on a card.",
      },
      {
        question: "Is the same Form W-7 used for renewal?",
        answer:
          "Yes. Select the renewal application type and complete the prior-ITIN fields.",
      },
    ],
    related: [
      "form-w-7-guide",
      "itin-requirements-and-documents",
      "how-long-does-it-take-to-get-an-itin",
    ],
    sources: [
      {
        label: "IRS: How to renew an ITIN",
        href: "https://www.irs.gov/tin/itin/how-to-renew-an-itin",
      },
      {
        label: "IRS: Form W-7 instructions",
        href: "https://www.irs.gov/instructions/iw7",
      },
    ],
  },
  {
    slug: "form-w-7-guide",
    title: "Form W-7 guide for new ITINs and renewals",
    metaTitle: "Form W-7 Guide | New ITIN Applications and Renewals",
    metaDescription:
      "Understand Form W-7 sections, application reasons, supporting documents and common errors for new ITINs and renewals.",
    excerpt:
      "A line-by-line planning guide to the form used for every new ITIN and renewal.",
    summary:
      "Form W-7 is the IRS application for a new Individual Taxpayer Identification Number and for ITIN renewal. The selected reason, biographical details and documents must support the same federal tax purpose.",
    category: "Forms",
    published,
    updated,
    readingTime: "9 min read",
    sections: [
      {
        id: "purpose",
        title: "What Form W-7 is used for",
        paragraphs: [
          "At the top of the form, choose either a new application or renewal. Every applicant, including each family member, needs a separate signed Form W-7.",
        ],
      },
      {
        id: "reason",
        title: "Choosing the correct Form W-7 reason",
        paragraphs: [
          "The form lists reasons such as a nonresident alien claiming a treaty benefit, a nonresident alien filing a return, a resident alien filing a return, and certain spouse, dependent, student or researcher situations.",
          "Choose the reason that best describes why the applicant needs a U.S. taxpayer identification number. Some reasons require treaty details or exception documentation.",
        ],
      },
      {
        id: "details",
        title: "Names, addresses and biographical details",
        paragraphs: [
          "Enter the legal name, mailing address, foreign address, birth information and citizenship consistently. Differences between the form and identity documents can produce questions or delays.",
        ],
      },
      {
        id: "documents-section",
        title: "Completing the supporting-document section",
        paragraphs: [
          "List the document type, issuing country or agency, identification number, expiration date and U.S. entry date where requested. Do not list expired documents as current evidence.",
        ],
      },
      {
        id: "renewal-lines",
        title: "Form W-7 renewal fields",
        paragraphs: [
          "Renewal applicants answer line 6e and provide the prior ITIN and the name under which it was issued on line 6f. A legal name change should be supported with appropriate documentation.",
        ],
      },
      {
        id: "review",
        title: "Final Form W-7 review",
        bullets: [
          "Correct application type selected",
          "One accurate reason selected and supported",
          "All required lines completed",
          "Form signed by an authorized person",
          "Tax return or valid exception evidence included",
          "Identity documents current and consistent",
        ],
        paragraphs: [
          "Use the latest revision and instructions from IRS.gov. Old checklists may omit current dependent or documentation rules.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can Form W-7 be signed electronically?",
        answer:
          "The current instructions require an original signature. Review the latest IRS instructions before submission.",
      },
      {
        question: "Does every family member need Form W-7?",
        answer:
          "Yes. Each person applying for an ITIN needs an individual Form W-7.",
      },
      {
        question: "Where does Form W-7 go on the tax return?",
        answer:
          "The IRS instructs applicants to attach Form W-7 to the front of the federal tax return package.",
      },
    ],
    related: [
      "how-to-apply-for-an-itin",
      "itin-requirements-and-documents",
      "itin-renewal-guide",
    ],
    sources: [
      {
        label: "IRS: Form W-7",
        href: "https://www.irs.gov/forms-pubs/about-form-w-7",
      },
      {
        label: "IRS: Instructions for Form W-7",
        href: "https://www.irs.gov/instructions/iw7",
      },
    ],
  },
  {
    slug: "itin-for-non-us-residents",
    title: "ITIN for non-US residents and applicants abroad",
    metaTitle: "ITIN for Non-US Residents | Apply From Abroad",
    metaDescription:
      "Learn when non-US residents need an ITIN, how an application from abroad works and which documents support Form W-7.",
    excerpt:
      "Federal tax purpose, treaty claims, overseas documents and submission choices explained.",
    summary:
      "A non-US resident may need an ITIN when they have a U.S. federal tax purpose and are not eligible for an SSN. Living abroad by itself does not create ITIN eligibility.",
    category: "International",
    published,
    updated,
    readingTime: "8 min read",
    sections: [
      {
        id: "who",
        title: "Who may need an ITIN for non-US residents",
        paragraphs: [
          "Common situations include filing Form 1040-NR, claiming a tax-treaty benefit, receiving certain U.S.-source payments, or being an eligible spouse or dependent connected to a federal return.",
          "Tax residency and immigration status are separate concepts. Form W-7 asks for the federal tax reason, not a general desire for U.S. identification.",
        ],
      },
      {
        id: "abroad",
        title: "How an ITIN application from abroad works",
        paragraphs: [
          "Applicants abroad can submit by mail or use an IRS-approved acceptance agent available internationally. A Certifying Acceptance Agent may authenticate most documents, subject to IRS exceptions.",
        ],
        bullets: [
          "Confirm the relevant return or Form W-7 exception",
          "Use a complete foreign address where required",
          "Prepare certified identity and foreign-status evidence",
          "Choose trackable international delivery if mailing",
          "Allow the IRS overseas processing window",
        ],
      },
      {
        id: "treaty",
        title: "Tax-treaty and exception applications",
        paragraphs: [
          "Some nonresident aliens seek an ITIN to claim a treaty benefit without attaching a standard federal return. These applications require the correct Form W-7 reason and documentation for the applicable exception.",
        ],
      },
      {
        id: "limits",
        title: "What an ITIN does not provide",
        paragraphs: [
          "An ITIN does not authorize work, create immigration status, qualify a person for Social Security benefits or act as general identification outside the federal tax system.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can foreigners apply for an ITIN without visiting the U.S.?",
        answer:
          "Yes, if they have a valid federal tax purpose. Applications can be mailed from abroad or handled through available IRS-approved acceptance-agent options.",
      },
      {
        question: "Does owning a U.S. company automatically qualify me?",
        answer:
          "Not necessarily. Eligibility depends on the individual’s federal tax purpose and SSN eligibility, not ownership alone.",
      },
      {
        question: "How long do overseas applications take?",
        answer:
          "The IRS says applications from overseas can take 9–11 weeks for a status notice.",
      },
    ],
    related: [
      "how-to-apply-for-an-itin",
      "itin-vs-ssn",
      "certified-acceptance-agent",
    ],
    sources: [
      {
        label: "IRS: ITIN overview",
        href: "https://www.irs.gov/tin/itin/individual-taxpayer-identification-number-itin",
      },
      {
        label: "IRS: ITIN acceptance agents",
        href: "https://www.irs.gov/tin/itin/itin-acceptance-agents",
      },
    ],
  },
  {
    slug: "itin-vs-ssn",
    title: "ITIN vs SSN: purpose, eligibility and key differences",
    metaTitle: "ITIN vs SSN | Purpose, Eligibility and Differences",
    metaDescription:
      "Compare ITIN vs SSN eligibility, tax use, work authorization and what to do if an ITIN holder later receives an SSN.",
    excerpt:
      "Understand which number applies, what each number does and why a person cannot use both.",
    summary:
      "An SSN is issued by the Social Security Administration to eligible people and can be connected to employment authorization. An ITIN is issued by the IRS only for federal tax purposes to people who are not eligible for an SSN.",
    category: "Basics",
    published,
    updated,
    readingTime: "6 min read",
    sections: [
      {
        id: "difference",
        title: "The core ITIN vs SSN difference",
        paragraphs: [
          "Both are nine-digit taxpayer identification numbers, but they come from different agencies and have different eligibility rules. A person eligible for an SSN should not apply for an ITIN.",
        ],
      },
      {
        id: "itin",
        title: "What an ITIN is used for",
        paragraphs: [
          "An ITIN lets the IRS process federal tax returns and related documents for an individual who has a federal tax purpose but cannot obtain an SSN.",
        ],
        bullets: [
          "Federal income tax filing",
          "Certain treaty-benefit claims",
          "Federal tax reporting and withholding situations",
          "Eligible spouse or dependent tax purposes",
        ],
      },
      {
        id: "ssn",
        title: "What an SSN is used for",
        paragraphs: [
          "The Social Security Administration issues SSNs. Depending on the holder’s status, an SSN can be used for employment, Social Security records and federal tax administration.",
        ],
      },
      {
        id: "not-do",
        title: "What an ITIN cannot do",
        paragraphs: [
          "An ITIN does not provide work authorization, immigration status, Social Security benefits or eligibility for the Earned Income Tax Credit. It is not general identification outside the federal tax system.",
        ],
      },
      {
        id: "later-ssn",
        title: "If you receive an SSN after using an ITIN",
        paragraphs: [
          "Stop using the ITIN and notify the IRS so tax records can be combined under the SSN. The IRS advises sending identifying information and a copy of the Social Security card.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can I have both an ITIN and an SSN?",
        answer:
          "You should not continue using both. If you later receive an SSN, stop using the ITIN and notify the IRS.",
      },
      {
        question: "Can an ITIN be used on a job application?",
        answer:
          "An ITIN does not authorize employment and should not be presented as proof of work authorization.",
      },
      {
        question: "Does an ITIN build Social Security benefits?",
        answer:
          "No. An ITIN does not qualify the holder for Social Security benefits.",
      },
    ],
    related: [
      "itin-for-non-us-residents",
      "how-to-apply-for-an-itin",
      "form-w-7-guide",
    ],
    sources: [
      {
        label: "IRS: Taxpayer identification numbers",
        href: "https://www.irs.gov/tin/taxpayer-identification-numbers-tin",
      },
      {
        label: "IRS: ITIN uses and limits",
        href: "https://www.irs.gov/tin/itin/individual-taxpayer-identification-number-itin",
      },
    ],
  },
  {
    slug: "certified-acceptance-agent",
    title: "Certified Acceptance Agent: how CAA ITIN service works",
    metaTitle: "Certified Acceptance Agent | How CAA ITIN Service Works",
    metaDescription:
      "Learn what a Certified Acceptance Agent does, which ITIN documents a CAA can authenticate and how CAAs differ from Acceptance Agents.",
    excerpt:
      "Document authentication, Form W-7 support, limits and questions to ask before choosing an agent.",
    summary:
      "A Certified Acceptance Agent is an IRS-approved agent that can help complete Form W-7 and authenticate most supporting documents, allowing authenticated documents to be returned instead of mailed to the IRS.",
    category: "Professional help",
    published,
    updated,
    readingTime: "7 min read",
    sections: [
      {
        id: "role",
        title: "What a Certified Acceptance Agent does",
        paragraphs: [
          "A CAA reviews Form W-7, verifies that the supporting evidence appears to meet IRS requirements, authenticates eligible documents and submits the package for IRS processing.",
          "The CAA does not issue an ITIN and cannot guarantee that the IRS will accept the application.",
        ],
      },
      {
        id: "difference",
        title: "CAA vs Acceptance Agent",
        paragraphs: [
          "Both agent types can help complete Form W-7 and communicate with the IRS about application issues. A CAA can authenticate most supporting documents; a standard Acceptance Agent reviews and mails the documents instead.",
        ],
      },
      {
        id: "limits",
        title: "CAA document-authentication limits",
        paragraphs: [
          "The IRS excludes foreign military identification cards from CAA authentication. For dependent applicants, a CAA cannot authenticate documents other than passports and birth certificates.",
          "Applicants should confirm exactly which originals will be reviewed, which copies can be certified and when documents will be returned.",
        ],
      },
      {
        id: "choose",
        title: "How to evaluate a CAA ITIN service",
        bullets: [
          "Verify the agent appears on the current IRS list",
          "Ask whether tax-return preparation is included",
          "Request a written scope and fee schedule",
          "Confirm the secure document-transfer method",
          "Avoid anyone promising guaranteed approval or special IRS priority",
        ],
        paragraphs: [
          "Fees vary because acceptance-agent services are private. IRS Taxpayer Assistance Centers with ITIN services are another option and may authenticate documents without a private-agent fee.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is every tax preparer a CAA?",
        answer:
          "No. CAA status requires an IRS agreement and appears on the IRS acceptance-agent list.",
      },
      {
        question: "Can a CAA approve my ITIN?",
        answer:
          "No. Only the IRS assigns or renews an ITIN.",
      },
      {
        question: "Will a CAA make IRS processing faster?",
        answer:
          "A complete package may avoid preventable questions, but a CAA does not control IRS processing time.",
      },
    ],
    related: [
      "apply-for-itin-without-mailing-passport",
      "itin-requirements-and-documents",
      "how-to-apply-for-an-itin",
    ],
    sources: [
      {
        label: "IRS: ITIN acceptance agents",
        href: "https://www.irs.gov/tin/itin/itin-acceptance-agents",
      },
      {
        label: "IRS: How to apply for an ITIN",
        href: "https://www.irs.gov/tin/itin/how-to-apply-for-an-itin",
      },
    ],
  },
  {
    slug: "apply-for-itin-without-mailing-passport",
    title: "How to apply for an ITIN without mailing your passport",
    metaTitle: "Apply for ITIN Without Mailing Your Original Passport",
    metaDescription:
      "Learn IRS-approved ways to apply for an ITIN without mailing an original passport, including CAAs and Taxpayer Assistance Centers.",
    excerpt:
      "Compare CAA authentication, IRS appointments and issuing-agency-certified passport copies.",
    summary:
      "You may be able to apply for an ITIN without mailing your original passport by using a Certifying Acceptance Agent, an IRS Taxpayer Assistance Center with ITIN services, or a passport copy certified by the issuing agency.",
    category: "Documents",
    published,
    updated,
    readingTime: "7 min read",
    sections: [
      {
        id: "options",
        title: "Three ways to avoid mailing an original passport",
        paragraphs: [
          "The best option depends on location, appointment availability, document type and whether the applicant is a dependent.",
        ],
        bullets: [
          "Meet with a Certifying Acceptance Agent that can authenticate the passport",
          "Make an appointment at an IRS Taxpayer Assistance Center offering ITIN services",
          "Obtain a passport copy certified by the government agency that issued it",
        ],
      },
      {
        id: "caa",
        title: "Using a CAA for an ITIN without mailing the original passport",
        paragraphs: [
          "A CAA reviews the original passport, prepares an authentication certificate and returns the authenticated document. The CAA submits the certificate and application package to the IRS.",
          "CAA authentication does not change the applicant’s eligibility requirements or guarantee IRS acceptance.",
        ],
      },
      {
        id: "tac",
        title: "Using an IRS Taxpayer Assistance Center",
        paragraphs: [
          "Some IRS centers review Form W-7, authenticate most documents, return them at the appointment and mail the package. Appointments and ITIN services are not available at every location.",
        ],
      },
      {
        id: "certified-copy",
        title: "Using an issuing-agency-certified passport copy",
        paragraphs: [
          "A copy certified by the passport-issuing agency bears that agency’s certification that it is a true copy. A notarized copy from an unrelated notary is not a substitute under IRS rules.",
        ],
      },
      {
        id: "dependent-limits",
        title: "Special limits for dependent documents",
        paragraphs: [
          "For dependent applicants, a CAA can authenticate passports and birth certificates but not every other supporting document. Dependent residency evidence may still need separate handling.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can I upload a passport scan directly to the IRS?",
        answer:
          "No ordinary upload replaces the IRS supporting-document requirements for Form W-7.",
      },
      {
        question: "Is a notarized passport copy accepted?",
        answer:
          "The IRS distinguishes a copy certified by the issuing agency from a notarized copy. A standard notarized photocopy is not accepted as an issuing-agency-certified copy.",
      },
      {
        question: "Does a CAA keep my passport?",
        answer:
          "A CAA can authenticate an eligible passport and return it rather than mailing the original to the IRS.",
      },
    ],
    related: [
      "certified-acceptance-agent",
      "itin-requirements-and-documents",
      "how-to-apply-for-an-itin",
    ],
    sources: [
      {
        label: "IRS: ITIN acceptance agents",
        href: "https://www.irs.gov/tin/itin/itin-acceptance-agents",
      },
      {
        label: "IRS: ITIN supporting documents",
        href: "https://www.irs.gov/tin/itin/itin-supporting-documents",
      },
    ],
  },
  {
    slug: "caa-passport-processing-time-cp565",
    title: "CAA passport review, ITIN processing time and the CP565 notice",
    metaTitle: "CAA Passport Review, ITIN Processing Time and CP565",
    metaDescription:
      "Learn how a Certified Acceptance Agent checks a passport, current ITIN processing times, when documents return and what an IRS CP565 notice means.",
    excerpt:
      "What happens after a CAA checks your passport, how long the IRS may take and how to read a CP565 notice.",
    summary:
      "A Certified Acceptance Agent can inspect an eligible original passport and submit a Certificate of Accuracy, so the passport usually does not travel with the application. The IRS generally asks applicants to allow 7 weeks for a status notice, or 9 to 11 weeks during peak season and for applications filed from overseas. CP565 is the notice confirming that an ITIN was assigned or renewed.",
    category: "CAA service",
    published: newPublished,
    updated: newPublished,
    readingTime: "8 min read",
    author: publisher,
    keywords: [
      "Certified Acceptance Agent passport",
      "ITIN processing time",
      "CP565 notice",
      "ITIN passport return time",
      "CAA ITIN status",
      "IRS ITIN approval letter",
    ],
    sections: [
      {
        id: "passport-review",
        title: "What a Certified Acceptance Agent does with your passport",
        paragraphs: [
          "A Certified Acceptance Agent, usually shortened to CAA, compares your original identification with the information on Form W-7. For an eligible passport, the CAA prepares a Certificate of Accuracy and normally returns the original document after the appointment. The certificate goes to the IRS with the rest of the application package.",
          "A CAA does not issue an ITIN and cannot approve an application. The IRS makes that decision. The value of the CAA process is careful document review and, for many applicants, avoiding the need to mail an original passport to the IRS.",
        ],
      },
      {
        id: "processing-time",
        title: "How long ITIN processing takes after CAA submission",
        paragraphs: [
          "The IRS currently says to allow 7 weeks from receipt of a complete application for a status notice. Allow 9 to 11 weeks if the application was submitted from January 15 through April 30 or from outside the United States.",
          "CAA review does not place an application in a faster IRS queue. A complete, consistent package may prevent avoidable correspondence, but no agent can guarantee an approval date.",
        ],
      },
      {
        id: "passport-return",
        title: "Passport return time depends on how you applied",
        paragraphs: [
          "If a CAA authenticates your passport, you generally leave the appointment with it. If you mail an original passport directly to the IRS, document return follows a separate mailing timeline. The IRS says supporting documents should be returned within 60 days from the date on the notice. Contact the number shown on the notice if they do not arrive.",
          "Keep the CAA receipt, courier tracking and a complete copy of the submitted package. These records help establish when the file entered the process.",
        ],
      },
      {
        id: "cp565",
        title: "What the CP565 notice means",
        paragraphs: [
          "CP565 is the IRS notice that confirms a new ITIN or an ITIN renewal. Check the spelling of the name and the date of birth, then keep the original notice with permanent tax records. Use the name and ITIN exactly as shown when filing future federal tax returns.",
          "CP565 is not a Social Security card, work permit or immigration document. If you later receive an SSN, stop using the ITIN for federal tax filing and ask the IRS to combine the tax records.",
        ],
      },
      {
        id: "delayed",
        title: "What to do when the expected period has passed",
        paragraphs: [
          "Wait until the applicable 7-week or 9-to-11-week window has passed before calling. Have the applicant's full name, mailing address, filing date, CAA receipt or delivery confirmation, and any IRS letter available. Never submit a duplicate Form W-7 simply because a notice is late unless the IRS or your adviser tells you to do so.",
        ],
      },
    ],
    faqs: [
      {
        question: "Does a CAA keep my original passport?",
        answer:
          "A CAA can usually authenticate an eligible passport and return it after review. Special document rules apply to some dependents and document types.",
      },
      {
        question: "Does CP565 mean my ITIN is active?",
        answer:
          "CP565 confirms that the IRS assigned or renewed the ITIN shown on the notice. Keep it with your tax records.",
      },
      {
        question: "Can a CAA see live IRS processing status?",
        answer:
          "No. A CAA can confirm submission records and help respond to correspondence, but does not have a public live-tracking system for the IRS ITIN unit.",
      },
    ],
    related: [
      "certified-acceptance-agent",
      "how-long-does-it-take-to-get-an-itin",
      "apply-for-itin-without-mailing-passport",
    ],
    sources: [
      { label: "IRS: Understanding your CP565 notice", href: "https://www.irs.gov/individuals/understanding-your-cp565-notice" },
      { label: "IRS: ITIN acceptance agents", href: "https://www.irs.gov/tin/itin/itin-acceptance-agents" },
      { label: "IRS: How to apply for an ITIN", href: "https://www.irs.gov/tin/itin/how-to-apply-for-an-itin" },
    ],
  },
  {
    slug: "non-us-resident-bank-account-itin-ein",
    title: "Non-US resident opening a US account: do you need an ITIN or EIN?",
    metaTitle: "Non-US Resident US Bank Account: ITIN or EIN?",
    metaDescription:
      "Understand when a non-US resident may need an ITIN or EIN for a US bank account, what banks can request and why the two tax IDs are not interchangeable.",
    excerpt:
      "A practical comparison of ITINs, EINs and bank identification rules for non-US residents.",
    summary:
      "An ITIN identifies an individual for federal tax purposes, while an EIN identifies a business or other entity. A bank may accept a passport, ITIN, EIN or other identification depending on the customer and account, but the IRS will not issue an ITIN solely to open a bank account.",
    category: "Banking",
    published: newPublished,
    updated: newPublished,
    readingTime: "8 min read",
    author: publisher,
    keywords: [
      "non US resident US bank account ITIN",
      "ITIN or EIN for bank account",
      "open US bank account without SSN",
      "foreign owner business bank account EIN",
      "nonresident alien bank account",
    ],
    sections: [
      {
        id: "quick-answer",
        title: "The short answer: the account holder determines the tax ID",
        paragraphs: [
          "For a personal account, a bank may ask a non-US resident for an ITIN if one has been issued, but its customer identification rules may also allow a foreign passport or another government-issued number. Each institution sets its own documentation and risk requirements within federal rules.",
          "For an account owned by a company, the bank will usually ask for the company's EIN and formation records. It may separately request personal identification and tax information for beneficial owners, managers or authorized signers.",
        ],
      },
      {
        id: "itin-vs-ein",
        title: "ITIN and EIN are not substitutes",
        paragraphs: [
          "An ITIN belongs to an individual who needs a US taxpayer identification number but is not eligible for an SSN. An EIN belongs to an entity or business tax account. Using the company's EIN in a field asking for the owner's personal TIN can create a mismatch, just as entering an ITIN where the bank asks for the entity's EIN can delay verification.",
        ],
        bullets: [
          "Personal tax reporting: SSN or ITIN when required",
          "Business account tax reporting: entity EIN when required",
          "Identity verification: passport or other accepted government ID",
          "Ownership checks: information for each relevant beneficial owner or controller",
        ],
      },
      {
        id: "itin-purpose",
        title: "You cannot get an ITIN only to open an account",
        paragraphs: [
          "The IRS states that it does not issue an ITIN solely for opening a bank or investment account, e-commerce or starting a business. A Form W-7 applicant must show a federal tax purpose, usually with a tax return or documentation for a listed exception.",
          "If a bank asks for an ITIN, that request by itself does not automatically establish eligibility. Ask the bank what alternative identification it accepts, then consider separately whether you have a genuine US tax filing or withholding reason for Form W-7.",
        ],
      },
      {
        id: "bank-checklist",
        title: "Documents a non-US resident may be asked to provide",
        paragraphs: [
          "Requirements vary, especially for remote applications. Confirm the list with the institution before paying a service provider or arranging travel.",
        ],
        bullets: [
          "Valid foreign passport and a second form of identification",
          "Residential address and proof of address",
          "ITIN, SSN or foreign tax number when applicable",
          "For a company, EIN letter and formation documents",
          "Ownership, control and source-of-funds information",
        ],
      },
      {
        id: "tax-reporting",
        title: "Opening the account and handling tax reporting are separate questions",
        paragraphs: [
          "A bank may be able to identify a foreign customer without an ITIN, but tax forms still depend on the customer's status and income. A foreign individual may be asked for Form W-8BEN, while a US person generally uses Form W-9. Do not choose a form based only on citizenship or the account's mailing address.",
        ],
      },
    ],
    faqs: [
      { question: "Can a non-US citizen open a US bank account?", answer: "Many banks allow it, but identification, address, in-person visit and product eligibility rules vary by institution." },
      { question: "Does an LLC EIN replace the owner's ITIN?", answer: "No. The EIN identifies the LLC or business tax account. A bank may still ask for separate personal information about the owner or signer." },
      { question: "Will the IRS issue an ITIN for banking only?", answer: "No. The IRS says an ITIN is not issued solely to open a bank or investment account. The applicant needs a federal tax purpose." },
    ],
    related: ["itin-for-non-us-residents", "itin-vs-ssn", "form-w-7-guide"],
    sources: [
      { label: "IRS: Topic 857, ITIN", href: "https://www.irs.gov/taxtopics/tc857" },
      { label: "FDIC: GetBanked", href: "https://www.fdic.gov/getbanked" },
      { label: "IRS: Taxpayer identification numbers", href: "https://www.irs.gov/tin/taxpayer-identification-numbers-tin" },
    ],
  },
  {
    slug: "foreign-seller-itin-tax-id-guide",
    title: "Foreign seller tax ID guide: when a non-US person needs an ITIN",
    metaTitle: "Foreign Seller ITIN and Tax ID Guide for Non-US Persons",
    metaDescription:
      "Learn when a foreign seller may need an ITIN, when a foreign TIN may be enough, and how W-8BEN, 1040-NR, marketplace sales and FIRPTA fit together.",
    excerpt:
      "How foreign TINs, ITINs, W-8BEN and US tax filing duties apply to non-US sellers.",
    summary:
      "A foreign seller does not automatically need an ITIN just because a US customer or online platform pays them. The correct tax ID depends on the income, withholding form, treaty claim and whether the seller must file a US return.",
    category: "Foreign sellers",
    published: newPublished,
    updated: newPublished,
    readingTime: "9 min read",
    author: publisher,
    keywords: [
      "foreign seller ITIN",
      "non US person tax identification number",
      "ITIN for online seller",
      "W-8BEN ITIN foreign TIN",
      "foreign property seller ITIN",
      "1040-NR seller",
    ],
    sections: [
      {
        id: "not-automatic",
        title: "Selling to US customers does not automatically require an ITIN",
        paragraphs: [
          "An ITIN is a federal tax processing number for an individual who has a US tax purpose and is not eligible for an SSN. The location of a marketplace, payment processor or customer does not by itself decide whether the seller needs one.",
          "Start with three facts: who legally earns the income, whether that person is an individual or entity, and what US tax or withholding rule applies. A foreign company may need an EIN, while a foreign individual with a filing obligation may need an ITIN.",
        ],
      },
      {
        id: "w8ben",
        title: "W-8BEN may use a foreign TIN or an ITIN, depending on the claim",
        paragraphs: [
          "A foreign individual commonly gives Form W-8BEN to a withholding agent to certify foreign status. The form has separate fields for a US TIN and a foreign tax identifying number. An ITIN is required in some situations, including certain treaty or effectively connected income cases, but not for every payment to a foreign person.",
          "Do not submit Form W-9 simply because a platform asks for a tax form. Form W-9 is for a US person. Supplying the wrong status certification can create incorrect reporting or withholding.",
        ],
      },
      {
        id: "filing-return",
        title: "When a US tax return creates the ITIN need",
        paragraphs: [
          "A nonresident alien who must file Form 1040-NR, or files to claim a refund of US tax withheld, generally needs an ITIN if not eligible for an SSN. The ITIN application is usually filed with the return unless a Form W-7 exception applies.",
          "Marketplace reporting and income-tax liability are different issues. Receiving an information form does not, by itself, settle where income is sourced or whether a treaty applies.",
        ],
      },
      {
        id: "property",
        title: "Foreign sellers of US real property have special FIRPTA rules",
        paragraphs: [
          "A foreign individual selling a US real property interest may need an ITIN for FIRPTA withholding procedures, a reduced-withholding application or a later Form 1040-NR refund claim. The IRS lists transaction documents that may support Form W-7 in these cases, including the sales contract, closing statement and Forms 8288 or 8288-A.",
          "Because closing dates and withholding certificates are time-sensitive, involve a tax professional and closing agent early rather than waiting until the transfer date.",
        ],
      },
      {
        id: "decision-list",
        title: "Questions to answer before applying",
        paragraphs: [
          "An application should follow the tax requirement, not the other way around. Confirm the following points before preparing Form W-7.",
        ],
        bullets: [
          "Is the seller an individual or a legal entity?",
          "Is the income US-source or effectively connected with a US trade or business?",
          "Is a treaty benefit being claimed?",
          "Did a payer request W-8BEN, W-8BEN-E or another withholding form?",
          "Must the seller file Form 1040-NR or claim a withholding refund?",
        ],
      },
    ],
    faqs: [
      { question: "Does every foreign Amazon or ecommerce seller need an ITIN?", answer: "No. The answer depends on the legal seller, US tax filing duty and withholding documentation. The IRS does not issue an ITIN solely for e-commerce." },
      { question: "Can I use my foreign TIN on Form W-8BEN?", answer: "Form W-8BEN includes a foreign TIN field. Whether a US ITIN is also required depends on the payment and the tax or treaty position claimed." },
      { question: "Does a foreign company use an ITIN?", answer: "No. An ITIN identifies an individual. A foreign entity that needs a US taxpayer number generally applies for an EIN." },
    ],
    related: ["itin-for-non-us-residents", "form-w-7-guide", "itin-requirements-and-documents"],
    sources: [
      { label: "IRS: Instructions for Form W-8BEN", href: "https://www.irs.gov/instructions/iw8ben" },
      { label: "IRS: ITIN guidance for foreign property buyers and sellers", href: "https://www.irs.gov/individuals/international-taxpayers/itin-guidance-for-foreign-property-buyers-sellers" },
      { label: "IRS: Topic 857, ITIN", href: "https://www.irs.gov/taxtopics/tc857" },
    ],
  },
  {
    slug: "check-itin-status-phone-numbers",
    title: "How to check ITIN status by phone: 267-941-1000 and 800-829-1040",
    metaTitle: "Check ITIN Status: IRS Phone Numbers and CP565",
    metaDescription:
      "Learn when and how to call the IRS about ITIN status, which number to use inside or outside the US, what to prepare and why CP565 matters.",
    excerpt:
      "When to call the IRS, which ITIN status number applies and what information to have ready.",
    summary:
      "For general individual help, the IRS lists 800-829-1040 inside the United States and 267-941-1000 for international callers. Your notice may show a more specific number, which should normally be used first. Wait through the published ITIN processing period before requesting status.",
    category: "ITIN status",
    published: newPublished,
    updated: newPublished,
    readingTime: "7 min read",
    author: publisher,
    keywords: [
      "ITIN status 267-941-1000",
      "ITIN status 800-829-1040",
      "check ITIN status",
      "IRS ITIN phone number",
      "CP565 status",
      "ITIN application tracking",
    ],
    sections: [
      {
        id: "numbers",
        title: "Which IRS number should you call?",
        paragraphs: [
          "If you have an IRS notice, start with the telephone number printed on it. That route is tied most closely to the type of correspondence you received. For general individual assistance, the IRS lists 800-829-1040 for callers in the United States. International callers can use 267-941-1000, which is not toll-free.",
          "Phone numbers and hours can change. Confirm them on IRS.gov or on the latest notice before calling, especially if you found a number on a third-party website.",
        ],
      },
      {
        id: "when-to-call",
        title: "Wait until the normal processing window has passed",
        paragraphs: [
          "The IRS says to allow 7 weeks for notification of ITIN application status. Allow 9 to 11 weeks if you applied during the January 15 through April 30 peak period or submitted from overseas. Calling earlier usually will not produce a final decision.",
          "Count from confirmed delivery to the IRS, not from the day you handed the packet to a preparer or postal counter.",
        ],
      },
      {
        id: "prepare",
        title: "What to have ready before the call",
        paragraphs: [
          "The IRS must verify identity before discussing a tax account. Keep the application copy and delivery record in front of you and allow enough time for the call.",
        ],
        bullets: [
          "Applicant's full legal name, date of birth and current address",
          "Date and method of submission",
          "Courier tracking or CAA submission receipt",
          "Copy of Form W-7 and attached tax return",
          "Any CP565, CP566 or CP567 notice received",
        ],
      },
      {
        id: "notices",
        title: "CP565, CP566 and CP567 are different",
        paragraphs: [
          "CP565 confirms that the IRS assigned or renewed an ITIN. CP566 asks for additional information. CP567 explains that the application was rejected. Read the response deadline and mailing instructions carefully before sending anything.",
          "If CP565 has arrived, the status question is usually resolved. Check the name and date of birth and keep the notice in your permanent records.",
        ],
      },
      {
        id: "protect",
        title: "Protect yourself from fake status services",
        paragraphs: [
          "Do not give a passport scan, tax return or payment to an unknown caller who promises an instant status result. IRS representatives will not demand payment by gift card, cryptocurrency or wire transfer to release an ITIN. Use the number printed on official correspondence or published on IRS.gov.",
        ],
      },
    ],
    faqs: [
      { question: "Is 267-941-1000 toll-free?", answer: "No. The IRS identifies it as an international, non-toll-free number." },
      { question: "Can 800-829-1040 check an ITIN application?", answer: "It is the IRS general individual assistance line. If you have a notice with a specific number, use the number on the notice first." },
      { question: "What does CP565 mean?", answer: "CP565 confirms that the IRS assigned or renewed the ITIN shown on the notice." },
    ],
    related: ["can-you-check-itin-status-online", "how-long-does-it-take-to-get-an-itin", "caa-passport-processing-time-cp565"],
    sources: [
      { label: "IRS: Contact information", href: "https://www.irs.gov/help/let-us-help-you" },
      { label: "IRS: Understanding your CP565 notice", href: "https://www.irs.gov/individuals/understanding-your-cp565-notice" },
      { label: "IRS: How to apply for an ITIN", href: "https://www.irs.gov/tin/itin/how-to-apply-for-an-itin" },
    ],
  },
  {
    slug: "ein-foreign-responsible-party-no-itin-ssn",
    title: "EIN for a foreign responsible party with no ITIN or SSN",
    metaTitle: "EIN for Foreign Responsible Party Without ITIN or SSN",
    metaDescription:
      "See how a foreign responsible party can complete Form SS-4 without an ITIN or SSN, when to enter foreign or N/A and how international EIN applications work.",
    excerpt:
      "Form SS-4 rules for a foreign responsible party who is not eligible for an SSN or ITIN.",
    summary:
      "A foreign responsible party who has no SSN or ITIN and is ineligible to obtain either may enter “foreign” or “N/A” on Form SS-4 line 7b. International applicants who have no US legal residence, principal office or principal place of business cannot use the IRS online EIN application.",
    category: "EIN",
    published: newPublished,
    updated: newPublished,
    readingTime: "8 min read",
    author: publisher,
    keywords: [
      "EIN foreign responsible party no ITIN",
      "EIN without SSN",
      "Form SS-4 line 7b foreign",
      "foreign owner EIN application",
      "international EIN phone number",
      "EIN nonresident alien",
    ],
    sections: [
      {
        id: "line-7b",
        title: "What to enter on Form SS-4 line 7b",
        paragraphs: [
          "The current Form SS-4 instructions say to enter “foreign” or “N/A” on line 7b when the responsible party does not have and is ineligible to obtain an SSN or ITIN. An entry is still required. Do not invent a number, borrow another person's TIN or use the new entity's EIN before it exists.",
          "If the responsible party already has an SSN or ITIN, use that number as directed. The exception is for a person who is genuinely ineligible, not simply someone who would prefer not to provide an existing TIN.",
        ],
      },
      {
        id: "responsible-party",
        title: "Who counts as the responsible party?",
        paragraphs: [
          "For most nongovernment applicants, the responsible party must be an individual. It is the person who ultimately owns or controls the entity, or who exercises effective control over its funds and assets. Listing a formation agent or another company merely for convenience can make the application inaccurate.",
        ],
      },
      {
        id: "online-limit",
        title: "Why many foreign applicants cannot use the online EIN tool",
        paragraphs: [
          "The IRS online application is limited to applicants whose legal residence, principal place of business, or principal office or agency is in the United States or a US territory. The online process also requires a valid taxpayer identification number for the responsible party or principal person using it.",
          "If the entity has no qualifying US location, use an international method even if it was formed in a US state. Formation and principal place of business are not always the same fact.",
        ],
      },
      {
        id: "apply",
        title: "International EIN application methods",
        paragraphs: [
          "International applicants may apply by phone, fax or mail. The IRS currently lists 267-941-1099 for eligible international telephone applications. For a foreign address, the current SS-4 instructions list fax 304-707-9471 from outside the United States. Always confirm the latest number before sending sensitive information.",
          "Complete Form SS-4 before calling. If applying by fax or mail, sign it and keep the transmission confirmation or delivery record. Use only one method for the same entity to avoid duplicate EINs.",
        ],
      },
      {
        id: "after",
        title: "After the EIN is issued",
        paragraphs: [
          "Keep the assignment notice with permanent company records and use the EIN only for the entity it identifies. An EIN does not create an LLC, open a bank account automatically or replace the owner's personal tax number. Report later responsible-party or address changes on Form 8822-B within the applicable deadline.",
        ],
      },
    ],
    faqs: [
      { question: "Can a foreign owner get an EIN without an ITIN?", answer: "Yes, when the responsible party has no SSN or ITIN and is ineligible for either, the SS-4 instructions permit “foreign” or “N/A” on line 7b." },
      { question: "Can a foreign-owned US LLC apply for an EIN online?", answer: "Only if it meets the IRS location and responsible-party TIN conditions for the online tool. Many owners operating entirely from abroad must use an international method." },
      { question: "Is 267-941-1099 the ITIN status number?", answer: "No. It is the number listed for eligible international EIN applications. The similar 267-941-1000 number is used for international individual tax assistance." },
    ],
    related: ["non-us-business-owner-representative-tax-id", "non-us-resident-bank-account-itin-ein", "itin-for-non-us-residents"],
    sources: [
      { label: "IRS: Instructions for Form SS-4", href: "https://www.irs.gov/instructions/iss4" },
      { label: "IRS: About Form SS-4", href: "https://www.irs.gov/forms-pubs/about-form-ss-4" },
      { label: "IRS: Where to file Form SS-4", href: "https://www.irs.gov/filing/where-to-file-your-taxes-for-form-ss-4" },
    ],
  },
  {
    slug: "non-us-business-owner-representative-tax-id",
    title: "Business representative and owner Tax ID requirements for non-US companies",
    metaTitle: "Non-US Business Rep and Owner Tax ID Requirements",
    metaDescription:
      "Understand which Tax ID a non-US business, owner, responsible party and authorized representative may need for EIN, banking and US tax forms.",
    excerpt:
      "A role-by-role guide to EIN, ITIN, SSN and foreign TIN requests for non-US businesses.",
    summary:
      "A business EIN, an owner's personal TIN and a representative's identity serve different purposes. A non-US company should identify who owns the account, who controls the entity and which US filing or onboarding rule is asking for a number before entering an EIN, ITIN, SSN or foreign TIN.",
    category: "Business tax IDs",
    published: newPublished,
    updated: newPublished,
    readingTime: "9 min read",
    author: publisher,
    keywords: [
      "Business Rep Owner Tax ID requirements non-US",
      "non US business owner tax ID",
      "foreign company representative TIN",
      "beneficial owner ITIN EIN",
      "authorized signer tax identification",
      "foreign responsible party SS-4",
    ],
    sections: [
      {
        id: "four-roles",
        title: "Separate the company, owner, responsible party and representative",
        paragraphs: [
          "Onboarding forms often place several roles on one screen, which makes Tax ID requests look interchangeable. They are not. The company is the legal account holder, the beneficial owner has an ownership interest, the responsible party controls the entity for IRS EIN records, and an authorized representative acts for the company within granted authority.",
          "One person can fill more than one role, but the form should still be answered for the role named in that field.",
        ],
      },
      {
        id: "which-id",
        title: "Which number normally belongs to each role?",
        paragraphs: [
          "The correct answer depends on the form and tax classification. This is a working guide, not a substitute for the instructions beside the field.",
        ],
        bullets: [
          "Business or entity: EIN if a US federal entity tax number is required",
          "US individual owner: SSN or ITIN as applicable",
          "Foreign individual owner: foreign TIN, ITIN or other identification, depending on the rule",
          "Responsible party on Form SS-4: SSN or ITIN, or “foreign” or “N/A” when the person has neither and is ineligible",
          "Authorized representative: personal identification and authority documents, not automatic use of the company's EIN as a personal TIN",
        ],
      },
      {
        id: "platforms-banks",
        title: "Banks and platforms can request more than the IRS minimum",
        paragraphs: [
          "A bank, payment provider or marketplace must verify customers and may have its own supported-country, address and documentation rules. Having an EIN does not force a provider to open an account. The provider may ask for passports, ownership percentages, residential addresses, source-of-funds information and tax residence details.",
          "If a portal labels a field only as “Tax ID,” ask whether it wants the entity's EIN, the individual's US TIN or the foreign tax number. Guessing can lead to an automated mismatch that is difficult to correct.",
        ],
      },
      {
        id: "w8-forms",
        title: "Withholding forms follow the beneficial owner and entity type",
        paragraphs: [
          "A foreign individual generally uses Form W-8BEN to certify foreign status. A foreign entity generally uses Form W-8BEN-E or another form appropriate to its classification and income. A US person generally uses Form W-9. The authorized signer signs for the beneficial owner or entity but does not replace that person's tax identity with their own.",
        ],
      },
      {
        id: "checklist",
        title: "A safer onboarding checklist",
        paragraphs: [
          "Before entering any number, save the field label and instructions, identify the legal account holder, confirm tax residence and classification, and match the number to the named role. Keep formation records, EIN correspondence and ownership information consistent across applications.",
          "Do not apply for an ITIN simply because a private form appears to require one. First determine whether the owner has a federal tax purpose and is ineligible for an SSN.",
        ],
      },
    ],
    faqs: [
      { question: "Can the representative enter the company's EIN as their Tax ID?", answer: "Only if the field specifically asks for the entity's EIN. An EIN should not be used as though it were the representative's personal TIN." },
      { question: "Does every foreign beneficial owner need an ITIN?", answer: "No. It depends on the US tax purpose, filing duty and the form being completed. A foreign TIN or identification document may be the correct requirement in some settings." },
      { question: "Can an entity be the responsible party on Form SS-4?", answer: "For most nongovernment entities, the responsible party must be an individual who ultimately owns or controls the entity." },
    ],
    related: ["ein-foreign-responsible-party-no-itin-ssn", "non-us-resident-bank-account-itin-ein", "foreign-seller-itin-tax-id-guide"],
    sources: [
      { label: "IRS: Instructions for Form SS-4", href: "https://www.irs.gov/instructions/iss4" },
      { label: "IRS: Instructions for Form W-8BEN", href: "https://www.irs.gov/instructions/iw8ben" },
      { label: "IRS: Taxpayer identification numbers", href: "https://www.irs.gov/tin/taxpayer-identification-numbers-tin" },
    ],
  },
  {
    slug: "can-you-check-itin-status-online",
    title: "Can you check ITIN status online? What the IRS offers instead",
    metaTitle: "Can You Check ITIN Status Online? IRS Options",
    metaDescription:
      "There is no general IRS online ITIN application tracker. Learn what you can check online, when to call, how long to wait and how to recognize CP565.",
    excerpt:
      "Why there is no general online ITIN tracker and the safest ways to follow an application.",
    summary:
      "The IRS does not provide a general online tracker where a Form W-7 applicant can enter details and see live ITIN status. Delivery tracking, processing-time guidance, mailed notices and IRS telephone assistance are the practical ways to follow the application.",
    category: "ITIN status",
    published: newPublished,
    updated: newPublished,
    readingTime: "7 min read",
    author: publisher,
    keywords: [
      "ITIN cannot check online status",
      "check ITIN status online",
      "ITIN application tracker",
      "IRS ITIN status online",
      "track Form W-7",
      "CP565 notice online",
    ],
    sections: [
      {
        id: "no-tracker",
        title: "There is no general online Form W-7 status tracker",
        paragraphs: [
          "You can prepare an application online and use a courier's website to confirm delivery, but those services do not show the IRS review stage. The IRS does not offer a public Form W-7 tracker comparable to package tracking or the “Where's My Refund?” tool.",
          "Be careful with websites that ask for a passport number, date of birth or payment to reveal instant ITIN status. A private preparer may show its own workflow, such as documents received or package mailed, but that is not live IRS case data.",
        ],
      },
      {
        id: "online-help",
        title: "What you can confirm online",
        paragraphs: [
          "Online tools are still useful for confirming the current Form W-7, reviewing accepted documents, finding an IRS Taxpayer Assistance Center and checking published processing guidance. Courier tracking can confirm that a mailed package reached the IRS address.",
          "An IRS online account may show tax-account information, but it should not be treated as a live ITIN application tracker. The official mailed notice remains the clearest decision record.",
        ],
      },
      {
        id: "timeline",
        title: "Allow the full processing time before following up",
        paragraphs: [
          "Allow 7 weeks after IRS receipt for an application-status notice. Allow 9 to 11 weeks during the January 15 through April 30 peak period or when filing from overseas. Add delivery time for the notice to reach an international address.",
          "If you used a CAA, ask for proof of submission and confirm the mailing address entered on Form W-7. The CAA can help interpret correspondence but cannot turn a private portal into IRS tracking.",
        ],
      },
      {
        id: "follow-up",
        title: "How to follow up safely",
        paragraphs: [
          "After the relevant period has passed, call the IRS using the number on any notice. For general individual help, the IRS lists 800-829-1040 in the United States and 267-941-1000 for international calls. The international number is not toll-free.",
          "Have the delivery date, Form W-7 copy, current address and any notice available. If someone else calls for you, the IRS may require valid authorization before discussing protected tax information.",
        ],
      },
      {
        id: "notice-result",
        title: "The notice tells you the result",
        paragraphs: [
          "CP565 means an ITIN was assigned or renewed. CP566 requests more information, and CP567 reports a rejection. Respond using the instructions and deadline on the notice. Do not send a second application just because the first one is not visible online.",
        ],
      },
    ],
    faqs: [
      { question: "Can I track Form W-7 with Where's My Refund?", answer: "No. The refund tool is not a Form W-7 or ITIN application tracker." },
      { question: "Can a CAA track my ITIN online?", answer: "A CAA can track its own preparation and submission steps, but there is no general public live IRS ITIN-status portal." },
      { question: "How will I know the ITIN was approved?", answer: "The IRS sends CP565 to confirm that it assigned or renewed an ITIN." },
    ],
    related: ["check-itin-status-phone-numbers", "how-long-does-it-take-to-get-an-itin", "caa-passport-processing-time-cp565"],
    sources: [
      { label: "IRS: Individual taxpayer identification number", href: "https://www.irs.gov/tin/itin/individual-taxpayer-identification-number-itin" },
      { label: "IRS: Understanding your CP565 notice", href: "https://www.irs.gov/individuals/understanding-your-cp565-notice" },
      { label: "IRS: How to apply for an ITIN", href: "https://www.irs.gov/tin/itin/how-to-apply-for-an-itin" },
    ],
  },
];

export const blogArticleMap = new Map(
  blogArticles.map((article) => [article.slug, article])
);
