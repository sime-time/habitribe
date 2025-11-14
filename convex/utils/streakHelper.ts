import { ConvexError, v } from "convex/values";
import { getWeekBounds } from "@/utils/dateHelper";
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
export const createOrUpdateStreak = internalMutation({
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

    // get all entries ordered by creation time (newest first)
    const orderedEntries = await ctx.db
      .query("habitEntries")
      .withIndex("by_habit", (q) => q.eq("habitId", habit._id))
      .order("desc")
      .collect();

    // find the index of current entry and get the previous one
    const currentIndexEntry = orderedEntries.findIndex(
      (e) => e._id === args.entryId,
    );
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

    // determine if previous entry is in the previous period
    let isPreviousContinuous = false;

    if (previousEntry) {
      switch (habit.schedule.frequency) {
        case "daily": {
          // check if previous entry is created within 24 hours of current entry
          const currentDate = new Date(entry.date);
          const previousDate = new Date(previousEntry.date);
          const dayDiff =
            (currentDate.getTime() - previousDate.getTime()) /
            (1000 * 60 * 60 * 24);

          console.log("daily streak diff", dayDiff);

          isPreviousContinuous = dayDiff === 1;
          break;
        }
        case "weekly": {
          // check if previous entry is within 1 week of current entry
          const currentDate = new Date(entry.date);
          const previousDate = new Date(previousEntry.date);

          const { start: currentWeekStart } = getWeekBounds(currentDate);
          const { start: previousWeekStart } = getWeekBounds(previousDate);

          const weekDiff =
            (new Date(currentWeekStart).getTime() -
              new Date(previousWeekStart).getTime()) /
            (1000 * 60 * 60 * 24 * 7);

          console.log("weekly streak diff", weekDiff);

          isPreviousContinuous = weekDiff <= 1 && weekDiff > 0;
          break;
        }
        case "monthly": {
          // check if previous entry is in the month before current entry's month
          const currentDate = new Date(entry.date);
          const previousDate = new Date(previousEntry.date);

          // year * 12 gives you a unique integer for each month across all years
          // subtracting two of these integers tells you exactly how many months apart they are
          const currentMonth =
            currentDate.getFullYear() * 12 + currentDate.getMonth();
          const previousMonth =
            previousDate.getFullYear() * 12 + previousDate.getMonth();

          isPreviousContinuous = currentMonth - previousMonth === 1;
          break;
        }
      }
    }

    if (isPreviousContinuous) {
      // continue the streak
      return await ctx.db.patch(activeStreak._id, {
        endDate: entry.date,
        length: activeStreak.length + 1,
      });
    } else {
      // gap detected - end old streak and create new one
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
