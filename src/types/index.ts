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

// ============================================
// FACULTY INTERFACES - Dynamic Database-Driven Faculty
// ============================================

export interface FacultyPublication {
  title: string;
  year: number;
  journal?: string;
  book?: string;
  url?: string;
}

export interface Faculty {
  id: string;
  name: string;
  designation: string;
  email?: string;
  phone?: string;

  // Professional Information
  specialization: string[];
  experience: number;
  education: string[];
  qualifications: string[];

  // Research & Academic
  research_areas: string[];
  publications: FacultyPublication[];
  achievements: string[];

  // Profile Information
  bio?: string;
  profile_image_url?: string;
  office_location?: string;
  office_hours?: string;

  // Contact & Links
  linkedin_url?: string;
  research_gate_url?: string;
  google_scholar_url?: string;
  personal_website?: string;

  // Display Settings
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;

  // Metadata
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

// Data for creating new faculty
export interface CreateFacultyData {
  name: string;
  designation: string;
  email?: string;
  phone?: string;
  specialization: string[];
  experience: number;
  education: string[];
  qualifications: string[];
  research_areas: string[];
  publications: FacultyPublication[];
  achievements: string[];
  bio?: string;
  profile_image_url?: string;
  office_location?: string;
  office_hours?: string;
  linkedin_url?: string;
  research_gate_url?: string;
  google_scholar_url?: string;
  personal_website?: string;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
}

// Data for updating existing faculty
export type UpdateFacultyData = Partial<CreateFacultyData>;

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
  // Sponsors relationship
  sponsors?: EventSponsor[];
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

// ============================================
// GALLERY SLIDER INTERFACES - Homepage Dynamic Gallery
// ============================================

export interface GallerySlide {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image_url: string;
  image_alt?: string;
  link_url?: string;
  link_text?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Data for creating new gallery slides
export interface CreateGallerySlideData {
  title: string;
  subtitle?: string;
  description?: string;
  image_url: string;
  image_alt?: string;
  link_url?: string;
  link_text?: string;
  sort_order?: number;
  is_active?: boolean;
}

// Data for updating gallery slides
export interface UpdateGallerySlideData {
  title?: string;
  subtitle?: string;
  description?: string;
  image_url?: string;
  image_alt?: string;
  link_url?: string;
  link_text?: string;
  sort_order?: number;
  is_active?: boolean;
}

// Upload options for gallery images
export interface GalleryImageUpload {
  type: "url" | "file";
  data: string | File;
}

// ============================================
// SPONSOR INTERFACES - Dynamic Event Sponsors
// ============================================

export interface Sponsor {
  id: string;
  name: string;
  logo_url?: string;
  website_url?: string;
  description?: string;
  contact_email?: string;
  contact_phone?: string;
  tier: "platinum" | "gold" | "silver" | "bronze" | "partner";
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface EventSponsor {
  id: string;
  event_id: string;
  sponsor_id: string;
  sponsor: Sponsor; // Populated sponsor data
  display_order: number;
  sponsor_tier: "platinum" | "gold" | "silver" | "bronze" | "partner";
  is_featured: boolean;
  custom_description?: string;
  created_at: string;
  updated_at: string;
}

// Data for creating new sponsors
export interface CreateSponsorData {
  name: string;
  logo_url?: string;
  website_url?: string;
  description?: string;
  contact_email?: string;
  contact_phone?: string;
  tier: "platinum" | "gold" | "silver" | "bronze" | "partner";
  status?: "active" | "inactive";
}

// Data for updating existing sponsors
export type UpdateSponsorData = Partial<CreateSponsorData>;

// Data for adding sponsors to events
export interface CreateEventSponsorData {
  event_id: string;
  sponsor_id: string;
  display_order?: number;
  sponsor_tier?: "platinum" | "gold" | "silver" | "bronze" | "partner";
  is_featured?: boolean;
  custom_description?: string;
}

// Sponsor tiers with display properties
export interface SponsorTierConfig {
  tier: "platinum" | "gold" | "silver" | "bronze" | "partner";
  label: string;
  color: string;
  priority: number;
  defaultLogoSize: "large" | "medium" | "small";
}

export const SPONSOR_TIERS: SponsorTierConfig[] = [
  { tier: "platinum", label: "Platinum", color: "#E5E7EB", priority: 1, defaultLogoSize: "large" },
  { tier: "gold", label: "Gold", color: "#F59E0B", priority: 2, defaultLogoSize: "large" },
  { tier: "silver", label: "Silver", color: "#6B7280", priority: 3, defaultLogoSize: "medium" },
  { tier: "bronze", label: "Bronze", color: "#CD7C2F", priority: 4, defaultLogoSize: "medium" },
  { tier: "partner", label: "Partner", color: "#3B82F6", priority: 5, defaultLogoSize: "small" },
];

// ============================================
// RESEARCH SYSTEM INTERFACES
// ============================================

export interface Author {
  id: string;
  name: string;
  email?: string;
  affiliation?: string;
  orcid_id?: string;
  bio?: string;
  website_url?: string;
  photo_url?: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface Journal {
  id: string;
  name: string;
  publisher?: string;
  impact_factor?: number;
  issn?: string;
  website_url?: string;
  description?: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface ResearchCategory {
  id: string;
  name: string;
  description?: string;
  color: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface ResearchPaper {
  id: string;
  title: string;
  abstract?: string;
  publication_date?: string;
  doi?: string;
  journal_id?: string;
  journal?: Journal;
  volume?: string;
  issue?: string;
  pages?: string;
  pdf_url?: string;
  external_url?: string;
  status: "draft" | "in-review" | "published" | "rejected";
  citation_count: number;
  is_featured: boolean;
  keywords?: string[];
  created_at: string;
  updated_at: string;
  created_by?: string;

  // Related data
  authors?: PaperAuthor[];
  categories?: ResearchCategory[];
}

export interface PaperAuthor {
  id: string;
  paper_id: string;
  author_id: string;
  author: Author;
  author_order: number;
  is_corresponding: boolean;
  created_at: string;
}

export interface PaperCategory {
  id: string;
  paper_id: string;
  category_id: string;
  category: ResearchCategory;
  created_at: string;
}

// Create data interfaces
export interface CreateAuthorData {
  name: string;
  email?: string;
  affiliation?: string;
  orcid_id?: string;
  bio?: string;
  website_url?: string;
  photo_url?: string;
  status?: "active" | "inactive";
}

export interface CreateJournalData {
  name: string;
  publisher?: string;
  impact_factor?: number;
  issn?: string;
  website_url?: string;
  description?: string;
  status?: "active" | "inactive";
}

export interface CreateResearchCategoryData {
  name: string;
  description?: string;
  color?: string;
  status?: "active" | "inactive";
}

export interface CreateResearchPaperData {
  title: string;
  abstract?: string;
  publication_date?: string;
  doi?: string;
  journal_id?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  pdf_url?: string;
  external_url?: string;
  status?: "draft" | "in-review" | "published" | "rejected";
  citation_count?: number;
  is_featured?: boolean;
  keywords?: string[];

  // Author assignments
  authors?: Array<{
    author_id: string;
    author_order: number;
    is_corresponding?: boolean;
  }>;

  // Category assignments
  category_ids?: string[];
}

export interface CreatePaperAuthorData {
  paper_id: string;
  author_id: string;
  author_order: number;
  is_corresponding?: boolean;
}

// Update data interfaces
export type UpdateAuthorData = Partial<CreateAuthorData>;
export type UpdateJournalData = Partial<CreateJournalData>;
export type UpdateResearchCategoryData = Partial<CreateResearchCategoryData>;
export type UpdateResearchPaperData = Partial<CreateResearchPaperData>;

// Research paper status options
export const RESEARCH_PAPER_STATUSES = [
  { value: "draft", label: "Draft", color: "#6B7280" },
  { value: "in-review", label: "In Review", color: "#F59E0B" },
  { value: "published", label: "Published", color: "#10B981" },
  { value: "rejected", label: "Rejected", color: "#EF4444" },
] as const;

// Research search and filter options
export interface ResearchFilters {
  status?: string;
  category_id?: string;
  author_id?: string;
  journal_id?: string;
  year?: number;
  year_from?: number;
  year_to?: number;
  is_featured?: boolean;
  is_published?: boolean;
  search?: string;
  sort_by?: string;
  sort_order?: string;
  limit?: number;
  offset?: number;
}

// Research statistics
export interface ResearchStats {
  total_papers: number;
  published_papers: number;
  in_review_papers: number;
  total_citations: number;
  total_authors: number;
  total_journals: number;
  papers_by_year: Array<{ year: number; count: number }>;
  papers_by_category: Array<{ category: string; count: number }>;
}
