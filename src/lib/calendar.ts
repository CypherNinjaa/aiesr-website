/**
 * Calendar utilities for events and date handling
 */

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  hasEvents: boolean;
  events: string[]; // event IDs
}

export interface CalendarMonth {
  year: number;
  month: number;
  days: CalendarDay[];
}

/**
 * Generate calendar data for a given month
 */
export function generateCalendarMonth(
  year: number,
  month: number,
  eventDates: Date[] = []
): CalendarMonth {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());

  const endDate = new Date(lastDay);
  endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));

  const days: CalendarDay[] = [];
  const currentDate = new Date(startDate);
  const today = new Date();

  while (currentDate <= endDate) {
    const dateStr = currentDate.toDateString();
    const hasEvents = eventDates.some(eventDate => eventDate.toDateString() === dateStr);

    days.push({
      date: new Date(currentDate),
      isCurrentMonth: currentDate.getMonth() === month,
      isToday: currentDate.toDateString() === today.toDateString(),
      hasEvents,
      events: [], // In a real app, you'd populate this with actual event IDs
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return {
    year,
    month,
    days,
  };
}

/**
 * Get month name
 */
export function getMonthName(month: number): string {
  const months = [
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
  return months[month];
}

/**
 * Get day abbreviation
 */
export function getDayAbbreviation(day: number): string {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

/**
 * Check if two dates are the same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return date1.toDateString() === date2.toDateString();
}

/**
 * Format date for display
 */
export function formatEventDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format time for display
 */
export function formatEventTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Get relative time string (e.g., "in 3 days", "yesterday")
 */
export function getRelativeTimeString(date: Date): string {
  const now = new Date();
  const diffInMs = date.getTime() - now.getTime();
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    return "Today";
  } else if (diffInDays === 1) {
    return "Tomorrow";
  } else if (diffInDays === -1) {
    return "Yesterday";
  } else if (diffInDays > 1 && diffInDays <= 7) {
    return `In ${diffInDays} days`;
  } else if (diffInDays < -1 && diffInDays >= -7) {
    return `${Math.abs(diffInDays)} days ago`;
  } else {
    return formatEventDate(date);
  }
}

/**
 * Check if an event is upcoming (within next 30 days)
 */
export function isUpcomingEvent(eventDate: Date, withinDays: number = 30): boolean {
  const now = new Date();
  const maxDate = new Date(now.getTime() + withinDays * 24 * 60 * 60 * 1000);
  return eventDate >= now && eventDate <= maxDate;
}

/**
 * Group events by date
 */
export function groupEventsByDate<T extends { date: Date }>(events: T[]): Map<string, T[]> {
  const grouped = new Map<string, T[]>();

  events.forEach(event => {
    const dateKey = event.date.toDateString();
    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, []);
    }
    grouped.get(dateKey)!.push(event);
  });

  return grouped;
}
