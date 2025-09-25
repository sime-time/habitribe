import { ConvexError, v } from "convex/values";
import { mutation } from "../_generated/server";

export const editHabit = mutation({
  args: {
    id: v.id("habits"),
    name: v.optional(v.string()),
    icon: v.optional(v.string()),
    description: v.optional(v.string()),
    color: v.optional(v.string()),
    goalTarget: v.optional(v.number()),
    goalUnit: v.optional(v.string()),
    startDate: v.optional(v.string()), // "YYYY-MM-DD"
    schedule: v.optional(
      v.object({
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
    ),
  },
  handler: async (ctx, args) => {
    // destructure the args to separate habit id
    const { id, ...updateFields } = args;
    await ctx.db.patch(id, updateFields);
  },
});

export const toggleHabitEntry = mutation({
  args: { id: v.id("habitEntries") },
  handler: async (ctx, args) => {
    const entry = await ctx.db.get(args.id);
    if (!entry) {
      throw new ConvexError("Entry not found");
    }
    await ctx.db.patch(args.id, {
      isCompleted: !entry.isCompleted,
    });
  },
});
