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
  sections: ArticleSection[];
  faqs: Array<{ question: string; answer: string }>;
  related: string[];
  sources: Array<{ label: string; href: string }>;
}

const published = "2026-06-29";
const updated = "2026-06-29";

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
];

export const blogArticleMap = new Map(
  blogArticles.map((article) => [article.slug, article])
);
