import { getTodayDateString } from "@/utils/dateHelper";
import { Frequency } from "@/utils/habitLabelHelper";
import type { HabitFormData } from "@/validation/HabitFormSchema";
import { iconColors } from "./colors";

export const initialForm: HabitFormData = {
  name: "",
  description: "",
  color: iconColors[0],
  icon: "💪",
  proofMethodId: "",
  startDate: getTodayDateString(), // "YYYY-MM-DD" format
  schedule: {
    frequency: Frequency.Daily,
    pattern: 1,
  },
};
