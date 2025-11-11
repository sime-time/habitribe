import type { Doc, Id } from "@/convex/_generated/dataModel";

type Habit = Doc<"habits">;
type ProofMethod = Doc<"proofMethods">;

export enum Frequency {
  Daily = "daily",
  Weekly = "weekly",
  Monthly = "monthly",
}

export function getScheduleLabel(
  frequency: Frequency,
  pattern: number | number[],
): string {
  // Handle days of week (array format)
  if (Array.isArray(pattern)) {
    if (pattern.length === 0) return "set pattern...";

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const sortedPattern = [...pattern].sort((a, b) => a - b);
    const selectedDays = sortedPattern.map((day) => dayNames[day]).join(", ");

    return selectedDays;
  }

  switch (frequency) {
    case Frequency.Daily:
      return pattern === 1 ? "Every day" : `${pattern} times a day`;
    case Frequency.Weekly:
      return pattern === 1 ? "Every week" : `${pattern} times a week`;
    case Frequency.Monthly:
      return pattern === 1 ? "Every month" : `${pattern} times a month`;
    default:
      return "Every day";
  }
}

export function getProofMethodDescription(
  id: string,
  proofMethods: ProofMethod[] | undefined,
) {
  if (!proofMethods) return "select proof method...";
  const proofMethodId = id as Id<"proofMethods">;
  const proofMethod = proofMethods.find((pt) => pt._id === proofMethodId);
  return proofMethod?.description.toLowerCase() || "select proof method...";
}

export function getProofMethodRequirements(
  id: string,
  proofMethods: ProofMethod[] | undefined,
) {
  if (!proofMethods) return "Requires Method of Proof";
  const proofMethodId = id as Id<"proofMethods">;
  const proofMethod = proofMethods.find((pt) => pt._id === proofMethodId);
  return proofMethod?.requirements || "Requires Method of Proof";
}

export function isComplete(progress: number | undefined, habit: Habit) {
  if (!progress) return false;

  // get the target count from habit schedule pattern
  const target: number = Array.isArray(habit?.schedule.pattern)
    ? habit.schedule.pattern.length
    : habit.schedule.pattern;

  const isComplete = progress >= target;
  return isComplete;
}
