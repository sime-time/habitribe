// take a date range and activity data,
// then display a GitHub-style heatmap
// where each small square represents a day,
// colored by intensity of activity.

import { useEffect, useRef } from "react";
import { ScrollView, Text, type TextStyle, View } from "react-native";
import { createColorStyles } from "@/assets/styles/color.styles";
import { s } from "@/assets/styles/utility.styles";
import useTheme from "@/hooks/useTheme";
import {
  aggregateWeekActivity,
  calculateIntensity,
  generateDateRange,
  getColorFromIntensity,
  getMaxActivityValue,
  groupDatesIntoWeeks,
} from "@/utils/heatmapHelper";

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface HeatmapCalendarProps {
  variant: "daily" | "weekly" | "monthly";
  startDate: string; // YYYY-MM-DD
  endDate: string; // This must be a monday or it won't work
  activity: { date: string; progress: number }[];
  color?: string;
}

export default function HeatmapGrid({
  variant = "daily",
  startDate,
  endDate,
  activity,
  color,
}: HeatmapCalendarProps) {
  const { colors } = useTheme();
  const c = createColorStyles(colors);
  const scrollViewRef = useRef<ScrollView>(null);

  const dateRange = generateDateRange(startDate, endDate);
  const weeks = groupDatesIntoWeeks(dateRange);
  const maxValue = getMaxActivityValue(activity);
  const accentColor = color || colors.primary;

  /* Daily heatmap variant (grid chart) */
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
              {weeks.map((week, weekIndex) => (
                <View key={weekIndex} style={[s.flexCol, s.gap1]}>
                  {week.map((day, dayIndex) => {
                    const progressValue =
                      activity.find((item) => item.date === day)?.progress || 0;
                    const intensity = calculateIntensity(
                      progressValue,
                      maxValue,
                    );
                    const cellColor = getColorFromIntensity(
                      intensity,
                      accentColor,
                      colors.border,
                    );
                    return (
                      <View
                        key={dayIndex}
                        style={[
                          s.h3,
                          s.w3,
                          s.roundedSm,
                          { backgroundColor: cellColor },
                        ]}
                      ></View>
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

  /* Weekly heatmap variant (vertical bars) */
  const renderWeeklyVariant = () => (
    <View style={[s.flexCol, s.gap1]}>
      <ScrollView
        ref={scrollViewRef}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      >
        <View style={[s.flexRow, s.gap2]}>
          {weeks.map((week, weekIndex) => {
            const weekActivity = aggregateWeekActivity(activity, week);
            const intensity = calculateIntensity(weekActivity, maxValue);
            const barColor = getColorFromIntensity(
              intensity,
              accentColor,
              colors.border,
            );
            return (
              <View
                key={weekIndex}
                style={[
                  s.h12,
                  { width: 8 },
                  s.roundedSm,
                  { backgroundColor: barColor },
                ]}
              />
            );
          })}
        </View>
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

  return variant === "daily" ? renderDailyVariant() : renderWeeklyVariant();
}
