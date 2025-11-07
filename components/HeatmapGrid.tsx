// take a date range and activity data,
// then display a GitHub-style heatmap
// where each small square represents a day,
// colored by intensity of activity.

import { useEffect, useRef } from "react";
import { ScrollView, Text, type TextStyle, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { createColorStyles } from "@/assets/styles/color.styles";
import { s } from "@/assets/styles/utility.styles";
import useTheme from "@/hooks/useTheme";
import {
  aggregateWeekValues,
  calculateIntensity,
  generateFullActivityRange,
  getColorFromIntensity,
  groupActivityIntoWeeks,
} from "@/utils/heatmapHelper";
import type { Activity } from "@/validation/HabitSchema";

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface HeatmapGridProps {
  variant: "daily" | "weekly" | "monthly";
  maxValue: number;
  activity: Activity[];
  startDate: string;
  endDate: string;
  color?: string;
}

export default function HeatmapGrid({
  variant = "daily",
  maxValue,
  activity,
  startDate,
  endDate,
  color,
}: HeatmapGridProps) {
  const { colors } = useTheme();
  const c = createColorStyles(colors);
  const scrollViewRef = useRef<ScrollView>(null);

  const fullActivity = generateFullActivityRange(startDate, endDate, activity);
  if (variant === "daily") {
    console.log("full activity", fullActivity);
  }
  const weeks = groupActivityIntoWeeks(fullActivity);
  const valuePerWeek = aggregateWeekValues(weeks);
  const accentColor = color || colors.primary;

  /* Daily variant (heatmap grid) */
  const renderDailyVariant = () => (
    <View style={[s.flexCol, s.gap1]}>
      {/* Main row: static labels + scrollable content */}
      <View style={[s.flexRow, s.gap2]}>
        {/* Static weekday labels column (left side, never scrolls) */}
        <View style={[s.flexCol, s.justifyEvenly, s.gap1]}>
          {WEEKDAY_LABELS.map((day) => (
            <Text
              key={day}
              style={
                [
                  c.textForeground,
                  s.opacity50,
                  s.h3,
                  s.text2xs,
                  s.textRight,
                ] as TextStyle[]
              }
            >
              {["Mon", "Wed", "Fri", "Sun"].includes(day) ? day : ""}
            </Text>
          ))}
        </View>

        <ScrollView
          ref={scrollViewRef}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
          <View style={[s.flexCol, s.gap1]}>
            {/* Heatmap grid */}
            <View style={[s.flexRow, s.gap1]}>
              {weeks.map((activities, weekIndex) => (
                <View key={weekIndex} style={[s.flexCol, s.gap1]}>
                  {activities.map((activity, activityIndex) => {
                    const intensity = calculateIntensity(
                      activity.value,
                      maxValue,
                    );
                    const cellColor = getColorFromIntensity(
                      intensity,
                      accentColor,
                      colors.border,
                    );
                    return (
                      <View
                        key={activityIndex}
                        style={[
                          s.h3,
                          s.w3,
                          s.roundedSm,
                          { backgroundColor: cellColor },
                        ]}
                      />
                    );
                  })}
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );

  /* Weekly variant (bar chart) */
  const renderWeeklyVariant = () => (
    <View style={[s.flexCol, s.gap1]}>
      <ScrollView
        ref={scrollViewRef}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      >
        <Text>{maxValue}</Text>
      </ScrollView>
    </View>
  );

  // useEffect required:
  // if you call `scrollToEnd()` before React Native has rendered/measured the ScrollView content,
  // it won't know how far to scroll.
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: false });
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  switch (variant) {
    case "daily":
      return renderDailyVariant();
    case "weekly":
      return renderWeeklyVariant();
  }
}
