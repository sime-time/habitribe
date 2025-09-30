import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useMutation, useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router, useLocalSearchParams } from "expo-router";
import { Fragment, useEffect } from "react";
import {
  Button,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { ZodError } from "zod";
import { createHabitStyles } from "@/assets/styles/habit.styles";
import { toastConfig } from "@/assets/styles/toast.config";
import { text } from "@/assets/styles/token.styles";
import IconOrEmoji from "@/components/IconOrEmoji";
import { iconColors } from "@/constants/colors";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import useTheme from "@/hooks/useTheme";
import { useHabitFormStore } from "@/stores/habitFormStore";
import {
  getFrequencyText,
  getGoalDisplayText,
  getProofTypeName,
  type Period,
} from "@/utils/habitFormLabels";
import { type HabitFormData, HabitSchema } from "@/validation/HabitSchema";

type HabitId = Id<"habits">;

export default function HabitForm() {
  const { colors, isDarkMode } = useTheme();
  const styles = createHabitStyles(colors);

  // functionality is determined by a query parameter for a habit id.
  // "edit" mode when id is defined,
  // "create" mode when id is undefined
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditMode = id !== undefined;

  // Habit state
  const habitForm = useHabitFormStore((state) => state.habitForm);
  const name = useHabitFormStore((state) => state.habitForm.name);
  const icon = useHabitFormStore((state) => state.habitForm.icon);
  const color = useHabitFormStore((state) => state.habitForm.color);
  const schedule = useHabitFormStore((state) => state.habitForm.schedule);
  const proofTypeId = useHabitFormStore((state) => state.habitForm.proofTypeId);
  const goalTarget = useHabitFormStore((state) => state.habitForm.goalTarget);
  const goalUnit = useHabitFormStore((state) => state.habitForm.goalUnit);
  const reminders = useHabitFormStore((state) => state.reminders);
  const remindersEnabled = useHabitFormStore((state) => state.remindersEnabled);

  // in "edit" mode the initial form becomes populated
  // with the current data of the habit being updated
  const setInitialForm = useHabitFormStore((state) => state.setInitialForm);
  const updateForm = useHabitFormStore((state) => state.updateForm);
  const resetForm = useHabitFormStore((state) => state.resetForm);
  const addReminder = useHabitFormStore((state) => state.addReminder);
  const updateReminder = useHabitFormStore((state) => state.updateReminder);
  const removeReminder = useHabitFormStore((state) => state.removeReminder);
  const toggleReminders = useHabitFormStore((state) => state.toggleReminders);

  const createHabit = useMutation(api.exec.create.addHabit);
  const createReminder = useMutation(api.exec.create.addReminder);
  const updateHabit = useMutation(api.exec.update.editHabit);

  // in "create" mode this query will be undefined (skipped)
  const currentHabit = useQuery(
    api.exec.read.getHabit,
    isEditMode ? { habitId: id as HabitId } : "skip",
  );
  const proofTypes = useQuery(api.exec.read.getProofTypes);

  // set the initialForm to be the current habit data
  // so when a user resets the form, it returns to the original habit data
  useEffect(() => {
    let initialForm: HabitFormData;
    if (isEditMode && currentHabit) {
      console.log("EDIT MODE");
      initialForm = {
        name: currentHabit.name,
        color: currentHabit.color,
        icon: currentHabit.icon,
        proofTypeId: currentHabit.proofTypeId,
        goalTarget: currentHabit.goalTarget,
        goalUnit: currentHabit.goalUnit,
        startDate: currentHabit.startDate,
        schedule: {
          period: currentHabit.schedule.period as Period,
          interval: currentHabit.schedule.interval,
        },
      };
    } else {
      console.log("CREATE MODE");
      initialForm = {
        name: "",
        color: iconColors[0],
        icon: "barbell",
        proofTypeId: "",
        goalTarget: 1,
        goalUnit: "count",
        startDate: new Date().toISOString().split("T")[0], // "YYYY-MM-DD" format
        schedule: {
          period: "daily" as Period.Daily,
          interval: 1,
        },
      };
    }
    setInitialForm(initialForm);
    resetForm();
  }, [isEditMode, currentHabit, setInitialForm, resetForm]);

  const createSubmit = async () => {
    const validHabitForm = HabitSchema.parse(habitForm);
    const habitId = await createHabit({
      ...validHabitForm,
      proofTypeId: validHabitForm.proofTypeId as Id<"proofTypes">,
    });

    if (remindersEnabled) {
      for (const reminder of reminders) {
        const timeString = reminder.toTimeString().slice(0, 5); // "HH:mm"
        await createReminder({
          habitId,
          time: timeString,
        });
      }
    }
    Toast.show({ type: "success", text1: "New habit added" });
  };

  const updateSubmit = async (id: string) => {
    const habitId = id as HabitId;
    const validHabitForm = HabitSchema.parse(habitForm);
    console.log("validHabit", validHabitForm);
    await updateHabit({
      id: habitId,
      ...validHabitForm,
      proofTypeId: validHabitForm.proofTypeId as Id<"proofTypes">,
    });

    if (remindersEnabled) {
      for (const reminder of reminders) {
        const timeString = reminder.toTimeString().slice(0, 5); // "HH:mm"
        await createReminder({
          habitId,
          time: timeString,
        });
      }
    }
    Toast.show({ type: "success", text1: "Habit updated" });
  };

  const handleSubmit = async () => {
    try {
      if (id) {
        await updateSubmit(id);
      } else {
        await createSubmit();
      }
      resetForm();
      router.dismissTo("/(tabs)");
    } catch (err) {
      console.error("Habit Form Error: ", err);
      if (err instanceof ZodError) {
        Toast.show({ type: "error", text1: err.issues[0].message });
      } else if (err instanceof ConvexError) {
        Toast.show({ type: "error", text1: err.data });
      } else if (err instanceof Error) {
        Toast.show({ type: "error", text1: err.message });
      }
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
              <Text style={styles.inputLabel}>DETAILS</Text>
              <View style={styles.inputGroup}>
                {/* NAME */}
                <View style={styles.inputContainer}>
                  <Text style={styles.body}>Name</Text>
                  <TextInput
                    value={name}
                    style={[styles.body, { flex: 1, textAlign: "right" }]}
                    placeholder="E.g., Exercise"
                    placeholderTextColor={colors.mutedForeground}
                    onChangeText={(text) => updateForm("name", text)}
                  />
                </View>

                <View style={styles.inputDivider} />

                {/* ICON */}
                <Link href="/habit/icon" asChild>
                  <TouchableOpacity style={styles.inputContainer}>
                    <Text style={styles.body}>Icon</Text>
                    <View style={styles.inputIcon}>
                      <IconOrEmoji iconName={icon} iconColor={color} />
                      <Ionicons
                        name="chevron-forward"
                        size={text.base}
                        color={colors.mutedForeground}
                      />
                    </View>
                  </TouchableOpacity>
                </Link>

                <View style={styles.inputDivider} />

                {/* REMINDERS */}
                <View style={styles.inputContainer}>
                  <Text style={styles.body}>Reminders</Text>
                  <View>
                    <Switch
                      value={remindersEnabled}
                      onChange={() => toggleReminders()}
                      thumbColor={colors.primaryForeground}
                      trackColor={{
                        false: colors.border,
                        true: colors.primary,
                      }}
                      ios_backgroundColor={colors.border}
                    />
                  </View>
                </View>

                {remindersEnabled && (
                  <>
                    <View style={styles.inputDivider} />
                    {reminders.map((reminder, index) => (
                      <Fragment key={index}>
                        <View style={styles.inputContainer}>
                          <DateTimePicker
                            value={reminder}
                            onChange={(_event, selectedDate) =>
                              updateReminder(index, selectedDate)
                            }
                            mode="time"
                            is24Hour={true}
                            textColor={colors.foreground}
                            accentColor={colors.primary}
                            themeVariant={isDarkMode ? "dark" : "light"}
                          />

                          <TouchableOpacity
                            style={styles.inputIcon}
                            onPress={() => removeReminder(index)}
                          >
                            <Ionicons
                              name="trash-outline"
                              size={text.base}
                              color={colors.destructive}
                            />
                          </TouchableOpacity>
                        </View>

                        <View style={styles.inputDivider} />
                      </Fragment>
                    ))}

                    <TouchableOpacity
                      style={styles.inputContainer}
                      onPress={addReminder}
                    >
                      <View style={styles.inputIcon}>
                        <Ionicons
                          name="add"
                          size={text.base}
                          color={colors.primary}
                        />
                        <Text style={[styles.body, { color: colors.primary }]}>
                          Add reminder
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>

            {/* COMMIT STATEMENT */}
            <View style={styles.container}>
              <Text style={styles.inputLabel}>COMMITMENT</Text>
              <View style={styles.inputGroup}>
                <View style={styles.inputContainer}>
                  <Text style={styles.body}>
                    {"I will "}
                    <Text style={styles.primaryText}>submit a photo</Text>
                    {" of "}
                    <Text style={styles.primaryText}>the gym</Text>
                    {", every "}
                    <Text style={styles.primaryText}>day</Text>
                  </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity onPress={handleSubmit}>
              <LinearGradient
                colors={colors.gradients.primary}
                style={styles.button}
              >
                <Text style={styles.buttonText}>
                  {isEditMode ? "Update Habit" : "Add Habit"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <Button
              title="Reset Habit"
              onPress={resetForm}
              color={colors.destructive}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
      <Toast config={toastConfig} topOffset={0} />
    </LinearGradient>
  );
}
