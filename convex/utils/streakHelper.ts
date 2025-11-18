import type { GenericMutationCtx } from "convex/server";
import { ConvexError, v } from "convex/values";
import { isComplete } from "@/utils/habitLabelHelper";
import type { Id } from "../_generated/dataModel";
import { internalMutation } from "../_generated/server";

/**
 * Creates or updates a streak session for a habit entry.
 * This mutation manages streak tracking by either extending an active streak,
 * breaking it if a period is skipped, or creating a new streak.
 *
 * @param {Id<"habits">} habitId - The ID of the habit to track streaks
 * @param {string} entryDate - The date of the entry in "YYYY-MM-DD" format
 * @param {"daily" | "weekly" | "monthly"} frequency - The frequency of the habit
 * @description
 * 1. Retrieves the habit and its current active streak (if any)
 * 2. Checks if the entry date represents the next consecutive period:
 *    - Daily: entryDate must be exactly 1 day after activeStreak.endDate
 *    - Weekly: entryDate must be exactly 7 days after activeStreak.endDate
 *    - Monthly: entryDate must be in the month following activeStreak.endDate's month
 * 3. Updates or creates streak based on continuity:
 *    - **Continuing streak**: Updates active streak with new endDate and increments length
 *    - **Broken streak**: Deactivates old streak and creates new one with length = 1
 *    - **New streak**: Creates initial streak with length = 1
 */
export const createOrIncrementStreak = internalMutation({
  args: {
    entryId: v.id("habitEntries"),
  },
  handler: async (ctx, args) => {
    const entry = await ctx.db.get(args.entryId);
    if (!entry) throw new ConvexError("Entry not found");

    const habit = await ctx.db.get(entry.habitId);
    if (!habit) throw new ConvexError("Habit not found");

    const activeStreak = await ctx.db
      .query("streaks")
      .withIndex("by_active_habit", (q) =>
        q.eq("habitId", habit._id).eq("active", true),
      )
      .first();

    if (!activeStreak) {
      // create a new active streak
      return await ctx.db.insert("streaks", {
        userId: entry.userId,
        habitId: entry.habitId,
        startDate: entry.date,
        endDate: entry.date,
        length: 1,
        active: true,
      });
    }

    const previousEntry = await getPreviousEntry(ctx, habit._id, entry._id);

    if (
      (!previousEntry && activeStreak.endDate === entry.date) ||
      activeStreak.startDate === activeStreak.endDate
    ) {
      // this is the very first entry of this habit
      return await ctx.db.patch(activeStreak._id, {
        endDate: entry.date,
        length: activeStreak.length + 1,
      });
    }

    const previousComplete = isComplete(previousEntry.progress, habit);

    if (previousComplete) {
      // streak is active, has previous entry, and previous entry is completed
      // continue the streak
      return await ctx.db.patch(activeStreak._id, {
        endDate: entry.date,
        length: activeStreak.length + 1,
      });
    } else {
      // streak is active, has previous entry, but previous entry is incomplete
      // end old streak and start a new one
      await ctx.db.patch(activeStreak._id, {
        endDate: previousEntry?.date,
        active: false,
      });
      return await ctx.db.insert("streaks", {
        userId: entry.userId,
        habitId: entry.habitId,
        startDate: entry.date,
        endDate: entry.date,
        length: 1,
        active: true,
      });
    }
  },
});

// check if a streak needs to be broken
export const checkStreak = internalMutation({
  args: {
    entryId: v.id("habitEntries"),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const entry = await ctx.db.get(args.entryId);
    if (!entry) throw new ConvexError("Entry not found");

    const habit = await ctx.db.get(entry.habitId);
    if (!habit) throw new ConvexError("Habit not found");

    const activeStreak = await ctx.db
      .query("streaks")
      .withIndex("by_active_habit", (q) =>
        q.eq("habitId", habit._id).eq("active", true),
      )
      .first();

    const previousEntry = await getPreviousEntry(ctx, habit._id, entry._id);

    if (
      activeStreak &&
      activeStreak.endDate < args.date &&
      previousEntry &&
      !isComplete(previousEntry.progress, habit)
    ) {
      // new period already started, but previous wasn't completed
      // break the streak
      await ctx.db.patch(activeStreak._id, {
        active: false,
      });
    }
  },
});

async function getPreviousEntry(
  // biome-ignore lint/suspicious/noExplicitAny: Convex context is dynamic
  ctx: GenericMutationCtx<any>,
  habitId: Id<"habits">,
  entryId: Id<"habitEntries">,
) {
  // get all entries ordered by creation time (newest first)
  const orderedEntries = await ctx.db
    .query("habitEntries")
    .withIndex("by_habit", (q) => q.eq("habitId", habitId))
    .order("desc")
    .collect();

  // find the index of current entry and get the previous one
  const currentIndexEntry = orderedEntries.findIndex((e) => e._id === entryId);
  if (currentIndexEntry === -1) {
    throw new ConvexError(
      "Current entry not found in ordered habit entries list",
    );
  }

  // use index to find previous entry
  const previousEntry =
    currentIndexEntry < orderedEntries.length - 1
      ? orderedEntries[currentIndexEntry + 1]
      : null;

  return previousEntry;
}
