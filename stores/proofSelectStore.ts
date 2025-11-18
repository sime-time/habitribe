import { create } from "zustand";
import type { Id } from "@/convex/_generated/dataModel";

interface ProofSelectStore {
  isOpen: boolean;
  entryId: Id<"habitEntries"> | null;
  setEntryId: (id: Id<"habitEntries">) => void;
  openSheet: () => void;
  closeSheet: () => void;
}

export const useProofSelectStore = create<ProofSelectStore>((set) => ({
  isOpen: false,
  entryId: null,
  setEntryId: (id) =>
    set({
      entryId: id,
    }),
  openSheet: () =>
    set({
      isOpen: true,
    }),
  closeSheet: () =>
    set({
      isOpen: false,
    }),
}));
