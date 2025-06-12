import { lazy } from "react";

// Lazy load heavy components
export const HeroSection = lazy(() =>
  import("@/components/sections/HeroSection").then(module => ({
    default: module.HeroSection,
  }))
);

export const WhyChooseSection = lazy(() =>
  import("@/components/sections/WhyChooseSection").then(module => ({
    default: module.WhyChooseSection,
  }))
);

export const ProgramsSection = lazy(() =>
  import("@/components/sections/ProgramsSection").then(module => ({
    default: module.ProgramsSection,
  }))
);

export const FacultySection = lazy(() =>
  import("@/components/sections/FacultySection").then(module => ({
    default: module.FacultySection,
  }))
);

export const TestimonialsSection = lazy(() =>
  import("@/components/sections/TestimonialsSection").then(module => ({
    default: module.TestimonialsSection,
  }))
);

export const ContactSection = lazy(() =>
  import("@/components/sections/ContactSection").then(module => ({
    default: module.ContactSection,
  }))
);
