import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import { internal } from "../_generated/api";
import { mutation } from "../_generated/server";

export const deleteHabit = mutation({
  args: { id: v.id("habits") },
  handler: async (ctx, args) => {
    // delete all reminders linked to this habit
    const reminders = await ctx.db
      .query("reminders")
      .withIndex("by_habit", (q) => q.eq("habitId", args.id))
      .collect();

    for (const reminder of reminders) {
      await ctx.db.delete(reminder._id);
    }

    // delete all habit entries linked to this habit
    const entries = await ctx.db
      .query("habitEntries")
      .withIndex("by_habit", (q) => q.eq("habitId", args.id))
      .collect();

    for (const entry of entries) {
      await ctx.db.delete(entry._id);
    }

    // delete all proofs linked to this habit
    const proofs = await ctx.db
      .query("proofs")
      .withIndex("by_habit", (q) => q.eq("habitId", args.id))
      .collect();

    for (const proof of proofs) {
      await ctx.db.delete(proof._id);
    }

    // delete all streaks linked to this habit
    const streaks = await ctx.db
      .query("streaks")
      .withIndex("by_habit", (q) => q.eq("habitId", args.id))
      .collect();

    for (const streak of streaks) {
      await ctx.db.delete(streak._id);
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

/**
 * Delete a proof and decrement the habit entry's progress
 */
export const deleteProof = mutation({
  args: {
    proofId: v.id("proofs"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Unauthorized");

    // Get the proof
    const proof = await ctx.db.get(args.proofId);
    if (!proof) throw new ConvexError("Proof not found");

    // Verify it belongs to this user
    if (proof.userId !== userId) {
      throw new ConvexError("Proof does not belong to this user");
    }

    const entry = await ctx.db.get(proof.habitEntryId);
    if (!entry) throw new ConvexError("Entry not found");

    const habit = await ctx.db.get(entry.habitId);
    if (!habit) throw new ConvexError("Habit not found");

    // decrement entry progress
    await ctx.db.patch(proof.habitEntryId, {
      progress: Math.max(0, entry.progress - 1),
    });

    // rebuild streaks for this habit after progress changes
    await ctx.runMutation(internal.utils.streakHelper.rebuildAllStreaks, {
      habitId: habit._id,
    });

    // delete the proof
    await ctx.db.delete(args.proofId);
  },
});
