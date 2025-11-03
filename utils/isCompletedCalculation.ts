import type { Doc } from "@/convex/_generated/dataModel";

type Habit = Doc<"habits">;

export function calculateIsCompleted(progress: number, habit: Habit) {
  // get the target count from habit schedule pattern
  const target: number = Array.isArray(habit?.schedule.pattern)
    ? habit.schedule.pattern.length
    : habit.schedule.pattern;

  const isCompleted = progress >= target;
  return isCompleted;
}
