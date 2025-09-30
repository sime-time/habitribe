import type { Doc, Id } from "@/convex/_generated/dataModel";

export enum Period {
  Daily = "daily",
  Weekly = "weekly",
  Monthly = "monthly",
}
export function getFrequencyText(
  period: Period,
  interval: number | number[],
): string {
  // Handle days of week (array format)
  if (Array.isArray(interval)) {
    if (interval.length === 0) return "Select days";

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const selectedDays = interval.map((day) => dayNames[day]).join(", ");

    // Abbreviate if too long
    if (selectedDays.length > 20) {
      return `${interval.length} days/week`;
    }
    return selectedDays;
  }

  // Handle numeric intervals
  switch (period) {
    case Period.Daily:
      return interval === 1 ? "Every day" : `Every ${interval} days`;
    case Period.Weekly:
      return interval === 1 ? "Every week" : `Every ${interval} weeks`;
    case Period.Monthly:
      return interval === 1 ? "Every month" : `Every ${interval} months`;
    default:
      return "Every day";
  }
}

export function getGoalDisplayText(goalTarget: number, goalUnit: string) {
  if (!goalTarget || goalTarget === 0) {
    return "Set target";
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

type ProofType = Doc<"proofTypes">;
export function getProofTypeName(
  id: string,
  proofTypes: ProofType[] | undefined,
) {
  if (!proofTypes) return "None";
  const proofTypeId = id as Id<"proofTypes">;
  const proofType = proofTypes.find((pt) => pt._id === proofTypeId);
  return proofType?.name || "None";
}
