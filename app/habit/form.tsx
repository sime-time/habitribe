import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useMutation, useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { Plus } from "lucide-react-native";
import { Fragment, useCallback, useEffect, useLayoutEffect } from "react";
import {
  Alert,
  ScrollView,
  Switch,
  Text,
  TextInput,
  type TextStyle,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { ZodError } from "zod";
import { createColorStyles } from "@/assets/styles/color.styles";
import { toastConfig } from "@/assets/styles/toast.config";
import { s } from "@/assets/styles/utility.styles";
import CommitStatement from "@/components/CommitStatement";
import Emoji from "@/components/Emoji";
import { initialForm } from "@/constants/initialForm";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import useTheme from "@/hooks/useTheme";
import { useHabitFormStore } from "@/stores/habitFormStore";
import type { Frequency } from "@/utils/habitFormLabels";
import { HabitSchema } from "@/validation/HabitSchema";

type HabitId = Id<"habits">;

export default function HabitForm() {
  const { colors, isDarkMode } = useTheme();
  const c = createColorStyles(colors);

  // functionality is determined by a query parameter for a habit id.
  // "edit" mode when id is defined,
  // "create" mode when id is undefined
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditMode = id !== undefined;
  const navigation = useNavigation();

  // Habit state
  const habitForm = useHabitFormStore((state) => state.habitForm);
  const name = useHabitFormStore((state) => state.habitForm.name);
  const icon = useHabitFormStore((state) => state.habitForm.icon);
  const color = useHabitFormStore((state) => state.habitForm.color);
  const reminders = useHabitFormStore((state) => state.reminders);
  const remindersEnabled = useHabitFormStore((state) => state.remindersEnabled);
  const initialReminders = useHabitFormStore((state) => state.initialReminders);

  // in "edit" mode the initial form becomes populated with the data of the habit being updated
  const setInitialForm = useHabitFormStore((state) => state.setInitialForm);
  const updateForm = useHabitFormStore((state) => state.updateForm);
  const resetForm = useHabitFormStore((state) => state.resetForm);
  const addReminder = useHabitFormStore((state) => state.addReminder);
  const updateReminder = useHabitFormStore((state) => state.updateReminder);
  const removeReminder = useHabitFormStore((state) => state.removeReminder);
  const toggleReminders = useHabitFormStore((state) => state.toggleReminders);
  const setReminders = useHabitFormStore((state) => state.setReminders);

  // database mutations
  const createHabit = useMutation(api.exec.create.addHabit);
  const updateHabit = useMutation(api.exec.update.editHabit);
  const createReminder = useMutation(api.exec.create.addReminder);
  const editReminder = useMutation(api.exec.update.editReminder);
  const deleteReminder = useMutation(api.exec.delete.deleteReminder);
  const deleteHabit = useMutation(api.exec.delete.deleteHabit);

  // in "create" mode these queries will be undefined (skipped)
  const currentHabit = useQuery(
    api.exec.read.getHabit,
    isEditMode ? { habitId: id as HabitId } : "skip",
  );
  const currentHabitReminders = useQuery(
    api.exec.read.getHabitReminders,
    isEditMode ? { habitId: id as HabitId } : "skip",
  );

  // set the initialForm & initialReminders to be the current habit data
  // so when a user resets the form, it returns to the original habit data
  useEffect(() => {
    if (isEditMode && currentHabit) {
      setInitialForm({
        name: currentHabit.name,
        description: currentHabit.description || "",
        color: currentHabit.color,
        icon: currentHabit.icon,
        proofMethodId: currentHabit.proofMethodId,
        startDate: currentHabit.startDate,
        schedule: {
          frequency: currentHabit.schedule.frequency as Frequency,
          pattern: currentHabit.schedule.pattern,
        },
      });
    } else {
      setInitialForm(initialForm);
    }

    if (isEditMode && currentHabitReminders) {
      const reminderStates = currentHabitReminders.map((reminder) => {
        const [hours, minutes] = reminder.time.split(":").map(Number);
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        return {
          id: reminder._id,
          time: date,
        };
      });
      setReminders(reminderStates);
    } else {
      setReminders([]);
    }
    resetForm();
  }, [
    isEditMode,
    currentHabit,
    currentHabitReminders,
    setReminders,
    setInitialForm,
    resetForm,
  ]);

  // useCallback memoizes the function, so it's only recreated when its dependencies (id, deleteHabit) change.
  // This makes it safe to use in the useLayoutEffect dependency array.
  const handleDelete = useCallback(async () => {
    Alert.alert(
      "Delete Habit",
      "This will remove all habit progress and reminders.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteHabit({ id: id as HabitId });
              Toast.show({
                type: "success",
                text1: "Habit deleted successfully",
              });
              router.dismissTo("/(tabs)");
            } catch (err) {
              console.error(err);
              Toast.show({ type: "error", text1: "Failed to delete habit" });
            }
          },
        },
      ],
    );
  }, [id, deleteHabit]);

  // override header buttons if in edit mode
  useLayoutEffect(() => {
    if (isEditMode) {
      navigation.setOptions({
        headerTitle: name,
        headerRight: () => (
          <TouchableOpacity onPress={handleDelete}>
            <Ionicons
              name="trash-outline"
              color={colors.destructive}
              size={24}
            />
          </TouchableOpacity>
        ),
      });
    }
  }, [isEditMode, navigation, colors, name, handleDelete]);

  const createSubmit = async () => {
    const validHabitForm = HabitSchema.parse(habitForm);
    const habitId = await createHabit({
      ...validHabitForm,
      proofMethodId: validHabitForm.proofMethodId as Id<"proofMethods">,
    });

    if (remindersEnabled) {
      for (const reminder of reminders) {
        const timeString = reminder.time.toTimeString().slice(0, 5); // "HH:mm"
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
    await updateHabit({
      id: habitId,
      ...validHabitForm,
      proofMethodId: validHabitForm.proofMethodId as Id<"proofMethods">,
    });

    if (remindersEnabled) {
      for (const reminder of reminders) {
        const timeString = reminder.time.toTimeString().slice(0, 5); // "HH:mm"

        if (reminder.id === null) {
          // null id = NEW reminder to create in database
          await createReminder({
            habitId,
            time: timeString,
          });
        } else {
          // reminder id EXISTS in database, update it
          await editReminder({
            id: reminder.id as Id<"reminders">,
            time: timeString,
          });
        }
      }
    } // always check for deleted reminders, esp if reminders are disabled
    // find deleted reminders (in initialReminders but not in current reminders)
    const reminderIds = reminders.map((r) => r.id);
    const currentIds = reminderIds.filter((id) => id !== null);
    const deletedReminders = initialReminders.filter(
      (initial) => initial.id !== null && !currentIds.includes(initial.id),
    );

    // delete removed reminders from database
    for (const deleted of deletedReminders) {
      if (deleted.id) {
        await deleteReminder({ id: deleted.id as Id<"reminders"> });
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
    <LinearGradient colors={colors.gradients.background} style={s.flex1}>
      <SafeAreaView style={s.flex1}>
        <ScrollView style={s.p4} contentContainerStyle={s.flexGrow}>
          <View style={[s.flex1, s.gap6]}>
            {/* DETAILS */}
            <View>
              <Text
                style={[s.textXs, s.mb2, s.ml2, c.textMuted] as TextStyle[]}
              >
                DETAILS
              </Text>
              <View
                style={[
                  s.px4,
                  c.bgCard,
                  s.roundedMd,
                  s.border1,
                  c.borderDefault,
                ]}
              >
                {/* NAME */}
                <View
                  style={[
                    s.flex1,
                    s.flexRow,
                    s.justifyBetween,
                    s.itemsCenter,
                    s.h13,
                  ]}
                >
                  <Text style={[s.textLg, s.fontMedium, c.textForeground]}>
                    Name
                  </Text>
                  <TextInput
                    value={name}
                    style={
                      [
                        s.textLg,
                        s.fontMedium,
                        c.textForeground,
                        s.flex1,
                        s.textRight,
                      ] as TextStyle[]
                    }
                    placeholder="E.g., Exercise"
                    placeholderTextColor={colors.muted}
                    onChangeText={(text) => updateForm("name", text)}
                  />
                </View>

                <View style={[s.divider, c.bgMuted]} />

                {/* ICON */}
                <TouchableOpacity
                  style={[
                    s.wFull,
                    s.flexRow,
                    s.justifyBetween,
                    s.itemsCenter,
                    s.h13,
                  ]}
                  onPress={() => router.push("/habit/icon")}
                >
                  <Text style={[s.textLg, s.fontMedium, c.textForeground]}>
                    Icon
                  </Text>
                  <View style={[s.flexRow, s.itemsCenter, s.gap2]}>
                    <View
                      style={[
                        s.roundedFull,
                        s.itemsCenter,
                        s.justifyCenter,
                        {
                          backgroundColor: `${color}30`,
                          height: 40,
                          width: 40,
                        },
                      ]}
                    >
                      <Emoji iconName={icon} iconSize={18} />
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color={colors.muted}
                    />
                  </View>
                </TouchableOpacity>

                <View style={[s.divider, c.bgMuted]} />

                {/* REMINDERS */}
                <View
                  style={[
                    s.flex1,
                    s.flexRow,
                    s.justifyBetween,
                    s.itemsCenter,
                    s.h13,
                  ]}
                >
                  <Text style={[s.textLg, s.fontMedium, c.textForeground]}>
                    Reminders
                  </Text>
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
                    <View style={[s.divider, c.bgMuted]} />

                    {reminders.map((reminder, index) => (
                      <Fragment key={index}>
                        <View
                          style={[
                            s.flex1,
                            s.flexRow,
                            s.justifyBetween,
                            s.itemsCenter,
                            s.h13,
                          ]}
                        >
                          <DateTimePicker
                            value={reminder.time}
                            onChange={(_event, selectedDate) => {
                              if (!selectedDate) return;
                              const reminderState = {
                                id: reminder.id,
                                time: selectedDate,
                              };
                              updateReminder(index, reminderState);
                            }}
                            mode="time"
                            is24Hour={true}
                            textColor={colors.foreground}
                            accentColor={colors.primary}
                            themeVariant={isDarkMode ? "dark" : "light"}
                          />

                          <TouchableOpacity
                            style={[s.flexRow, s.itemsCenter, s.gap2]}
                            onPress={() => removeReminder(index)}
                          >
                            <Ionicons
                              name="trash-outline"
                              size={20}
                              color={colors.destructive}
                            />
                          </TouchableOpacity>
                        </View>

                        <View style={[s.divider, c.bgMuted]} />
                      </Fragment>
                    ))}

                    <TouchableOpacity
                      style={[
                        s.flex1,
                        s.flexRow,
                        s.justifyBetween,
                        s.itemsCenter,
                        s.h13,
                      ]}
                      onPress={addReminder}
                    >
                      <View style={[s.flexRow, s.itemsCenter, s.gap2]}>
                        <Plus size={18} color={colors.primary} />
                        <Text style={[s.textLg, s.fontMedium, c.textPrimary]}>
                          Add reminder
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>

            {/* COMMITMENT */}
            <View>
              <Text
                style={[s.textXs, s.mb2, s.ml2, c.textMuted] as TextStyle[]}
              >
                COMMITMENT
              </Text>
              <CommitStatement />
            </View>

            <View style={[s.gap1, s.flex1, s.justifyEnd]}>
              <TouchableOpacity onPress={handleSubmit}>
                <LinearGradient
                  colors={colors.gradients.primary}
                  style={s.button}
                >
                  <Text
                    style={[s.textLg, s.fontMedium, c.textPrimaryForeground]}
                  >
                    {isEditMode ? "Update Habit" : "Add Habit"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.button, c.bgTransparent]}
                onPress={resetForm}
              >
                <Text style={[s.textLg, c.textDestructive]}>Reset Habit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
      <Toast config={toastConfig} topOffset={0} />
    </LinearGradient>
  );
}
