import { create } from "zustand";

type AppState = {
  isOnline: boolean;
  setIsOnline: (value: boolean) => void;
};

export const useAppStore = create<AppState>((set) => ({
  isOnline: true,
  setIsOnline: (value) => set({ isOnline: value }),
}));
