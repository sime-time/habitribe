import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { FlashList } from "@shopify/flash-list";
import { LinearGradient } from "expo-linear-gradient";
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
  Time = "time",
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

  // UI state derived from Habit state
  const derivedGoalUnit = (unit: string) => {
    switch (unit) {
      case "time":
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

  // Initialize selectedHours and selectedMinutes based on goalTarget when goalUnit is "time"
  useEffect(() => {
    if (goalUnit === "time" && goalTarget > 0) {
      const totalMinutes = Math.floor(goalTarget / 60);
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      setSelectedHours(hours);
      setSelectedMinutes(minutes);
    }
  }, [goalTarget, goalUnit]);

  // Use Flashlist to iterate UI through this array
  const units = [
    { title: "Time", data: GoalUnit.Time },
    { title: "Custom", data: GoalUnit.Custom },
  ];

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
                <FlashList
                  data={units}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.inputContainer}
                      onPress={() => {
                        // Reset the goal values when a new GoalUnitType is selected
                        setGoalUnitType(item.data);
                        if (item.data !== GoalUnit.Custom) {
                          setGoalUnit(item.data);
                        }
                        // Set Default Target Value
                        if (item.data === GoalUnit.Time) {
                          setGoalTarget(
                            selectedHours * 3600 + selectedMinutes * 60,
                          );
                        }
                      }}
                    >
                      <Text style={styles.body}>{item.title}</Text>
                      <View style={styles.inputIcon}>
                        {item.data === goalUnitType && (
                          <Ionicons
                            name="checkmark"
                            color={colors.primary}
                            size={CHECKMARK_SIZE}
                          />
                        )}
                      </View>
                    </TouchableOpacity>
                  )}
                  ItemSeparatorComponent={() => (
                    <View style={styles.inputDivider} />
                  )}
                />
                {goalUnitType === GoalUnit.Custom && (
                  <>
                    <View style={styles.inputDivider} />
                    <TextInput
                      style={[styles.inputContainer, styles.body]}
                      placeholder={`Current Unit: (${goalUnit})`}
                      placeholderTextColor={colors.mutedForeground}
                      onChangeText={setGoalUnit}
                    />
                  </>
                )}
              </View>
            </View>

            <View style={styles.container}>
              <Text style={styles.inputLabel}>TARGET</Text>

              <View style={styles.inputGroup}>
                {/* Calculate targetValue in seconds */}
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
                  <TextInput
                    keyboardType="numeric"
                    style={[styles.inputContainer, styles.body]}
                    placeholder={
                      goalTarget ? String(goalTarget) : "Enter value"
                    }
                    placeholderTextColor={colors.mutedForeground}
                    onChangeText={(text) => {
                      const numericText = text.replace(/[^0-9]/g, ""); // Only allow digits
                      if (numericText !== "") {
                        // No decimal values
                        const num = parseInt(numericText, 10);
                        if (!Number.isNaN(num)) {
                          setGoalTarget(num);
                        }
                      }
                    }}
                  />
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
