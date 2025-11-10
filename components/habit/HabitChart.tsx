// take a date range and activity data,
// then display activity visualizations in different variants:
// - daily: GitHub-style heatmap where each square represents a day
// - weekly: bar chart showing weekly totals
// - monthly: donut charts showing monthly progress

import { useEffect, useRef } from "react";
import { ScrollView, Text, View } from "react-native";
import { BarChart, PieChart } from "react-native-gifted-charts";
import { createColorStyles } from "@/assets/styles/color.styles";
import { borderRadius, spacing } from "@/assets/styles/token.styles";
import { s } from "@/assets/styles/utility.styles";
import HabitHeatmap from "@/components/HabitHeatmap";
import useTheme from "@/hooks/useTheme";
import { calculateStartDateFromNumDays } from "@/utils/dateHelper";
import {
  aggregateWeekValues,
  generateFullActivityRange,
  generateMonthRange,
  groupActivityIntoWeeks,
} from "@/utils/heatmapHelper";
import type { Activity } from "@/validation/HabitSchema";

interface HabitChartProps {
  variant: "daily" | "weekly" | "monthly";
  maxValue: number;
  activity: Activity[];
  endDate: string;
  numDays: number;
  squareSize?: number;
  gutterSize?: number;
  color?: string;
}

export default function HabitChart({
  variant = "daily",
  maxValue,
  activity,
  endDate,
  numDays,
  squareSize = spacing[3],
  gutterSize = spacing[1],
  color,
}: HabitChartProps) {
  const { colors } = useTheme();
  const c = createColorStyles(colors);
  const scrollViewRef = useRef<ScrollView>(null);

  const startDate = calculateStartDateFromNumDays(endDate, numDays);
  const fullActivity = generateFullActivityRange(startDate, endDate, activity);
  const weeks = groupActivityIntoWeeks(fullActivity);
  const valuePerWeek = aggregateWeekValues(weeks);
  const accentColor = color || colors.primary;

  /* Daily variant (heatmap grid) */
  const renderDailyVariant = () => (
    <ScrollView
      ref={scrollViewRef}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
    >
      <HabitHeatmap
        data={activity}
        maxValue={maxValue}
        endDate={endDate}
        numDays={numDays}
        color={accentColor}
      />
    </ScrollView>
  );

  /* Weekly variant (bar chart) */
  const renderWeeklyVariant = () => (
    <View style={[s.overflowHidden]}>
      <BarChart
        scrollRef={scrollViewRef}
        data={valuePerWeek}
        maxValue={maxValue}
        stepValue={1}
        height={spacing[28]}
        xAxisLabelsHeight={0}
        xAxisThickness={1}
        xAxisColor={`${colors.border}`}
        yAxisThickness={1}
        yAxisColor={`${colors.border}`}
        yAxisLabelContainerStyle={[s.w3, s.opacity50]}
        yAxisTextStyle={[s.text2xs, c.textForeground]}
        yAxisLabelWidth={0}
        hideYAxisText={false}
        rulesType="solid"
        rulesThickness={1}
        rulesColor={`${colors.border}`}
        barBorderRadius={borderRadius.sm}
        barWidth={squareSize}
        frontColor={accentColor}
        initialSpacing={0}
        endSpacing={0}
        spacing={gutterSize}
      />
    </View>
  );

  /* Monthly variant (donut charts) */
  const renderMonthlyVariant = () => {
    const months = generateMonthRange(startDate, endDate);
    const activityMap = new Map<string, number>(
      activity.map((act) => [act.date.slice(0, 7), act.value]),
    );

    const pieCharts = months.map((month, index) => {
      const progressValue: number = activityMap.get(month) || 0;
      const proportion: number = (progressValue / maxValue) * 100;

      const pieData = [
        {
          value: proportion,
          color: accentColor,
        },
        {
          value: 100 - proportion,
          color: `${colors.border}80`,
        },
      ];

      return {
        month,
        pieData,
        isFirstMonth: index === 0,
        isEmpty: progressValue === 0,
      };
    });

    // skip the first month if it's empty
    const charts = pieCharts.filter(
      (chart) => !(chart.isFirstMonth && chart.isEmpty),
    );

    return (
      <ScrollView
        ref={scrollViewRef}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      >
        <View style={[s.flexRow, s.gap4]}>
          {charts.map((chart, index) => (
            <PieChart
              key={index}
              data={chart.pieData}
              donut={true}
              radius={spacing[11]}
              innerRadius={spacing[8]}
              centerLabelComponent={() => (
                <Text style={[c.textForeground, s.textSm, s.fontSemibold]}>
                  {new Date(`${chart.month}-02`).toLocaleDateString("en-US", {
                    month: "short",
                  })}
                </Text>
              )}
            />
          ))}
        </View>
      </ScrollView>
    );
  };

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
    case "monthly":
      return renderMonthlyVariant();
  }
}
