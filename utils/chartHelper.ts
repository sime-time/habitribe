import type { Activity } from "@/validation/HabitSchema";
import { formatLocalDate, parseLocalDate } from "./dateHelper";

/**
 * Generate array of activities from startDate to endDate (inclusive)
 * Fills in missing dates with value of 0
 * @param startDate - YYYY-MM-DD format
 * @param endDate - YYYY-MM-DD format
 * @param activity - Array of existing activity items
 * @returns array of activities for all dates in range
 */
export function generateFullActivityRange(
  startDate: string,
  endDate: string,
  activity: Activity[],
): Activity[] {
  const startingDate = parseLocalDate(startDate);
  const endingDate = parseLocalDate(endDate);

  const dayDifference =
    Math.ceil(
      (endingDate.getTime() - startingDate.getTime()) / (1000 * 60 * 60 * 24),
    ) + 1; // add 1 to include the ending date

  // create a map for O(1) lookup
  const activityMap = new Map(activity.map((a) => [a.date, a.value]));

  const fullActivityRange = Array.from({ length: dayDifference }, (_, i) => {
    const date = new Date(startingDate);
    date.setDate(startingDate.getDate() + i);
    const dateString = formatLocalDate(date);

    return {
      date: dateString,
      value: activityMap.get(dateString) ?? 0, // use existing value or 0
    };
  });

  return fullActivityRange;
}

/**
 * Group activity data into weeks (7 days per week).
 * For this to work properly, the first activity.date should be a monday.
 * @param dates - Array of date strings YYYY-MM-DD
 * @returns 2D array where each inner array represents a week
 */
export function groupActivityIntoWeeks(activity: Activity[]): Activity[][] {
  if (activity.length === 0) return [];

  // Verify first day is Monday (dayOfWeek = 1)
  const firstDate = parseLocalDate(activity[0].date);
  const firstDayOfWeek = firstDate.getDay();

  if (firstDayOfWeek !== 1) {
    console.warn(
      `First activity date (${activity[0].date}) is not a Monday (day ${firstDayOfWeek}). ` +
        `The heatmap grid may be misaligned.`,
    );
  }

  const weeks: Activity[][] = [];
  for (let i = 0; i < activity.length; i += 7) {
    weeks.push(activity.slice(i, i + 7));
  }
  return weeks;
}

/**
 * Transform the activity data grouped by week into data
 * that can be used to generate a weekly bar chart
 * @param weeks - 2D array of dates and progress values
 * @returns total progress for the week
 */
export function aggregateWeekValues(weeks: Activity[][]): { value: number }[] {
  const weekValues = weeks.map((weekActivity) => {
    // sum up all the values of the week
    const weekTotal = weekActivity.reduce((sum, a) => {
      return sum + a.value;
    }, 0);
    return { value: weekTotal };
  });

  return weekValues;
}

/**
 * Generate a string array of all the months between start date and end date
 * @param start - string YYYY-MM-DD
 * @param end - string YYYY-MM-DD
 * @returns array of month strings in format YYYY-MM
 */
export function generateMonthRange(start: string, end: string): string[] {
  const months: string[] = [];

  const startDate = new Date(start);
  const endDate = new Date(end);

  const currentDate = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    1,
  );

  while (currentDate <= endDate) {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    months.push(`${year}-${month}`);

    currentDate.setMonth(currentDate.getMonth() + 1);
  }
  return months;
}

/**
 * Calculate intensity (0-1) based on value relative to max
 * @param value - current progress value
 * @param maxValue - max progress value in dataset
 * @returns normalized intensity between 0 and 1
 */
export function calculateIntensity(value: number, maxValue: number): number {
  if (maxValue === 0) return 0; // edge case when no activity exists
  if (maxValue === value) return 1;
  return value / maxValue;
}

/**
 * Get max value from activity array
 * @param activity - array of dates and progress values
 * @returns maxium progress value in activity
 */
export function getMaxActivityValue(activity: Activity[]): number {
  return activity.reduce((a, b) => Math.max(a, b.value), -Infinity) || 0;
}

/**
 * Generate color shade based on intensity
 * @param intensity - value between 0 and 1
 * @param accentColor - hex color to base shades on
 * @param borderColor - border color for empty/minimal activity
 * @returns hex color string
 */
export function getColorFromIntensity(
  intensity: number,
  accentColor: string,
  borderColor: string,
): string {
  const colorShades = [
    `${borderColor}80`,
    `${accentColor}20`,
    `${accentColor}60`,
    `${accentColor}80`,
    `${accentColor}`,
  ];

  const index = Math.min(
    Math.floor(intensity * colorShades.length),
    colorShades.length - 1,
  );

  return colorShades[index];
}

/**
 * Shift a date forward or backward by a number of days.
 * @param date - The starting date
 * @param numDays - Number of days to shift (positive = forward, negative = backward)
 * @returns A new Date object shifted by the specified number of days
 */
export function shiftDate(date: Date, numDays: number): Date {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + numDays);
  return newDate;
}
