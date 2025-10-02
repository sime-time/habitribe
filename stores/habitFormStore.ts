import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { iconColors } from "@/constants/colors";
import { initialForm } from "@/constants/initialForm";
import { proofMethodDefaults } from "@/constants/proofMethodDefaults";
import type { HabitFormData } from "@/validation/HabitSchema";

interface HabitFormStore {
  // Core form data
  habitForm: HabitFormData;
  initialForm: HabitFormData;

  // Reminders state
  remindersEnabled: boolean;
  reminders: Date[];

  // Icon selection state
  selectedIcon: string;
  selectedEmoji: string;
  selectedColor: string;

  // Actions for core form
  updateForm: (
    field: keyof HabitFormData,
    value: string | number | number[],
  ) => void;
  updateSchedule: (schedule: HabitFormData["schedule"]) => void;
  updateProofMethod: (proofMethodId: string, proofMethodName: string) => void;

  // Actions for reminders
  toggleReminders: () => void;
  addReminder: () => void;
  removeReminder: (index: number) => void;
  updateReminder: (index: number, time: Date | undefined) => void;

  // Actions for icon selection
  setSelectedIcon: (icon: string) => void;
  setSelectedEmoji: (emoji: string) => void;
  setSelectedColor: (color: string) => void;

  // Form management
  setInitialForm: (habitData: HabitFormData) => void;
  resetForm: () => void;
  isDraftSaved: boolean;
}

export const useHabitFormStore = create<HabitFormStore>()(
  persist(
    (set) => ({
      // Initial state
      habitForm: initialForm,
      initialForm: initialForm,
      remindersEnabled: false,
      reminders: [],
      selectedIcon: "barbell",
      selectedEmoji: "",
      selectedColor: iconColors[0],
      isDraftSaved: false,

      // Core form actions
      updateForm(field, value) {
        set((state) => ({
          habitForm: { ...state.habitForm, [field]: value },
          isDraftSaved: true,
        }));
      },

      updateSchedule(schedule) {
        set((state) => ({
          habitForm: { ...state.habitForm, schedule },
          isDraftSaved: true,
        }));
      },

      updateProofMethod(proofMethodId, proofMethodName) {
        const defaults =
          proofMethodDefaults[proofMethodName] || proofMethodDefaults.default;

        set((state) => ({
          habitForm: {
            ...state.habitForm,
            proofMethodId,
            goalTarget: defaults.goalTarget,
            goalUnit: defaults.goalUnit,
          },
          isDraftSaved: true,
        }));
      },

      // Reminder actions
      toggleReminders() {
        const newTime = new Date();
        newTime.setHours(8, 0, 0, 0); // Default to 8:00 AM
        set((state) => ({
          remindersEnabled: !state.remindersEnabled,
          // clear all reminders if needed
          reminders: !state.remindersEnabled ? [newTime] : [],
        }));
      },

      addReminder() {
        const newTime = new Date();
        newTime.setHours(8, 0, 0, 0); // Default to 8:00 AM
        set((state) => ({
          reminders: [...state.reminders, newTime],
        }));
      },

      removeReminder(index) {
        set((state) => ({
          reminders: state.reminders.filter((_, i) => i !== index),
        }));
      },

      updateReminder(index, time) {
        set((state) => ({
          reminders: state.reminders.map((reminder, i) =>
            // if time is defined & the index matches...
            time && i === index ? time : reminder,
          ),
        }));
      },

      // Icon selection actions
      // will change the UI state and habit form simultaneously
      setSelectedIcon(icon) {
        set((state) => ({
          selectedIcon: icon,
          selectedEmoji: "", // Clear emoji
          habitForm: { ...state.habitForm, icon },
          isDraftSaved: true,
        }));
      },

      setSelectedEmoji(emoji) {
        set((state) => ({
          selectedIcon: "", // Clear icon
          selectedEmoji: emoji,
          habitForm: { ...state.habitForm, icon: emoji },
          isDraftSaved: true,
        }));
      },

      setSelectedColor(color) {
        set((state) => ({
          selectedColor: color,
          habitForm: { ...state.habitForm, color },
          isDraftSaved: true,
        }));
      },

      // Form management
      setInitialForm(habitData: HabitFormData) {
        set({
          initialForm: habitData,
        });
      },

      resetForm() {
        set((state) => ({
          habitForm: state.initialForm,
          remindersEnabled: false,
          reminders: [],
          selectedIcon: state.initialForm.icon,
          selectedEmoji: state.initialForm.icon,
          selectedColor: state.initialForm.color,
          isDraftSaved: false,
        }));
      },
    }),
    {
      name: "habit-form-draft",
      // Zustand persist middleware.
      // When data is stored in AsyncStorage and then rehydrated, Date objects get serialized to strings.
      // So when the store is loaded from persistence, the reminders array contains strings instead of Date objects
      storage: createJSONStorage(() => AsyncStorage, {
        reviver: (key, value) => {
          // Convert ISO date strings back to Date objects for reminders array
          if (key === "reminders" && Array.isArray(value)) {
            return value.map((item) => new Date(item));
          }
          return value;
        },
        replacer: (key, value) => {
          // Convert Date objects to ISO strings for storage
          if (key === "reminders" && Array.isArray(value)) {
            return value.map((item) => item.toISOString());
          }
          return value;
        },
      }),
    },
  ),
);
