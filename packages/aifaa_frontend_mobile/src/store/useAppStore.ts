import { create } from "zustand";

interface AppState {
  theme: "light" | "dark";
  userName: string | null;
  setUserName: (name: string) => void;
  toggleTheme: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  theme: "light",
  userName: null,

  setUserName: (name) => set({ userName: name }),

  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === "light" ? "dark" : "light",
    })),
}));
