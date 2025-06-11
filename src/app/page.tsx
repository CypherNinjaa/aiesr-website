import { HeroSection } from "@/components/sections/HeroSection";
import { WhyChooseSection } from "@/components/sections/WhyChooseSection";
import { ProgramsSection } from "@/components/sections/ProgramsSection";
import { FacultySection } from "@/components/sections/FacultySection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { ContactSection } from "@/components/sections/ContactSection";

export default function Home() {
	return (
		<div className="min-h-screen">
			<HeroSection />
			<WhyChooseSection />
			<ProgramsSection />
			<FacultySection />
			<TestimonialsSection />
			<ContactSection />
		</div>
	);
}
