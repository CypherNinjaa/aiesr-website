import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Event } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).replace(/\s+\S*$/, "") + "...";
}

export function scrollToSection(sectionId: string) {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\s+/g, ""));
}

export function generateMetaTitle(title: string, siteName: string = "AIESR"): string {
  return `${title} | ${siteName} - Amity Institute of English Studies and Research`;
}

export function generateMetaDescription(description: string, maxLength: number = 160): string {
  return truncateText(description, maxLength);
}

export function getEventRegistrationLink(event: Event): string | null {
  // Option 2: Always require admin to specify registration link
  // No fallback to environment variable
  if (event.registrationRequired) {
    return event.customRegistrationLink || event.registrationLink || null;
  }
  return null;
}

export function canUserRegisterForEvent(event: Event): boolean {
  const registrationLink = getEventRegistrationLink(event);
  const isEventPast = new Date(event.date) < new Date();

  return !!(
    event.registrationRequired &&
    registrationLink &&
    !isEventPast &&
    (!event.capacity || !event.registeredCount || event.registeredCount < event.capacity)
  );
}
