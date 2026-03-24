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