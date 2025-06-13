"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import eventsData from "@/data/events.json";
import { formatDate } from "@/lib/utils";
import { Event, EventRaw } from "@/types";

// Transform raw event data to Event objects
const transformEvents = (rawEvents: EventRaw[]): Event[] => {
  return rawEvents.map(event => ({
    ...event,
    date: new Date(event.date),
    endDate: event.endDate ? new Date(event.endDate) : undefined,
  }));
};

const events = transformEvents(eventsData as EventRaw[]);

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

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const hasEvent = (date: Date) => {
    return events.some(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8"></div>);
    }

    // Calendar days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
      const eventExists = hasEvent(date);
      const isToday = date.toDateString() === new Date().toDateString();

      days.push(
        <button
          key={day}
          onClick={() => onDateSelect(date)}
          className={`relative flex h-8 w-8 items-center justify-center rounded-full text-sm transition-colors ${isSelected ? "bg-burgundy text-white" : ""} ${isToday && !isSelected ? "bg-gold text-white" : ""} ${!isSelected && !isToday ? "hover:bg-gray-100" : ""} `}
        >
          {day}
          {eventExists && (
            <div className="bg-gold absolute right-0 bottom-0 h-2 w-2 rounded-full"></div>
          )}
        </button>
      );
    }

    return days;
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-burgundy font-semibold">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <div className="flex gap-1">
            <button
              onClick={previousMonth}
              className="rounded p-1 transition-colors hover:bg-gray-100"
            >
              ‹
            </button>
            <button onClick={nextMonth} className="rounded p-1 transition-colors hover:bg-gray-100">
              ›
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs text-gray-500">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>
        <div className="grid grid-cols-7 gap-1">{renderCalendarDays()}</div>
        <div className="mt-4 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <div className="bg-gold h-2 w-2 rounded-full"></div>
            <span>Events Available</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const EventsSection: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Get upcoming events (next 3 months)
  const now = new Date();
  const threeMonthsFromNow = new Date(now.getFullYear(), now.getMonth() + 3, now.getDate());

  const upcomingEvents = events
    .filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= now && eventDate <= threeMonthsFromNow;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3); // Show only first 3 upcoming events

  const filteredEvents = selectedDate
    ? events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.toDateString() === selectedDate.toDateString();
      })
    : upcomingEvents;

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="font-primary text-burgundy mb-6 text-4xl font-bold md:text-5xl">
            Upcoming Events
          </h2>
          <div className="bg-gold mx-auto mb-6 h-1 w-24 rounded-full"></div>
          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-700">
            Discover exciting literary events, academic conferences, and cultural programs. Join us
            for enriching experiences that celebrate literature and learning.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Events List */}
          <div className="lg:col-span-3">
            {selectedDate && (
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-burgundy text-xl font-semibold">
                  Events for {formatDate(selectedDate)}
                </h3>
                <Button variant="outline" size="sm" onClick={() => setSelectedDate(null)}>
                  Show All Upcoming
                </Button>
              </div>
            )}

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-6"
            >
              {filteredEvents.length === 0 ? (
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-8 text-center">
                    <div className="mb-4 text-6xl">📅</div>
                    <h3 className="mb-2 text-xl font-semibold text-gray-700">No Events Found</h3>
                    <p className="text-gray-500">
                      {selectedDate
                        ? "No events scheduled for this date."
                        : "No upcoming events in the next 3 months."}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredEvents.map(event => (
                  <motion.div key={event.id} variants={cardVariants}>
                    <Card className="group border-0 shadow-lg transition-all duration-300 hover:shadow-xl">
                      <CardContent className="p-0">
                        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-4">
                          {/* Date & Type */}
                          <div className="text-center md:text-left">
                            <div className="text-burgundy mb-1 text-3xl font-bold">
                              {new Date(event.date).getDate()}
                            </div>
                            <div className="mb-2 text-sm text-gray-600">
                              {new Date(event.date).toLocaleDateString("en-US", {
                                month: "short",
                                year: "numeric",
                              })}
                            </div>
                            <div className="mb-3 text-sm text-gray-500">
                              {new Date(event.date).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${getEventTypeColor(event.type)} `}
                            >
                              {getEventTypeIcon(event.type)} {event.type}
                            </span>
                          </div>

                          {/* Event Details */}
                          <div className="md:col-span-2">
                            <h3 className="text-burgundy group-hover:text-gold mb-2 text-xl font-bold transition-colors">
                              {event.title}
                            </h3>
                            <p className="mb-3 leading-relaxed text-gray-600">
                              {event.shortDescription}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">📍 {event.location}</div>
                              {event.registrationRequired && (
                                <div className="flex items-center gap-1">
                                  ✅ Registration Required
                                </div>
                              )}
                            </div>
                            {event.speakers && event.speakers.length > 0 && (
                              <div className="mt-3">
                                <div className="mb-1 text-sm text-gray-500">Speakers:</div>
                                <div className="flex flex-wrap gap-2">
                                  {event.speakers.slice(0, 2).map((speaker, idx) => (
                                    <span
                                      key={idx}
                                      className="rounded bg-gray-100 px-2 py-1 text-xs"
                                    >
                                      {speaker}
                                    </span>
                                  ))}
                                  {event.speakers.length > 2 && (
                                    <span className="text-xs text-gray-500">
                                      +{event.speakers.length - 2} more
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col gap-3">
                            <Link href={`/events/${event.id}`}>
                              <Button className="w-full">View Details</Button>
                            </Link>
                            {event.registrationRequired && event.registrationLink && (
                              <Link href={event.registrationLink}>
                                <Button variant="outline" className="w-full">
                                  Register Now
                                </Button>
                              </Link>
                            )}
                            {event.capacity && event.registeredCount !== undefined && (
                              <div className="text-center text-xs text-gray-500">
                                {event.registeredCount}/{event.capacity} registered
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </motion.div>

            {/* View All Events Button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="mt-12 text-center"
            >
              <Link href="/events">
                <Button size="lg" variant="outline">
                  View All Events
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Sidebar - Mini Calendar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <MiniCalendar
                events={events}
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
              />

              {/* Event Categories */}
              <Card className="mt-6 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-burgundy">Event Categories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    {
                      type: "academic" as const,
                      label: "Academic",
                      count: events.filter(e => e.type === "academic").length,
                    },
                    {
                      type: "cultural" as const,
                      label: "Cultural",
                      count: events.filter(e => e.type === "cultural").length,
                    },
                    {
                      type: "research" as const,
                      label: "Research",
                      count: events.filter(e => e.type === "research").length,
                    },
                    {
                      type: "workshop" as const,
                      label: "Workshop",
                      count: events.filter(e => e.type === "workshop").length,
                    },
                  ].map(category => (
                    <div key={category.type} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-3 w-3 rounded-full ${category.type === "academic" ? "bg-blue-500" : ""} ${category.type === "cultural" ? "bg-purple-500" : ""} ${category.type === "research" ? "bg-green-500" : ""} ${category.type === "workshop" ? "bg-orange-500" : ""} `}
                        ></span>
                        <span className="text-sm">{category.label}</span>
                      </div>
                      <span className="text-xs text-gray-500">{category.count}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
