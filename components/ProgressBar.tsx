import { LinearGradient } from "expo-linear-gradient";
import { Text, type TextStyle, View } from "react-native";
import { createColorStyles } from "@/assets/styles/color.styles";
import { s } from "@/assets/styles/utility.styles";
import useTheme from "@/hooks/useTheme";
import type { HabitWithEntryAndStreak } from "@/types/HabitTypes";

interface ProgressBarProps {
  habitData: HabitWithEntryAndStreak[];
}

export default function ProgressBar({ habitData }: ProgressBarProps) {
  const { colors } = useTheme();
  const c = createColorStyles(colors);

  // calculate total progress by summing all entry progress
  const totalProgress = habitData.reduce((sum, data) => {
    return sum + (data.entry?.progress || 0);
  }, 0);

  // calculate total required by summing all habit targets
  const totalRequired = habitData.reduce((sum, data) => {
    const target: number = Array.isArray(data.habit.schedule.pattern)
      ? 1
      : Number(data.habit.schedule.pattern);
    return sum + target;
  }, 0);

  const progressPercentage =
    totalRequired > 0 ? (totalProgress / totalRequired) * 100 : 0;

  return (
    <View style={[s.flexRow, s.itemsCenter, s.mt1]}>
      <View style={[s.flex1, s.h2, s.rounded, s.overflowHidden, c.bgBorder]}>
        <LinearGradient
          colors={colors.gradients.success}
          style={[s.hFull, s.rounded, { width: `${progressPercentage}%` }]}
        />
      </View>
      <Text
        style={[s.textSm, s.textRight, c.textSuccess, s.w12] as TextStyle[]}
      >
        {Math.round(progressPercentage)}%
      </Text>
    </View>
  );
}
