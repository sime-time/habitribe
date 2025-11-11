import { ScrollView, Text, type TextStyle, View } from "react-native";
import { createColorStyles } from "@/assets/styles/color.styles";
import { spacing } from "@/assets/styles/token.styles";
import { s } from "@/assets/styles/utility.styles";
import useTheme from "@/hooks/useTheme";
import type { Activity } from "@/types/HabitTypes";
import {
  calculateIntensity,
  generateFullActivityRange,
  getColorFromIntensity,
  groupActivityIntoWeeks,
} from "@/utils/chartHelper";

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface HabitHeatmap {
  maxValue: number;
  data: Activity[];
  endDate: string;
  numDays: number;
  squareSize?: number;
  gutterSize?: number;
  color?: string;
  scrollRef?: React.RefObject<ScrollView | null>;
}

/**
 * GitHub-style contribution heatmap
 *
 * Displays activity data as a grid of colored squares, where each square
 * represents a day. Color intensity indicates activity level.
 *
 * Features:
 * - Horizontal scrolling for date ranges
 * - Fixed weekday labels on the left
 * - Responsive to custom accent colors
 * - Dark/light theme support
 */
export default function HabitHeatmap({
  maxValue,
  data,
  endDate,
  numDays,
  squareSize = spacing[3],
  gutterSize = spacing[1],
  color,
  scrollRef,
}: HabitHeatmap) {
  const { colors } = useTheme();
  const c = createColorStyles(colors);
  const accentColor = color || colors.primary;

  const fullActivity = generateFullActivityRange(endDate, numDays, data);

  const weekData = groupActivityIntoWeeks(fullActivity);

  return (
    <View style={[s.flexCol, s.gap2, s.pr2]}>
      {/* Main row: static labels + scrollable grid */}
      <View style={[s.flexRow, s.gap2]}>
        {/* Static weekday labels column (left side, never scrolls) */}
        <View style={[s.flexCol, s.justifyEvenly, s.gap1]}>
          {WEEKDAY_LABELS.map((day) => (
            <Text
              key={day}
              style={
                [
                  c.textMuted,
                  s.text2xs,
                  s.textRight,
                  s.fontMedium,
                  { height: squareSize },
                ] as TextStyle[]
              }
            >
              {["Mon", "Wed", "Fri", "Sun"].includes(day) ? day : ""}
            </Text>
          ))}
        </View>

        {/* Scrollable heatmap grid */}
        <ScrollView
          ref={scrollRef}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
        >
          <View>
            {/* Grid container */}
            <View style={[s.flexRow, { gap: gutterSize }]}>
              {weekData.map((activities, weekIndex) => (
                <View key={weekIndex} style={[s.flexCol, { gap: gutterSize }]}>
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
                          s.roundedSm,
                          {
                            backgroundColor: cellColor,
                            width: squareSize,
                            height: squareSize,
                          },
                        ]}
                        accessible={true}
                        accessibilityLabel={`${activity.date}: ${activity.value} activities`}
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
}
