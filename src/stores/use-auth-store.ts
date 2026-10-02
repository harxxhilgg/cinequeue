import { create } from "zustand";

export type AppUser = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
};

type AuthStore = {
  user: AppUser | null;
  setUser: (user: AppUser | null) => void;
  clearUser: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,

  setUser: (user) => set({ user }),

  clearUser: () => set({ user: null }),
}));
