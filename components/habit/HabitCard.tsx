import { useMutation } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Camera, Check, X } from "lucide-react-native";
import { Image, type ImageStyle, Pressable, Text, View } from "react-native";
import { createColorStyles } from "@/assets/styles/color.styles";
import { s } from "@/assets/styles/utility.styles";
import Emoji from "@/components/Emoji";
import HabitCheckbox from "@/components/HabitCheckbox";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import useTheme from "@/hooks/useTheme";
import {
  calculateIsCompleted,
  type Frequency,
  getScheduleLabel,
} from "@/utils/habitLabelHelper";

type HabitCardProps = {
  habit: Doc<"habits">;
  // biome-ignore lint/suspicious/noExplicitAny: entry type comes from Convex query
  entry: Doc<"habitEntries"> | null;
  proofMethodType: string;
};

export default function HabitCard({
  habit,
  entry,
  proofMethodType,
}: HabitCardProps) {
  const { colors } = useTheme();
  const c = createColorStyles(colors);

  return (
    <Pressable
      style={[
        s.mb5,
        s.p4,
        s.gap3,
        s.roundedLg,
        c.bgCard,
        c.borderDefault,
        s.border1,
      ]}
      onPress={() => router.navigate(`/habit/form?id=${habit._id}`)}
    >
      {/* Header: Icon + Name + Description */}
      <View style={[s.flexRow, s.justifyBetween, s.itemsCenter]}>
        <View style={[s.flexRow, s.itemsCenter, s.gap3]}>
          <View
            style={[
              s.p3,
              s.roundedLg,
              s.itemsCenter,
              s.justifyCenter,
              { backgroundColor: `${habit.color}30` },
            ]}
          >
            <Emoji iconName={habit.icon} iconColor={habit.color} />
          </View>
          <View style={[s.flexCol, s.gap1]}>
            <Text style={[s.textLg, s.fontMedium, c.textForeground]}>
              {habit.name}
            </Text>
            <Text style={[s.textSm, c.textMuted]}>
              {getScheduleLabel(
                habit.schedule.frequency as Frequency,
                habit.schedule.pattern,
              )}
            </Text>
          </View>
        </View>

        <HabitCheckbox />
      </View>
    </Pressable>
  );
}
