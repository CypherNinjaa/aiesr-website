// ============================================
// PROGRAM INTERFACES - Dynamic Database-Driven Programs
// ============================================

export interface Program {
  id: string;
  title: string;
  description: string;
  short_description: string;
  duration: string;
  level: "undergraduate" | "postgraduate" | "doctoral" | "certificate";
  fees?: string;
  image_url?: string;
  slug: string;

  // Admin-controlled links and content
  apply_link?: string;
  learn_more_content?: string;

  // JSON fields for flexible data
  eligibility: string[];
  curriculum: string[];
  career_prospects: string[];
  highlights: string[];

  // Display control
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;

  // Metadata
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

// Data for creating new programs
export interface CreateProgramData {
  title: string;
  description: string;
  short_description: string;
  duration: string;
  level: "undergraduate" | "postgraduate" | "doctoral" | "certificate";
  fees?: string;
  image_url?: string;
  slug: string;
  apply_link?: string;
  learn_more_content?: string;
  eligibility: string[];
  curriculum: string[];
  career_prospects: string[];
  highlights: string[];
  is_active?: boolean;
  is_featured?: boolean;
  sort_order?: number;
}

// Data for updating existing programs
export type UpdateProgramData = Partial<CreateProgramData>;

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
  // New fields for enhanced visual content
  posterImage?: string; // Main event poster for hero section
  pdfBrochure?: string; // URL to downloadable PDF brochure
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
  // New fields for enhanced visual content
  posterImage?: string; // Main event poster for hero section
  pdfBrochure?: string; // URL to downloadable PDF brochure
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

// Achievement interfaces
export interface Achievement {
  id: string;
  title: string;
  description: string;
  category_id: string; // References categories table
  category?: Category; // Populated category data
  type: "award" | "publication" | "recognition" | "milestone" | "collaboration";
  achiever_name: string;
  achiever_type: "student" | "faculty" | "department" | "institution";
  date_achieved: Date;
  image_url?: string;
  details?: {
    institution?: string;
    award_body?: string;
    amount?: string;
    rank?: string;
    publication_details?: string;
    collaboration_partners?: string[];
    impact?: string;
    media_links?: string[];
  };
  is_featured: boolean;
  sort_order: number;
  status: "draft" | "published" | "archived";
  created_at: Date;
  updated_at: Date;
  created_by: string;
}

export interface AchievementFormData {
  title: string;
  description: string;
  category_id: string; // References categories table
  type: "award" | "publication" | "recognition" | "milestone" | "collaboration";
  achiever_name: string;
  achiever_type: "student" | "faculty" | "department" | "institution";
  date_achieved: string;
  image_url?: string;
  details?: {
    institution?: string;
    award_body?: string;
    amount?: string;
    rank?: string;
    publication_details?: string;
    collaboration_partners?: string[];
    impact?: string;
    media_links?: string[];
  };
  is_featured?: boolean;
  sort_order?: number;
  status?: "draft" | "published" | "archived";
}

export interface AchievementStats {
  total: number;
  student_achievements: number;
  faculty_achievements: number;
  recent_achievements: number;
  featured_achievements: number;
}

// Database Testimonial interfaces (for admin/database operations)
export interface DatabaseTestimonial {
  id: string;
  student_name: string;
  email?: string;
  photo_url?: string;
  story_text: string;
  graduation_year?: number;
  current_position?: string;
  company?: string;
  academic_program?:
    | "BA English Literature"
    | "MA English Literature"
    | "PhD English Studies"
    | "Certificate Courses"
    | "Other";
  status: "pending" | "approved" | "rejected";
  is_featured: boolean;
  rejection_reason?: string;
  sort_order: number;
  submitted_at: string;
  approved_at?: string;
  approved_by?: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseTestimonialFormData {
  student_name: string;
  email?: string;
  photo_url?: string;
  story_text: string;
  graduation_year?: number;
  current_position?: string;
  company?: string;
  program?:
    | "BA English Literature"
    | "MA English Literature"
    | "PhD English Studies"
    | "Certificate Courses"
    | "Other";
}

export interface TestimonialStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  featured: number;
}
