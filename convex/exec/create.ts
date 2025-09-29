import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import { mutation } from "../_generated/server";

export const addHabit = mutation({
  args: {
    name: v.string(),
    icon: v.optional(v.string()),
    description: v.optional(v.string()),
    color: v.optional(v.string()),
    proofTypeId: v.id("proofTypes"),
    goalTarget: v.number(),
    goalUnit: v.string(),
    startDate: v.string(), // "YYYY-MM-DD"
    schedule: v.object({
      period: v.union(
        v.literal("daily"),
        v.literal("weekly"),
        v.literal("monthly"),
      ),
      interval: v.union(
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
    proofUrl: v.optional(v.string()),
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
