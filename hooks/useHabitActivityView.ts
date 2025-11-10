import { useQuery } from "convex/react";
import { useState } from "react";
import { api } from "@/convex/_generated/api";
import {
  calculateStartDateFromNumDays,
  getWeekMonthBounds,
} from "@/utils/dateHelper";

export function useHabitActivityView(habitDate: string) {
  const date = new Date(habitDate);
  const weekday = date.getDay();
  const bounds = getWeekMonthBounds(date);

  // toggle between current period and heatmap
  const [showHeatmap, setShowHeatmap] = useState(false);

  // current period entries (always loaded, grouped by frequency)
  const currentHabitEntries = useQuery(api.exec.read.getGroupedHabitEntries, {
    date: habitDate,
    weekday,
    bounds,
  });

  // calculate startDate from number of days
  const startDate = calculateStartDateFromNumDays(habitDate, 365);

  // lazy loaded when showHeatmap is true
  const heatmapData = useQuery(
    api.exec.read.getHabitEntryActivity,
    showHeatmap ? { startDate, endDate: habitDate } : "skip",
  );

  return {
    currentHabitEntries,
    heatmapData,
    showHeatmap,
    setShowHeatmap,
  };
}
