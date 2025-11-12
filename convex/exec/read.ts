import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import type { HabitActivity, HabitWithEntry } from "@/types/HabitTypes";
import { internal } from "../_generated/api";
import { query } from "../_generated/server";

export const getHabit = query({
  args: {
    habitId: v.id("habits"),
  },
  handler: async (ctx, args) => {
    const habit = await ctx.db.get(args.habitId);
    return habit;
  },
});

export const getHabitReminders = query({
  args: {
    habitId: v.id("habits"),
  },
  handler: async (ctx, args) => {
    const reminders = await ctx.db
      .query("reminders")
      .withIndex("by_habit", (q) => q.eq("habitId", args.habitId))
      .order("desc")
      .collect();
    return reminders;
  },
});

export const getProofMethods = query({
  handler: async (ctx) => {
    const proofMethods = await ctx.db.query("proofMethods").collect();
    return proofMethods;
  },
});

export const getFlatHabitEntries = query({
  args: {
    date: v.string(), // YYYY-MM-DD
    weekday: v.number(),
    bounds: v.object({
      weekStart: v.string(),
      weekEnd: v.string(),
      monthStart: v.string(),
      monthEnd: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new ConvexError("Unauthorized");

    const groups: {
      dailyHabits: HabitWithEntry[];
      weeklyHabits: HabitWithEntry[];
      monthlyHabits: HabitWithEntry[];
    } = await ctx.runQuery(
      internal.utils.entryHelper.groupHabitEntriesByFrequency,
      {
        date: args.date,
        weekday: args.weekday,
        userId: userId,
        bounds: args.bounds,
      },
    );

    // flat array of habit+entry objects
    return [
      ...groups.dailyHabits,
      ...groups.weeklyHabits,
      ...groups.monthlyHabits,
    ];
  },
});

export const getGroupedHabitEntries = query({
  args: {
    date: v.string(), // YYYY-MM-DD
    weekday: v.number(),
    bounds: v.object({
      weekStart: v.string(),
      weekEnd: v.string(),
      monthStart: v.string(),
      monthEnd: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new ConvexError("Unauthorized");

    const groups: {
      dailyHabits: HabitWithEntry[];
      weeklyHabits: HabitWithEntry[];
      monthlyHabits: HabitWithEntry[];
    } = await ctx.runQuery(
      internal.utils.entryHelper.groupHabitEntriesByFrequency,
      {
        date: args.date,
        weekday: args.weekday,
        userId: userId,
        bounds: args.bounds,
      },
    );

    return groups;
  },
});

export const getHabitActivity = query({
  args: {
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new ConvexError("Unauthorized");

    const dailyActivity: HabitActivity[] = [];
    const weeklyActivity: HabitActivity[] = [];
    const monthlyActivity: HabitActivity[] = [];

    // get all user habits
    const habits = await ctx.db
      .query("habits")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    // fetch heatmap data for each habit in parallel
    await Promise.all(
      habits.map(async (habit) => {
        const entries = await ctx.db
          .query("habitEntries")
          .withIndex("by_habit_date", (q) =>
            q
              .eq("habitId", habit._id)
              .gte("date", args.startDate)
              .lte("date", args.endDate),
          )
          .collect();

        switch (habit.schedule.frequency) {
          case "daily":
            dailyActivity.push({
              habitId: habit._id,
              activity: entries.map((entry) => ({
                date: entry.date,
                value: entry.progress,
              })),
            });
            break;
          case "weekly":
            weeklyActivity.push({
              habitId: habit._id,
              activity: entries.map((entry) => ({
                date: entry.date,
                value: entry.progress,
              })),
            });
            break;
          case "monthly":
            monthlyActivity.push({
              habitId: habit._id,
              activity: entries.map((entry) => ({
                date: entry.date,
                value: entry.progress,
              })),
            });
            break;
        }
      }),
    );

    return { dailyActivity, weeklyActivity, monthlyActivity };
  },
});
