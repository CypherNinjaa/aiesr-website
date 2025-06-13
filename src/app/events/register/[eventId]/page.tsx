"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import React, { useState, useEffect } from "react";
import { EventRegistrationForm } from "@/components/forms/EventRegistrationForm";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import eventsData from "@/data/events.json";
import { formatDate } from "@/lib/utils";
import { Event, EventRaw } from "@/types";

// Import the registration data type
type EventRegistrationData = {
  name: string;
  email: string;
  phone: string;
  program: string;
  year: string;
  dietaryRequirements?: string;
  specialAccommodations?: string;
  emergencyContact: string;
  emergencyContactName: string;
};

// Transform raw event data to Event objects
const transformEvents = (rawEvents: EventRaw[]): Event[] => {
  return rawEvents.map(event => ({
    ...event,
    date: new Date(event.date),
    endDate: event.endDate ? new Date(event.endDate) : undefined,
  }));
};

const events = transformEvents(eventsData as EventRaw[]);

interface EventRegistrationPageProps {
  params: Promise<{
    eventId: string;
  }>;
}

export default function EventRegistrationPage({ params }: EventRegistrationPageProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [eventId, setEventId] = useState<string | null>(null);

  useEffect(() => {
    params.then(({ eventId }) => {
      setEventId(eventId);
    });
  }, [params]);

  if (!eventId) {
    return <div>Loading...</div>;
  }

  const event = events.find(e => e.id === eventId);

  if (!event) {
    notFound();
  }

  if (!event.registrationRequired) {
    return (
      <div className="min-h-screen pt-20">
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <Card className="mx-auto max-w-md">
              <CardContent className="p-8">
                <div className="mb-4 text-6xl">ℹ️</div>
                <h2 className="text-burgundy mb-4 text-2xl font-bold">No Registration Required</h2>
                <p className="mb-6 text-gray-600">
                  This event is open to all and does not require registration. Simply show up at the
                  venue on the event date.
                </p>
                <Link href={`/events/${event.id}`}>
                  <Button>View Event Details</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    );
  }

  const isEventPast = new Date(event.date) < new Date();
  const isEventFull =
    event.capacity && event.registeredCount && event.registeredCount >= event.capacity;

  if (isEventPast) {
    return (
      <div className="min-h-screen pt-20">
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <Card className="mx-auto max-w-md">
              <CardContent className="p-8">
                <div className="mb-4 text-6xl">⏰</div>
                <h2 className="text-burgundy mb-4 text-2xl font-bold">Registration Closed</h2>
                <p className="mb-6 text-gray-600">
                  This event has already taken place. Registration is no longer available.
                </p>
                <Link href="/events">
                  <Button>View Other Events</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    );
  }

  if (isEventFull) {
    return (
      <div className="min-h-screen pt-20">
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <Card className="mx-auto max-w-md">
              <CardContent className="p-8">
                <div className="mb-4 text-6xl">📝</div>
                <h2 className="text-burgundy mb-4 text-2xl font-bold">Event Full</h2>
                <p className="mb-6 text-gray-600">
                  Unfortunately, this event has reached its maximum capacity. Please check back
                  later for future events.
                </p>
                <Link href="/events">
                  <Button>View Other Events</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    );
  }
  const handleRegistration = async (data: EventRegistrationData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In a real app, you would send this data to your backend
      console.log("Registration data:", { eventId: event.id, ...data });

      setIsSubmitted(true);
    } catch (error: unknown) {
      console.error("Registration failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen pt-20">
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <Card className="border-0 shadow-xl">
                <CardContent className="p-12">
                  <div className="mb-6 text-6xl">✅</div>
                  <h2 className="text-burgundy mb-4 text-3xl font-bold">
                    Registration Successful!
                  </h2>
                  <p className="mb-6 text-lg text-gray-600">
                    Thank you for registering for <strong>{event.title}</strong>. You will receive a
                    confirmation email shortly with event details and instructions.
                  </p>

                  <div className="mb-8 rounded-lg bg-gray-50 p-6">
                    <h3 className="mb-4 font-semibold text-gray-800">Event Summary</h3>
                    <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                      <div>
                        <span className="text-gray-500">Event:</span>
                        <p className="font-semibold">{event.title}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Date:</span>
                        <p className="font-semibold">{formatDate(event.date)}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Time:</span>
                        <p className="font-semibold">
                          {new Date(event.date).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Location:</span>
                        <p className="font-semibold">{event.location}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center gap-4 sm:flex-row">
                    <Link href={`/events/${event.id}`}>
                      <Button variant="outline">View Event Details</Button>
                    </Link>
                    <Link href="/events">
                      <Button>Browse More Events</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    );
  }

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
            <Link href={`/events/${event.id}`} className="hover:text-burgundy">
              {event.title}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-burgundy">Register</span>
          </nav>
        </div>
      </section>

      {/* Registration Header */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h1 className="font-primary text-burgundy mb-4 text-4xl font-bold">
                Event Registration
              </h1>
              <div className="bg-gold mx-auto mb-6 h-1 w-24 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Event Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-4 border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-burgundy">Event Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="mb-2 font-semibold text-gray-800">{event.title}</h3>
                      <p className="text-sm text-gray-600">{event.shortDescription}</p>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">📅</span>
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">⏰</span>
                        <span>
                          {new Date(event.date).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">📍</span>
                        <span>{event.location}</span>
                      </div>
                      {event.capacity && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">👥</span>
                          <span>
                            {event.registeredCount || 0}/{event.capacity} registered
                          </span>
                        </div>
                      )}
                    </div>

                    {event.capacity && event.registeredCount !== undefined && (
                      <div>
                        {" "}
                        <div className="h-2 w-full rounded-full bg-gray-200">
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
                        <p className="mt-2 text-xs text-gray-500">
                          {event.capacity - event.registeredCount} spots remaining
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Registration Form */}
              <div className="lg:col-span-2">
                <EventRegistrationForm
                  eventId={event.id}
                  eventTitle={event.title}
                  onSubmit={handleRegistration}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
