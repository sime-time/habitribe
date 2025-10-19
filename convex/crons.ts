import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.daily(
  "Create daily habit entries",
  { hourUTC: 0, minuteUTC: 5 },
  internal.crons.entries.createDailyHabitEntries,
);

crons.weekly(
  "Create weekly habit entries",
  { dayOfWeek: "monday", hourUTC: 0, minuteUTC: 5 },
  internal.crons.entries.createWeeklyHabitEntries,
);

crons.monthly(
  "Create monthly habit entries",
  { day: 1, hourUTC: 0, minuteUTC: 5 },
  internal.crons.entries.createMonthlyHabitEntries,
);

export default crons;
