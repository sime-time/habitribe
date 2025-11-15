import { v } from "convex/values";
import { internalQuery } from "../_generated/server";

export const groupHabitEntriesByFrequency = internalQuery({
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
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    // determine the widest range needed to fetch one time
    const rangeStart = // check if week begins before month starts
      args.bounds.weekStart < args.bounds.monthStart
        ? args.bounds.weekStart
        : args.bounds.monthStart;

    const rangeEnd = // check if week ends after month ends
      args.bounds.weekEnd > args.bounds.monthEnd
        ? args.bounds.weekEnd
        : args.bounds.monthEnd;

    const currentEntries = await ctx.db
      .query("habitEntries")
      .withIndex("by_user_date", (q) =>
        q
          .eq("userId", args.userId)
          .gte("date", rangeStart)
          .lte("date", rangeEnd),
      )
      .collect();

    // filter all habit entries in this current period
    const todayEntries = currentEntries.filter((e) => e.date === args.date);

    const weekEntries = currentEntries.filter(
      (e) => e.date >= args.bounds.weekStart && e.date <= args.bounds.weekEnd,
    );
    const monthEntries = currentEntries.filter(
      (e) => e.date >= args.bounds.monthStart && e.date <= args.bounds.monthEnd,
    );

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

      // get the active streak for this habit
      const activeStreak = await ctx.db
        .query("streaks")
        .withIndex("by_active_habit", (q) =>
          q.eq("habitId", habit._id).eq("active", true),
        )
        .first();

      switch (habit.schedule.frequency) {
        case "daily": {
          // check if today aligns with the habit's pattern
          const entry = todayEntryMap.get(habit._id);

          if (
            Number.isInteger(habit.schedule.pattern) ||
            (Array.isArray(habit.schedule.pattern) &&
              habit.schedule.pattern.includes(args.weekday))
          ) {
            dailyHabits.push({
              habit: habit,
              entry: entry || null,
              streak: activeStreak || null,
            });
          }
          break;
        }
        case "weekly": {
          // check if today is in a week that already has an entry
          const weekEntry = weeklyEntryMap.get(habit._id);
          weeklyHabits.push({
            habit,
            entry: weekEntry || null,
            streak: activeStreak || null,
          });
          break;
        }
        case "monthly": {
          // check if today is in a month that already has an entry
          const monthEntry = monthlyEntryMap.get(habit._id);
          monthlyHabits.push({
            habit,
            entry: monthEntry || null,
            streak: activeStreak || null,
          });
          break;
        }
      }
    }
    return { dailyHabits, weeklyHabits, monthlyHabits };
  },
});
