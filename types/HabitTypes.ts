import type { Doc, Id } from "@/convex/_generated/dataModel";

export type Habit = Doc<"habits">;
export type HabitEntry = Doc<"habitEntries">;
export type ProofMethodId = Id<"proofMethods">;
export type ProofMethod = Doc<"proofMethods">;

export type Activity = {
  date: string;
  value: number;
};
export type HabitActivity = {
  habitId: Id<"habits">;
  activity: Activity[];
};
export type HabitWithEntry = {
  habit: Doc<"habits">;
  entry: Doc<"habitEntries"> | null;
};
