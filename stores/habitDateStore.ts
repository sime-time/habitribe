import { create } from "zustand";
import { getTodayDateString, parseLocalDate } from "@/utils/dateHelper";

const today = getTodayDateString();

interface HabitDateStore {
  date: Date;
  dateId: string; // "YYYY-MM-DD" format
  updateDate: (date: Date | string) => void;
  reset: () => void;
}

export const useHabitDateStore = create<HabitDateStore>((set) => ({
  date: parseLocalDate(today),
  dateId: today,
  updateDate: (date: Date | string) => {
    if (date instanceof Date) {
      set({
        date: date,
      });
    } else {
      set({
        dateId: date,
      });
    }
  },
  reset: () => {
    set({
      date: parseLocalDate(today),
      dateId: today,
    });
  },
}));
