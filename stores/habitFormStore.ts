import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { iconColors } from "@/constants/colors";
import { initialForm } from "@/constants/initialForm";
import type { HabitFormData } from "@/validation/HabitSchema";

interface ReminderState {
  id: string | null; // null means not in database yet
  time: Date; // storing time as Date because that's what the react-native-time-picker outputs
}

interface HabitFormStore {
  // Core form data
  habitForm: HabitFormData;
  initialForm: HabitFormData;

  // Reminders state
  remindersEnabled: boolean;
  reminders: ReminderState[];
  initialReminders: ReminderState[]; // to track which reminder ids to delete/keep

  // Icon selection state
  selectedIcon: string;
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
  updateReminder: (index: number, reminderState: ReminderState) => void;
  setReminders: (reminders: ReminderState[]) => void;

  // Actions for icon selection
  setSelectedIcon: (icon: string) => void;
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
      initialReminders: [],
      selectedIcon: "💪",
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
        // Validate proof method name
        if (!["Camera", "No Proof"].includes(proofMethodName)) {
          console.warn(`Invalid proof method: ${proofMethodName}`);
          return;
        }
        const defaults = { goalUnit: "count", goalTarget: 1 };

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
        const defaultTime = new Date();
        defaultTime.setHours(8, 0, 0, 0); // 8:00 AM

        const newReminder = {
          id: null,
          time: defaultTime,
        };

        set((state) => ({
          remindersEnabled: !state.remindersEnabled,
          // clear all reminders if needed
          reminders: !state.remindersEnabled ? [newReminder] : [],
        }));
      },

      addReminder() {
        const defaultTime = new Date();
        defaultTime.setHours(8, 0, 0, 0); // 8:00 AM

        const newReminder = {
          id: null,
          time: defaultTime,
        };

        set((state) => ({
          reminders: [...state.reminders, newReminder],
        }));
      },

      removeReminder(index) {
        set((state) => ({
          reminders: state.reminders.filter((_, i) => i !== index),
        }));
      },

      updateReminder(index, newReminder) {
        set((state) => ({
          reminders: state.reminders.map((reminder, i) =>
            // if new reminder is defined & the index matches...
            i === index ? newReminder : reminder,
          ),
        }));
      },

      setReminders(reminders) {
        set({
          reminders,
          initialReminders: reminders,
          remindersEnabled: reminders.length > 0,
        });
      },

      // Icon selection actions
      // will change the UI state and habit form simultaneously
      setSelectedIcon(icon) {
        set((state) => ({
          selectedIcon: icon,
          habitForm: { ...state.habitForm, icon },
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
          remindersEnabled: state.remindersEnabled,
          reminders: state.reminders,
          initialReminders: state.initialReminders,
          selectedIcon: state.initialForm.icon || "💪",
          selectedColor: state.initialForm.color || iconColors[0],
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
            // value is the array of reminder states
            const conversion = value.map((reminder) => ({
              id: reminder.id,
              time: new Date(reminder.time), // convert string to Date
            }));
            return conversion;
          }
          return value;
        },
        replacer: (key, value) => {
          // Convert Date objects to ISO strings for storage
          if (key === "reminders" && Array.isArray(value)) {
            const conversion = value.map((reminder) => ({
              id: reminder.id,
              time: reminder.time.toISOString(), // convert Date to string
            }));
            return conversion;
          }
          return value;
        },
      }),
    },
  ),
);
