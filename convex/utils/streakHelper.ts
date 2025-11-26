import { ConvexError, v } from "convex/values";
import { internalMutation } from "../_generated/server";
import { calculateAllStreaks } from "./streakCalculator";

export const rebuildAllStreaks = internalMutation({
  args: { habitId: v.id("habits") },
  handler: async (ctx, args) => {
    const habit = await ctx.db.get(args.habitId);
    if (!habit) throw new ConvexError("Habit not found");

    const entries = await ctx.db
      .query("habitEntries")
      .withIndex("by_habit", (q) => q.eq("habitId", args.habitId))
      .order("asc")
      .collect();

    // calculate all streaks from in-memory entry data
    const calculatedStreaks = calculateAllStreaks(habit, entries);

    // delete all old streaks for this habit
    const oldStreaks = await ctx.db
      .query("streaks")
      .withIndex("by_habit", (q) => q.eq("habitId", args.habitId))
      .collect();

    for (const oldStreak of oldStreaks) {
      await ctx.db.delete(oldStreak._id);
    }

    // insert recalculated streaks
    for (let i = 0; i < calculatedStreaks.length; i++) {
      const streak = calculatedStreaks[i];
      const isActive = i === calculatedStreaks.length - 1;

      await ctx.db.insert("streaks", {
        habitId: args.habitId,
        userId: habit.userId,
        startDate: streak.startDate,
        endDate: streak.endDate,
        length: streak.length,
        active: isActive,
        entryIds: streak.entryIds,
        breakingEntryId: streak.breakingEntryId || undefined,
      });
    }
    return calculatedStreaks;
  },
});
