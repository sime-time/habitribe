import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.daily(
  "Create daily habit entries",
  { hourUTC: 0, minuteUTC: 5 },
  internal.entries.cron.createDailyHabitEntries,
);

crons.weekly(
  "Create weekly habit entries",
  { dayOfWeek: "monday", hourUTC: 0, minuteUTC: 5 },
  internal.entries.cron.createWeeklyHabitEntries,
);

crons.monthly(
  "Create monthly habit entries",
  { day: 1, hourUTC: 0, minuteUTC: 5 },
  internal.entries.cron.createMonthlyHabitEntries,
);

export default crons;
