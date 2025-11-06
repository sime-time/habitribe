import { Frequency } from "@/utils/habitLabelHelper";
import type { HabitFormData } from "@/validation/HabitSchema";
import { iconColors } from "./colors";

export const initialForm: HabitFormData = {
  name: "",
  description: "",
  color: iconColors[0],
  icon: "💪",
  proofMethodId: "",
  startDate: new Date().toISOString().split("T")[0], // "YYYY-MM-DD" format
  schedule: {
    frequency: Frequency.Daily,
    pattern: 1,
  },
};
