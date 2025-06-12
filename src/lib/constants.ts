// Site configuration
export const SITE_CONFIG = {
  name: "AIESR",
  fullName: "Amity Institute of English Studies and Research",
  description:
    "Shape your future in English Studies and Research at one of India's premier institutes. Discover our comprehensive programs in literature, linguistics, and creative writing.",
  url: "https://aiesr.amity.edu",
  ogImage: "/og-image.jpg",
  logo: "/logo.png",
  favicon: "/favicon.ico",
} as const;

// Contact information
export const CONTACT_INFO = {
  email: {
    admissions: "admissions@aiesr.amity.edu",
    info: "info@aiesr.amity.edu",
    urgent: "urgent@aiesr.amity.edu",
  },
  phone: {
    primary: "+91 612 2346789",
    secondary: "+91 612 2346790",
  },
  address: {
    street: "Amity University Campus",
    city: "Patna",
    state: "Bihar",
    pincode: "800014",
    country: "India",
    full: "Amity University Campus, Patna, Bihar 800014",
  },
  officeHours: {
    weekdays: "9:00 AM - 6:00 PM",
    saturday: "9:00 AM - 2:00 PM",
    sunday: "Closed",
  },
} as const;

// Social media links
export const SOCIAL_LINKS = {
  facebook: "https://facebook.com/AIESR",
  twitter: "https://twitter.com/AIESR_Official",
  linkedin: "https://linkedin.com/school/aiesr",
  instagram: "https://instagram.com/aiesr_official",
  youtube: "https://youtube.com/c/AIESR",
} as const;

// Navigation structure
export const NAVIGATION = {
  main: [
    { label: "Home", href: "/" },
    {
      label: "About",
      href: "/about",
      children: [
        { label: "History & Legacy", href: "/about/history" },
        { label: "Mission & Vision", href: "/about/mission" },
        { label: "Leadership Team", href: "/about/leadership" },
        { label: "Infrastructure", href: "/about/infrastructure" },
      ],
    },
    {
      label: "Programs",
      href: "/programs",
      children: [
        { label: "Undergraduate", href: "/programs/undergraduate" },
        { label: "Postgraduate", href: "/programs/postgraduate" },
        { label: "Doctoral", href: "/programs/doctoral" },
        { label: "Certificate Courses", href: "/programs/certificate" },
      ],
    },
    { label: "Faculty", href: "/faculty" },
    { label: "Research", href: "/research" },
    { label: "Admissions", href: "/admissions" },
    { label: "Student Life", href: "/student-life" },
    { label: "Contact", href: "/contact" },
  ] as const,
  footer: {
    academics: [
      { label: "Undergraduate Programs", href: "/programs/undergraduate" },
      { label: "Postgraduate Programs", href: "/programs/postgraduate" },
      { label: "Doctoral Programs", href: "/programs/doctoral" },
      { label: "Certificate Courses", href: "/programs/certificate" },
    ],
    about: [
      { label: "About AIESR", href: "/about" },
      { label: "Faculty", href: "/faculty" },
      { label: "Campus Life", href: "/student-life" },
      { label: "Research", href: "/research" },
    ],
    admissions: [
      { label: "How to Apply", href: "/admissions/apply" },
      { label: "Eligibility", href: "/admissions/eligibility" },
      { label: "Fees Structure", href: "/admissions/fees" },
      { label: "Scholarships", href: "/admissions/scholarships" },
    ],
    resources: [
      { label: "Library", href: "/library" },
      { label: "E-Resources", href: "/e-resources" },
      { label: "Downloads", href: "/downloads" },
      { label: "Alumni", href: "/alumni" },
    ],
  },
} as const;

// Program options for forms
export const PROGRAM_OPTIONS = [
  { value: "ba-english", label: "B.A. English Literature" },
  { value: "ma-english", label: "M.A. English Literature" },
  { value: "phd-english", label: "Ph.D. English Literature" },
  { value: "creative-writing", label: "Creative Writing Certificate" },
  { value: "linguistics", label: "Linguistics Program" },
  { value: "other", label: "Other" },
] as const;

// Animation settings
export const ANIMATION_CONFIG = {
  stagger: {
    children: 0.1,
    container: 0.3,
  },
  duration: {
    fast: 0.3,
    normal: 0.5,
    slow: 0.8,
  },
  ease: {
    smooth: [0.25, 0.46, 0.45, 0.94],
    bounce: [0.68, -0.55, 0.265, 1.55],
  },
} as const;

// Breakpoints for responsive design
export const BREAKPOINTS = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

// Query keys for React Query
export const QUERY_KEYS = {
  faculty: ["faculty"],
  facultyById: (id: string) => ["faculty", id],
  programs: ["programs"],
  programsByLevel: (level: string) => ["programs", "level", level],
  programBySlug: (slug: string) => ["programs", slug],
  testimonials: ["testimonials"],
  featuredTestimonials: (limit: number) => ["testimonials", "featured", limit],
  news: ["news"],
  events: ["events"],
} as const;

// Error messages
export const ERROR_MESSAGES = {
  generic: "Something went wrong. Please try again.",
  network: "Network error. Please check your internet connection.",
  validation: "Please check your input and try again.",
  notFound: "The requested resource was not found.",
  unauthorized: "You are not authorized to access this resource.",
  server: "Server error. Please try again later.",
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  formSubmitted: "Thank you for your inquiry! We will get back to you within 24 hours.",
  newsletterSubscribed: "Successfully subscribed to our newsletter!",
  applicationSubmitted: "Your application has been submitted successfully!",
  profileUpdated: "Your profile has been updated successfully.",
} as const;

// API endpoints (when you add a backend)
export const API_ENDPOINTS = {
  contact: "/api/contact",
  newsletter: "/api/newsletter",
  application: "/api/application",
  faculty: "/api/faculty",
  programs: "/api/programs",
  testimonials: "/api/testimonials",
  news: "/api/news",
  events: "/api/events",
} as const;

// Feature flags
export const FEATURES = {
  enableAnalytics: true,
  enableChatbot: false,
  enableDarkMode: false,
  enableMultiLanguage: false,
  enablePWA: true,
} as const;
