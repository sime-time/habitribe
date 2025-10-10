import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronDown, ChevronUp, Minus, Plus } from "lucide-react-native";
import { useCallback, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  type TextStyle,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createColorStyles } from "@/assets/styles/color.styles";
import { s } from "@/assets/styles/utility.styles";
import { units } from "@/constants/goalUnits";
import { CHECKMARK_SIZE } from "@/constants/sizes";
import useTheme from "@/hooks/useTheme";
import { useHabitFormStore } from "@/stores/habitFormStore";

export default function HabitGoal() {
  const { colors } = useTheme();
  const c = createColorStyles(colors);

  // Habit state
  const updateForm = useHabitFormStore((state) => state.updateForm);

  const goalTarget = useHabitFormStore((state) => state.habitForm.goalTarget);
  const setGoalTarget = (target: number) => updateForm("goalTarget", target);

  const goalUnit = useHabitFormStore((state) => state.habitForm.goalUnit);
  const setGoalUnit = (unit: string) => {
    updateForm("goalUnit", unit.toLowerCase());
  };

  const [showUnits, setShowUnits] = useState(false);
  const toggleShowUnits = useCallback(
    () => setShowUnits(!showUnits),
    [showUnits],
  );

  // Increment/Decrement goal target
  const incrementGoal = () => {
    setGoalTarget(goalTarget + 1);
  };
  const decrementGoal = () => {
    // cannot go lower than 0
    const newGoalTarget = goalTarget - 1;
    if (newGoalTarget >= 0) {
      setGoalTarget(newGoalTarget);
    }
  };

  return (
    <LinearGradient colors={colors.gradients.background} style={s.flex1}>
      <SafeAreaView style={s.flex1}>
        <ScrollView style={s.flex1}>
          <View style={[s.flex1, s.p4]}>
            <View style={[s.flex1, s.gap2]}>
              <Text style={[s.textXs, s.ml2, c.textMuted] as TextStyle[]}>
                TAP THE NUMBER TO TYPE
              </Text>

              <View
                style={[
                  s.flex1,
                  s.px4,
                  c.bgCard,
                  s.roundedMd,
                  s.border1,
                  c.borderDefault,
                ]}
              >
                <View
                  style={[
                    s.flex1,
                    s.flexRow,
                    s.justifyEvenly,
                    s.itemsCenter,
                    s.my4,
                  ]}
                >
                  <TouchableOpacity
                    style={[
                      s.p2,
                      s.justifyCenter,
                      s.itemsCenter,
                      c.bgPrimary,
                      s.roundedSm,
                    ]}
                    onPress={decrementGoal}
                  >
                    <Minus color={colors.card} size={CHECKMARK_SIZE} />
                  </TouchableOpacity>
                  <TextInput
                    value={goalTarget ? String(goalTarget) : undefined}
                    style={
                      [
                        s.flex1,
                        s.textCenter,
                        c.textForeground,
                        s.text4xl,
                        s.fontBold,
                      ] as TextStyle[]
                    }
                    placeholder={"0"}
                    placeholderTextColor={colors.muted}
                    keyboardType="numeric"
                    onChangeText={(text) => {
                      // Only allow whole numbers
                      const numericText = text.replace(/[^0-9]/g, "");
                      const num = Number(numericText);
                      if (!Number.isNaN(num)) {
                        setGoalTarget(num);
                      }
                    }}
                  />
                  <TouchableOpacity
                    style={[
                      s.p2,
                      s.justifyCenter,
                      s.itemsCenter,
                      c.bgPrimary,
                      s.roundedSm,
                    ]}
                    onPress={incrementGoal}
                  >
                    <Plus color={colors.card} size={CHECKMARK_SIZE} />
                  </TouchableOpacity>
                </View>

                <View style={[s.divider, c.bgMuted]} />

                <TouchableOpacity
                  style={[
                    s.flex1,
                    s.flexRow,
                    s.justifyCenter,
                    s.itemsCenter,
                    s.gap2,
                    s.inputHeight,
                  ]}
                  onPress={toggleShowUnits}
                >
                  <Text style={[s.textLg, s.fontSemibold, c.textForeground]}>
                    {goalUnit.toUpperCase()}
                  </Text>
                  <View style={[s.flexRow, s.itemsCenter, s.gap2]}>
                    {showUnits ? (
                      <ChevronUp color={colors.muted} size={CHECKMARK_SIZE} />
                    ) : (
                      <ChevronDown color={colors.muted} size={CHECKMARK_SIZE} />
                    )}
                  </View>
                </TouchableOpacity>
              </View>

              {showUnits && (
                <View
                  style={[
                    s.flex1,
                    s.px4,
                    c.bgCard,
                    s.roundedMd,
                    s.border1,
                    c.borderDefault,
                    s.mt2,
                    s.z10,
                  ]}
                >
                  <FlashList
                    data={units}
                    keyExtractor={(item) => item.value}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={[
                          s.flex1,
                          s.flexRow,
                          s.justifyBetween,
                          s.itemsCenter,
                          s.inputHeight,
                        ]}
                        onPress={() => {
                          setGoalUnit(item.value);
                          toggleShowUnits();
                        }}
                      >
                        <Text
                          style={[s.textLg, c.textForeground] as TextStyle[]}
                        >
                          {item.label}
                        </Text>
                        <View style={[s.flexRow, s.itemsCenter, s.gap2]}>
                          {item.value === goalUnit ? (
                            <Ionicons
                              name="checkmark"
                              color={colors.primary}
                              size={CHECKMARK_SIZE}
                            />
                          ) : null}
                        </View>
                      </TouchableOpacity>
                    )}
                    ItemSeparatorComponent={() => (
                      <View style={[s.divider, c.bgMuted]} />
                    )}
                  />
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
