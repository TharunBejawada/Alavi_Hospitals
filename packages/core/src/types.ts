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

// A detail page for exactly one condition or procedure within a speciality's
// landing page. 1-to-1: (specialityId, itemType, itemId) uniquely identifies
// at most one Treatment.
export interface Treatment {
  treatmentId: string;
  specialityId: string;
  specialityName: string; // denormalized, for admin list display
  itemType: TreatmentItemType;
  itemId: string; // -> ConditionTreated.id or TreatmentProcedure.id
  itemTitle: string; // denormalized snapshot of the condition/procedure title
  pageId: string; // SpecialityLandingPage.pageId this item came from
  title: string; // detail page H1, defaults to itemTitle, editable
  bannerImage: string;
  content: string; // RTE HTML
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