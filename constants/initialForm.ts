import { Period } from "@/utils/habitFormLabels";
import type { HabitFormData } from "@/validation/HabitSchema";
import { iconColors } from "./colors";

export const initialForm: HabitFormData = {
  name: "",
  description: "",
  color: iconColors[6],
  icon: "barbell",
  proofMethodId: "kn75pkr2x7a8ch1rj5hq9vcch17rk5th",
  goalTarget: 1,
  goalUnit: "count",
  startDate: new Date().toISOString().split("T")[0], // "YYYY-MM-DD" format
  schedule: {
    period: Period.Daily,
    interval: 1,
  },
};
