/**
 * @fileoverview Usage examples for the ActivityHeatmap component.
 * Shows different configurations and integration patterns.
 *
 * These are examples only - not meant to be used directly.
 */

import React, { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { createColorStyles } from "@/assets/styles/color.styles";
import { s } from "@/assets/styles/utility.styles";
import useTheme from "@/hooks/useTheme";
import ActivityHeatmap from "./ActivityHeatmap";
import type { HeatmapDataPoint } from "./types";

// ============================================
// EXAMPLE 1: Basic Habit Completion Heatmap
// ============================================

export function BasicHabitHeatmap() {
  const { colors } = useTheme();
  const c = createColorStyles(colors);

  // Generate sample data: random habit completions for last 365 days
  const data = useMemo(() => {
    const result: HeatmapDataPoint[] = [];
    const endDate = new Date();

    for (let i = 365; i > 0; i--) {
      const date = new Date(endDate);
      date.setDate(date.getDate() - i);

      result.push({
        date: date.toISOString().split("T")[0], // "YYYY-MM-DD" format
        value: Math.random() < 0.3 ? 0 : Math.floor(Math.random() * 5) + 1,
      });
    }

    return result;
  }, []);

  return (
    <View style={[s.p4, c.bgBackground]}>
      <ActivityHeatmap
        data={data}
        endDate={new Date()}
        numDays={365}
        width={350}
        height={150}
        gutterSize={2}
        squareSize={16}
        tooltipDataAttrs={(value) => ({
          fill: !value || value.value === 0 ? colors.muted : colors.primary,
          fillOpacity: value && value.value > 0 ? 0.7 : 0.2,
        })}
        titleForValue={(value) => {
          if (!value) return "No activity";
          const date = new Date(value.date);
          const dateStr = date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          });
          return `${dateStr}: ${value.value} completions`;
        }}
      />
    </View>
  );
}

// ============================================
// EXAMPLE 2: Intensity Gradient Heatmap
// ============================================

export function IntensityGradientHeatmap() {
  // Color palette: white to dark green
  const colorPalette = [
    "#f3f4f6", // empty
    "#d1fae5", // light
    "#6ee7b7", // medium-light
    "#10b981", // medium
    "#059669", // dark
  ];

  const data = useMemo(() => {
    const result: HeatmapDataPoint[] = [];
    const endDate = new Date();

    for (let i = 365; i > 0; i--) {
      const date = new Date(endDate);
      date.setDate(date.getDate() - i);

      // Higher value on weekends (arbitrary logic for demo)
      const isWeekend = [0, 6].includes(date.getDay());
      const count = isWeekend
        ? Math.floor(Math.random() * 8) + 3
        : Math.floor(Math.random() * 5);

      result.push({
        date: date.toISOString().split("T")[0],
        value: count,
      });
    }

    return result;
  }, []);

  return (
    <View style={s.p4}>
      <ActivityHeatmap
        data={data}
        endDate={new Date()}
        numDays={365}
        width={350}
        height={150}
        tooltipDataAttrs={(value) => {
          const count = value?.value ?? 0;
          // Map count (0-10) to color palette
          const index = Math.min(
            Math.floor((count / 10) * (colorPalette.length - 1)),
            colorPalette.length - 1,
          );

          return {
            fill: colorPalette[index],
          };
        }}
        titleForValue={(value) => {
          if (!value) return "No activity";
          const date = new Date(value.date);
          return `${date.toLocaleDateString()}: ${value.value} units`;
        }}
      />
    </View>
  );
}

// ============================================
// EXAMPLE 3: Interactive Heatmap with Selection
// ============================================

export function InteractiveHeatmap() {
  const { colors } = useTheme();
  const c = createColorStyles(colors);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const data = useMemo(() => {
    const result: HeatmapDataPoint[] = [];
    const endDate = new Date();

    for (let i = 365; i > 0; i--) {
      const date = new Date(endDate);
      date.setDate(date.getDate() - i);

      result.push({
        date: date.toISOString().split("T")[0],
        value: Math.random() < 0.4 ? 0 : Math.floor(Math.random() * 3) + 1,
      });
    }

    return result;
  }, []);

  const handleDayPress = (dataPoint: HeatmapDataPoint) => {
    setSelectedDate(dataPoint.date as string);
  };

  return (
    <View style={[s.gap4, s.p4]}>
      <ActivityHeatmap
        data={data}
        endDate={new Date()}
        numDays={365}
        width={350}
        height={150}
        tooltipDataAttrs={(value) => {
          const isSelected = selectedDate === (value?.date as string | null);

          return {
            fill: !value || value.value === 0 ? colors.muted : colors.primary,
            stroke: isSelected ? colors.foreground : "transparent",
            strokeWidth: isSelected ? 2 : 0,
          };
        }}
        onDayPress={handleDayPress}
      />

      {selectedDate && (
        <View style={[s.p3, s.roundedMd, c.bgCard, s.border1, c.borderDefault]}>
          <View style={[s.textBase, s.fontMedium, c.textForeground]}>
            Selected: {selectedDate}
          </View>
        </View>
      )}
    </View>
  );
}

// ============================================
// EXAMPLE 4: Vertical Layout
// ============================================

