import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import { internal } from "../_generated/api";
import { mutation } from "../_generated/server";

export const addHabit = mutation({
  args: {
    name: v.string(),
    icon: v.optional(v.string()),
    description: v.optional(v.string()),
    color: v.optional(v.string()),
    proofMethodId: v.id("proofMethods"),
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

    // habit entry needs to be created immediately
    // because the addMissingEntry mutation only re-triggers when the date changes
    await ctx.db.insert("habitEntries", {
      habitId: habitId,
      userId: userId,
      date: args.startDate,
      progress: 0,
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

/**
 * Creates missing habit entries for a given date on-demand.
 * Called by the client when the user opens the app to ensure entries exist.
 *
 * This pattern solves timezone issues - the client controls what "today" means
 * in their local timezone, and entries are created just-in-time.
 *
 * The midnight cron jobs serve as a backup but this mutation is the primary
 * entry creation mechanism.
 */
export const addMissingEntries = mutation({
  args: {
    date: v.string(),
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
    if (userId === null) {
      // User is not authenticated
      // return early since there are no habits to create entries for
      return { created: 0, date: args.date };
    }

    // get all the user habits
    const habits = await ctx.db
      .query("habits")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    // get all habit entries in this current period
    const todayEntries = await ctx.db
      .query("habitEntries")
      .withIndex("by_user_date", (q) =>
        q.eq("userId", userId).eq("date", args.date),
      )
      .collect();

    const weekEntries = await ctx.db
      .query("habitEntries")
      .withIndex("by_user_date", (q) =>
        q
          .eq("userId", userId)
          .gte("date", args.bounds.weekStart)
          .lte("date", args.bounds.weekEnd),
      )
      .collect();

    const monthEntries = await ctx.db
      .query("habitEntries")
      .withIndex("by_user_date", (q) =>
        q
          .eq("userId", userId)
          .gte("date", args.bounds.monthStart)
          .lte("date", args.bounds.monthEnd),
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
              habit.schedule.pattern.includes(args.weekday));

          if (!entry && shouldExist) {
            const entryId = await ctx.db.insert("habitEntries", {
              habitId: habit._id,
              userId: userId,
              date: args.date,
              progress: 0,
            });
            created++;

            // check if we need to break the streak
            await ctx.runMutation(internal.utils.streakHelper.checkStreak, {
              entryId,
              date: args.date,
            });
          }
          break;
        }
        case "weekly": {
          // check if today is in a week that already has an entry
          const weekEntry = weeklyEntryMap.get(habit._id);
          if (!weekEntry) {
            // create habit entry on the current week's start date (monday)
            const entryId = await ctx.db.insert("habitEntries", {
              habitId: habit._id,
              userId: userId,
              date: args.bounds.weekStart,
              progress: 0,
            });
            created++;

            // check if we need to break the streak
            await ctx.runMutation(internal.utils.streakHelper.checkStreak, {
              entryId,
              date: args.bounds.weekStart,
            });
          }
          break;
        }
        case "monthly": {
          // check if today is in a month that already has an entry
          const monthEntry = monthlyEntryMap.get(habit._id);
          if (!monthEntry) {
            const entryId = await ctx.db.insert("habitEntries", {
              habitId: habit._id,
              userId: userId,
              date: args.bounds.monthStart,
              progress: 0,
            });
            created++;

            // check if we need to break the streak
            await ctx.runMutation(internal.utils.streakHelper.checkStreak, {
              entryId,
              date: args.bounds.monthStart,
            });
          }
          break;
        }
      }
    }

    console.log(`created ${created} missing entries on ${args.date}`);
    return { created, date: args.date };
  },
});

export const addProof = mutation({
  args: {
    habitEntryId: v.id("habitEntries"),
    date: v.string(), // date the proof was uploaded
    key: v.string(), // r2 storage key
    caption: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new ConvexError("No user ID found");

    // get the habit entry
    const entry = await ctx.db.get(args.habitEntryId);
    if (!entry) throw new ConvexError("Habit entry not found");

    // insert the new proof
    const proofId = await ctx.db.insert("proofs", {
      userId: userId,
      habitId: entry.habitId,
      ...args,
    });

    // increment progress on the habit entry
    const newProgress = entry.progress + 1;

    await ctx.db.patch(args.habitEntryId, {
      progress: newProgress,
    });

    const habit = await ctx.db.get(entry.habitId);
    if (habit) {
      // determine target goal based on habit pattern
      const target: number = Array.isArray(habit.schedule.pattern)
        ? 1 // daily habit on specific weekdays needs only 1 completion
        : habit.schedule.pattern;

      // if entry is completed (progress >= target), create or update streak
      if (newProgress >= target) {
        await ctx.runMutation(
          internal.utils.streakHelper.createOrIncrementStreak,
          {
            entryId: args.habitEntryId,
          },
        );
      }
    }

    console.log(`inserted proof: ${proofId}`);
    return proofId;
  },
});
