import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import { getMonthBounds, getWeekBounds } from "@/utils/boundsHelper";
import { mutation } from "../_generated/server";

export const addHabit = mutation({
  args: {
    name: v.string(),
    icon: v.optional(v.string()),
    description: v.optional(v.string()),
    color: v.optional(v.string()),
    proofMethodId: v.id("proofMethods"),
    goalTarget: v.number(),
    goalUnit: v.string(),
    startDate: v.string(), // "YYYY-MM-DD"
    schedule: v.object({
      frequency: v.union(
        v.literal("daily"),
        v.literal("weekly"),
        v.literal("monthly"),
      ),
      pattern: v.union(
        v.number(), // every N days/weeks/months
        v.array(v.number()), // 0=Sunday, 1=Monday, etc.
      ),
    }),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new ConvexError("No user id found");
    }
    const habitId = await ctx.db.insert("habits", {
      userId,
      ...args,
    });

    return habitId;
  },
});

export const addHabitEntry = mutation({
  args: {
    habitId: v.id("habits"),
    userId: v.id("users"),
    date: v.string(), // "YYYY-MM-DD" format
    progress: v.number(),
    isCompleted: v.boolean(),
    proofUrl: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const habitEntryId = await ctx.db.insert("habitEntries", {
      ...args,
    });
    return habitEntryId;
  },
});

export const addReminder = mutation({
  args: {
    habitId: v.id("habits"),
    time: v.string(), // "HH:mm" format (24-hour)
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new ConvexError("No user id found");
    }
    const reminderId = await ctx.db.insert("reminders", {
      userId,
      ...args,
    });
    return reminderId;
  },
});

export const addMissingEntries = mutation({
  args: {
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new ConvexError("No user ID found");

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

    // check if missing entry should exist and doesn't
    // if missing, create it
    let created = 0;
    for (const habit of habits) {
      // skip if habit hasn't started yet
      if (habit.startDate > args.date) continue;

      switch (habit.schedule.frequency) {
        case "daily": {
          // check if today aligns with the habit's pattern
          const entry = todayEntryMap.get(habit._id);
          const shouldExist: boolean =
            Number.isInteger(habit.schedule.pattern) ||
            (Array.isArray(habit.schedule.pattern) &&
              habit.schedule.pattern.includes(weekday));

          if (!entry && shouldExist) {
            await ctx.db.insert("habitEntries", {
              habitId: habit._id,
              userId: userId,
              date: args.date,
              progress: 0,
              isCompleted: false,
            });
            created++;
          }
          break;
        }
        case "weekly": {
          // check if today is in a week that already has an entry
          const weekEntry = weeklyEntryMap.get(habit._id);
          if (!weekEntry) {
            // create habit entry on the current week's start date (monday)
            await ctx.db.insert("habitEntries", {
              habitId: habit._id,
              userId: userId,
              date: weekStart,
              progress: 0,
              isCompleted: false,
            });
            created++;
          }
          break;
        }
        case "monthly": {
          // check if today is in a month that already has an entry
          const monthEntry = monthlyEntryMap.get(habit._id);
          if (!monthEntry) {
            await ctx.db.insert("habitEntries", {
              habitId: habit._id,
              userId: userId,
              date: monthStart,
              progress: 0,
              isCompleted: false,
            });
            created++;
          }
          break;
        }
      }
    }

    console.log(`created ${created} missing entries on ${args.date}`);
    return { created, date: args.date };
  },
});
