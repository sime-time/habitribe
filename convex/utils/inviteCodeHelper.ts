import { ConvexError } from "convex/values";
import { internalQuery } from "../_generated/server";

/**
 * Generate a unique 6-character alphanumeric invite code
 * Excludes ambiguous characters: 0, O, 1, I, l
 * Collision probability: 32^6 = ~1 billion combinations
 */
export const generateUniqueInviteCode = internalQuery({
  handler: async (ctx): Promise<string> => {
    const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"; // 32 chars
    const maxAttempts = 5;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      let code = "";
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      const existing = await ctx.db
        .query("tribes")
        .withIndex("by_invite_code", (q) => q.eq("inviteCode", code))
        .first();

      if (!existing) return code;
    }

    throw new ConvexError(
      "Failed to generate unique invite code after 5 attempts",
    );
  },
});
