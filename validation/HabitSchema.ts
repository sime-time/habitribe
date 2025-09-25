import { z } from "zod";
import { Period } from "@/utils/habitFormLabels";

export const HabitSchema = z.object({
  name: z.string().min(1, "Habit name is required"),
  description: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  goalTarget: z.number().min(1, "Goal target must be at least 1"),
  goalUnit: z.string().min(1, "Goal unit is required"),
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  schedule: z.object({
    period: z.enum(Period),
    interval: z.union([
      z
        .number()
        .min(1, "Interval must be at least 1"), // Every N days/weeks/months
      z
        .array(z.number().min(0).max(6))
        .min(1, "Select at least one day of the week"), // Days of week: 0=Sunday, 1=Monday, etc.
    ]),
  }),
});

export type HabitFormData = z.infer<typeof HabitSchema>;
