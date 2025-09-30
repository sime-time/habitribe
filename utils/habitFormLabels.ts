import type { Doc, Id } from "@/convex/_generated/dataModel";

export enum Period {
  Daily = "daily",
  Weekly = "weekly",
  Monthly = "monthly",
}
export function getFrequencyLabel(
  period: Period,
  interval: number | number[],
): string {
  // Handle days of week (array format)
  if (Array.isArray(interval)) {
    if (interval.length === 0) return "Set Frequency...";

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const sortedInterval = [...interval].sort((a, b) => a - b);
    const selectedDays = sortedInterval.map((day) => dayNames[day]).join(", ");

    return selectedDays;
  }

  // Handle numeric intervals
  switch (period) {
    case Period.Daily:
      return interval === 1 ? "day" : `${interval} days`;
    case Period.Weekly:
      return interval === 1 ? "week" : `${interval} weeks`;
    case Period.Monthly:
      return interval === 1 ? "month" : `${interval} months`;
    default:
      return "day";
  }
}

export function getGoalLabel(goalTarget: number, goalUnit: string) {
  if (!goalTarget || goalTarget === 0) {
    return "Set Goal...";
  }

  switch (goalUnit) {
    case "time": {
      // goalTarget is stored in seconds
      const totalMinutes = Math.floor(goalTarget / 60);
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      if (hours === 0 && minutes === 0) {
        return "Set time";
      }

      const hourText = hours === 1 ? "hour" : "hours";
      const minuteText = minutes === 1 ? "minute" : "minutes";

      if (hours > 0 && minutes > 0) {
        return `${hours} ${hourText}, ${minutes} ${minuteText}`;
      } else if (hours > 0) {
        return `${hours} ${hourText}`;
      } else {
        return `${minutes} ${minuteText}`;
      }
    }

    case "count": {
      const countText = goalTarget === 1 ? "time" : "times";
      return `${goalTarget} ${countText}`;
    }

    default:
      // Custom unit
      return `${goalTarget} ${goalUnit}`;
  }
}

type ProofMethod = Doc<"proofMethods">;
export function getProofMethodLabel(
  id: string,
  proofMethods: ProofMethod[] | undefined,
) {
  if (!proofMethods) return "select method";
  const proofMethodId = id as Id<"proofMethods">;
  const proofMethod = proofMethods.find((pt) => pt._id === proofMethodId);
  return proofMethod?.description.toLowerCase() || "select method";
}
