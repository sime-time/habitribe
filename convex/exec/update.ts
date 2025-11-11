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
    const { id, ...updateFields } = args;
    await ctx.db.patch(id, updateFields);
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
