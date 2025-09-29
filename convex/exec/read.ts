import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
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
      .order("asc")
      .collect();
  },
});

export const getUserHabitEntries = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const entries = ctx.db
      .query("habitEntries")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .order("desc");
    return entries;
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

export const getHabitEntry = query({
  args: {
    habitId: v.id("habits"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const habit = ctx.db
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

export const getHabitReminders = query({
  args: {
    habitId: v.id("habits"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const reminders = ctx.db
      .query("reminders")
      .filter((q) =>
        q.and(
          q.eq(q.field("habitId"), args.habitId),
          q.eq(q.field("userId"), args.userId),
        ),
      )
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
    const reminders = ctx.db
      .query("reminders")
      .filter((q) => q.and(q.eq(q.field("userId"), args.userId)))
      .order("desc")
      .collect();
    return reminders;
  },
});

export const getProofTypes = query({
  handler: async (ctx) => {
    const proofTypes = ctx.db.query("proofTypes").collect();
    return proofTypes;
  },
});
