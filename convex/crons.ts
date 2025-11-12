import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.daily(
  "Create daily habit entries",
  { hourUTC: 0, minuteUTC: 1 },
  internal.utils.cronHelper.createDailyHabitEntries,
);

crons.weekly(
  "Create weekly habit entries",
  { dayOfWeek: "monday", hourUTC: 0, minuteUTC: 1 },
  internal.utils.cronHelper.createWeeklyHabitEntries,
);

crons.monthly(
  "Create monthly habit entries",
  { day: 1, hourUTC: 0, minuteUTC: 1 },
  internal.utils.cronHelper.createMonthlyHabitEntries,
);

export default crons;
