import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createHabitStyles } from "@/assets/styles/habit.styles";
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

  return (
    <LinearGradient
      colors={colors.gradients.background}
      style={styles.container}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.form}>
            <View style={styles.container}>
              <Text style={styles.inputLabel}>TARGET</Text>
              <View style={styles.inputGroup}>
                {/* Calculate time value in seconds */}
                <View style={styles.centered}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
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
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
