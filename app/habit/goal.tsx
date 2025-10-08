import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronDown, ChevronUp, Minus, Plus } from "lucide-react-native";
import { useCallback, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  CHECKMARK_SIZE,
  createHabitStyles,
} from "@/assets/styles/habit.styles";
import { spacing } from "@/assets/styles/token.styles";
import { units } from "@/constants/goalUnits";
import useTheme from "@/hooks/useTheme";
import { useHabitFormStore } from "@/stores/habitFormStore";

export default function HabitTarget() {
  const { colors } = useTheme();
  const styles = createHabitStyles(colors);

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
    <LinearGradient
      colors={colors.gradients.background}
      style={styles.container}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.form}>
            <View style={styles.container}>
              <Text style={styles.inputLabel}>
                TAP TO MANUALLY INPUT A NUMBER
              </Text>

              <View style={styles.inputGroup}>
                <View style={styles.countContainer}>
                  <TouchableOpacity
                    style={styles.countButton}
                    onPress={decrementGoal}
                  >
                    <Minus color={colors.card} size={CHECKMARK_SIZE} />
                  </TouchableOpacity>
                  <TextInput
                    value={goalTarget ? String(goalTarget) : undefined}
                    style={styles.countText}
                    placeholder={"0"}
                    placeholderTextColor={colors.mutedForeground}
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
                    style={styles.countButton}
                    onPress={incrementGoal}
                  >
                    <Plus color={colors.card} size={CHECKMARK_SIZE} />
                  </TouchableOpacity>
                </View>

                <View style={styles.inputDivider} />

                <TouchableOpacity
                  style={[styles.inputContainer, styles.unitContainer]}
                  onPress={toggleShowUnits}
                >
                  <Text style={styles.body}>{goalUnit.toUpperCase()}</Text>
                  <View style={styles.inputIcon}>
                    {showUnits ? (
                      <ChevronUp
                        color={colors.mutedForeground}
                        size={CHECKMARK_SIZE}
                      />
                    ) : (
                      <ChevronDown
                        color={colors.mutedForeground}
                        size={CHECKMARK_SIZE}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              </View>

              {showUnits && (
                <View
                  style={[
                    styles.inputGroup,
                    { marginTop: spacing.xs2, zIndex: 2 },
                  ]}
                >
                  <FlashList
                    data={units}
                    keyExtractor={(item) => item.value}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.inputContainer}
                        onPress={() => {
                          setGoalUnit(item.value);
                          toggleShowUnits();
                        }}
                      >
                        <Text style={styles.body}>{item.label}</Text>
                        <View style={styles.inputIcon}>
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
                      <View style={styles.inputDivider} />
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
