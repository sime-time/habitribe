import { internal } from "../_generated/api";
import { internalMutation } from "../_generated/server";

/**
 * Migration: Rebuild all streaks for all users.
 *
 * This should be called once on first deploy of the new streak system.
 * It recalculates streaks from scratch based on existing habit entries.
 */
export const migrateToRobustStreaks = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Get all unique habits
    const habits = await ctx.db.query("habits").collect();

    let migratedCount = 0;

    for (const habit of habits) {
      // Rebuild streaks for each habit
      await ctx.runMutation(internal.utils.streakHelper.rebuildAllStreaks, {
        habitId: habit._id,
      });
      migratedCount++;
    }

    console.log(`Migrated streaks for ${migratedCount} habits`);
    return { migratedCount };
  },
});
