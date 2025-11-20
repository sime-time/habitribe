import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import { createColorStyles } from "@/assets/styles/color.styles";
import { s } from "@/assets/styles/utility.styles";
import Emoji from "@/components/Emoji";
import HabitCheckbox from "@/components/habit/HabitCheckbox";
import type { Doc } from "@/convex/_generated/dataModel";
import useTheme from "@/hooks/useTheme";
import { type Frequency, getScheduleLabel } from "@/utils/habitLabelHelper";

interface HabitCardProps {
  habit: Doc<"habits">;
  entry: Doc<"habitEntries"> | null;
  streak: Doc<"streaks"> | null;
  proofMethodType: string;
  children?: ReactNode;
}

export default function HabitCard({
  habit,
  entry,
  streak,
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
        <Pressable
          onPress={() => router.navigate(`/calendar?habitId=${habit._id}`)}
          style={[s.flexRow, s.itemsCenter, s.gap3]}
        >
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
            <View style={[s.flexRow, s.gap1, s.itemsCenter]}>
              <Text style={[s.textBase, s.fontMedium, c.textForeground]}>
                {habit.name}
              </Text>
              {streak && streak.length > 1 && (
                <View style={[s.flexRow, s.itemsCenter]}>
                  <Ionicons
                    name="flame-outline"
                    size={16}
                    color={habit.color}
                  />
                  <Text
                    style={[s.textSm, s.fontNormal, { color: habit.color }]}
                  >
                    {streak.length}
                  </Text>
                </View>
              )}
            </View>

            <Text style={[s.textXs, c.textMuted]}>
              {getScheduleLabel(
                habit.schedule.frequency as Frequency,
                habit.schedule.pattern,
              )}
            </Text>
          </View>
        </Pressable>

        <HabitCheckbox
          habit={habit}
          entry={entry}
          proofMethodType={proofMethodType}
        />
      </View>

      {children}
    </View>
  );
}
