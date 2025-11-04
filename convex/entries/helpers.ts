import { v } from "convex/values";
import { internalQuery } from "../_generated/server";

export const sortHabitEntriesByFrequency = internalQuery({
  args: {
    date: v.string(),
    weekday: v.number(),
    userId: v.id("users"),
    bounds: v.object({
      weekStart: v.string(),
      weekEnd: v.string(),
      monthStart: v.string(),
      monthEnd: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    // get all the user habits
    const habits = await ctx.db
      .query("habits")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    // get all habit entries in this current period
    const todayEntries = await ctx.db
      .query("habitEntries")
      .filter((q) =>
        q.and(
          q.eq(q.field("userId"), args.userId),
          q.eq(q.field("date"), args.date),
        ),
      )
      .collect();

    const weekEntries = await ctx.db
      .query("habitEntries")
      .filter((q) =>
        q.and(
          q.eq(q.field("userId"), args.userId),
          q.gte(q.field("date"), args.bounds.weekStart),
          q.lte(q.field("date"), args.bounds.weekEnd),
        ),
      )
      .collect();

    const monthEntries = await ctx.db
      .query("habitEntries")
      .filter((q) =>
        q.and(
          q.eq(q.field("userId"), args.userId),
          q.gte(q.field("date"), args.bounds.monthStart),
          q.lte(q.field("date"), args.bounds.monthEnd),
        ),
      )
      .collect();

    // use maps for quick lookups in habit loop
    const todayEntryMap = new Map(todayEntries.map((e) => [e.habitId, e]));
    const weeklyEntryMap = new Map(weekEntries.map((e) => [e.habitId, e]));
    const monthlyEntryMap = new Map(monthEntries.map((e) => [e.habitId, e]));

    // group what habits/entries need to be returned
    const dailyHabits = [];
    const weeklyHabits = [];
    const monthlyHabits = [];

    for (const habit of habits) {
      // skip if habit hasn't started yet
      if (habit.startDate > args.date) continue;

      switch (habit.schedule.frequency) {
        case "daily": {
          // check if today aligns with the habit's pattern
          const entry = todayEntryMap.get(habit._id);
          if (
            Number.isInteger(habit.schedule.pattern) ||
            (Array.isArray(habit.schedule.pattern) &&
              habit.schedule.pattern.includes(weekday))
          ) {
            dailyHabits.push({ habit: habit, entry: entry || null });
          }
          break;
        }
        case "weekly": {
          // check if today is in a week that already has an entry
          const weekEntry = weeklyEntryMap.get(habit._id);
          weeklyHabits.push({ habit, entry: weekEntry || null });
          break;
        }
        case "monthly": {
          // check if today is in a month that already has an entry
          const monthEntry = monthlyEntryMap.get(habit._id);
          monthlyHabits.push({ habit, entry: monthEntry || null });
          break;
        }
      }
    }
    return { dailyHabits, weeklyHabits, monthlyHabits };
  },
});
