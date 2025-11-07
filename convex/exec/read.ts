import { getAuthUserId } from "@convex-dev/auth/server";
import { R2 } from "@convex-dev/r2";
import { ConvexError, v } from "convex/values";
import type { HabitActivity } from "@/validation/HabitSchema";
import { components, internal } from "../_generated/api";
import type { Doc } from "../_generated/dataModel";
import { query } from "../_generated/server";

type HabitWithEntry = {
  habit: Doc<"habits">;
  entry: Doc<"habitEntries"> | null;
};
const r2 = new R2(components.r2);

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

export const getTodaysHabitEntries = query({
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

    const sorted: {
      dailyHabits: HabitWithEntry[];
      weeklyHabits: HabitWithEntry[];
      monthlyHabits: HabitWithEntry[];
    } = await ctx.runQuery(
      internal.entries.helpers.sortHabitEntriesByFrequency,
      {
        date: args.date,
        weekday: args.weekday,
        userId: userId,
        bounds: args.bounds,
      },
    );

    // flat array of habit+entry objects
    return [
      ...sorted.dailyHabits,
      ...sorted.weeklyHabits,
      ...sorted.monthlyHabits,
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

    const sorted: {
      dailyHabits: HabitWithEntry[];
      weeklyHabits: HabitWithEntry[];
      monthlyHabits: HabitWithEntry[];
    } = await ctx.runQuery(
      internal.entries.helpers.sortHabitEntriesByFrequency,
      {
        date: args.date,
        weekday: args.weekday,
        userId: userId,
        bounds: args.bounds,
      },
    );

    // add proofs to each entry
    // generate URL for each entry's proof
    async function addProofToEntry(item: HabitWithEntry) {
      // no entry, return item as-is
      if (!item.entry) {
        return item;
      }

      const habitEntryId = item.entry._id;

      // fetch proofs for this entry
      const proofs = await ctx.db
        .query("proofs")
        .withIndex("by_habit_entry", (q) => q.eq("habitEntryId", habitEntryId))
        .collect();

      // generate URLs for each proof
      const proofWithUrls = await Promise.all(
        proofs.map(async (proof) => ({
          ...proof,
          url: await r2.getUrl(proof.key, {
            expiresIn: 60 * 60 * 24, // 1 day
          }),
        })),
      );

      return {
        habit: item.habit,
        entry: {
          ...item.entry,
          proof: proofWithUrls,
        },
      };
    }

    // parallel optimization
    const [dailyHabits, weeklyHabits, monthlyHabits] = await Promise.all([
      Promise.all(
        sorted.dailyHabits.map(async (item) => addProofToEntry(item)),
      ),
      Promise.all(
        sorted.weeklyHabits.map(async (item) => addProofToEntry(item)),
      ),
      Promise.all(
        sorted.monthlyHabits.map(async (item) => addProofToEntry(item)),
      ),
    ]);

    // habit+entry grouped by frequency and proofs include a url to view on the client
    return { dailyHabits, weeklyHabits, monthlyHabits };
  },
});

export const getHabitHeatmaps = query({
  args: {
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new ConvexError("Unauthorized");

    const daily: HabitActivity[] = [];
    const weekly: HabitActivity[] = [];
    const monthly: HabitActivity[] = [];

    // get all user habits
    const habits = await ctx.db
      .query("habits")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();

    // fetch heatmap data for each habit in parallel
    await Promise.all(
      habits.map(async (habit) => {
        const entries = await ctx.db
          .query("habitEntries")
          .filter((q) =>
            q.and(
              q.eq(q.field("userId"), userId),
              q.eq(q.field("habitId"), habit._id),
              q.gte(q.field("date"), args.startDate),
              q.lte(q.field("date"), args.endDate),
            ),
          )
          .collect();

        switch (habit.schedule.frequency) {
          case "daily":
            daily.push({
              habit: habit,
              activity: entries.map((entry) => ({
                date: entry.date,
                value: entry.progress,
              })),
            });
            break;
          case "weekly":
            weekly.push({
              habit: habit,
              activity: entries.map((entry) => ({
                date: entry.date,
                value: entry.progress,
              })),
            });
            break;
          case "monthly":
            monthly.push({
              habit: habit,
              activity: entries.map((entry) => ({
                date: entry.date,
                value: entry.progress,
              })),
            });
            break;
        }
      }),
    );

    return { daily, weekly, monthly };
  },
});
