import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
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
    const { id, ...updateHabit } = args;

    // If frequency is being changed, delete all existing entries to avoid conflicts
    // For example: weekly habit with entry on "2025-11-10" (Monday)
    // If switched to daily, daily entries are created on individual dates
    // If switched back to weekly, we'd have both the original weekly entry and new daily entries in the same week
    if (updateHabit.schedule) {
      const habit = await ctx.db.get(id);
      if (
        habit &&
        habit.schedule.frequency !== updateHabit.schedule.frequency
      ) {
        // frequency is changing, delete all entries for this habit
        const entries = await ctx.db
          .query("habitEntries")
          .withIndex("by_habit", (q) => q.eq("habitId", id))
          .collect();

        for (const entry of entries) {
          await ctx.db.delete(entry._id);
        }
      }
    }

    await ctx.db.patch(id, updateHabit);
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

    await ctx.db.patch(args.id, {
      progress: entry.progress + 1,
    });
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
  },
});
