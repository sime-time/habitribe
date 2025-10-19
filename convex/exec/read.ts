import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import { getMonthBounds, getWeekBounds } from "@/utils/boundsHelper";
import type { Id } from "../_generated/dataModel";
import { query } from "../_generated/server";

export const currentUser = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    // use id to get the full user data
    return await ctx.db.get(userId);
  },
});

export const getHabit = query({
  args: {
    habitId: v.id("habits"),
  },
  handler: async (ctx, args) => {
    const habit = await ctx.db.get(args.habitId);
    return habit;
  },
});

export const getHabits = query({
  handler: async (ctx) => {
    const habits = await ctx.db.query("habits").order("desc").collect();
    return habits;
  },
});

export const getUserHabits = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    return ctx.db
      .query("habits")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();
  },
});

export const getHabitEntry = query({
  args: {
    habitId: v.id("habits"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const habit = await ctx.db
      .query("habitEntries")
      .filter((q) =>
        q.and(
          q.eq(q.field("habitId"), args.habitId),
          q.eq(q.field("userId"), args.userId),
        ),
      )
      .take(1);
    return habit;
  },
});

export const getUserHabitEntries = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    const entries = await ctx.db
      .query("habitEntries")
      .filter((q) => q.eq(q.field("userId"), userId))
      .order("desc")
      .collect();
    return entries;
  },
});

export const getTodaysHabits = query({
  args: {
    date: v.string(), // YYYY-MM-DD
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new ConvexError("No user ID found");
    }

    const weekday = new Date(args.date).getDay();

    // get all the user habits
    const habits = await ctx.db
      .query("habits")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();

    // get the start and end dates of the current week and month
    const { start: weekStart, end: weekEnd } = getWeekBounds(args.date);
    const { start: monthStart, end: monthEnd } = getMonthBounds(args.date);

    // get all habit entries in this current period
    const todayEntries = await ctx.db
      .query("habitEntries")
      .filter((q) =>
        q.and(
          q.eq(q.field("userId"), userId),
          q.eq(q.field("date"), args.date),
        ),
      )
      .collect();

    const weekEntries = await ctx.db
      .query("habitEntries")
      .filter((q) =>
        q.and(
          q.eq(q.field("userId"), userId),
          q.gte(q.field("date"), weekStart),
          q.lte(q.field("date"), weekEnd),
        ),
      )
      .collect();

    const monthEntries = await ctx.db
      .query("habitEntries")
      .filter((q) =>
        q.and(
          q.eq(q.field("userId"), userId),
          q.gte(q.field("date"), monthStart),
          q.lte(q.field("date"), monthEnd),
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
            dailyHabits.push({ ...habit, entry: entry || null });
          }
          break;
        }
        case "weekly": {
          // check if today is in a week that already has an entry
          const weekEntry = weeklyEntryMap.get(habit._id);
          weeklyHabits.push({ ...habit, entry: weekEntry || null });
          break;
        }
        case "monthly": {
          // check if today is in a month that already has an entry
          const monthEntry = monthlyEntryMap.get(habit._id);
          monthlyHabits.push({ ...habit, entry: monthEntry || null });
          break;
        }
      }
    }
    return { dailyHabits, weeklyHabits, monthlyHabits };
  },
});

export const getHabitReminders = query({
  args: {
    habitId: v.id("habits"),
  },
  handler: async (ctx, args) => {
    const reminders = await ctx.db
      .query("reminders")
      .filter((q) => q.eq(q.field("habitId"), args.habitId))
      .order("desc")
      .collect();
    return reminders;
  },
});

export const getUserReminders = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const reminders = await ctx.db
      .query("reminders")
      .filter((q) => q.eq(q.field("userId"), args.userId))
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
