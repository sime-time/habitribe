import { create } from "zustand";
import type { Doc } from "@/convex/_generated/dataModel";

type Habit = Doc<"habits">;
type HabitEntry = Doc<"habitEntries">;

interface HabitSelectStore {
  habitSelected: Habit | null;
  entrySelected: HabitEntry | null;
  isOpen: boolean;
  openSheet: () => void;
  closeSheet: () => void;
  selectHabit: (habit: Habit) => void;
  selectEntry: (entry: HabitEntry | null) => void;
  reset: () => void;
}

export const useHabitSelectStore = create<HabitSelectStore>((set) => ({
  habitSelected: null,
  entrySelected: null,
  isOpen: false,
  openSheet: () =>
    set({
      isOpen: true,
    }),
  closeSheet: () =>
    set({
      isOpen: false,
    }),
  selectHabit: (habit: Habit) => {
    set({
      habitSelected: habit,
    });
  },
  selectEntry: (entry: HabitEntry | null) => {
    set({
      entrySelected: entry,
    });
  },
  reset: () => {
    set({
      habitSelected: null,
      entrySelected: null,
    });
  },
}));
