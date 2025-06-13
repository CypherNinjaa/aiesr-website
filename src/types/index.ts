export interface Program {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  duration: string;
  level: "undergraduate" | "postgraduate" | "doctoral" | "certificate";
  eligibility: string[];
  curriculum: string[];
  careerProspects: string[];
  highlights: string[];
  image: string;
  slug: string;
  fees?: string;
}

export interface Faculty {
  id: string;
  name: string;
  designation: string;
  specialization: string[];
  education: string[];
  experience: number;
  publications: string[];
  awards?: string[];
  image: string;
  bio: string;
  email?: string;
  researchAreas?: string[];
}

export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  publishDate: Date;
  author: string;
  category: string;
  featuredImage: string;
  slug: string;
  tags?: string[];
}

// Dynamic Category Interface
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color_class: string;
  icon_emoji: string;
  is_active: boolean;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
  created_by?: string;
}

export interface EventRaw {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  date: string;
  endDate?: string;
  location: string;
  type?: "academic" | "cultural" | "research" | "workshop"; // Deprecated - kept for migration
  category_id?: string; // New dynamic category reference
  image?: string;
  registrationRequired: boolean;
  registrationLink?: string; // For backward compatibility with existing data
  customRegistrationLink?: string; // New field for admin-defined registration links
  featured?: boolean;
  capacity?: number;
  registeredCount?: number;
  speakers?: string[];
  schedule?: {
    time: string;
    title: string;
    speaker?: string;
    description: string;
  }[];
  tags?: string[];
}

export interface Event {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  date: Date;
  endDate?: Date;
  location: string;
  type?: "academic" | "cultural" | "research" | "workshop"; // Deprecated - kept for migration
  category_id?: string; // New dynamic category reference
  category?: Category; // Populated category object
  image?: string;
  registrationRequired: boolean;
  registrationLink?: string; // For backward compatibility with existing data
  customRegistrationLink?: string; // New field for admin-defined registration links
  featured?: boolean;
  capacity?: number;
  registeredCount?: number;
  speakers?: string[];
  schedule?: {
    time: string;
    title: string;
    speaker?: string;
    description: string;
  }[];
  tags?: string[];
  // New fields for admin management
  status?: "draft" | "published" | "cancelled" | "completed";
  createdAt?: Date;
  updatedAt?: Date;
  registrationDeadline?: Date;
}

export interface Testimonial {
  id: string;
  name: string;
  program: string;
  year: string;
  image: string;
  quote: string;
  currentPosition?: string;
  company?: string;
}

export interface NavigationItem {
  label: string;
  href: string;
  children?: NavigationItem[];
}

export interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
}

// Admin related types
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "super_admin";
  createdAt: Date;
  lastLogin?: Date;
}

// Legacy EventCategory - use Category interface instead
export interface EventCategory {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  createdAt: Date;
}

export interface EventAnalytics {
  eventId: string;
  views: number;
  registrationClicks: number;
  lastUpdated: Date;
}
