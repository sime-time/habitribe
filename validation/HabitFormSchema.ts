import { z } from "zod";
import { Frequency } from "@/utils/habitLabelHelper";

export const HabitFormSchema = z.object({
  name: z.string().min(1, "Habit name is required"),
  description: z.string().min(2, "Habit description is required"),
  icon: z.string().optional(),
  color: z.string().optional(),
  proofMethodId: z
    .string()
    .min(1, "You must select a proof type")
    .refine(
      (val) => /^[a-zA-Z][a-zA-Z0-9_]*$/.test(val),
      "Invalid proof type ID format",
    ),
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  schedule: z.object({
    frequency: z.enum(Frequency),
    pattern: z.union([
      z
        .number()
        .min(1, "Pattern must be at least 1"), // Every N days/weeks/months
      z
        .array(z.number().min(0).max(6))
        .min(1, "Select at least one day of the week"), // Days of week: 0=Sunday, 1=Monday, etc.
    ]),
  }),
});

export type HabitFormData = z.infer<typeof HabitFormSchema>;
