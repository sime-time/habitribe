type ProofDefaults = {
  goalUnit: string;
  goalTarget: number;
};

export const proofMethodDefaults: Record<string, ProofDefaults> = {
  Camera: { goalUnit: "photo", goalTarget: 1 },
  "Time-lapse": { goalUnit: "seconds", goalTarget: 0 },
  "Focus Timer": { goalUnit: "seconds", goalTarget: 0 },
  // Default for unknown/custom methods
  default: { goalUnit: "count", goalTarget: 1 },
};
