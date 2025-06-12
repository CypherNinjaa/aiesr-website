import { Metadata } from "next";
import React from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  siteName?: string;
}

interface CourseData {
  id: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  eligibility?: string[];
}

interface FacultyData {
  name: string;
  designation: string;
  bio: string;
  email: string;
  image: string;
  specialization?: string[];
  education?: string[];
  awards?: string[];
}

interface EventData {
  title: string;
  description: string;
  date: string;
  location: string;
  image?: string;
}

export function generateMetadata({
  title = "AIESR - Amity Institute of English Studies and Research",
  description = "Shape your future in English Studies and Research at one of India's premier institutes. Discover our comprehensive programs in literature, linguistics, and creative writing.",
  keywords = "English Studies, Literature, Research, Amity University, Patna, English Literature, Creative Writing, Linguistics",
  image = "/og-image.jpg",
  url = "https://aiesr.amity.edu",
  siteName = "AIESR - Amity Institute of English Studies and Research",
}: SEOProps = {}): Metadata {
  return {
    title,
    description,
    keywords,
    authors: [{ name: "AIESR" }],
    creator: "AIESR",
    publisher: "Amity University",

    // Open Graph
    openGraph: {
      title,
      description,
      url,
      siteName,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_IN",
      type: "website",
    },

    // Twitter
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@AIESR_Official",
    },

    // Additional SEO
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    // Verification
    verification: {
      google: "your-google-verification-code",
    },

    // Alternate languages
    alternates: {
      canonical: url,
      languages: {
        "en-IN": url,
        "hi-IN": `${url}/hi`,
      },
    },

    // Other
    category: "education",
  };
}

// Structured Data for different page types
export const generateStructuredData = {
  organization: () => ({
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "AIESR - Amity Institute of English Studies and Research",
    alternateName: "AIESR",
    url: "https://aiesr.amity.edu",
    logo: "https://aiesr.amity.edu/logo.png",
    image: "https://aiesr.amity.edu/og-image.jpg",
    description:
      "Premier institute for English Studies and Research offering undergraduate, postgraduate, and doctoral programs.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Amity University Campus",
      addressLocality: "Patna",
      addressRegion: "Bihar",
      postalCode: "800014",
      addressCountry: "IN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-612-2346789",
      contactType: "Admissions",
      email: "admissions@aiesr.amity.edu",
    },
    sameAs: [
      "https://facebook.com/AIESR",
      "https://twitter.com/AIESR_Official",
      "https://linkedin.com/school/aiesr",
      "https://instagram.com/aiesr_official",
    ],
  }),
  course: (course: CourseData) => ({
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.description,
    provider: {
      "@type": "EducationalOrganization",
      name: "AIESR - Amity Institute of English Studies and Research",
    },
    courseCode: course.id,
    educationalLevel: course.level,
    timeRequired: course.duration,
    coursePrerequisites: course.eligibility?.join(", "),
    occupationalCredentialAwarded: course.title,
  }),

  person: (faculty: FacultyData) => ({
    "@context": "https://schema.org",
    "@type": "Person",
    name: faculty.name,
    jobTitle: faculty.designation,
    worksFor: {
      "@type": "EducationalOrganization",
      name: "AIESR - Amity Institute of English Studies and Research",
    },
    description: faculty.bio,
    email: faculty.email,
    image: faculty.image,
    expertise: faculty.specialization?.join(", "),
    alumniOf: faculty.education?.[0],
    award: faculty.awards,
  }),

  breadcrumb: (items: Array<{ name: string; url: string }>) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }),
  event: (event: EventData) => ({
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    startDate: event.date,
    location: {
      "@type": "Place",
      name: event.location,
      address: "Amity University Campus, Patna, Bihar 800014",
    },
    organizer: {
      "@type": "EducationalOrganization",
      name: "AIESR - Amity Institute of English Studies and Research",
    },
    image: event.image,
    eventStatus: "https://schema.org/EventScheduled",
  }),
};

// Component to inject structured data
interface StructuredDataProps {
  data: Record<string, unknown>;
}

export const StructuredData: React.FC<StructuredDataProps> = ({ data }) => {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
};
