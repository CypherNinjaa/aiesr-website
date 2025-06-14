"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useEvent, useEventsByType } from "@/hooks/useEvents";
import { formatDate, getEventRegistrationLink, canUserRegisterForEvent } from "@/lib/utils";
import { Event } from "@/types";

interface EventPageProps {
  params: Promise<{
    id: string;
  }>;
}

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

export default function EventPage({ params }: EventPageProps) {
  // Use React.use() for client components with promises in Next.js 15
  const { id } = React.use(params);

  // Fetch event from database
  const { data: event, isLoading, error } = useEvent(id);
  const { data: relatedEvents = [] } = useEventsByType(event?.type, 3);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-20">
        <div className="text-center">
          <div className="border-burgundy h-32 w-32 animate-spin rounded-full border-b-2"></div>
          <p className="mt-4 text-gray-600">Loading event...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    notFound();
  }

  // Filter out the current event from related events
  const filteredRelatedEvents = relatedEvents.filter(e => e.id !== event.id).slice(0, 3);
  const isEventPast = new Date(event.date) < new Date();
  const registrationLink = getEventRegistrationLink(event);
  const canRegister = canUserRegisterForEvent(event);

  // Debug logging
  console.log("Event Registration Debug:", {
    eventId: event.id,
    registrationRequired: event.registrationRequired,
    registrationLink: event.registrationLink,
    customRegistrationLink: event.customRegistrationLink,
    finalRegistrationLink: registrationLink,
    canRegister,
    isEventPast,
  });

  return (
    <div className="min-h-screen pt-20">
      {/* Breadcrumb */}
      <section className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <nav className="text-sm text-gray-600">
            <Link href="/" className="hover:text-burgundy">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/events" className="hover:text-burgundy">
              Events
            </Link>
            <span className="mx-2">/</span>
            <span className="text-burgundy">{event.title}</span>
          </nav>
        </div>
      </section>{" "}
      {/* Event Hero */}
      <section className="from-burgundy bg-gradient-to-br to-red-900 py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Event Details */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col justify-center"
            >
              <div className="mb-6 flex flex-wrap items-center gap-4">
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${getEventTypeColor(event.type)} border-2 border-white/20`}
                >
                  {getEventTypeIcon(event.type)} {event.type}
                </span>
                {event.featured && (
                  <span className="bg-gold text-burgundy rounded-full px-3 py-1 text-sm font-semibold">
                    Featured Event
                  </span>
                )}
                {isEventPast && (
                  <span className="rounded-full bg-gray-600 px-3 py-1 text-sm text-white">
                    Past Event
                  </span>
                )}
              </div>
              <h1 className="font-primary mb-6 text-4xl font-bold md:text-5xl">{event.title}</h1>
              <p className="mb-8 text-xl leading-relaxed text-gray-200">{event.shortDescription}</p>
              <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="rounded-lg bg-white/10 p-4">
                  <div className="text-gold mb-2 text-2xl">📅</div>
                  <div className="text-sm text-gray-300">Date</div>
                  <div className="font-semibold">{formatDate(event.date)}</div>
                </div>
                <div className="rounded-lg bg-white/10 p-4">
                  <div className="text-gold mb-2 text-2xl">⏰</div>
                  <div className="text-sm text-gray-300">Time</div>
                  <div className="font-semibold">
                    {new Date(event.date).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {event.endDate && (
                      <div className="text-sm text-gray-300">
                        to{" "}
                        {new Date(event.endDate).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    )}
                  </div>
                </div>
                <div className="rounded-lg bg-white/10 p-4">
                  <div className="text-gold mb-2 text-2xl">📍</div>
                  <div className="text-sm text-gray-300">Location</div>
                  <div className="font-semibold">{event.location}</div>
                </div>
                <div className="rounded-lg bg-white/10 p-4">
                  <div className="text-gold mb-2 text-2xl">👥</div>
                  <div className="text-sm text-gray-300">Capacity</div>
                  <div className="font-semibold">
                    {event.capacity ? (
                      <>
                        {event.registeredCount || 0}/{event.capacity}
                        <div className="text-sm text-gray-300">registered</div>
                      </>
                    ) : (
                      "Open"
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-4 sm:flex-row">
                {canRegister && registrationLink && (
                  <Link href={registrationLink}>
                    <Button
                      size="lg"
                      className="border-2 border-yellow-600 bg-yellow-500 font-bold text-white hover:bg-yellow-600"
                    >
                      Register Now
                    </Button>
                  </Link>
                )}
                {event.pdfBrochure && (
                  <a href={event.pdfBrochure} download target="_blank" rel="noopener noreferrer">
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-white font-semibold text-white hover:bg-white hover:text-red-900"
                    >
                      📄 Download Brochure
                    </Button>
                  </a>
                )}
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white font-semibold text-white hover:bg-white hover:text-red-900"
                >
                  Share Event
                </Button>
              </div>
            </motion.div>

            {/* Event Poster */}
            {event.posterImage && (
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex items-center justify-center"
              >
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  {" "}
                  <Image
                    src={event.posterImage}
                    alt={`${event.title} Poster`}
                    width={400}
                    height={600}
                    className="h-auto max-h-[600px] w-full max-w-md object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>
      {/* Event Content */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {/* Description */}
                <Card className="mb-8 border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-burgundy">About This Event</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg leading-relaxed text-gray-700">{event.description}</p>
                  </CardContent>
                </Card>

                {/* Schedule */}
                {event.schedule && event.schedule.length > 0 && (
                  <Card className="mb-8 border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-burgundy">Event Schedule</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {event.schedule.map(
                          (
                            item: {
                              time: string;
                              title: string;
                              speaker?: string;
                              description: string;
                            },
                            index: number
                          ) => (
                            <div
                              key={index}
                              className="flex gap-4 border-b border-gray-100 pb-6 last:border-0"
                            >
                              <div className="w-20 flex-shrink-0 text-right">
                                <div className="bg-burgundy rounded px-3 py-1 text-sm font-semibold text-white">
                                  {item.time}
                                </div>
                              </div>
                              <div className="flex-1">
                                <h4 className="mb-1 font-semibold text-gray-800">{item.title}</h4>
                                {item.speaker && (
                                  <p className="text-burgundy mb-2 text-sm">
                                    Speaker: {item.speaker}
                                  </p>
                                )}
                                <p className="text-sm text-gray-600">{item.description}</p>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Speakers */}
                {event.speakers && event.speakers.length > 0 && (
                  <Card className="mb-8 border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-burgundy">Featured Speakers</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {event.speakers.map((speaker: string, index: number) => (
                          <div
                            key={index}
                            className="flex items-center gap-4 rounded-lg bg-gray-50 p-4"
                          >
                            <div className="bg-burgundy flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-white">
                              {speaker
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-800">{speaker}</h4>
                              <p className="text-sm text-gray-600">Distinguished Speaker</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="space-y-6"
              >
                {/* Registration Status */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-burgundy">Registration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {event.registrationRequired ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span
                            className={`font-semibold ${
                              canRegister ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {canRegister ? "Open" : isEventPast ? "Event Ended" : "Full"}
                          </span>
                        </div>
                        {event.capacity && event.registeredCount !== undefined && (
                          <>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Registered:</span>
                              <span className="font-semibold">
                                {event.registeredCount}/{event.capacity}
                              </span>
                            </div>
                            <div className="h-3 w-full rounded-full bg-gray-200">
                              {" "}
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
                          </>
                        )}{" "}
                        {canRegister && registrationLink && (
                          <Link href={registrationLink}>
                            <Button className="w-full">Register Now</Button>
                          </Link>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-600">No registration required. Open to all.</p>
                    )}
                  </CardContent>
                </Card>
                {/* Event Tags */}
                {event.tags && event.tags.length > 0 && (
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-burgundy">Tags</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {event.tags.map((tag: string, index: number) => (
                          <span
                            key={index}
                            className="bg-burgundy/10 text-burgundy rounded-full px-3 py-1 text-sm"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}{" "}
                {/* Quick Actions */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-burgundy">Quick Actions</CardTitle>
                  </CardHeader>{" "}
                  <CardContent className="space-y-3">
                    {event.pdfBrochure && (
                      <a
                        href={event.pdfBrochure}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full"
                      >
                        <Button
                          variant="outline"
                          className="w-full border-red-800 bg-white text-red-800 transition-colors hover:bg-red-800 hover:text-white"
                        >
                          📄 Download PDF Brochure
                        </Button>
                      </a>
                    )}
                    <Button
                      variant="outline"
                      className="w-full border-red-800 bg-white text-red-800 transition-colors hover:bg-red-800 hover:text-white"
                    >
                      Add to Calendar
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-red-800 bg-white text-red-800 transition-colors hover:bg-red-800 hover:text-white"
                    >
                      Share Event
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-red-800 bg-white text-red-800 transition-colors hover:bg-red-800 hover:text-white"
                    >
                      Get Directions
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>{" "}
      {/* Related Events */}
      {filteredRelatedEvents.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <h2 className="font-primary text-burgundy mb-8 text-center text-3xl font-bold">
                Related Events
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {filteredRelatedEvents.map((relatedEvent: Event) => (
                  <Card
                    key={relatedEvent.id}
                    className="group border-0 shadow-lg transition-shadow hover:shadow-xl"
                  >
                    <CardContent className="p-6">
                      <div className="mb-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${getEventTypeColor(relatedEvent.type)} `}
                        >
                          {getEventTypeIcon(relatedEvent.type)} {relatedEvent.type}
                        </span>
                      </div>
                      <h3 className="text-burgundy group-hover:text-gold mb-2 font-bold transition-colors">
                        {relatedEvent.title}
                      </h3>
                      <p className="mb-4 line-clamp-3 text-sm text-gray-600">
                        {relatedEvent.shortDescription}
                      </p>
                      <div className="mb-4 text-sm text-gray-500">
                        📅 {formatDate(relatedEvent.date)}
                      </div>
                      <Link href={`/events/${relatedEvent.id}`}>
                        <Button variant="outline" size="sm" className="w-full">
                          View Details
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
}
