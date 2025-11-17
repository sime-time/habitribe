import { getMonthBounds, getWeekBounds } from "@/utils/dateHelper";
import { internal } from "../_generated/api";
import { internalMutation } from "../_generated/server";

export const createDailyHabitEntries = internalMutation({
  handler: async (ctx) => {
    const date = new Date();
    const today = date.toISOString().split("T")[0];
    const weekday = new Date(date).getDay(); // 0 = Sunday

    // get all the daily habits in the database
    const dailyHabits = await ctx.db
      .query("habits")
      .withIndex("by_frequency", (q) => q.eq("schedule.frequency", "daily"))
      .collect();

    // get today's habit entries
    const entries = await ctx.db
      .query("habitEntries")
      .withIndex("by_date", (q) => q.eq("date", today))
      .collect();

    let created: number = 0;

    // decide which habits are "active" today
    for (const habit of dailyHabits) {
      // skip habits that haven't started yet
      if (habit.startDate > today) continue;

      let shouldCreate = false;

      // check if entry already exists for today
      const existingEntry = entries.find((e) => e.habitId === habit._id);
      if (!existingEntry) {
        // if pattern is number, create one for today
        if (Number.isInteger(habit.schedule.pattern)) {
          shouldCreate = true;
        }
        // if pattern is array, check if todayWeekday is included
        else if (
          Array.isArray(habit.schedule.pattern) &&
          habit.schedule.pattern.includes(weekday)
        ) {
          shouldCreate = true;
        }
      }

      if (shouldCreate) {
        const entryId = await ctx.db.insert("habitEntries", {
          habitId: habit._id,
          userId: habit.userId,
          date: today,
          progress: 0,
        });
        created++;

        // check if we need to break the streak
        await ctx.runMutation(internal.utils.streakHelper.checkStreak, {
          entryId,
          date: today,
        });
      }
    }

    // logging
    console.log(`Created ${created} daily habit entries for ${today}`);
    return { created, date: today };
  },
});

export const createWeeklyHabitEntries = internalMutation({
  handler: async (ctx) => {
    const date = new Date();
    const today = date.toISOString().split("T")[0];

    const weeklyHabits = await ctx.db
      .query("habits")
      .withIndex("by_frequency", (q) => q.eq("schedule.frequency", "weekly"))
      .collect();

    const { start, end } = getWeekBounds(date);

    // get entries within this week's bounds (monday and sunday)
    const entries = await ctx.db
      .query("habitEntries")
      .withIndex("by_date", (q) => q.gte("date", start).lte("date", end))
      .collect();

    let created = 0;

    for (const habit of weeklyHabits) {
      // skip habits that haven't started yet
      if (habit.startDate > today) continue;

      // check if entry already exists within the week's bounds
      const existingEntry = entries.find((e) => e.habitId === habit._id);

      if (!existingEntry) {
        const entryId = await ctx.db.insert("habitEntries", {
          habitId: habit._id,
          userId: habit.userId,
          date: start, // Monday's date
          progress: 0,
        });
        created++;

        // check if we need to break the streak
        await ctx.runMutation(internal.utils.streakHelper.checkStreak, {
          entryId,
          date: start,
        });
      }
    }
    // logging
    console.log(`Created ${created} weekly habit entries for ${today}`);
    return { created, date: today };
  },
});

export const createMonthlyHabitEntries = internalMutation({
  handler: async (ctx) => {
    const date = new Date();
    const today = date.toISOString().split("T")[0];

    const monthlyHabits = await ctx.db
      .query("habits")
      .withIndex("by_frequency", (q) => q.eq("schedule.frequency", "monthly"))
      .collect();

    const { start, end } = getMonthBounds(date);

    // get entries created on the first of the month
    const entries = await ctx.db
      .query("habitEntries")
      .withIndex("by_date", (q) => q.gte("date", start).lte("date", end))
      .collect();

    let created = 0;

    for (const habit of monthlyHabits) {
      // skip habits that haven't started yet
      if (habit.startDate > today) continue;

      const existingEntry = entries.find((e) => e.habitId === habit._id);

      if (!existingEntry) {
        const entryId = await ctx.db.insert("habitEntries", {
          habitId: habit._id,
          userId: habit.userId,
          date: start, // start of the month
          progress: 0,
        });
        created++;

        // check if we need to break the streak
        await ctx.runMutation(internal.utils.streakHelper.checkStreak, {
          entryId,
          date: start,
        });
      }
    }
    // logging
    console.log(`Created ${created} monthly habit entries for ${today}`);
    return { created, date: today };
  },
});
