import { v } from "convex/values";
import { mutation } from "../_generated/server";

export const deleteHabit = mutation({
  args: { id: v.id("habits") },
  handler: async (ctx, args) => {
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
