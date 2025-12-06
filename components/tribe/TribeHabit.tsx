import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { createColorStyles } from "@/assets/styles/color.styles";
import { s } from "@/assets/styles/utility.styles";
import Emoji from "@/components/Emoji";
import useTheme from "@/hooks/useTheme";
import { useTribeStore } from "@/stores/tribeStore";
import { type Frequency, getScheduleLabel } from "@/utils/habitLabelHelper";
import type { HabitFormData } from "@/validation/HabitFormSchema";

export default function TribeHabit({
  index,
  habit,
}: {
  index: number;
  habit: HabitFormData;
}) {
  const { colors } = useTheme();
  const c = createColorStyles(colors);

  const deleteHabit = useTribeStore((state) => state.removeHabit);

  const ICON_SIZE = 28;
  const renderActions = () => (
    <View style={[s.flexRow, s.gap3, s.ml3, s.itemsCenter]}>
      <TouchableOpacity
        style={[c.bgDestructive, s.p2, s.roundedMd]}
        onPress={() => deleteHabit(index)}
      >
        <Ionicons name="trash" size={ICON_SIZE} color={colors.background} />
      </TouchableOpacity>
    </View>
  );

  return (
    <Swipeable renderRightActions={renderActions} containerStyle={s.mb3}>
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
        {/* Header: Icon + Name + Description */}
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
              </View>

              <Text style={[s.textXs, c.textMuted]}>
                {getScheduleLabel(
                  habit.schedule.frequency as Frequency,
                  habit.schedule.pattern,
                )}
              </Text>
            </View>
          </Pressable>
        </View>
      </View>
    </Swipeable>
  );
}
