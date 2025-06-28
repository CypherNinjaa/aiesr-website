import { supabase } from "@/lib/supabase";
import {
  Author,
  Journal,
  ResearchCategory,
  ResearchPaper,
  CreateAuthorData,
  CreateJournalData,
  CreateResearchCategoryData,
  CreateResearchPaperData,
  UpdateAuthorData,
  UpdateJournalData,
  UpdateResearchCategoryData,
  UpdateResearchPaperData,
  ResearchFilters,
  ResearchStats,
} from "@/types";

export class ResearchService {
  // ==========================================
  // AUTHORS CRUD
  // ==========================================

  static async getAuthors(options?: {
    status?: "active" | "inactive";
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<Author[]> {
    let query = supabase.from("authors").select("*").order("name", { ascending: true });

    if (options?.status) {
      query = query.eq("status", options.status);
    }

    if (options?.search) {
      query = query.ilike("name", `%${options.search}%`);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 50) - 1);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching authors:", error);
      throw new Error("Failed to fetch authors");
    }

    return data || [];
  }

  static async getAuthor(id: string): Promise<Author | null> {
    const { data, error } = await supabase.from("authors").select("*").eq("id", id).single();

    if (error) {
      console.error("Error fetching author:", error);
      throw new Error("Failed to fetch author");
    }

    return data;
  }

  static async createAuthor(authorData: CreateAuthorData): Promise<Author> {
    const { data, error } = await supabase.from("authors").insert(authorData).select().single();

    if (error) {
      console.error("Error creating author:", error);
      throw new Error("Failed to create author");
    }

    return data;
  }

  static async updateAuthor(id: string, updates: UpdateAuthorData): Promise<Author> {
    const { data, error } = await supabase
      .from("authors")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating author:", error);
      throw new Error("Failed to update author");
    }

