import { useMutation } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Check } from "lucide-react-native";
import { memo, useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { createColorStyles } from "@/assets/styles/color.styles";
import { spacing } from "@/assets/styles/token.styles";
import { s } from "@/assets/styles/utility.styles";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import useTheme from "@/hooks/useTheme";
import { isComplete } from "@/utils/habitLabelHelper";

type HabitCheckboxProps = {
  habit: Doc<"habits">;
  entry: Doc<"habitEntries"> | null;
  proofMethodType?: string;
};

function HabitCheckbox({ habit, entry, proofMethodType }: HabitCheckboxProps) {
  const { colors } = useTheme();
  const c = createColorStyles(colors);

  const incrementProgress = useMutation(
    api.exec.update.incrementHabitEntryProgress,
  );
  const resetProgress = useMutation(api.exec.update.resetHabitEntryProgress);

  const pieData = useMemo(() => {
    if (!entry) return [];
    const maxProgress: number = Array.isArray(habit?.schedule.pattern)
      ? habit.schedule.pattern.length
      : habit.schedule.pattern;
    const proportion: number = (entry.progress / maxProgress) * 100;

    return [
      {
        value: proportion,
        color: habit.color,
      },
      {
        value: 100 - proportion,
        color: `${colors.border}80`,
      },
    ];
  }, [entry, habit.schedule.pattern, habit.color, colors.border]);

  const handlePress = () => {
    if (!entry) return;
    if (proofMethodType === "camera") {
      return router.navigate(`/proof/select?entryId=${entry._id}`);
    }

    if (isComplete(entry.progress, habit)) {
      resetProgress({ id: entry._id });
    } else {
      incrementProgress({ id: entry._id });
    }
  };

  return (
    <Pressable onPress={handlePress}>
      <LinearGradient
        colors={
          isComplete(entry?.progress, habit)
            ? colors.gradients.success
            : colors.gradients.muted
        }
        style={[
          s.roundedFull,
          s.outline1,
          c.outlineDefault,
          s.itemsCenter,
          s.justifyCenter,
        ]}
      >
        {/* Pie Chart is pressable so remove pointerEvents from it */}
        {/* Show checkmark if there is no progress or habit is complete */}
        {entry?.progress === 0 || isComplete(entry?.progress, habit) ? (
          <View style={s.m2}>
            <Check size={20} color={colors.card} />
          </View>
        ) : (
          <View pointerEvents="none">
            <PieChart
              data={pieData || []}
              donut={true}
              radius={18}
              innerRadius={spacing[3]}
              innerCircleColor={colors.card}
              centerLabelComponent={() => (
                <Text style={[c.textForeground, s.textSm, s.fontSemibold]}>
                  {entry?.progress ?? 0}
                </Text>
              )}
            />
          </View>
        )}
      </LinearGradient>
    </Pressable>
  );
}

export default memo(HabitCheckbox);
