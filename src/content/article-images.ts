export interface ArticleImage {
  src: string;
  alt: string;
  objectPosition?: string;
}

export const articleImages: Record<string, ArticleImage> = {
  "how-to-apply-for-an-itin": {
    src: "/images/blog/apply-for-itin-online-guide.jpg",
    alt: "Tax professionals reviewing application paperwork in an office",
    objectPosition: "center 38%",
  },
  "itin-requirements-and-documents": {
    src: "/images/blog/itin-requirements-documents.jpg",
    alt: "Organized stacks of paper documents and office folders",
    objectPosition: "center 52%",
  },
  "how-long-does-it-take-to-get-an-itin": {
    src: "/images/blog/itin-processing-time-calendar.jpg",
    alt: "Desktop calendar used to plan an ITIN processing timeline",
    objectPosition: "center 58%",
  },
  "itin-renewal-guide": {
    src: "/images/blog/itin-renewal-form-signing.jpg",
    alt: "Person completing renewal paperwork beside a calculator",
    objectPosition: "center 48%",
  },
  "form-w-7-guide": {
    src: "/images/blog/form-w7-tax-preparation.jpg",
    alt: "Professional reviewing tax forms with a calculator and laptop",
    objectPosition: "center 46%",
  },
  "itin-for-non-us-residents": {
    src: "/images/blog/itin-non-us-residents-passport.jpg",
    alt: "Passport beside an airplane window for an international applicant",
    objectPosition: "center 42%",
  },
  "itin-vs-ssn": {
    src: "/images/blog/itin-vs-ssn-document-comparison.jpg",
    alt: "Tax documents and calculator arranged for identification-number comparison",
    objectPosition: "center 48%",
  },
  "certified-acceptance-agent": {
    src: "/images/blog/certified-acceptance-agent-review.jpg",
    alt: "Professional explaining a document during an application review",
    objectPosition: "center 50%",
  },
  "apply-for-itin-without-mailing-passport": {
    src: "/images/blog/itin-without-mailing-passport.jpg",
    alt: "Passport resting on international travel documents",
    objectPosition: "center 52%",
  },
};
