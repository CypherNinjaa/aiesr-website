import { useQuery } from "@tanstack/react-query";
import { Program } from "@/types";

// Simulate API call - replace with actual API endpoint
const fetchPrograms = async (): Promise<Program[]> => {
  // In a real app, this would be an API call
  const response = await import("@/data/programs.json");
  return response.default as Program[];
};

export const usePrograms = () => {
  return useQuery({
    queryKey: ["programs"],
    queryFn: fetchPrograms,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Hook for programs by level
export const useProgramsByLevel = (level: Program["level"]) => {
  return useQuery({
    queryKey: ["programs", "level", level],
    queryFn: async () => {
      const allPrograms = await fetchPrograms();
      return allPrograms.filter(program => program.level === level);
    },
    enabled: !!level,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

// Hook for individual program
export const useProgramBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["programs", slug],
    queryFn: async () => {
      const allPrograms = await fetchPrograms();
      const program = allPrograms.find(p => p.slug === slug);
      if (!program) {
        throw new Error(`Program with slug ${slug} not found`);
      }
      return program;
    },
    enabled: !!slug,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};
