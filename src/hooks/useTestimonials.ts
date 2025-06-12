import { useQuery } from "@tanstack/react-query";
import { Testimonial } from "@/types";

// Simulate API call - replace with actual API endpoint
const fetchTestimonials = async (): Promise<Testimonial[]> => {
  // In a real app, this would be an API call
  const response = await import("@/data/testimonials.json");
  return response.default as Testimonial[];
};

export const useTestimonials = () => {
  return useQuery({
    queryKey: ["testimonials"],
    queryFn: fetchTestimonials,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Hook for featured testimonials
export const useFeaturedTestimonials = (limit: number = 3) => {
  return useQuery({
    queryKey: ["testimonials", "featured", limit],
    queryFn: async () => {
      const allTestimonials = await fetchTestimonials();
      // Return the first 'limit' testimonials as featured
      return allTestimonials.slice(0, limit);
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};
