import { create } from "zustand";
import type { Doc } from "@/convex/_generated/dataModel";

type Habit = Doc<"habits">;

interface HabitSelectStore {
  habitSelected: Habit | null;
  isOpen: boolean;
  openSheet: () => void;
  closeSheet: () => void;
  selectHabit: (habit: Habit) => void;
  resetHabit: () => void;
}

export const useHabitSelectStore = create<HabitSelectStore>((set) => ({
  habitSelected: null,
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
  resetHabit: () => {
    set({
      habitSelected: null,
    });
  },
}));
