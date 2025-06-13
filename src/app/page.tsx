"use client";

import {
  HeroSection,
  WhyChooseSection,
  ProgramsSection,
  FacultySection,
  TestimonialsSection,
  ContactSection,
  EventsSection,
} from "@/components/sections";
import { SectionSuspense, LazyLoadSection } from "@/components/ui/SectionSuspense";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero section loads immediately */}
      <SectionSuspense>
        <HeroSection />
      </SectionSuspense>
      {/* Other sections load when they come into view */}
      <LazyLoadSection>
        <SectionSuspense>
          <WhyChooseSection />
        </SectionSuspense>
      </LazyLoadSection>
      <LazyLoadSection>
        <SectionSuspense>
          {/* student success story */}
          <TestimonialsSection />
        </SectionSuspense>
      </LazyLoadSection>
      <LazyLoadSection>
        <SectionSuspense>
          <ProgramsSection />
        </SectionSuspense>
      </LazyLoadSection>{" "}
      <LazyLoadSection>
        <SectionSuspense>
          <FacultySection />
        </SectionSuspense>
      </LazyLoadSection>
      <LazyLoadSection>
        <SectionSuspense>
          <EventsSection />
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
