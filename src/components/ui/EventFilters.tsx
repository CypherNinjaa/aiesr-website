"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Event } from "@/types";

interface EventFiltersProps {
  selectedType: Event["type"] | "all";
  selectedDateFilter: "upcoming" | "past" | "all";
  searchTerm: string;
  onTypeChange: (type: Event["type"] | "all") => void;
  onDateFilterChange: (filter: "upcoming" | "past" | "all") => void;
  onSearchChange: (search: string) => void;
  eventCounts: {
    all: number;
    academic: number;
    cultural: number;
    research: number;
    workshop: number;
  };
}

const getTypeIcon = (type: Event["type"] | "all") => {
  switch (type) {
    case "academic":
      return "🎓";
    case "cultural":
      return "🎭";
    case "research":
      return "🔬";
    case "workshop":
      return "🛠️";
    case "all":
    default:
      return "📅";
  }
};

const getTypeColor = (type: Event["type"] | "all", isSelected: boolean) => {
  if (!isSelected) {
    return "bg-white text-gray-700 border-gray-300 hover:border-burgundy";
  }

  switch (type) {
    case "academic":
      return "bg-blue-500 text-white border-blue-500";
    case "cultural":
      return "bg-purple-500 text-white border-purple-500";
    case "research":
      return "bg-green-500 text-white border-green-500";
    case "workshop":
      return "bg-orange-500 text-white border-orange-500";
    case "all":
    default:
      return "bg-burgundy text-white border-burgundy";
  }
};

export const EventFilters: React.FC<EventFiltersProps> = ({
  selectedType,
  selectedDateFilter,
  searchTerm,
  onTypeChange,
  onDateFilterChange,
  onSearchChange,
  eventCounts,
}) => {
  const typeFilters = [
    { key: "all" as const, label: "All Events", count: eventCounts.all },
    { key: "academic" as const, label: "Academic", count: eventCounts.academic },
    { key: "cultural" as const, label: "Cultural", count: eventCounts.cultural },
    { key: "research" as const, label: "Research", count: eventCounts.research },
    { key: "workshop" as const, label: "Workshop", count: eventCounts.workshop },
  ];

  const dateFilters = [
    { key: "upcoming" as const, label: "Upcoming", icon: "⏭️" },
    { key: "past" as const, label: "Past", icon: "⏮️" },
    { key: "all" as const, label: "All", icon: "📅" },
  ];

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-burgundy">Filter Events</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search */}
        <div>
          <label htmlFor="event-search" className="mb-2 block text-sm font-medium text-gray-700">
            Search Events
          </label>
          <input
            id="event-search"
            type="text"
            placeholder="Search by title, description, or location..."
            value={searchTerm}
            onChange={e => onSearchChange(e.target.value)}
            className="focus:ring-burgundy w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2"
          />
        </div>

        {/* Date Filter */}
        <div>
          <h4 className="mb-3 text-sm font-medium text-gray-700">Time Period</h4>
          <div className="grid grid-cols-1 gap-2">
            {dateFilters.map(filter => (
              <button
                key={filter.key}
                onClick={() => onDateFilterChange(filter.key)}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                  selectedDateFilter === filter.key
                    ? "bg-burgundy border-burgundy text-white"
                    : "hover:border-burgundy border-gray-300 bg-white text-gray-700"
                } `}
              >
                <span>{filter.icon}</span>
                <span>{filter.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Type Filter */}
        <div>
          <h4 className="mb-3 text-sm font-medium text-gray-700">Event Type</h4>
          <div className="space-y-2">
            {typeFilters.map(type => (
              <button
                key={type.key}
                onClick={() => onTypeChange(type.key)}
                className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${getTypeColor(type.key, selectedType === type.key)} `}
              >
                <div className="flex items-center gap-2">
                  <span>{getTypeIcon(type.key)}</span>
                  <span>{type.label}</span>
                </div>
                <span
                  className={`rounded-full px-2 py-1 text-xs ${
                    selectedType === type.key
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-600"
                  } `}
                >
                  {type.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Clear Filters */}
        <div className="border-t pt-4">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => {
              onTypeChange("all");
              onDateFilterChange("upcoming");
              onSearchChange("");
            }}
          >
            Clear All Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
