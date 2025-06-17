"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { useEvents } from "@/hooks/useEvents";
import { formatDate } from "@/lib/utils";
import { CategoryService } from "@/services/category";
import { Event, Category } from "@/types";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const getEventCategoryColor = (event: Event) => {
  // Use category if available, fallback to deprecated type field
  if (event.category?.color_class) {
    return event.category.color_class;
  }

  // Fallback to old type-based colors for backward compatibility
  const type = event.type;
  switch (type) {
    case "academic":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "cultural":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "research":
      return "bg-green-100 text-green-800 border-green-200";
    case "workshop":
      return "bg-orange-100 text-orange-800 border-orange-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getEventCategoryDisplay = (event: Event) => {
  // Use category if available, fallback to deprecated type field
  if (event.category) {
    return {
      icon: event.category.icon_emoji,
      name: event.category.name,
    };
  }

  // Fallback to old type-based display for backward compatibility
  const type = event.type;
  const typeIcons = {
    academic: "📚",
    cultural: "🎭",
    research: "🔬",
    workshop: "🛠️",
  };

  return {
    icon: typeIcons[type as keyof typeof typeIcons] || "📅",
    name: type || "Event",
  };
};

export default function EventsPage() {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState<"upcoming" | "past" | "all">("upcoming");
  const [categories, setCategories] = useState<Category[]>([]);

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const activeCategories = await CategoryService.getActiveCategories();
        setCategories(activeCategories);
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };

    loadCategories();
  }, []);

  // Fetch events from database
  const {
    data: events = [],
    isLoading,
    error,
  } = useEvents({
    status: "published", // Only show published events
  });

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading events...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-600">Error loading events: {error.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }
  // Filter events based on selected criteria
  const filteredEvents = events
    .filter(event => {
      // Type/Category filter - check both new category system and old type system
      if (selectedType !== "all") {
        const matchesCategory =
          event.category?.slug === selectedType ||
          event.category?.name.toLowerCase() === selectedType;
        const matchesOldType = event.type === selectedType;
        if (!matchesCategory && !matchesOldType) return false;
      }

      // Search filter
      if (
        searchTerm &&
        !event.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !event.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !event.location.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      // Date filter
      const eventDate = new Date(event.date);
      const now = new Date();

      if (dateFilter === "upcoming" && eventDate < now) return false;
      if (dateFilter === "past" && eventDate >= now) return false;

      return true;
    })
    .sort((a, b) => {
      // Sort by date (upcoming events first for "upcoming", reverse for "past")
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateFilter === "past" ? dateB - dateA : dateA - dateB;
    });
  // Create dynamic filter options from categories and old types
  const eventTypes = [
    { key: "all", label: "All Events", count: events.length },
    // Add categories
    ...categories.map(category => ({
      key: category.slug,
      label: `${category.icon_emoji} ${category.name}`,
      count: events.filter(e => e.category?.id === category.id).length,
    })),
    // Add old types for backward compatibility
    {
      key: "academic",
      label: "📚 Academic (Legacy)",
      count: events.filter(e => e.type === "academic" && !e.category).length,
    },
    {
      key: "cultural",
      label: "🎭 Cultural (Legacy)",
      count: events.filter(e => e.type === "cultural" && !e.category).length,
    },
    {
      key: "research",
      label: "🔬 Research (Legacy)",
      count: events.filter(e => e.type === "research" && !e.category).length,
    },
    {
      key: "workshop",
      label: "🛠️ Workshop (Legacy)",
      count: events.filter(e => e.type === "workshop" && !e.category).length,
    },
  ].filter(type => type.count > 0 || type.key === "all"); // Only show types with events

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="from-burgundy bg-gradient-to-br to-red-900 py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-primary mb-6 text-5xl font-bold md:text-6xl">
              Events & Activities
            </h1>
            <div className="bg-gold mx-auto mb-6 h-1 w-24 rounded-full"></div>
            <p className="mx-auto max-w-3xl text-xl leading-relaxed">
              Explore our comprehensive calendar of literary events, academic conferences, cultural
              programs, and workshops designed to enrich your academic journey.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="border-b bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
            {/* Search */}
            <div className="max-w-md flex-1">
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="focus:ring-burgundy w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2"
              />
            </div>

            {/* Date Filter */}
            <div className="flex gap-2">
              {[
                { key: "upcoming" as const, label: "Upcoming" },
                { key: "past" as const, label: "Past" },
                { key: "all" as const, label: "All" },
              ].map(filter => (
                <button
                  key={filter.key}
                  onClick={() => setDateFilter(filter.key)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    dateFilter === filter.key
                      ? "bg-burgundy text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  } `}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Type Filters */}
          <div className="mt-6 flex flex-wrap gap-3">
            {eventTypes.map(type => (
              <button
                key={type.key}
                onClick={() => setSelectedType(type.key)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  selectedType === type.key
                    ? "bg-burgundy border-burgundy text-white"
                    : "hover:border-burgundy border-gray-300 bg-white text-gray-700"
                } `}
              >
                {type.label} ({type.count})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Events List */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          {/* Results Info */}
          <div className="mb-8">
            <p className="text-gray-600">
              Showing {filteredEvents.length} of {events.length} events
              {selectedType !== "all" && ` in ${selectedType} category`}
            </p>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="py-16 text-center">
              <div className="mb-4 text-6xl">📅</div>
              <h3 className="mb-2 text-2xl font-semibold text-gray-700">No Events Found</h3>
              <p className="mb-6 text-gray-500">Try adjusting your filters or search criteria.</p>
              <Button
                onClick={() => {
                  setSelectedType("all");
                  setSearchTerm("");
                  setDateFilter("all");
                }}
              >
                Clear All Filters
              </Button>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              {filteredEvents.map(event => (
                <motion.div key={event.id} variants={cardVariants}>
                  <Card className="group overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-xl">
                    <CardContent className="p-0">
                      <div className="grid grid-cols-1 gap-0 lg:grid-cols-5">
                        {" "}
                        {/* Event Image */}
                        <div className="relative h-64 lg:col-span-2 lg:h-auto">
                          {event.image ? (
                            <Image
                              src={event.image}
                              alt={event.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, 40vw"
                            />
                          ) : (
                            <div className="from-burgundy to-gold h-full bg-gradient-to-br"></div>
                          )}
                          <div className="absolute inset-0 bg-black/20"></div>{" "}
                          <div className="absolute top-4 left-4">
                            {(() => {
                              const categoryDisplay = getEventCategoryDisplay(event);
                              return (
                                <span
                                  className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-medium ${getEventCategoryColor(event)} `}
                                >
                                  {categoryDisplay.icon} {categoryDisplay.name}
                                </span>
                              );
                            })()}
                          </div>
                          <div className="absolute bottom-4 left-4 text-white">
                            <div className="text-3xl font-bold">
                              {new Date(event.date).getDate()}
                            </div>
                            <div className="text-sm">
                              {new Date(event.date).toLocaleDateString("en-US", {
                                month: "short",
                                year: "numeric",
                              })}
                            </div>
                          </div>
                          {event.featured && (
                            <div className="absolute top-4 right-4">
                              <span className="bg-gold rounded-full px-2 py-1 text-xs font-semibold text-white">
                                Featured
                              </span>
                            </div>
                          )}
                        </div>
                        {/* Event Details */}
                        <div className="p-6 lg:col-span-3 lg:p-8">
                          <div className="flex h-full flex-col">
                            <div className="flex-1">
                              <h3 className="text-burgundy group-hover:text-gold mb-3 text-2xl font-bold transition-colors md:text-3xl">
                                {event.title}
                              </h3>

                              <p className="mb-4 leading-relaxed text-gray-600">
                                {event.description}
                              </p>

                              <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                  <span>📅</span>
                                  <span>{formatDate(event.date)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                  <span>⏰</span>
                                  <span>
                                    {new Date(event.date).toLocaleTimeString("en-US", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                  <span>📍</span>
                                  <span>{event.location}</span>
                                </div>
                                {event.registrationRequired && (
                                  <div className="flex items-center gap-2 text-sm text-green-600">
                                    <span>✅</span>
                                    <span>Registration Required</span>
                                  </div>
                                )}
                              </div>

                              {event.speakers && event.speakers.length > 0 && (
                                <div className="mb-6">
                                  <h4 className="mb-2 font-semibold text-gray-800">
                                    Featured Speakers:
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                    {event.speakers.map((speaker, idx) => (
                                      <span
                                        key={idx}
                                        className="rounded-full bg-gray-100 px-3 py-1 text-sm"
                                      >
                                        {speaker}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {event.tags && event.tags.length > 0 && (
                                <div className="mb-6">
                                  <div className="flex flex-wrap gap-2">
                                    {event.tags.map((tag, idx) => (
                                      <span
                                        key={idx}
                                        className="bg-burgundy/10 text-burgundy rounded px-2 py-1 text-xs"
                                      >
                                        #{tag}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row">
                              <Link href={`/events/${event.id}`} className="flex-1">
                                <Button className="w-full">View Full Details</Button>
                              </Link>{" "}
                              {event.registrationRequired &&
                                (event.customRegistrationLink || event.registrationLink) && (
                                  <Link
                                    href={
                                      event.customRegistrationLink || event.registrationLink || "#"
                                    }
                                    className="flex-1"
                                  >
                                    <Button variant="outline" className="w-full">
                                      Register Now
                                    </Button>
                                  </Link>
                                )}
                            </div>

                            {event.capacity && event.registeredCount !== undefined && (
                              <div className="mt-3 border-t pt-3">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-500">Registration:</span>
                                  <span className="font-semibold">
                                    {event.registeredCount}/{event.capacity} registered
                                  </span>
                                </div>{" "}
                                <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                                  <div
                                    className="progress-bar-sm"
                                    data-progress={
                                      Math.round(
                                        Math.min(
                                          event.capacity && event.registeredCount !== undefined
                                            ? (event.registeredCount / event.capacity) * 100
                                            : 0,
                                          100
                                        ) / 10
                                      ) * 10
                                    }
                                  ></div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
