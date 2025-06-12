import { useQuery } from "@tanstack/react-query";
import { Faculty } from "@/types";

// Simulate API call - replace with actual API endpoint
const fetchFaculty = async (): Promise<Faculty[]> => {
  // In a real app, this would be an API call
  const response = await import("@/data/faculty.json");
  return response.default as Faculty[];
};

export const useFaculty = () => {
  return useQuery({
    queryKey: ["faculty"],
    queryFn: fetchFaculty,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Hook for individual faculty member
export const useFacultyById = (id: string) => {
  return useQuery({
    queryKey: ["faculty", id],
    queryFn: async () => {
      const allFaculty = await fetchFaculty();
      const faculty = allFaculty.find(f => f.id === id);
      if (!faculty) {
        throw new Error(`Faculty member with id ${id} not found`);
      }
      return faculty;
    },
    enabled: !!id,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};
