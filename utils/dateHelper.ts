import type { Frequency } from "./habitLabelHelper";

/**
 * Parse a date string (YYYY-MM-DD) as local time, not UTC
 * @param dateString - YYYY-MM-DD format
 * @returns Date object in local timezone
 */
export function parseLocalDate(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day, 0, 0, 0, 0);
}

export function formatLocalDate(d: Date) {
  const year = d.getFullYear();
  // January is 0, so we have to add 1
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getTodayDateString(): string {
  const today = new Date();
  return formatLocalDate(today);
}

// weekly helper function
export function getWeekBounds(date: Date): { start: string; end: string } {
  const dayOfWeek = date.getDay();
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  // calculate monday of this week (start)
  const monday = new Date(date);
  monday.setDate(date.getDate() - daysToMonday);

  // calculate sunday of this week (end)
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return {
    start: formatLocalDate(monday),
    end: formatLocalDate(sunday),
  };
}

// monthly helper function
export function getMonthBounds(date: Date): { start: string; end: string } {
  // first day of the month (start)
  const first = new Date(date);
  first.setDate(1);

  // last day of the month (end)
  const last = new Date(first);
  last.setMonth(last.getMonth() + 1); // must set it to the next month because
  last.setDate(0); // 0 will take the last date of the previous month

  return {
    start: formatLocalDate(first),
    end: formatLocalDate(last),
  };
}

export function getWeekMonthBounds(date: Date) {
  const { start: weekStart, end: weekEnd } = getWeekBounds(date);
  const { start: monthStart, end: monthEnd } = getMonthBounds(date);
  return { weekStart, weekEnd, monthStart, monthEnd };
}

export function calculateStartDate(frequency: Frequency) {
  switch (frequency) {
    case "weekly": {
      const today = parseLocalDate(getTodayDateString());
      const { start } = getWeekBounds(today);
      return start;
    }
    case "monthly": {
      const today = parseLocalDate(getTodayDateString());
      const { start } = getMonthBounds(today);
      return start;
    }
    default: {
      return getTodayDateString();
    }
  }
}

/**
 * Calculate start date from end date and number of days
 * @param endDate - The end date (inclusive)
 * @param numDays - Number of days to include
 * @returns Start date as YYYY-MM-DD string
 */
export function calculateStartDateFromNumDays(
  endDate: string,
  numDays: number,
): string {
  if (numDays <= 0) throw new Error("number of days must be greater than 0");

  const date = parseLocalDate(endDate);
  date.setDate(date.getDate() - (numDays - 1));

  const startDate = formatLocalDate(date);
  return startDate;
}

export function formatCreationTime(creationTimeMs: number): string {
  const date = new Date(creationTimeMs);
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const day = date.getDate();
  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${month} ${day}, ${time}`;
}

export function uppercaseFirstLetter(word: string): string {
  return word.toUpperCase().charAt(0);
}
