import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";

import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  habits: defineTable({
    userId: v.id("users"),
    name: v.string(),
    description: v.optional(v.string()),
    icon: v.optional(v.string()),
    color: v.optional(v.string()),
    proofMethodId: v.id("proofMethods"),
    startDate: v.string(), // "YYYY-MM-DD" format
    schedule: v.object({
      frequency: v.union(
        v.literal("daily"),
        v.literal("weekly"),
        v.literal("monthly"),
      ),
      pattern: v.union(
        v.number(), // X times per day/week/month
        v.array(v.number()), // 0=Sunday, 1=Monday, etc.
      ),
    }),
  }),

  habitEntries: defineTable({
    habitId: v.id("habits"),
    userId: v.id("users"),
    date: v.string(), // "YYYY-MM-DD" format
    progress: v.number(),
  }),

  proofs: defineTable({
    userId: v.id("users"),
    habitId: v.id("habits"),
    habitEntryId: v.id("habitEntries"),
    date: v.string(), // "YYYY-MM-DD"
    key: v.string(), // R2 storage key
    caption: v.optional(v.string()),
  })
    .index("by_user_date", ["userId", "date"])
    .index("by_habit_entry", ["habitEntryId"]),

  reminders: defineTable({
    habitId: v.id("habits"),
    userId: v.id("users"),
    time: v.string(), // "HH:mm" format (24-hour)
  }),

  proofMethods: defineTable({
    name: v.string(),
    type: v.union(v.literal("selfVerify"), v.literal("camera")),
    order: v.number(),
    description: v.string(),
    requirements: v.string(),
  }),
});
