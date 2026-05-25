import { create } from "zustand";

type SetupState = {
  isRuntimeValid: boolean;
  missingEnvKeys: string[];
  runtimeWarnings: string[];
  setRuntimeValidation: (input: {
    valid: boolean;
    missingKeys: string[];
    warnings: string[];
  }) => void;
};

export const useSetupStore = create<SetupState>((set) => ({
  isRuntimeValid: true,
  missingEnvKeys: [],
  runtimeWarnings: [],
  setRuntimeValidation: ({ valid, missingKeys, warnings }) => {
    set({
      isRuntimeValid: valid,
      missingEnvKeys: missingKeys,
      runtimeWarnings: warnings,
    });
  },
}));
