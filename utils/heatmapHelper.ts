/**
 * Generate array of dates from startDate to endDate (inclusive)
 * @param startDate - YYYY-MM-DD format
 * @param endDate - YYYY-MM-DD format
 * @returns array of dates as YYYY-MM-DD strings
 */
export function generateDateRange(
  startDate: string,
  endDate: string,
): string[] {
  const startingDate = new Date(startDate);
  const endingDate = new Date(endDate);

  const dayDifference =
    Math.ceil(
      (endingDate.getTime() - startingDate.getTime()) / (1000 * 60 * 60 * 24),
    ) + 1; // add 1 to include the ending date

  const dateArray = Array.from({ length: dayDifference }, (_, i) => {
    const date = new Date(startingDate);
    date.setDate(startingDate.getDate() + i);
    return date.toISOString().slice(0, 10); // YYYY-MM-DD
  });

  return dateArray;
}

/**
 * Group dates into weeks (7 days per week, starting with week 0).
 * For this to work properly, the weeks should start on a monday.
 * @param dates - Array of date strings YYYY-MM-DD
 * @returns 2D array where each inner array represents a week
 */
export function groupDatesIntoWeeks(dates: string[]): string[][] {
  // const firstDay = new Date(dates[0]).getDay();
  // console.log("first day", firstDay);
  // if (firstDay !== 1) throw new Error("Weeks must begin on a monday");

  const weeks: string[][] = [];
  for (let i = 0; i < dates.length; i += 7) {
    weeks.push(dates.slice(i, i + 7));
  }
  return weeks;
}

/**
 * Aggregate activity data by week
 * @param activity - array of dates and progress values
 * @param week - array of date strings in a week
 * @returns total progress for the week
 */
export function aggregateWeekActivity(
  activity: { date: string; progress: number }[],
  week: string[],
): number {
  return week.reduce((total, date) => {
    const dayActivity = activity.find((item) => item.date === date);
    return total + (dayActivity?.progress || 0);
  }, 0);
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
export function getMaxActivityValue(
  activity: { date: string; progress: number }[],
): number {
  return activity.reduce((a, b) => Math.max(a, b.progress), -Infinity) || 0;
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
