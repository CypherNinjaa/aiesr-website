import { Metadata } from "next";
import { generateMetadata } from "@/lib/seo";

export const metadata: Metadata = generateMetadata({
  title: "Events & Activities - AIESR",
  description:
    "Explore our comprehensive calendar of literary events, academic conferences, cultural programs, and workshops at AIESR. Join us for enriching experiences that celebrate literature and learning.",
  keywords:
    "AIESR events, literary events, academic conferences, workshops, cultural programs, English literature events, research seminars",
  url: "https://aiesr.amity.edu/events",
});
