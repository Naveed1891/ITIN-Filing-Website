export interface Package {
  id: string;
  slug: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  isPopular?: boolean;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Step {
  number: string;
  title: string;
  description: string;
}

export interface TimelineItem {
  label: string;
  title: string;
  description: string;
}
