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
    proofTypeId: v.id("proofTypes"),
    goalTarget: v.number(),
    goalUnit: v.string(), // e.g., time (in seconds)
    startDate: v.string(), // "YYYY-MM-DD" format
    schedule: v.object({
      period: v.union(
        v.literal("daily"),
        v.literal("weekly"),
        v.literal("monthly"),
      ),
      interval: v.union(
        v.number(), // every N days/weeks/months
        v.array(v.number()), // 0=Sunday, 1=Monday, etc.
      ),
    }),
  }),

  habitEntries: defineTable({
    habitId: v.id("habits"),
    userId: v.id("users"),
    date: v.string(), // "YYYY-MM-DD" format
    progress: v.number(),
    isCompleted: v.boolean(),
    proofUrl: v.optional(v.string()),
  }),

  reminders: defineTable({
    habitId: v.id("habits"),
    userId: v.id("users"),
    time: v.string(), // "HH:mm" format (24-hour)
  }),

  proofTypes: defineTable({
    name: v.string(),
    order: v.number(),
    description: v.string(),
  }),
});
