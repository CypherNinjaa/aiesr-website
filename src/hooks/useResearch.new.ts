import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ResearchService } from "@/services/research";
import {
  ResearchFilters,
  CreateResearchPaperData,
  UpdateResearchPaperData,
  CreateAuthorData,
  UpdateAuthorData,
  CreateJournalData,
  UpdateJournalData,
  CreateResearchCategoryData,
  UpdateResearchCategoryData,
} from "@/types";

// Research Papers Hooks
export const useResearchPapers = (filters?: ResearchFilters) => {
  return useQuery({
    queryKey: ["research-papers", filters],
    queryFn: () => ResearchService.getResearchPapers(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useResearchPaper = (id: string) => {
  return useQuery({
    queryKey: ["research-paper", id],
    queryFn: () => ResearchService.getResearchPaper(id),
    enabled: !!id,
  });
};

export const useCreateResearchPaper = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateResearchPaperData) => ResearchService.createResearchPaper(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["research-papers"] });
      queryClient.invalidateQueries({ queryKey: ["research-statistics"] });
    },
  });
};

export const useUpdateResearchPaper = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateResearchPaperData }) =>
      ResearchService.updateResearchPaper(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["research-papers"] });
      queryClient.invalidateQueries({ queryKey: ["research-paper", id] });
      queryClient.invalidateQueries({ queryKey: ["research-statistics"] });
    },
  });
};

export const useDeleteResearchPaper = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ResearchService.deleteResearchPaper(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["research-papers"] });
      queryClient.invalidateQueries({ queryKey: ["research-statistics"] });
    },
  });
};

// Authors Hooks
export const useAuthors = () => {
  return useQuery({
    queryKey: ["authors"],
    queryFn: () => ResearchService.getAuthors(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCreateAuthor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAuthorData) => ResearchService.createAuthor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authors"] });
    },
  });
};

export const useUpdateAuthor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAuthorData }) =>
      ResearchService.updateAuthor(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authors"] });
      queryClient.invalidateQueries({ queryKey: ["research-papers"] });
    },
  });
};

export const useDeleteAuthor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ResearchService.deleteAuthor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authors"] });
      queryClient.invalidateQueries({ queryKey: ["research-papers"] });
    },
  });
};

// Journals Hooks
export const useJournals = () => {
  return useQuery({
    queryKey: ["journals"],
    queryFn: () => ResearchService.getJournals(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCreateJournal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateJournalData) => ResearchService.createJournal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journals"] });
    },
  });
};

export const useUpdateJournal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateJournalData }) =>
      ResearchService.updateJournal(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journals"] });
      queryClient.invalidateQueries({ queryKey: ["research-papers"] });
    },
  });
};

export const useDeleteJournal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ResearchService.deleteJournal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journals"] });
      queryClient.invalidateQueries({ queryKey: ["research-papers"] });
    },
  });
};

// Categories Hooks
export const useCategories = () => {
  return useQuery({
    queryKey: ["research-categories"],
    queryFn: () => ResearchService.getResearchCategories(),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateResearchCategoryData) => ResearchService.createResearchCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["research-categories"] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateResearchCategoryData }) =>
      ResearchService.updateResearchCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["research-categories"] });
      queryClient.invalidateQueries({ queryKey: ["research-papers"] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ResearchService.deleteResearchCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["research-categories"] });
      queryClient.invalidateQueries({ queryKey: ["research-papers"] });
    },
  });
};

// Statistics Hook
export const useResearchStatistics = () => {
  return useQuery({
    queryKey: ["research-statistics"],
    queryFn: () => ResearchService.getResearchStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// DOI Lookup Hook
export const useDOILookup = () => {
  return useMutation({
    mutationFn: (doi: string) => ResearchService.lookupDOI(doi),
  });
};
