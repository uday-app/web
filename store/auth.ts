"use client";

import { create } from "zustand";

export type AuthUser = {
  id: string;
  phone: number;
  name: string;
  avatarSrc: string | null;
};

type AuthStore = {
  isLoggedIn: boolean;
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
  syncUser: (user: AuthUser | null) => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  isLoggedIn: false,
  user: null,
  login: (user) => set({ isLoggedIn: true, user }),
  logout: () => set({ isLoggedIn: false, user: null }),
  syncUser: (user) => set({ isLoggedIn: Boolean(user), user }),
}));
