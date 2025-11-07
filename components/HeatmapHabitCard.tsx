// components/HabitHeatmapCard.tsx
import { Text, View } from "react-native";
import { createColorStyles } from "@/assets/styles/color.styles";
import { s } from "@/assets/styles/utility.styles";
import Emoji from "@/components/Emoji";
import HeatmapGrid from "@/components/HeatmapGrid";
import type { Doc } from "@/convex/_generated/dataModel";
import useTheme from "@/hooks/useTheme";
import type { Activity } from "@/validation/HabitSchema";

interface HeatmapHabitCardProps {
  habit: Doc<"habits">;
  activity: Activity[];
  startDate: string;
  endDate: string;
  variant: "daily" | "weekly" | "monthly";
}

export default function HeatmapHabitCard({
  habit,
  activity,
  startDate,
  endDate,
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
          <Emoji iconName={habit.icon} iconColor={habit.color} iconSize={20} />
        </View>
        <View style={[s.flexCol, s.gap1]}>
          <Text style={[s.textBase, s.fontMedium, c.textForeground]}>
            {habit.name}
          </Text>
          <Text style={[s.textXs, c.textMuted]}>Streak: 3, Completed: 47</Text>
        </View>
      </View>

      <HeatmapGrid
        variant={variant}
        startDate={startDate}
        endDate={endDate}
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
