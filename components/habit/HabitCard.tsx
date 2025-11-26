import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import type { ReactNode } from "react";
import { Alert, Pressable, Text, TouchableOpacity, View } from "react-native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { createColorStyles } from "@/assets/styles/color.styles";
import { s } from "@/assets/styles/utility.styles";
import Emoji from "@/components/Emoji";
import HabitCheckbox from "@/components/habit/HabitCheckbox";
import { api } from "@/convex/_generated/api";
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

  const deleteHabit = useMutation(api.exec.delete.deleteHabit);

  const handleDelete = async () => {
    Alert.alert("Delete Habit", "This will remove all habit progress.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteHabit({ id: habit._id });
          } catch (err) {
            console.error(err);
          }
        },
      },
    ]);
  };

  const ICON_SIZE = 28;
  const renderActions = () => (
    <View style={[s.flexRow, s.gap3, s.ml3, s.itemsCenter]}>
      {proofMethodType === "camera" && (
        <TouchableOpacity
          style={[c.bgWarning, s.p2, s.roundedMd]}
          onPress={() => {
            if (entry) {
              router.navigate(
                `/calendar?habitId=${habit._id}&entryId=${entry._id}`,
              );
            }
          }}
        >
          <SymbolView
            name="calendar"
            size={ICON_SIZE}
            tintColor={colors.background}
            fallback={
              <Ionicons
                name="calendar"
                size={ICON_SIZE}
                color={colors.background}
              />
            }
          />
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={[c.bgPrimary, s.p2, s.roundedMd]}
        onPress={() => {
          router.navigate(`/habit/form?id=${habit._id}`);
        }}
      >
        <Ionicons name="pencil" size={ICON_SIZE} color={colors.background} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[c.bgDestructive, s.p2, s.roundedMd]}
        onPress={handleDelete}
      >
        <Ionicons name="trash" size={ICON_SIZE} color={colors.background} />
      </TouchableOpacity>
    </View>
  );

  return (
    <Swipeable renderRightActions={renderActions} containerStyle={s.mb4}>
      <View
        style={[
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
          <Pressable style={[s.flexRow, s.itemsCenter, s.gap3]}>
            <View
              style={[
                s.p2,
                s.roundedMd,
                s.itemsCenter,
                s.justifyCenter,
                { backgroundColor: `${habit.color}30` },
              ]}
            >
              <Emoji name={habit.icon} size={20} />
            </View>
            <View style={[s.flexCol, s.gap1, { maxWidth: "75%" }]}>
              <View style={[s.flexRow, s.gap1, s.itemsCenter]}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={"tail"}
                  style={[s.textBase, s.fontMedium, c.textForeground]}
                >
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
    </Swipeable>
  );
}
