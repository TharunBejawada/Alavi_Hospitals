export type UserRole = "ADMIN" | "EDITOR" | "DOCTOR";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  status: "ACTIVE" | "INACTIVE";
  lastLogin?: string;
}

export interface ExtraField {
  heading: string;
  description: string;
}

export interface Tag {
  name: string;
}

export interface BlogPost {
  blogId: string;
  blogImage: string;
  blogTitle: string;
  categories: string[];
  tags: Tag[];
  author: string;
  timeline: string; // Date string
  extraFields: ExtraField[];
  
  // SEO
  seoTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  url?: string;
  
  enabled: boolean;
  createdAt: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Doctor {
  doctorId: string;
  name: string;
  department: string;
  qualification: string;
  experience?: string;
  location?: string;
  priorityOrder?: number;
  image?: string;
  seoTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  url?: string;
  enabled: boolean;
  
  // The old string field (optional now)
  designation?: string; 
  
  // The new array fields
  designations?: string[];
  keyExpertise?: string[];
  conditionsTreated?: string[];
  qualificationsList?: string[];
  experienceAchievements?: string[];
  memberships?: string[];
  closingDescription?: string;
  
  // Existing dynamic objects
  extraFields?: { heading: string; description: string }[];
  faqs?: { question: string; answer: string }[];
}

export interface Speciality {
  specialityId: string;
  specialityName: string;
  description: string;
  icon: string;
  image: string;
  enabled: boolean;
  priorityOrder?: number; // Added to match your doctor sorting logic
  createdAt?: string;
}

export interface ConditionTreated {
  id?: string;
  icon: string;
  title: string;
  description: string;
}

export interface TreatmentProcedure {
  id?: string;
  title: string;
  description: string;
}

// Deterministic fallback id for legacy list items saved before `id` existed.
// Stable across renders as long as array order/length don't change; real
// persistence happens the next time the owning speciality-pages record is saved.
export function backfillItemIds<T extends { id?: string; title: string }>(
  items: T[] | undefined,
  seedPrefix: string
): (T & { id: string })[] {
  return (items || []).map((item, index) =>
    item.id ? (item as T & { id: string }) : { ...item, id: `${seedPrefix}-${index}` }
  );
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface SpecialityLandingPage {
  pageId: string;
  specialityId: string; // Used to map to the core speciality
  title: string;
  description: string; // RTE
  bannerImage: string;
  conditionsTreated: {
    title: string;
    description: string; // RTE
    list: ConditionTreated[];
  };
  specialityDoctors: {
    title: string;
    description: string;
  };
  treatmentsProcedures: {
    title: string;
    description: string; // RTE
    list: TreatmentProcedure[];
  };
  faqs: FAQ[];
  seoConfig: {
    title: string;
    url: string; // Unique URL slug
    metaDescription: string;
    metaKeywords: string;
  };
  enabled: boolean;
  createdAt?: string;
}

export type TreatmentItemType = "condition" | "procedure";

// A generic icon/image + title + description entry used across several
// Treatment sections (causes, symptoms, diagnosis steps, treatment options).
export interface TreatmentInfoItem {
  id?: string;
  icon?: string;
  image?: string;
  title: string;
  description: string;
}

export interface TreatmentMappedItem {
  itemType: TreatmentItemType;
  itemId: string;
  itemTitle: string; // denormalized snapshot of the condition/procedure title
}

// A detail page primarily written for one condition or procedure within a
// speciality's landing page, optionally also linked from other similar
// items via `additionalItems` (e.g. "Migraine" and "Headache" both pointing
// at the same treatment page). Each (specialityId, itemType, itemId) pair —
// whether primary or additional — may map to at most one Treatment.
export interface Treatment {
  treatmentId: string;
  specialityId: string;
  specialityName: string; // denormalized, for admin list display
  itemType: TreatmentItemType;
  itemId: string; // -> ConditionTreated.id or TreatmentProcedure.id
  itemTitle: string; // denormalized snapshot of the condition/procedure title
  additionalItems?: TreatmentMappedItem[]; // other similar items also served by this same page
  pageId: string; // SpecialityLandingPage.pageId this item came from

  // Hero
  badgeLabel: string; // small pill above the headline, e.g. "Migraine Treatment"
  title: string; // headline (H1), defaults to itemTitle, editable
  subtitle: string; // short supporting line under the headline

  // "What is X?" overview
  overview: {
    title: string;
    description: string; // RTE
    image: string;
  };

  // "Why Does X Occur?" causes & triggers
  causes: {
    title: string;
    description: string; // RTE
    list: TreatmentInfoItem[];
  };

  // "Common Signs & Symptoms" checklist
  symptoms: {
    title: string;
    description: string;
    list: string[];
  };

  // Mid-page CTA banner (sits between the diagnosis steps and treatment
  // options sections; buttons are fixed site-wide actions)
  ctaText: string;

  // Heading for the static "Why Choose Alavi Hospital" band, e.g.
  // "Expert Neurology Care for Better Migraine Management" (the icon
  // row itself is fixed sitewide content, not per-treatment).
  whyChooseHeading: string;

  // "BOOK YOUR CONSULTATION" bottom CTA band (buttons are fixed site-wide actions)
  bottomCta: {
    label: string; // small caps label, e.g. "BOOK YOUR CONSULTATION"
    heading: string;
    description1: string;
    description2: string;
  };

  // "How is X Diagnosed at Alavi Hospitals?"
  diagnosis: {
    title: string;
    description: string; // RTE
    list: TreatmentInfoItem[];
  };

  // Treatment options / advanced solutions
  treatmentOptions: {
    title: string;
    description: string; // RTE
    list: TreatmentInfoItem[];
  };

  faqs: FAQ[];

  seoConfig: {
    title: string;
    url: string; // unique URL slug
    metaDescription: string;
    metaKeywords: string;
  };
  enabled: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// A standalone "Second Opinion" topic page (e.g. Hernia, Cardiac Surgery),
// independent of the Speciality/Treatment mapping — admin-authored, listed
// on a public hub page and sorted by priorityOrder (lower shows first).
export interface SecondOpinionTopic {
  secondOpinionId: string;
  priorityOrder?: number; // lower shows first, missing/falsy treated as last

  title: string; // topic name, e.g. "Hernia" — used on the hub listing card
  icon: string; // small icon shown with the title in the hub's "Conditions Commonly Reviewed" row
  heroHeading: string; // e.g. "Already advised hernia surgery? Get an expert second opinion before you decide."
  heroImage: string;

  // "What is X?" overview
  overview: {
    title: string;
    description: string; // RTE
    image: string;
  };

  // "When is Surgery Recommended?"
  surgeryRecommendation: {
    title: string;
    description: string; // RTE
    listIntro: string; // e.g. "Surgery may be considered when you experience:"
    list: string[];
    note: string; // closing note, e.g. "The decision to undergo surgery should always be based on..."
  };

  // "What are the risks of delaying treatment?" timeline
  risks: {
    title: string;
    description: string; // RTE
    list: TreatmentInfoItem[]; // icon not used in this section
    note: string; // closing note
  };

  // "What are the benefits of timely surgery?" band
  benefits: {
    title: string;
    description: string; // RTE
    list: string[];
    note: string;
  };

  // "A second opinion, step by step." numbered timeline
  steps: TreatmentInfoItem[];

  // Bottom "Request a Second Opinion" section (form fields are fixed;
  // only the surrounding copy/image is admin-editable)
  requestSection: {
    image: string;
    heading: string;
    description: string;
  };

  faqs: FAQ[];

  seoConfig: {
    title: string;
    url: string; // unique URL slug
    metaDescription: string;
    metaKeywords: string;
  };
  enabled: boolean;
  createdAt?: string;
  updatedAt?: string;
}