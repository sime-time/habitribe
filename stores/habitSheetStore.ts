import { create } from "zustand";
import type { Doc } from "@/convex/_generated/dataModel";

type Habit = Doc<"habits">;

interface HabitSheetStore {
  habit: Habit | null;
  isOpen: boolean;
  openSheet: (selectedHabit: Habit) => void;
  closeSheet: () => void;
}

export const useHabitSheetStore = create<HabitSheetStore>((set) => ({
  habit: null,
  isOpen: false,
  openSheet: (selectedHabit: Habit) =>
    set({
      isOpen: true,
      habit: selectedHabit,
    }),
  closeSheet: () =>
    set({
      isOpen: false,
      habit: null,
    }),
}));
