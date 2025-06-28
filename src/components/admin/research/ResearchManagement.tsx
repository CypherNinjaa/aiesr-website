"use client";

import { BookOpen, Users, Building, Tag, FileText } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { AuthorManagement } from "./AuthorManagement";
import { CategoryManagement } from "./CategoryManagement";
import { JournalManagement } from "./JournalManagement";
import { ResearchPaperManagement } from "./ResearchPaperManagement";

type TabType = "papers" | "authors" | "journals" | "categories";

interface TabConfig {
  id: TabType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType;
}

const tabs: TabConfig[] = [
  {
    id: "papers",
    label: "Research Papers",
    icon: FileText,
    component: ResearchPaperManagement,
  },
  {
    id: "authors",
    label: "Authors",
    icon: Users,
    component: AuthorManagement,
  },
  {
    id: "journals",
    label: "Journals",
    icon: Building,
    component: JournalManagement,
  },
  {
    id: "categories",
    label: "Categories",
    icon: Tag,
    component: CategoryManagement,
  },
];

export function ResearchManagement() {
  const [activeTab, setActiveTab] = useState<TabType>("papers");

  const ActiveComponent =
    tabs.find(tab => tab.id === activeTab)?.component || ResearchPaperManagement;

  return (
    <div className="container mx-auto space-y-6 py-6">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold">
            <BookOpen className="h-8 w-8 text-blue-600" />
            Research Management
          </h1>
          <p className="text-gray-600">Manage research papers, authors, journals, and categories</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <Card>
        <CardContent className="p-0">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Research management tabs">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 border-b-2 px-1 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`}
                    type="button"
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </CardContent>
      </Card>

      {/* Tab Content */}
      <div className="tab-content">
        <ActiveComponent />
      </div>
    </div>
  );
}
