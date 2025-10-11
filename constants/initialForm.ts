import { Period } from "@/utils/habitFormLabels";
import type { HabitFormData } from "@/validation/HabitSchema";
import { iconColors } from "./colors";

export const initialForm: HabitFormData = {
  name: "",
  description: "",
  color: iconColors[0],
  icon: "💪",
  proofMethodId: "",
  goalTarget: 0,
  goalUnit: "count",
  startDate: new Date().toISOString().split("T")[0], // "YYYY-MM-DD" format
  schedule: {
    period: Period.Daily,
    interval: 1,
  },
};
