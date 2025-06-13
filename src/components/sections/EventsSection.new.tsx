"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useUpcomingEvents } from "@/hooks/useEvents";
import { formatDate } from "@/lib/utils";
import { Event } from "@/types";

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

const getEventTypeColor = (type: Event["type"]) => {
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

const getEventTypeIcon = (type: Event["type"]) => {
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
      </div>
      <div className="mb-2 grid grid-cols-7 gap-1">
        {["S", "M", "T", "W", "T", "F", "S"].map(day => (
          <div key={day} className="p-2 text-center text-xs font-medium text-gray-500">
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
    const typeMatch = selectedType === "all" || event.type === selectedType;
    const dateMatch =
      !selectedDate || new Date(event.date).toDateString() === selectedDate.toDateString();
    return typeMatch && dateMatch;
  });

  const featuredEvent = events.find((event: Event) => event.featured);

  const handleRegistration = (event: Event) => {
    // Track analytics
    if (event.registrationLink) {
      window.open(event.registrationLink, "_blank");
    } else {
      // Use the default registration URL from environment
      window.open(process.env.NEXT_PUBLIC_REGISTRATION_URL, "_blank");
    }
  };

  return (
    <section className="bg-gray-50 py-24" id="events">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">Upcoming Events</h2>
          <p className="mx-auto max-w-3xl text-xl text-gray-600">
            Join us for exciting academic conferences, cultural festivals, research symposiums, and
            interactive workshops throughout the year.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Sidebar */}
          <div className="space-y-6 lg:col-span-1">
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
                {" "}
                <div>
                  <label
                    htmlFor="event-type-filter"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Event Type
                  </label>
                  <select
                    id="event-type-filter"
                    value={selectedType}
                    onChange={e => setSelectedType(e.target.value as Event["type"] | "all")}
                    className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Events</option>
                    <option value="academic">🎓 Academic</option>
                    <option value="cultural">🎭 Cultural</option>
                    <option value="research">🔬 Research</option>
                    <option value="workshop">🛠️ Workshop</option>
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
                )}{" "}
                <div>
                  <label
                    htmlFor="view-mode-buttons"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    View Mode
                  </label>
                  <div
                    id="view-mode-buttons"
                    className="flex rounded-md shadow-sm"
                    role="group"
                    aria-label="View mode selection"
                  >
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
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Events</span>
                  <span className="font-semibold text-blue-600">{events.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Academic</span>
                  <span className="font-semibold">
                    {events.filter((e: Event) => e.type === "academic").length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Cultural</span>
                  <span className="font-semibold">
                    {events.filter((e: Event) => e.type === "cultural").length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Research</span>
                  <span className="font-semibold">
                    {events.filter((e: Event) => e.type === "research").length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Workshop</span>
                  <span className="font-semibold">
                    {events.filter((e: Event) => e.type === "workshop").length}
                  </span>
                </div>
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
                <Card className="overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600">
                  <CardContent className="p-8 text-white">
                    <div className="mb-4 flex items-center gap-2">
                      <span className="text-2xl">⭐</span>
                      <span className="font-semibold text-blue-100">Featured Event</span>
                    </div>
                    <h3 className="mb-4 text-2xl font-bold">{featuredEvent.title}</h3>
                    <p className="mb-6 text-blue-100">{featuredEvent.shortDescription}</p>
                    <div className="mb-6 flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span>📅</span>
                        <span>{formatDate(featuredEvent.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>📍</span>
                        <span>{featuredEvent.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>{getEventTypeIcon(featuredEvent.type)}</span>
                        <span className="capitalize">{featuredEvent.type}</span>
                      </div>
                    </div>{" "}
                    <div className="flex gap-4">
                      <Button
                        variant="outline"
                        onClick={() => handleRegistration(featuredEvent)}
                        className="bg-white text-blue-600 hover:bg-gray-100"
                      >
                        Register Now
                      </Button>
                      <Link href={`/events/${featuredEvent.id}`}>
                        <Button
                          variant="outline"
                          className="border-white text-white hover:bg-white hover:text-blue-600"
                        >
                          Learn More
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

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
                  viewMode === "grid" ? "grid grid-cols-1 gap-6 md:grid-cols-2" : "space-y-4"
                }
              >
                {" "}
                {filteredEvents.map((event: Event, _index: number) => (
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
                            <div className="mb-3 flex items-center gap-2">
                              <span
                                className={`rounded-full px-2 py-1 text-xs font-medium ${getEventTypeColor(
                                  event.type
                                )}`}
                              >
                                {getEventTypeIcon(event.type)} {event.type}
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
            )}

            {/* View All Events Link */}
            <div className="mt-12 text-center">
              <Link href="/events">
                <Button variant="outline" size="lg">
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
