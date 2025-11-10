// components/HabitHeatmapCard.tsx
import { Text, View } from "react-native";
import { createColorStyles } from "@/assets/styles/color.styles";
import { s } from "@/assets/styles/utility.styles";
import Emoji from "@/components/Emoji";
import HeatmapChart from "@/components/HeatmapChart";
import type { Doc } from "@/convex/_generated/dataModel";
import useTheme from "@/hooks/useTheme";
import type { Activity } from "@/validation/HabitSchema";
import HabitCheckbox from "./HabitCheckbox";

interface HeatmapHabitCardProps {
  habit: Doc<"habits">;
  activity: Activity[];
  endDate: string;
  numDays: number;
  variant: "daily" | "weekly" | "monthly";
}

export default function HeatmapHabitCard({
  habit,
  activity,
  endDate,
  numDays,
  variant,
}: HeatmapHabitCardProps) {
  const { colors } = useTheme();
  const c = createColorStyles(colors);

  return (
    <View
      style={[
        s.mb5,
        s.p4,
        s.gap3,
        s.roundedLg,
        c.bgCard,
        c.borderDefault,
        s.border1,
      ]}
    >
      {/* Header: Icon + Name + Streak */}
      <View style={[s.flexRow, s.justifyBetween, s.itemsCenter]}>
        <View style={[s.flexRow, s.itemsCenter, s.gap3]}>
          <View
            style={[
              s.p2,
              s.roundedMd,
              s.itemsCenter,
              s.justifyCenter,
              { backgroundColor: `${habit.color}30` },
            ]}
          >
            <Emoji
              iconName={habit.icon}
              iconColor={habit.color}
              iconSize={20}
            />
          </View>
          <View style={[s.flexCol, s.gap1]}>
            <Text style={[s.textBase, s.fontMedium, c.textForeground]}>
              {habit.name}
            </Text>
            <Text style={[s.textXs, c.textMuted]}>
              Streak: 3, Completed: 47
            </Text>
          </View>
        </View>

        <HabitCheckbox />
      </View>

      <HeatmapChart
        variant={variant}
        endDate={endDate}
        numDays={numDays}
        activity={activity}
        maxValue={
          Array.isArray(habit.schedule.pattern)
            ? habit.schedule.pattern.length
            : Number(habit.schedule.pattern)
        }
        color={habit.color}
      />
    </View>
  );
}
