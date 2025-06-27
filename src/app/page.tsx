"use client";

import {
  // HeroSection, // Commented out - using gallery slider instead
  WhyChooseSection,
  ProgramsSection,
  FacultySection,
  ContactSection,
  EventsSection,
} from "@/components/sections";
import { DynamicTestimonialsSection } from "@/components/sections/DynamicTestimonialsSection";
import { ProfessionalGallerySlider } from "@/components/sections/ProfessionalGallerySlider";
import { SectionSuspense, LazyLoadSection } from "@/components/ui/SectionSuspense";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero section commented out - Gallery slider shows first */}
      {/* <SectionSuspense>
        <HeroSection />
      </SectionSuspense> */}
      {/* Professional Gallery Slider - now shows first on homepage */}
      <SectionSuspense>
        <ProfessionalGallerySlider />
      </SectionSuspense>
      {/* Other sections load when they come into view */}
      <LazyLoadSection>
        <SectionSuspense>
          <EventsSection />
        </SectionSuspense>
      </LazyLoadSection>{" "}
      <LazyLoadSection>
        <SectionSuspense>
          <WhyChooseSection />
        </SectionSuspense>
      </LazyLoadSection>{" "}
      <LazyLoadSection>
        <SectionSuspense>
          {/* student success story */}
          <DynamicTestimonialsSection />
        </SectionSuspense>
      </LazyLoadSection>{" "}
      <LazyLoadSection>
        <SectionSuspense>
          <ProgramsSection />
        </SectionSuspense>{" "}
      </LazyLoadSection>{" "}
      <LazyLoadSection>
        <SectionSuspense>
          <FacultySection />
        </SectionSuspense>
      </LazyLoadSection>
      <LazyLoadSection>
        <SectionSuspense>
          <ContactSection />
        </SectionSuspense>
      </LazyLoadSection>
    </div>
  );
}
