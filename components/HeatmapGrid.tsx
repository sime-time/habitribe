// take a date range and activity data,
// then display a GitHub-style heatmap
// where each small square represents a day,
// colored by intensity of activity.

import { useEffect, useRef } from "react";
import { ScrollView, Text, type TextStyle, View } from "react-native";
import { createColorStyles } from "@/assets/styles/color.styles";
import { s } from "@/assets/styles/utility.styles";
import { iconColors } from "@/constants/colors";
import useTheme from "@/hooks/useTheme";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface HeatmapCalendarProps {
  startDate: string; // YYYY-MM-DD
  endDate: string;
  activity: { date: string; progress: number }[];
  color?: string;
}

export default function HeatmapGrid({
  startDate,
  endDate,
  activity,
  color,
}: HeatmapCalendarProps) {
  const { colors } = useTheme();
  const c = createColorStyles(colors);

  // convert strings to Date objects
  const startingDate = new Date(startDate);
  const endingDate = new Date(endDate);

  // get the difference between ending date and starting date in days
  const daysInMonth =
    Math.ceil(
      (endingDate.getTime() - startingDate.getTime()) / (1000 * 60 * 60 * 24),
    ) + 1; // add 1 to include the ending date

  // create each date in between starting and ending dates
  const calendarGrid = Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(startingDate);
    date.setDate(startingDate.getDate() + i);
    return date.toISOString().slice(0, 10); // YYYY-MM-DD
  });

  // intensity of color depends on highest progress in time period
  const maxValue = activity?.reduce(
    (a, b) => Math.max(a, b.progress),
    -Infinity,
  );

  const getIntensity = (value: number) => {
    if (maxValue !== value) {
      return Number(value / maxValue);
    } else {
      return value;
    }
  };

  const getColorFromIntensity = (intensity: number) => {
    const hex = color ? color : iconColors[0];
    const colorShades = [
      colors.border,
      `${hex}20`,
      `${hex}60`,
      `${hex}80`,
      `${hex}FF`,
    ];

    const index = Math.min(
      Math.floor(intensity * colorShades.length),
      colorShades.length - 1,
    );

    return colorShades[index];
  };

  // group calendar grid into weeks (7 items per week = 1 column)
  const weeks: string[][] = [];
  for (let i = 0; i < calendarGrid.length; i += 7) {
    weeks.push(calendarGrid.slice(i, i + 7));
  }

  // useEffect: if you call `scrollToEnd()` before React Native has measured and laid out the ScrollView content, it won't know how far to scroll.
  // scroll to the end after a small delay to allow layout to complete
  const scrollViewRef = useRef<ScrollView>(null);
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: false });
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return (
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
              {["Mon", "Wed", "Fri"].includes(day) ? day : ""}
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
                    const intensity = getIntensity(progressValue);
                    const color = getColorFromIntensity(intensity);
                    return (
                      <View
                        key={dayIndex}
                        style={[
                          s.h3,
                          s.w3,
                          s.roundedSm,
                          { backgroundColor: color },
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
}
