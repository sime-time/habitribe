import { parseLocalDate } from "@/utils/dateHelper";
import type { Frequency } from "@/utils/habitLabelHelper";
import type { Doc, Id } from "../_generated/dataModel";

export interface StreakData {
  startDate: string;
  endDate: string;
  length: number;
  entryIds: Id<"habitEntries">[];
  breakingEntryId?: Id<"habitEntries">;
}

export function calculateAllStreaks(
  habit: Doc<"habits">,
  entries: Doc<"habitEntries">[],
): StreakData[] {
  if (entries.length === 0) {
    return [];
  }

  const target: number = Array.isArray(habit.schedule.pattern)
    ? 1
    : habit.schedule.pattern;

  const streaks: StreakData[] = [];
  let currentStreak: Doc<"habitEntries">[] = [];
  let previousBreakingEntry: Doc<"habitEntries"> | null = null;

  // walk through entries chronologically (already sorted from query)
  for (const entry of entries) {
    const isComplete = entry.progress >= target;

    if (!isComplete) {
      // current entry is incomplete
      if (currentStreak.length > 0) {
        const savedStreak = buildStreakData(
          currentStreak,
          previousBreakingEntry?._id,
        );
        streaks.push(savedStreak);
        currentStreak = [];
      }
      previousBreakingEntry = entry;
    } else {
      // current entry is complete
      if (currentStreak.length === 0) {
        // start a new streak
        currentStreak.push(entry);
      } else {
        // check continuity with previous entry in streak (in-memory comparison)
        const previousEntry = currentStreak[currentStreak.length - 1];
        const isContinuous = checkContinuity(
          previousEntry.date,
          entry.date,
          habit.schedule.frequency as Frequency,
          habit.schedule.pattern,
        );

        if (isContinuous) {
          currentStreak.push(entry);
        } else {
          // continuity broken
          streaks.push(
            buildStreakData(currentStreak, previousBreakingEntry?._id),
          );
          currentStreak = [entry];
          previousBreakingEntry = null;
        }
      }
    }
  }
  if (currentStreak.length > 0) {
    streaks.push(buildStreakData(currentStreak));
  }
  return streaks;
}

function checkContinuity(
  currentDate: string,
  previousDate: string,
  frequency: Frequency,
  pattern: number | number[],
): boolean {
  switch (frequency) {
    case "daily":
      return checkDailyContinuity(previousDate, currentDate, pattern);
    case "weekly":
      return checkWeeklyContinuity(previousDate, currentDate);
    case "monthly":
      return checkMonthlyContinuity(previousDate, currentDate);
    default:
      return false;
  }
}

function checkDailyContinuity(
  currentDate: string,
  previousDate: string,
  pattern: number | number[],
): boolean {
  // if dates are the same (same entry), it's continuous
  if (currentDate === previousDate) {
    return true;
  }

  const current = parseLocalDate(currentDate);
  const previous = parseLocalDate(previousDate);

  const daysDiff = Math.floor(
    (current.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (typeof pattern === "number") {
    return daysDiff === pattern;
  } else {
    const currentWeekday = current.getDay();
    const previousWeekday = previous.getDay();

    // both week days must be in the pattern array
    if (
      !pattern.includes(previousWeekday) ||
      !pattern.includes(currentWeekday)
    ) {
      return false;
    }

    // calculate the expected gap between week days
    const expectedGap = getExpectedGapBetweenWeekdays(
      previousWeekday,
      currentWeekday,
    );
    return daysDiff === expectedGap;
  }
}

function checkWeeklyContinuity(
  currentDate: string,
  previousDate: string,
): boolean {
  // if dates are the same (same entry), it's continuous
  if (currentDate === previousDate) {
    return true;
  }

  const current = parseLocalDate(currentDate);
  const previous = parseLocalDate(previousDate);

  // verify both are mondays
  if (current.getDay() !== 1 || previous.getDay() !== 1) {
    return false;
  }

  // 7 day difference (1 week apart)
  const daysDiff = Math.abs(
    Math.floor(
      (current.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24),
    ),
  );

  return daysDiff === 7;
}

function checkMonthlyContinuity(
  currentDate: string,
  previousDate: string,
): boolean {
  // if dates are the same (same entry), it's continuous
  if (currentDate === previousDate) {
    return true;
  }

  const current = parseLocalDate(currentDate);
  const previous = parseLocalDate(previousDate);

  // verify both are 1st of the month
  if (current.getDate() !== 1 || previous.getDate() !== 1) {
    return false;
  }

  // check if exactly one month apart
  const currentMonth = current.getMonth();
  const currentYear = current.getFullYear();
  const previousMonth = previous.getMonth();
  const previousYear = previous.getFullYear();

  // create "month numbers" that can compare across years
  const currentMonthInt = currentYear * 12 + currentMonth;
  const previousMonthInt = previousYear * 12 + previousMonth;

  return Math.abs(currentMonthInt - previousMonthInt) === 1;
}

function getExpectedGapBetweenWeekdays(
  fromWeekday: number,
  toWeekday: number,
): number {
  let gap = 0;
  let current = fromWeekday;

  while (current !== toWeekday) {
    current = (current + 1) % 7;
    gap++;

    if (gap > 7) {
      return -1;
    }
  }

  return gap;
}

function buildStreakData(
  entries: Doc<"habitEntries">[],
  breakingEntryId?: Id<"habitEntries">,
): StreakData {
  return {
    startDate: entries[0].date,
    endDate: entries[entries.length - 1].date,
    length: entries.length,
    entryIds: entries.map((e) => e._id),
    breakingEntryId: breakingEntryId || undefined,
  };
}
