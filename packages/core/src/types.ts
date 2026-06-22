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
  icon: string;
  title: string;
  description: string;
}

export interface TreatmentProcedure {
  title: string;
  description: string;
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