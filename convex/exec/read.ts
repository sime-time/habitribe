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

export const getHabitEntry = query({
  args: {
    id: v.id("habitEntries"),
  },
  handler: async (ctx, args) => {
    const entry = await ctx.db.get(args.id);
    return entry;
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

export const getCameraBasedHabits = query({
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
    const flatHabitData = [
      ...groups.dailyHabits,
      ...groups.weeklyHabits,
      ...groups.monthlyHabits,
    ];

    // get all the proof methods
    const proofMethods = await ctx.db.query("proofMethods").collect();
    const cameraProofMethod = proofMethods.find(
      (method) => method.name.toLowerCase() === "camera",
    );
    if (!cameraProofMethod) return [];

    // filter the habits with camera-only proof methods
    const cameraHabits = flatHabitData.filter(
      (data) => data.habit.proofMethodId === cameraProofMethod._id,
    );

    return cameraHabits;
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
  args: { habitId: v.id("habits"), date: v.string() },
  handler: async (ctx, args) => {
    const proofs = await ctx.db
      .query("proofs")
      .withIndex("by_habit_date", (q) =>
        q.eq("habitId", args.habitId).eq("date", args.date),
      )
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

export const getHabitWithStreaksAndProofs = query({
  args: { habitId: v.id("habits") },
  handler: async (ctx, args) => {
    const habit = await ctx.db.get(args.habitId);
    if (!habit) throw new ConvexError("No habit found");

    // get all the streaks
    const streaks = await ctx.db
      .query("streaks")
      .withIndex("by_habit", (q) => q.eq("habitId", args.habitId))
      .collect();

    // retrieve the length of the current and longest streaks
    const longestStreak = streaks.reduce(
      (max, streak) => Math.max(max, streak.length),
      0,
    );
    const activeStreak = streaks.find((streak) => streak.active === true);
    const currentStreak = activeStreak?.length || 0;

    // get all the proofs for the habit
    const proofs = await ctx.db
      .query("proofs")
      .withIndex("by_habit", (q) => q.eq("habitId", args.habitId))
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

    // record: date -> url
    const proofDateUrl = proofsWithUrls.reduce(
      (acc, proof) => {
        acc[proof.date] = proof.url;
        return acc;
      },
      {} as Record<string, string | undefined>,
    );

    return { habit, proofDateUrl, currentStreak, longestStreak };
  },
});

export const getPublicTribes = query({
  handler: async (ctx) => {
    const tribes = await ctx.db
      .query("tribes")
      .withIndex("by_private", (q) => q.eq("private", false))
      .collect();
    return tribes;
  },
});
