import { create } from "zustand";
import { formatLocalDate, getTodayDateString } from "@/utils/dateHelper";

interface HabitChartStore {
  endDate: string;
  numDays: number;
  showCharts: boolean;
  setShowCharts: (show: boolean) => void;
  setChartDateRange: (date: Date | string, numDays: number) => void;
  reset: () => void;
}

export const useHabitChartStore = create<HabitChartStore>((set) => ({
  endDate: getTodayDateString(),
  numDays: 365,
  showCharts: false,
  setShowCharts: (show: boolean) => {
    set({
      showCharts: show,
    });
  },
  setChartDateRange: (date, numDays) => {
    const endDate = date instanceof Date ? formatLocalDate(date) : date;

    set({
      endDate,
      numDays,
    });
  },
  reset: () => {
    set({
      endDate: getTodayDateString(),
      numDays: 365,
      showCharts: false,
    });
  },
}));
