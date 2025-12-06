import { create } from "zustand";
import type { HabitFormData } from "@/validation/HabitFormSchema";

interface TribeStore {
  name: string;
  private: boolean;
  inviteCode: string;
  inviteLink: string;
  habits: { index: number; habit: HabitFormData }[];
  addHabit: (habit: HabitFormData) => void;
  removeHabit: (index: number) => void;
  setInviteLink: (link: string) => void;
  setInviteCode: (code: string) => void;
  setPrivate: (value: boolean) => void;
  setName: (value: string) => void;
  reset: () => void;
}

export const useTribeStore = create<TribeStore>((set) => ({
  name: "",
  private: false,
  habits: [],
  inviteCode: "",
  inviteLink: "",
  addHabit: (habit: HabitFormData) => {
    set((state) => ({
      habits: [...state.habits, { index: state.habits.length, habit }],
    }));
  },
  removeHabit: (index: number) => {
    set((state) => ({
      habits: state.habits.filter((item) => item.index !== index),
    }));
  },
  setName: (value: string) => {
    set({
      name: value,
    });
  },
  setPrivate: (value: boolean) => {
    set({
      private: value,
    });
  },
  setInviteCode: (code: string) => {
    set({
      inviteCode: code,
    });
  },
  setInviteLink: (link: string) => {
    set({
      inviteLink: link,
    });
  },
  reset: () => {
    set({
      name: "",
      private: false,
    });
  },
}));
