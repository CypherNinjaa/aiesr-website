"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useUpcomingEvents } from "@/hooks/useEvents";
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

const getEventTypeColor = (event: Event) => {
  // Use category if available, fallback to deprecated type field
  if (event.category?.color_class) {
    return event.category.color_class;
  }

  // Fallback to old type-based colors for backward compatibility
  const type = event.type;
  switch (type) {
    case "academic":
      return "bg-blue-100 text-blue-800";
    case "cultural":
      return "bg-purple-100 text-purple-800";
    case "research":
      return "bg-green-100 text-green-800";
    case "workshop":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getEventTypeIcon = (event: Event) => {
  // Use category if available, fallback to deprecated type field
  if (event.category?.icon_emoji) {
    return event.category.icon_emoji;
  }

  // Fallback to old type-based icons for backward compatibility
  const type = event.type;
  switch (type) {
    case "academic":
      return "🎓";
    case "cultural":
      return "🎭";
    case "research":
      return "🔬";
    case "workshop":
      return "🛠️";
    default:
      return "📅";
  }
};

interface MiniCalendarProps {
  events: Event[];
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}

const MiniCalendar: React.FC<MiniCalendarProps> = ({ events, selectedDate, onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const hasEvent = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return events.some((event: Event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return (
      selectedDate.getDate() === date.getDate() &&
      selectedDate.getMonth() === date.getMonth() &&
      selectedDate.getFullYear() === date.getFullYear()
    );
  };

  return (
    <div className="rounded-lg bg-white p-4 shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <button onClick={prevMonth} className="rounded p-1 hover:bg-gray-100">
          ←
        </button>
        <h3 className="font-semibold text-gray-900">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button onClick={nextMonth} className="rounded p-1 hover:bg-gray-100">
          →
        </button>
      </div>{" "}
      <div className="mb-2 grid grid-cols-7 gap-1">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
          <div
            key={`day-header-${index}`}
            className="p-2 text-center text-xs font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfMonth }, (_, i) => (
          <div key={`empty-${i}`} className="p-2"></div>
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          return (
            <button
              key={day}
              onClick={() =>
                onDateSelect(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))
              }
              className={`rounded p-2 text-sm transition-colors ${
                isSelected(day)
                  ? "bg-blue-600 text-white"
                  : hasEvent(day)
                    ? "bg-blue-100 text-blue-900 hover:bg-blue-200"
                    : "hover:bg-gray-100"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default function EventsSection() {
  const [selectedType, setSelectedType] = useState<Event["type"] | "all">("all");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
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

  // Fetch upcoming events from Supabase
  const { data: allEvents, isLoading, error } = useUpcomingEvents(20);

  if (isLoading) {
    return (
      <section className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading events...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600">Error loading events: {error.message}</p>
          </div>
        </div>
      </section>
    );
  }

  const events = allEvents || [];

  // Filter events
  const now = new Date();
  const threeMonthsFromNow = new Date(now.getFullYear(), now.getMonth() + 3, now.getDate());

  const upcomingEvents = events
    .filter(
      (event: Event) => new Date(event.date) >= now && new Date(event.date) <= threeMonthsFromNow
    )
    .sort((a: Event, b: Event) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const filteredEvents = upcomingEvents.filter((event: Event) => {
    // Type/Category filter - check both new category system and old type system
    if (selectedType !== "all") {
      const matchesCategory =
        event.category?.slug === selectedType ||
        event.category?.name.toLowerCase() === selectedType;
      const matchesOldType = event.type === selectedType;
      if (!matchesCategory && !matchesOldType) return false;
    }

    const dateMatch =
      !selectedDate || new Date(event.date).toDateString() === selectedDate.toDateString();
    return dateMatch;
  });

  const featuredEvent = events.find((event: Event) => event.featured);
  const handleRegistration = (event: Event) => {
    // Track analytics
    // Check for custom registration link first (new field), then fall back to legacy field
    const registrationUrl = event.customRegistrationLink || event.registrationLink;

    if (registrationUrl) {
      window.open(registrationUrl, "_blank");
    } else {
      // Use the default registration URL from environment
      window.open(process.env.NEXT_PUBLIC_REGISTRATION_URL, "_blank");
    }
  };

  return (
    <section className="bg-gray-50 py-12 sm:py-16 lg:py-24" id="events">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          {" "}
          <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:mb-6 sm:text-4xl md:text-5xl">
            Upcoming Events
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-gray-600 sm:text-xl">
            Join us for exciting academic conferences, cultural festivals, research symposiums, and
            interactive workshops throughout the year.
          </p>
        </motion.div>{" "}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Sidebar - Hidden on mobile, shown on desktop */}
          <div className="hidden space-y-6 lg:col-span-1 lg:flex lg:flex-col">
            {/* Mini Calendar */}
            <MiniCalendar
              events={events}
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Filter Events</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label
                    htmlFor="event-type-filter-desktop"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Event Type
                  </label>{" "}
                  <select
                    id="event-type-filter-desktop"
                    value={selectedType}
                    onChange={e => setSelectedType(e.target.value as Event["type"] | "all")}
                    className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Events</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.slug}>
                        {category.icon_emoji} {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                {selectedDate && (
                  <div>
                    <p className="mb-2 text-sm text-gray-600">
                      Showing events for: {selectedDate.toLocaleDateString()}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedDate(null)}
                      className="w-full"
                    >
                      Clear Date Filter
                    </Button>
                  </div>
                )}
                <div>
                  <label
                    htmlFor="view-mode-filter-desktop"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    View Mode
                  </label>
                  <div className="flex rounded-md shadow-sm">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`flex-1 rounded-l-md border px-3 py-2 text-sm font-medium ${
                        viewMode === "grid"
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Grid
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`flex-1 rounded-r-md border-t border-r border-b px-3 py-2 text-sm font-medium ${
                        viewMode === "list"
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      List
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Event Statistics</CardTitle>
              </CardHeader>{" "}
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Events</span>
                  <span className="font-semibold text-blue-600">{filteredEvents.length}</span>
                </div>
                {/* Dynamic category statistics - only show categories with events */}
                {categories
                  .filter(
                    category =>
                      events.filter((e: Event) => e.category?.id === category.id).length > 0
                  )
                  .map(category => (
                    <div key={category.id} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {category.icon_emoji} {category.name}
                      </span>
                      <span className="font-semibold">
                        {events.filter((e: Event) => e.category?.id === category.id).length}
                      </span>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Event */}
            {featuredEvent && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-8"
              >
                {" "}
                <Card className="overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600">
                  <CardContent className="p-4 text-white sm:p-6 lg:p-8">
                    <div className="mb-4 flex items-center gap-2">
                      <span className="text-xl sm:text-2xl">⭐</span>
                      <span className="text-sm font-semibold text-blue-100 sm:text-base">
                        Featured Event
                      </span>
                    </div>
                    <h3 className="mb-4 text-xl font-bold sm:text-2xl">{featuredEvent.title}</h3>
                    <p className="mb-6 text-sm text-blue-100 sm:text-base">
                      {featuredEvent.shortDescription}
                    </p>
                    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                      <div className="flex items-center gap-2">
                        <span>📅</span>
                        <span className="text-sm sm:text-base">
                          {formatDate(featuredEvent.date)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>📍</span>
                        <span className="text-sm sm:text-base">{featuredEvent.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>{getEventTypeIcon(featuredEvent)}</span>
                        <span className="text-sm capitalize sm:text-base">
                          {featuredEvent.type}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                      {" "}
                      <Button
                        onClick={() => handleRegistration(featuredEvent)}
                        className="w-full bg-white text-blue-600 hover:bg-gray-100 sm:w-auto"
                        size="sm"
                      >
                        Register Now
                      </Button>
                      <Link href={`/events/${featuredEvent.id}`}>
                        <Button
                          variant="outline"
                          className="w-full border-white text-white hover:bg-white hover:text-blue-600 sm:w-auto"
                          size="sm"
                        >
                          Learn More
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
            {/* Mobile Filters - Shown only on mobile, after featured event */}
            <div className="mb-8 lg:hidden">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Filter Events</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Mobile Calendar Toggle */}
                  <div>
                    <div className="mb-2 text-sm font-medium text-gray-700">Calendar</div>
                    <details className="group">
                      <summary className="cursor-pointer rounded-md border border-gray-300 p-2 text-sm hover:bg-gray-50">
                        📅 {selectedDate ? selectedDate.toLocaleDateString() : "Select Date"}
                      </summary>
                      <div className="mt-2">
                        <MiniCalendar
                          events={events}
                          selectedDate={selectedDate}
                          onDateSelect={setSelectedDate}
                        />
                      </div>
                    </details>
                  </div>
                  <div>
                    <label
                      htmlFor="event-type-filter-mobile"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Event Type
                    </label>{" "}
                    <select
                      id="event-type-filter-mobile"
                      value={selectedType}
                      onChange={e => setSelectedType(e.target.value as Event["type"] | "all")}
                      className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Events</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.slug}>
                          {category.icon_emoji} {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {selectedDate && (
                    <div>
                      <p className="mb-2 text-sm text-gray-600">
                        Showing events for: {selectedDate.toLocaleDateString()}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedDate(null)}
                        className="w-full"
                      >
                        Clear Date Filter
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            {/* Events Grid/List */}
            {filteredEvents.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="mb-4 text-6xl">📅</div>
                  <h3 className="mb-2 text-xl font-semibold text-gray-900">No events found</h3>
                  <p className="mb-4 text-gray-600">
                    {selectedType !== "all" || selectedDate
                      ? "Try adjusting your filters to see more events."
                      : "Check back soon for upcoming events!"}
                  </p>
                  {(selectedType !== "all" || selectedDate) && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedType("all");
                        setSelectedDate(null);
                      }}
                    >
                      Clear All Filters
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2"
                    : "space-y-4"
                }
              >
                {filteredEvents.map((event: Event) => (
                  <motion.div
                    key={event.id}
                    variants={cardVariants}
                    className={viewMode === "list" ? "w-full" : ""}
                  >
                    <Card className="h-full transition-shadow duration-300 hover:shadow-lg">
                      <CardContent className="p-6">
                        {" "}
                        <div className={viewMode === "list" ? "flex gap-6" : ""}>
                          {event.image && (
                            <div
                              className={`${
                                viewMode === "list" ? "h-32 w-32 flex-shrink-0" : "mb-4 h-48 w-full"
                              } relative overflow-hidden rounded-lg`}
                            >
                              <Image
                                src={event.image}
                                alt={event.title}
                                fill
                                className="object-cover"
                                sizes={
                                  viewMode === "list" ? "128px" : "(max-width: 768px) 100vw, 50vw"
                                }
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            {" "}
                            <div className="mb-3 flex items-center gap-2">
                              <span
                                className={`rounded-full px-2 py-1 text-xs font-medium ${getEventTypeColor(
                                  event
                                )}`}
                              >
                                {getEventTypeIcon(event)} {event.category?.name || event.type}
                              </span>
                              {event.featured && (
                                <span className="text-sm text-yellow-500">⭐</span>
                              )}
                            </div>
                            <h3 className="mb-2 text-xl font-bold text-gray-900">{event.title}</h3>
                            <p className="mb-4 line-clamp-3 text-gray-600">
                              {event.shortDescription}
                            </p>
                            <div className="mb-4 space-y-2">
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                📅 {formatDate(event.date)}
                              </div>
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                📍 {event.location}
                              </div>
                              {event.speakers && event.speakers.length > 0 && (
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                  🎤{" "}
                                  {event.speakers
                                    .slice(0, 2)
                                    .map((speaker: string, idx: number) => (
                                      <span key={idx}>
                                        {speaker}
                                        {idx < Math.min(event.speakers!.length, 2) - 1 && ", "}
                                      </span>
                                    ))}
                                  {event.speakers.length > 2 &&
                                    ` +${event.speakers.length - 2} more`}
                                </div>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleRegistration(event)}
                                className="flex-1"
                              >
                                Register Now
                              </Button>
                              <Link href={`/events/${event.id}`}>
                                <Button variant="outline" size="sm">
                                  Details
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}{" "}
            {/* View All Events Link */}
            <div className="mt-8 text-center sm:mt-12">
              <Link href="/events">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  View All Events
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
