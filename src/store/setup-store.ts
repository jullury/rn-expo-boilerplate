import { create } from "zustand";

type SetupState = {
  isRuntimeValid: boolean;
  missingEnvKeys: string[];
  setRuntimeValidation: (input: {
    valid: boolean;
    missingKeys: string[];
  }) => void;
};

export const useSetupStore = create<SetupState>((set) => ({
  isRuntimeValid: true,
  missingEnvKeys: [],
  setRuntimeValidation: ({ valid, missingKeys }) => {
    set({
      isRuntimeValid: valid,
      missingEnvKeys: missingKeys,
    });
  },
}));
