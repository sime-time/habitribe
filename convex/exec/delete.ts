import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
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

    // Delete the proof
    await ctx.db.delete(args.proofId);

    // Decrement progress on the entry
    const entry = await ctx.db.get(proof.habitEntryId);
    if (entry) {
      await ctx.db.patch(proof.habitEntryId, {
        progress: Math.max(0, entry.progress - 1),
      });
    }
  },
});
