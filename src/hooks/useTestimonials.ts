import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TestimonialsService } from "@/services/testimonials";
import { DatabaseTestimonial, DatabaseTestimonialFormData } from "@/types";
import { useAdminAuth } from "./useAdminAuth";

// Hook for fetching testimonials (admin view - all testimonials)
export const useTestimonials = (
  options: {
    status?: "pending" | "approved" | "rejected";
    academic_program?: string;
    limit?: number;
    offset?: number;
  } = {}
) => {
  return useQuery({
    queryKey: ["testimonials", "admin", options],
    queryFn: () => TestimonialsService.getAllTestimonials(options),
  });
};

// Hook for fetching approved testimonials (public view)
export const useApprovedTestimonials = (
  options: {
    is_featured?: boolean;
    academic_program?: string;
    graduation_year?: number;
    limit?: number;
    offset?: number;
  } = {}
) => {
  return useQuery({
    queryKey: ["testimonials", "approved", options],
    queryFn: () => TestimonialsService.getApprovedTestimonials(options),
  });
};

// Hook for fetching featured testimonials
export const useFeaturedTestimonials = (limit: number = 3) => {
  return useQuery({
    queryKey: ["testimonials", "featured", limit],
    queryFn: () => TestimonialsService.getFeaturedTestimonials(limit),
  });
};

// Hook for fetching single testimonial
export const useTestimonial = (id: string) => {
  return useQuery({
    queryKey: ["testimonials", id],
    queryFn: () => TestimonialsService.getTestimonialById(id),
    enabled: !!id,
  });
};

// Hook for testimonial statistics
export const useTestimonialStats = () => {
  return useQuery({
    queryKey: ["testimonials", "stats"],
    queryFn: () => TestimonialsService.getTestimonialStats(),
  });
};

// Hook for submitting testimonials (public)
export const useSubmitTestimonial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DatabaseTestimonialFormData) => TestimonialsService.submitTestimonial(data),
    onSuccess: () => {
      // Invalidate testimonials queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    },
  });
};

// Hook for admin actions
export const useTestimonialActions = () => {
  const queryClient = useQueryClient();
  const { adminUser } = useAdminAuth();
  const approveTestimonial = useMutation({
    mutationFn: async (id: string) => {
      if (!adminUser?.user?.id) {
        throw new Error("Admin user not authenticated");
      }
      return TestimonialsService.approveTestimonial(id, adminUser.user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    },
  });

  const rejectTestimonial = useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      if (!adminUser?.user?.id) {
        throw new Error("Admin user not authenticated");
      }
      return TestimonialsService.rejectTestimonial(id, reason, adminUser.user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    },
  });

  const toggleFeatured = useMutation({
    mutationFn: (id: string) => TestimonialsService.toggleFeatured(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    },
  });

  const deleteTestimonial = useMutation({
    mutationFn: (id: string) => TestimonialsService.deleteTestimonial(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    },
  });
  const updateTestimonial = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<DatabaseTestimonial> }) =>
      TestimonialsService.updateTestimonial(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    },
  });

  const updateSortOrder = useMutation({
    mutationFn: (testimonialIds: string[]) => TestimonialsService.updateSortOrder(testimonialIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    },
  });

  return {
    approveTestimonial,
    rejectTestimonial,
    toggleFeatured,
    deleteTestimonial,
    updateTestimonial,
    updateSortOrder,
  };
};