export function VerticalLayoutHeatmap() {
  const { colors } = useTheme();

  const data = useMemo(() => {
    const result: HeatmapDataPoint[] = [];
    const endDate = new Date();

    for (let i = 90; i > 0; i--) {
      // Just 90 days for vertical view
      const date = new Date(endDate);
      date.setDate(date.getDate() - i);

      result.push({
        date: date.toISOString().split("T")[0],
        value: Math.random() < 0.3 ? 0 : Math.floor(Math.random() * 4) + 1,
      });
    }

    return result;
  }, []);

  return (
    <ScrollView style={{ maxHeight: 400 }} showsVerticalScrollIndicator={true}>
      <View style={s.p4}>
        <ActivityHeatmap
          data={data}
          endDate={new Date()}
          numDays={90}
          width={200}
          height={500}
          horizontal={false} // Vertical layout
          gutterSize={1}
          squareSize={18}
          tooltipDataAttrs={(value) => ({
            fill: !value || value.value === 0 ? colors.muted : colors.primary,
          })}
        />
      </View>
    </ScrollView>
  );
}

// ============================================
// EXAMPLE 5: Multiple Habits Comparison
// ============================================

export function MultipleHabitsComparison() {
  const { colors } = useTheme();
  const c = createColorStyles(colors);

  const habit1Data = useMemo(() => {
    const result: HeatmapDataPoint[] = [];
    const endDate = new Date();

    for (let i = 365; i > 0; i--) {
      const date = new Date(endDate);
      date.setDate(date.getDate() - i);

      result.push({
        date: date.toISOString().split("T")[0],
        value: Math.random() < 0.2 ? 0 : 1,
      });
    }

    return result;
  }, []);

  const habit2Data = useMemo(() => {
    const result: HeatmapDataPoint[] = [];
    const endDate = new Date();

    for (let i = 365; i > 0; i--) {
      const date = new Date(endDate);
      date.setDate(date.getDate() - i);

      result.push({
        date: date.toISOString().split("T")[0],
        value: Math.random() < 0.4 ? 0 : Math.floor(Math.random() * 2) + 1,
      });
    }

    return result;
  }, []);

  const renderHabitHeatmap = (
    title: string,
    data: HeatmapDataPoint[],
    color: string,
  ) => (
    <View style={s.gap2}>
      <View style={[s.textBase, s.fontMedium, c.textForeground]}>{title}</View>
      <ActivityHeatmap
        data={data}
        endDate={new Date()}
        numDays={365}
        width={350}
        height={100}
        squareSize={12}
        gutterSize={1}
        showMonthLabels={false}
        tooltipDataAttrs={(value) => ({
          fill: !value || value.value === 0 ? colors.muted : color,
        })}
      />
    </View>
  );

  return (
    <ScrollView style={[s.flex1, s.p4]}>
      <View style={s.gap6}>
        {renderHabitHeatmap("Morning Exercise", habit1Data, colors.primary)}
        {renderHabitHeatmap(
          "Reading Practice",
          habit2Data,
          colors.success ?? "#10b981",
        )}
      </View>
    </ScrollView>
  );
}

// ============================================
// EXAMPLE 6: Custom Month Labels
// ============================================

export function CustomMonthLabelsHeatmap() {
  const { colors } = useTheme();

  const data = useMemo(() => {
    const result: HeatmapDataPoint[] = [];
    const endDate = new Date();

    for (let i = 365; i > 0; i--) {
      const date = new Date(endDate);
      date.setDate(date.getDate() - i);

      result.push({
        date: date.toISOString().split("T")[0],
        value: Math.random() < 0.3 ? 0 : Math.floor(Math.random() * 5) + 1,
      });
    }

    return result;
  }, []);

  const getMonthLabel = (monthIndex: number): string => {
    const fullNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return fullNames[monthIndex];
  };

  return (
    <View style={s.p4}>
      <ActivityHeatmap
        data={data}
        endDate={new Date()}
        numDays={365}
        width={350}
        height={150}
        showMonthLabels={true}
        getMonthLabel={getMonthLabel}
        tooltipDataAttrs={(value) => ({
          fill: !value || value.value === 0 ? colors.muted : colors.primary,
        })}
      />
    </View>
  );
}

// ============================================
// EXAMPLE 7: Accessibility with Titles
// ============================================

export function AccessibleHeatmap() {
  const { colors } = useTheme();

  const data = useMemo(() => {
    const result: HeatmapDataPoint[] = [];
    const endDate = new Date();

    for (let i = 365; i > 0; i--) {
      const date = new Date(endDate);
      date.setDate(date.getDate() - i);

      result.push({
        date: date.toISOString().split("T")[0],
        value: Math.random() < 0.3 ? 0 : Math.floor(Math.random() * 5) + 1,
      });
    }

    return result;
  }, []);

  return (
    <View style={s.p4}>
      <ActivityHeatmap
        data={data}
        endDate={new Date()}
        numDays={365}
        width={350}
        height={150}
        tooltipDataAttrs={(value) => ({
          fill: !value || value.value === 0 ? colors.muted : colors.primary,
        })}
        titleForValue={(value) => {
          if (!value) return "No activity recorded";

          const date = new Date(value.date);
          const dateStr = date.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          });

          const activityCount = value.value;
          const activityText =
            activityCount === 1
              ? "1 completion"
              : `${activityCount} completions`;

          return `${dateStr}: ${activityText}`;
        }}
      />
    </View>
  );
}

// ============================================
// EXPORT ALL EXAMPLES
// ============================================

export const EXAMPLES = {
  BasicHabitHeatmap,
  IntensityGradientHeatmap,
  InteractiveHeatmap,
  VerticalLayoutHeatmap,
  MultipleHabitsComparison,
  CustomMonthLabelsHeatmap,
  AccessibleHeatmap,
};
