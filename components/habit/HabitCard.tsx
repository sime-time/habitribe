import type { ReactNode } from "react";
import { Text, View } from "react-native";
import { createColorStyles } from "@/assets/styles/color.styles";
import { s } from "@/assets/styles/utility.styles";
import Emoji from "@/components/Emoji";
import type { Doc } from "@/convex/_generated/dataModel";
import useTheme from "@/hooks/useTheme";
import { type Frequency, getScheduleLabel } from "@/utils/habitLabelHelper";
import HabitCheckbox from "./HabitCheckbox";

interface HabitCardProps {
  habit: Doc<"habits">;
  entry: Doc<"habitEntries"> | null;
  proofMethodType: string;
  children?: ReactNode;
}

export default function HabitCard({
  habit,
  entry,
  proofMethodType,
  children,
}: HabitCardProps) {
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
      {/* Header: Icon + Name + Streak/Description */}
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
              {getScheduleLabel(
                habit.schedule.frequency as Frequency,
                habit.schedule.pattern,
              )}
            </Text>
          </View>
        </View>

        <HabitCheckbox entry={entry} proofMethodType={proofMethodType} />
      </View>

      {children}
    </View>
  );
}
