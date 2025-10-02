import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { FlashList } from "@shopify/flash-list";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronDown, Minus, Plus } from "lucide-react-native";
import { useEffect, useState } from "react";
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
import useTheme from "@/hooks/useTheme";
import { useHabitFormStore } from "@/stores/habitFormStore";

enum GoalUnit {
  Time = "seconds",
  Custom = "custom",
}

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

  // UI state derived from Habit state
  const derivedGoalUnit = (unit: string) => {
    switch (unit) {
      case "seconds":
        return GoalUnit.Time;
      default:
        return GoalUnit.Custom;
    }
  };

  const [goalUnitType, setGoalUnitType] = useState<GoalUnit>(
    derivedGoalUnit(goalUnit),
  );
  const [selectedHours, setSelectedHours] = useState<number>(0);
  const [selectedMinutes, setSelectedMinutes] = useState<number>(0);

  // This is important for habit "edit" mode:
  // Initialize selectedHours and selectedMinutes based on goalTarget when goalUnit is "seconds"
  useEffect(() => {
    if (goalUnit === "seconds" && goalTarget > 0) {
      const totalMinutes = Math.floor(goalTarget / 60);
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      setSelectedHours(hours);
      setSelectedMinutes(minutes);
    }
  }, [goalTarget, goalUnit]);

  // Sync UI state when goalUnit changes from another screen (e.g., proof selection)
  useEffect(() => {
    // Reset time pickers when in time mode
    if (goalUnit === GoalUnit.Time) {
      setGoalUnitType(GoalUnit.Time);
      setSelectedHours(0);
      setSelectedMinutes(0);
    }
  }, [goalUnit]);

  return (
    <LinearGradient
      colors={colors.gradients.background}
      style={styles.container}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.form}>
            <View style={styles.container}>
              <Text style={styles.inputLabel}>UNIT</Text>
              <View style={styles.inputGroup}>
                <TouchableOpacity
                  style={styles.inputContainer}
                  onPress={() => {
                    if (goalUnitType === GoalUnit.Custom) return;
                    setGoalUnitType(GoalUnit.Custom);
                    setGoalUnit("count");
                    setGoalTarget(0);
                    setSelectedHours(0);
                    setSelectedMinutes(0);
                  }}
                >
                  <Text style={styles.body}>Goal</Text>
                  <View style={styles.inputIcon}>
                    {goalUnitType === GoalUnit.Custom && (
                      <Ionicons
                        name="checkmark"
                        color={colors.primary}
                        size={CHECKMARK_SIZE}
                      />
                    )}
                  </View>
                </TouchableOpacity>

                <View style={styles.inputDivider} />

                <TouchableOpacity
                  style={styles.inputContainer}
                  onPress={() => {
                    if (goalUnitType === GoalUnit.Time) return;
                    setGoalUnitType(GoalUnit.Time);
                    setGoalUnit(GoalUnit.Time);
                    setGoalTarget(selectedHours * 3600 + selectedMinutes * 60);
                  }}
                >
                  <Text style={styles.body}>Time</Text>
                  <View style={styles.inputIcon}>
                    {goalUnitType === GoalUnit.Time && (
                      <Ionicons
                        name="checkmark"
                        color={colors.primary}
                        size={CHECKMARK_SIZE}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.container}>
              <Text style={styles.inputLabel}>TARGET</Text>

              <View style={styles.inputGroup}>
                {/* Calculate time value in seconds */}
                {goalUnitType === GoalUnit.Time ? (
                  <View style={styles.centered}>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Picker
                        selectedValue={selectedHours}
                        style={{ flex: 1 }}
                        onValueChange={(value) => {
                          setSelectedHours(value);
                          setGoalTarget(value * 3600 + selectedMinutes * 60);
                        }}
                        itemStyle={{
                          color: colors.foreground,
                        }}
                      >
                        {Array.from({ length: 24 }, (_, i) => (
                          <Picker.Item key={i} label={`${i} hr`} value={i} />
                        ))}
                      </Picker>

                      <Picker
                        selectedValue={selectedMinutes}
                        style={{ flex: 1 }}
                        onValueChange={(value) => {
                          setSelectedMinutes(value);
                          setGoalTarget(selectedHours * 3600 + value * 60);
                        }}
                        itemStyle={{
                          color: colors.foreground,
                        }}
                      >
                        {Array.from({ length: 60 }, (_, i) => (
                          <Picker.Item key={i} label={`${i} min`} value={i} />
                        ))}
                      </Picker>
                    </View>
                  </View>
                ) : (
                  <>
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

                    <TouchableOpacity style={styles.inputContainer}>
                      <Text style={styles.body}>Count</Text>
                      <View style={styles.inputIcon}>
                        <ChevronDown
                          color={colors.mutedForeground}
                          size={CHECKMARK_SIZE}
                        />
                      </View>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