    return data;
  }

  static async deleteAuthor(id: string): Promise<void> {
    const { error } = await supabase.from("authors").delete().eq("id", id);

    if (error) {
      console.error("Error deleting author:", error);
      throw new Error("Failed to delete author");
    }
  }

  static async searchAuthors(query: string): Promise<Author[]> {
    const { data, error } = await supabase
      .from("authors")
      .select("*")
      .or(`name.ilike.%${query}%,email.ilike.%${query}%,affiliation.ilike.%${query}%`)
      .eq("status", "active")
      .order("name", { ascending: true })
      .limit(20);

    if (error) {
      console.error("Error searching authors:", error);
      throw new Error("Failed to search authors");
    }

    return data || [];
  }

  // ==========================================
  // JOURNALS CRUD
  // ==========================================

  static async getJournals(options?: {
    status?: "active" | "inactive";
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<Journal[]> {
    let query = supabase.from("journals").select("*").order("name", { ascending: true });

    if (options?.status) {
      query = query.eq("status", options.status);
    }

    if (options?.search) {
      query = query.ilike("name", `%${options.search}%`);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 50) - 1);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching journals:", error);
      throw new Error("Failed to fetch journals");
    }

    return data || [];
  }

  static async getJournal(id: string): Promise<Journal | null> {
    const { data, error } = await supabase.from("journals").select("*").eq("id", id).single();

    if (error) {
      console.error("Error fetching journal:", error);
      throw new Error("Failed to fetch journal");
    }

    return data;
  }

  static async createJournal(journalData: CreateJournalData): Promise<Journal> {
    const { data, error } = await supabase.from("journals").insert(journalData).select().single();

    if (error) {
      console.error("Error creating journal:", error);
      throw new Error("Failed to create journal");
    }

    return data;
  }

  static async updateJournal(id: string, updates: UpdateJournalData): Promise<Journal> {
    const { data, error } = await supabase
      .from("journals")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating journal:", error);
      throw new Error("Failed to update journal");
    }

    return data;
  }

  static async deleteJournal(id: string): Promise<void> {
    const { error } = await supabase.from("journals").delete().eq("id", id);

    if (error) {
      console.error("Error deleting journal:", error);
      throw new Error("Failed to delete journal");
    }
  }

  static async searchJournals(query: string): Promise<Journal[]> {
    const { data, error } = await supabase
      .from("journals")
      .select("*")
      .or(`name.ilike.%${query}%,publisher.ilike.%${query}%`)
      .eq("status", "active")
      .order("impact_factor", { ascending: false })
      .limit(20);

    if (error) {
      console.error("Error searching journals:", error);
      throw new Error("Failed to search journals");
    }

    return data || [];
  }

  // ==========================================
  // RESEARCH CATEGORIES CRUD
  // ==========================================

  static async getResearchCategories(): Promise<ResearchCategory[]> {
    const { data, error } = await supabase
      .from("research_categories")
      .select("*")
      .eq("status", "active")
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching research categories:", error);
      throw new Error("Failed to fetch research categories");
    }

    return data || [];
  }

  static async createResearchCategory(
    categoryData: CreateResearchCategoryData
  ): Promise<ResearchCategory> {
    const { data, error } = await supabase
      .from("research_categories")
      .insert(categoryData)
      .select()
      .single();

    if (error) {
      console.error("Error creating research category:", error);
      throw new Error("Failed to create research category");
    }

    return data;
  }

  static async updateResearchCategory(
    id: string,
    updates: UpdateResearchCategoryData
  ): Promise<ResearchCategory> {
    const { data, error } = await supabase
      .from("research_categories")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating research category:", error);
      throw new Error("Failed to update research category");
    }

    return data;
  }

  static async deleteResearchCategory(id: string): Promise<void> {
    const { error } = await supabase.from("research_categories").delete().eq("id", id);

    if (error) {
      console.error("Error deleting research category:", error);
      throw new Error("Failed to delete research category");
    }
  }

  // ==========================================
  // RESEARCH PAPERS CRUD
  // ==========================================

  static async getResearchPapers(filters?: ResearchFilters): Promise<ResearchPaper[]> {
    let query = supabase
      .from("research_papers")
      .select(
        `
        *,
        journal:journals(*),
        authors:paper_authors(
          *,
          author:authors(*)
        ),
        categories:paper_categories(
          *,
          category:research_categories(*)
        )
      `
      )
      .order("publication_date", { ascending: false });

    // Apply filters
    if (filters?.status) {
      query = query.eq("status", filters.status);
    }

    if (filters?.is_featured !== undefined) {
      query = query.eq("is_featured", filters.is_featured);
    }

    if (filters?.journal_id) {
      query = query.eq("journal_id", filters.journal_id);
    }

    if (filters?.year) {
      query = query
        .gte("publication_date", `${filters.year}-01-01`)
        .lt("publication_date", `${filters.year + 1}-01-01`);
    }

    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,abstract.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching research papers:", error);
      throw new Error("Failed to fetch research papers");
    }

    return data || [];
  }

  static async getResearchPaper(id: string): Promise<ResearchPaper | null> {
    const { data, error } = await supabase
      .from("research_papers")
      .select(
        `
        *,
        journal:journals(*),
        authors:paper_authors(
          *,
          author:authors(*)
        ),
        categories:paper_categories(
          *,
          category:research_categories(*)
        )
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching research paper:", error);
      throw new Error("Failed to fetch research paper");
    }

    return data;
  }

  static async createResearchPaper(paperData: CreateResearchPaperData): Promise<ResearchPaper> {
    const { authors, category_ids, ...paperInfo } = paperData;

    // Insert the paper first
    const { data: paper, error: paperError } = await supabase
      .from("research_papers")
      .insert(paperInfo)
      .select()
      .single();

    if (paperError) {
      console.error("Error creating research paper:", paperError);
      throw new Error("Failed to create research paper");
    }

    // Insert authors if provided
    if (authors && authors.length > 0 && paper) {
      const authorInserts = authors.map(author => ({
        paper_id: paper.id,
        author_id: author.author_id,
        author_order: author.author_order,
        is_corresponding: author.is_corresponding || false,
      }));

      const { error: authorsError } = await supabase.from("paper_authors").insert(authorInserts);

      if (authorsError) {
        console.error("Error adding authors to paper:", authorsError);
        // Continue even if author insertion fails
      }
    }

    // Insert categories if provided
    if (category_ids && category_ids.length > 0 && paper) {
      const categoryInserts = category_ids.map(categoryId => ({
        paper_id: paper.id,
        category_id: categoryId,
      }));

      const { error: categoriesError } = await supabase
        .from("paper_categories")
        .insert(categoryInserts);

      if (categoriesError) {
        console.error("Error adding categories to paper:", categoriesError);
        // Continue even if category insertion fails
      }
    }

    // Return the full paper with relations
    return this.getResearchPaper(paper.id) as Promise<ResearchPaper>;
  }

  static async updateResearchPaper(
    id: string,
    updates: UpdateResearchPaperData
  ): Promise<ResearchPaper> {
    const { authors, category_ids, ...paperUpdates } = updates;

    // Update the paper
    const { data: _paper, error: paperError } = await supabase
      .from("research_papers")
      .update(paperUpdates)
      .eq("id", id)
      .select()
      .single();

    if (paperError) {
      console.error("Error updating research paper:", paperError);
      throw new Error("Failed to update research paper");
    }

    // Update authors if provided
    if (authors) {
      // Remove existing authors
      await supabase.from("paper_authors").delete().eq("paper_id", id);

      // Insert new authors
      if (authors.length > 0) {
        const authorInserts = authors.map(author => ({
          paper_id: id,
          author_id: author.author_id,
          author_order: author.author_order,
          is_corresponding: author.is_corresponding || false,
        }));

        await supabase.from("paper_authors").insert(authorInserts);
      }
    }

    // Update categories if provided
    if (category_ids) {
      // Remove existing categories
      await supabase.from("paper_categories").delete().eq("paper_id", id);

      // Insert new categories
      if (category_ids.length > 0) {
        const categoryInserts = category_ids.map(categoryId => ({
          paper_id: id,
          category_id: categoryId,
        }));

        await supabase.from("paper_categories").insert(categoryInserts);
      }
    }

    // Return the full paper with relations
    return this.getResearchPaper(id) as Promise<ResearchPaper>;
  }

  static async deleteResearchPaper(id: string): Promise<void> {
    const { error } = await supabase.from("research_papers").delete().eq("id", id);

    if (error) {
      console.error("Error deleting research paper:", error);
      throw new Error("Failed to delete research paper");
    }
  }

  // ==========================================
  // RESEARCH STATISTICS
  // ==========================================

  static async getResearchStats(): Promise<ResearchStats> {
    try {
      // Get total counts
      const [
        { count: totalPapers },
        { count: publishedPapers },
        { count: inReviewPapers },
        { count: totalAuthors },
        { count: totalJournals },
      ] = await Promise.all([
        supabase.from("research_papers").select("*", { count: "exact", head: true }),
        supabase
          .from("research_papers")
          .select("*", { count: "exact", head: true })
          .eq("status", "published"),
        supabase
          .from("research_papers")
          .select("*", { count: "exact", head: true })
          .eq("status", "in-review"),
        supabase.from("authors").select("*", { count: "exact", head: true }).eq("status", "active"),
        supabase
          .from("journals")
          .select("*", { count: "exact", head: true })
          .eq("status", "active"),
      ]);

      // Get total citations
      const { data: citationData } = await supabase
        .from("research_papers")
        .select("citation_count")
        .not("citation_count", "is", null);

      const totalCitations =
        citationData?.reduce((sum, paper) => sum + (paper.citation_count || 0), 0) || 0;

      // Get papers by year
      const { data: yearData } = await supabase
        .from("research_papers")
        .select("publication_date")
        .not("publication_date", "is", null)
        .eq("status", "published");

      const papersByYear =
        yearData?.reduce(
          (acc: { year: number; count: number }[], paper) => {
            const year = new Date(paper.publication_date).getFullYear();
            const existing = acc.find(item => item.year === year);
            if (existing) {
              existing.count++;
            } else {
              acc.push({ year, count: 1 });
            }
            return acc;
          },
          [] as { year: number; count: number }[]
        ) || [];

      // Get papers by category
      const { data: categoryData } = await supabase.from("paper_categories").select(`
          category:research_categories(name)
        `);

      const papersByCategory =
        (
          categoryData as { category?: { name: string } | { name: string }[] }[] | undefined
        )?.reduce(
          (acc: { category: string; count: number }[], item) => {
            let categoryName: string | undefined;
            if (Array.isArray(item.category)) {
              categoryName = item.category[0]?.name;
            } else {
              categoryName = item.category?.name;
            }
            if (categoryName) {
              const existing = acc.find(cat => cat.category === categoryName);
              if (existing) {
                existing.count++;
              } else {
                acc.push({ category: categoryName, count: 1 });
              }
            }
            return acc;
          },
          [] as { category: string; count: number }[]
        ) || [];

      return {
        total_papers: totalPapers || 0,
        published_papers: publishedPapers || 0,
        in_review_papers: inReviewPapers || 0,
        total_citations: totalCitations,
        total_authors: totalAuthors || 0,
        total_journals: totalJournals || 0,
        papers_by_year: papersByYear.sort((a, b) => b.year - a.year),
        papers_by_category: papersByCategory.sort((a, b) => b.count - a.count),
      };
    } catch (error) {
      console.error("Error fetching research stats:", error);
      throw new Error("Failed to fetch research statistics");
    }
  }

  // ==========================================
  // DOI LOOKUP (External API)
  // ==========================================

  static async lookupDOI(doi: string): Promise<Partial<CreateResearchPaperData> | null> {
    try {
      const response = await fetch(`https://api.crossref.org/works/${doi}`);
      if (!response.ok) return null;

      const data = await response.json();
      const work = data.message;

      return {
        title: work.title?.[0] || "",
        abstract: work.abstract || "",
        publication_date: work.published?.["date-parts"]?.[0]
          ? `${work.published["date-parts"][0][0]}-${(work.published["date-parts"][0][1] || 1).toString().padStart(2, "0")}-${(work.published["date-parts"][0][2] || 1).toString().padStart(2, "0")}`
          : undefined,
        doi: work.DOI,
        volume: work.volume,
        issue: work.issue,
        pages: work.page,
        external_url: work.URL,
        // Note: Journal and author matching would need additional logic
      };
    } catch (error) {
      console.error("Error looking up DOI:", error);
      return null;
    }
  }
}
