import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import { internal } from "../_generated/api";
import { mutation } from "../_generated/server";

export const editHabit = mutation({
  args: {
    id: v.id("habits"),
    name: v.optional(v.string()),
    icon: v.optional(v.string()),
    description: v.optional(v.string()),
    color: v.optional(v.string()),
    proofMethodId: v.optional(v.id("proofMethods")),
    startDate: v.optional(v.string()), // "YYYY-MM-DD"
    schedule: v.optional(
      v.object({
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
    ),
  },
  handler: async (ctx, args) => {
    // destructure the args to separate habit id
    const { id, ...updateData } = args;
    await ctx.db.patch(id, updateData);
  },
});

export const editReminder = mutation({
  args: { id: v.id("reminders"), time: v.string() },
  handler: async (ctx, args) => {
    const reminder = await ctx.db.get(args.id);
    if (!reminder) {
      throw new ConvexError("Reminder not found");
    }
    await ctx.db.patch(args.id, {
      time: args.time,
    });
  },
});

export const incrementHabitEntryProgress = mutation({
  args: { id: v.id("habitEntries") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Unauthorized");

    const entry = await ctx.db.get(args.id);
    if (!entry) throw new ConvexError("Entry not found");

    const newProgress = entry.progress + 1;

    // increment habit entry progress
    await ctx.db.patch(args.id, {
      progress: newProgress,
    });

    const habit = await ctx.db.get(entry.habitId);
    if (!habit) throw new ConvexError("Habit not found");

    // determine target goal based on habit pattern
    const target: number = Array.isArray(habit.schedule.pattern)
      ? 1 // daily habit on specific weekdays needs only 1 completion
      : habit.schedule.pattern;

    // if entry is completed (progress >= target), increment streak
    if (newProgress >= target) {
      await ctx.runMutation(
        internal.utils.streakHelper.createOrIncrementStreak,
        {
          entryId: args.id,
        },
      );
    }
  },
});

export const resetHabitEntryProgress = mutation({
  args: { id: v.id("habitEntries") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Unauthorized");

    const entry = await ctx.db.get(args.id);
    if (!entry) throw new ConvexError("Entry not found");

    await ctx.db.patch(args.id, {
      progress: 0,
    });

    // decrement streak length when resetting
    // but do not break the streak
    const habit = await ctx.db.get(entry.habitId);
    if (!habit) throw new ConvexError("Habit not found");

    const activeStreak = await ctx.db
      .query("streaks")
      .withIndex("by_active_habit", (q) =>
        q.eq("habitId", habit._id).eq("active", true),
      )
      .first();

    // check if this entry is part of the active streak
    if (activeStreak && entry.date === activeStreak.endDate) {
      // decrement but keep the streak active
      await ctx.db.patch(activeStreak._id, {
        length: Math.max(0, activeStreak.length - 1),
        endDate: activeStreak.endDate,
      });
    }
  },
});
