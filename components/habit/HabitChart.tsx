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
import HabitHeatmap from "@/components/habit/HabitHeatmap";
import useTheme from "@/hooks/useTheme";
import { useHabitChartStore } from "@/stores/habitChartStore";
import type { Activity } from "@/types/HabitTypes";
import {
  aggregateWeekValues,
  generateFullActivityRange,
  generateMonthRange,
  groupActivityIntoWeeks,
} from "@/utils/chartHelper";
import { calculateStartDateFromNumDays } from "@/utils/dateHelper";

interface HabitChartProps {
  variant: "daily" | "weekly" | "monthly";
  maxValue: number;
  activity: Activity[];
  squareSize?: number;
  gutterSize?: number;
  color?: string;
}

export default function HabitChart({
  variant = "daily",
  maxValue,
  activity,
  squareSize = spacing[3],
  gutterSize = spacing[1],
  color,
}: HabitChartProps) {
  const { colors } = useTheme();
  const c = createColorStyles(colors);
  const scrollViewRef = useRef<ScrollView>(null);
  const accentColor = color || colors.primary;

  const numDays = useHabitChartStore((state) => state.numDays);
  const endDate = useHabitChartStore((state) => state.endDate);
  const startDate = calculateStartDateFromNumDays(endDate, numDays);

  /* Daily variant (heatmap grid) */
  const renderDailyVariant = () => (
    <View>
      <HabitHeatmap
        data={activity}
        maxValue={maxValue}
        endDate={endDate}
        numDays={numDays}
        color={accentColor}
        scrollRef={scrollViewRef}
      />
    </View>
  );

  /* Weekly variant (bar chart) */
  const renderWeeklyVariant = () => {
    const fullActivity = generateFullActivityRange(endDate, numDays, activity);
    const weeks = groupActivityIntoWeeks(fullActivity);
    const valuePerWeek = aggregateWeekValues(weeks);

    return (
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
          yAxisLabelContainerStyle={maxValue < 11 ? [s.w3, s.opacity50] : null}
          yAxisTextStyle={[s.text2xs, c.textForeground]}
          yAxisLabelWidth={0}
          formatYLabel={(label) => Math.round(Number(label)).toString()}
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
  };

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
              data={chart.pieData || []}
              donut={true}
              radius={spacing[11]}
              innerRadius={spacing[8]}
              innerCircleColor={colors.card}
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

  // useEffect required: auto-scroll to the end of the chart (most recent day)
  // if you call `scrollToEnd()` before React Native has rendered/measured the ScrollView content,
  // it won't know how far to scroll.
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: false });
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // render the correct chart
  switch (variant) {
    case "daily":
      return renderDailyVariant();
    case "weekly":
      return renderWeeklyVariant();
    case "monthly":
      return renderMonthlyVariant();
  }
}
