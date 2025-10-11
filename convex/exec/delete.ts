import { v } from "convex/values";
import { mutation } from "../_generated/server";

export const deleteHabit = mutation({
  args: { id: v.id("habits") },
  handler: async (ctx, args) => {
    // delete all reminders linked to this habit
    const reminders = await ctx.db
      .query("reminders")
      .filter((q) => q.eq(q.field("habitId"), args.id))
      .collect();

    for (const reminder of reminders) {
      await ctx.db.delete(reminder._id);
    }

    // delete all habit entries linked to this habit
    const entries = await ctx.db
      .query("habitEntries")
      .filter((q) => q.eq(q.field("habitId"), args.id))
      .collect();

    for (const entry of entries) {
      await ctx.db.delete(entry._id);
    }

    // delete the habit
    await ctx.db.delete(args.id);
  },
});

export const deleteHabitEntry = mutation({
  args: { id: v.id("habitEntries") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const deleteReminder = mutation({
  args: { id: v.id("reminders") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
