import { useQuery } from "convex/react";
import { useState } from "react";
import { api } from "@/convex/_generated/api";
import { getWeekMonthBounds, getYearBounds } from "@/utils/dateHelper";

export function useHabitActivityView(habitDate: string) {
  const date = new Date(habitDate);
  const weekday = date.getDay();
  const bounds = getWeekMonthBounds(date);
  const { start: yearStart, end: yearEnd } = getYearBounds(date);

  // toggle between current period and heatmap
  const [showHeatmap, setShowHeatmap] = useState(false);

  // current period entries (always loaded, grouped by frequency)
  const currentHabitEntries = useQuery(api.exec.read.getGroupedHabitEntries, {
    date: habitDate,
    weekday,
    bounds,
  });

  // lazy loaded when showHeatmap is true
  const heatmapData = useQuery(
    api.exec.read.getHabitHeatmaps,
    showHeatmap ? { startDate: yearStart, endDate: yearEnd } : "skip",
  );

  return {
    currentHabitEntries,
    heatmapData,
    showHeatmap,
    setShowHeatmap,
  };
}
