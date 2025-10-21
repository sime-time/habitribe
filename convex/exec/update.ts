import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import { mutation } from "../_generated/server";
import { r2 } from "../bucket";

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

export const editHabitEntryProof = mutation({
  args: {
    id: v.id("habitEntries"),
    key: v.string(),
    caption: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const entry = await ctx.db
      .query("habitEntries")
      .filter((q) => q.eq(q.field("_id"), args.id))
      .first();
    const currentProof = entry?.proof || [];

    // const url = await r2.getUrl(args.storageKey);

    await ctx.db.patch(args.id, {
      progress: 1,
      isCompleted: true,
      proof: [
        ...currentProof,
        {
          key: args.key,
          caption: args.caption,
        },
      ],
    });
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
