import { getAuthUserId } from "@convex-dev/auth/server";
import { R2 } from "@convex-dev/r2";
import { ConvexError, v } from "convex/values";
import type {
  HabitActivity,
  HabitWithEntryAndStreak,
  ProofWithUrl,
} from "@/types/HabitTypes";
import { components, internal } from "../_generated/api";
import { query } from "../_generated/server";

const r2 = new R2(components.r2);

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

export const getFlatHabitData = query({
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
      dailyHabits: HabitWithEntryAndStreak[];
      weeklyHabits: HabitWithEntryAndStreak[];
      monthlyHabits: HabitWithEntryAndStreak[];
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

export const getGroupedHabitData = query({
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
      dailyHabits: HabitWithEntryAndStreak[];
      weeklyHabits: HabitWithEntryAndStreak[];
      monthlyHabits: HabitWithEntryAndStreak[];
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

export const getLongestStreak = query({
  args: { habitId: v.id("habits") },
  handler: async (ctx, args) => {
    const streaks = await ctx.db
      .query("streaks")
      .withIndex("by_habit", (q) => q.eq("habitId", args.habitId))
      .collect();

    return streaks.reduce((max, streak) => Math.max(max, streak.length), 0);
  },
});

export const getProofs = query({
  args: { entryId: v.id("habitEntries") },
  handler: async (ctx, args) => {
    const proofs = await ctx.db
      .query("proofs")
      .withIndex("by_entry", (q) => q.eq("habitEntryId", args.entryId))
      .collect();

    // generate image urls for all proofs
    const proofsWithUrls: ProofWithUrl[] = await Promise.all(
      proofs.map(async (proof) => ({
        ...proof,
        url: await r2.getUrl(proof.key, {
          expiresIn: 60 * 60 * 24, // 1 day
        }),
      })),
    );

    return proofsWithUrls;
  },
});
