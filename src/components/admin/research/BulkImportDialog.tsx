"use client";

import { Upload, FileText, Download, AlertCircle, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface BulkImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BulkImportDialog({ open, onOpenChange }: BulkImportDialogProps) {
  const [importData, setImportData] = useState("");
  const [format, setFormat] = useState<"json" | "csv">("json");

  const handleImport = async () => {
    if (!importData.trim()) return;

    try {
      let papers;
      if (format === "json") {
        papers = JSON.parse(importData);
      } else {
        papers = parseCSV(importData);
      }

      // Placeholder for bulk import logic
      console.log("Papers to import:", papers);

      setImportData("");
      onOpenChange(false);
    } catch (error) {
      console.error("Import failed:", error);
    }
  };

  const parseCSV = (csvData: string) => {
    const lines = csvData.split("\n");
    const headers = lines[0].split(",").map(h => h.trim());

    return lines
      .slice(1)
      .map(line => {
        const values = line.split(",").map(v => v.trim());
        const paper: Record<string, string | number | boolean | string[] | undefined> = {};

        headers.forEach((header, index) => {
          const value = values[index];
          switch (header.toLowerCase()) {
            case "title":
              paper.title = value;
              break;
            case "abstract":
              paper.abstract = value;
              break;
            case "doi":
              paper.doi = value;
              break;
            case "year":
            case "publication_year":
              paper.publication_year = parseInt(value);
              break;
            case "url":
              paper.url = value;
              break;
            case "authors":
              paper.author_ids = value.split(";").map(id => id.trim());
              break;
            case "is_published":
            case "published":
              paper.is_published = value.toLowerCase() === "true";
              break;
          }
        });

        return paper;
      })
      .filter(paper => paper.title);
  };

  const downloadTemplate = () => {
    const template =
      format === "json"
        ? JSON.stringify(
            [
              {
                title: "Sample Research Paper",
                abstract: "This is a sample abstract for the research paper.",
                doi: "10.1000/sample123",
                publication_year: 2024,
                is_published: true,
                url: "https://example.com/paper",
                citation_count: 0,
                author_ids: ["author-id-1", "author-id-2"],
                journal_id: "journal-id",
                category_id: "category-id",
              },
            ],
            null,
            2
          )
        : 'title,abstract,doi,publication_year,is_published,url,authors,journal_id,category_id\n"Sample Paper","Sample abstract","10.1000/sample","2024","true","https://example.com","author-id-1;author-id-2","journal-id","category-id"';

    const blob = new Blob([template], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `research-template.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!open) return null;

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
      <Card className="mx-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-semibold">
                <Upload className="h-5 w-5" />
                Bulk Import Research Papers
              </h2>
              <p className="mt-1 text-gray-600">
                Import multiple research papers at once using JSON or CSV format.
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            {/* Format Selection */}
            <div className="space-y-2">
              <label htmlFor="import-format" className="text-sm font-medium">
                Import Format
              </label>
              <div className="flex gap-2" id="import-format">
                <Button
                  variant={format === "json" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFormat("json")}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  JSON
                </Button>
                <Button
                  variant={format === "csv" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFormat("csv")}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  CSV
                </Button>
                <Button variant="outline" size="sm" onClick={downloadTemplate}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Template
                </Button>
              </div>
            </div>

            {/* Import Data */}
            <div className="space-y-2">
              <label htmlFor="import-data" className="text-sm font-medium">
                {format === "json" ? "JSON Data" : "CSV Data"}
              </label>
              <textarea
                id="import-data"
                value={importData}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setImportData(e.target.value)
                }
                placeholder={
                  format === "json" ? "Paste your JSON data here..." : "Paste your CSV data here..."
                }
                rows={10}
                className="w-full rounded-md border p-3 font-mono text-sm"
              />
            </div>

            {/* Help Text */}
            <div className="rounded-md border border-blue-200 bg-blue-50 p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 h-4 w-4 text-blue-600" />
                <div className="text-sm text-blue-800">
                  {format === "json" ? (
                    <>
                      Provide an array of research paper objects. Required fields: title,
                      publication_year, author_ids (array of author IDs). Optional fields: abstract,
                      doi, url, is_published, citation_count, journal_id, category_id.
                    </>
                  ) : (
                    <>
                      Provide CSV data with headers. Required columns: title, publication_year,
                      authors (semicolon-separated author IDs). Optional columns: abstract, doi,
                      url, is_published, citation_count, journal_id, category_id.
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleImport} disabled={!importData.trim()}>
              Import Papers
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
