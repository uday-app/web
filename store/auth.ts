"use client";

import { create } from "zustand";

import {
  getCurrentUserSession,
  signOutCurrentUser,
} from "@/actions/auth/session";
import type { SessionUser } from "@/actions/auth/session-contract";

export type AuthUser = {
  id: string;
  phone: number;
  name: string;
  avatarSrc: string | null;
};

type AuthStatus = "idle" | "syncing" | "authenticated" | "anonymous";

type AuthStore = {
  error: string | null;
  isLoggedIn: boolean;
  isSigningOut: boolean;
  status: AuthStatus;
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  signOut: () => Promise<{ error?: string }>;
  syncSession: () => Promise<AuthUser | null>;
  syncUser: (user: AuthUser | null) => void;
};

export const AUTH_SESSION_EVENT_KEY = "uday:auth-session-event";

function notifyAuthTabs(event: "login" | "signout") {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    AUTH_SESSION_EVENT_KEY,
    JSON.stringify({
      at: Date.now(),
      event,
    }),
  );
}

function toAuthPhone(value: string) {
  return Number(value.replace(/\D/g, "") || "0");
}

function toAuthUser(user: SessionUser): AuthUser {
  return {
    avatarSrc: user.avatar_url,
    id: user.auth_id ?? user.id,
    name: user.name?.trim() || "User",
    phone: toAuthPhone(user.phone),
  };
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  error: null,
  isLoggedIn: false,
  isSigningOut: false,
  status: "idle",
  user: null,
  login: (user) => {
    set({
      error: null,
      isLoggedIn: true,
      status: "authenticated",
      user,
    });
    notifyAuthTabs("login");
  },
  signOut: async () => {
    if (get().isSigningOut) {
      return {
        error: "Sign out is already in progress.",
      };
    }

    set({ error: null, isSigningOut: true });

    const result = await signOutCurrentUser();

    if (result.error) {
      set({
        error: result.error,
        isSigningOut: false,
      });

      return result;
    }

    set({
      error: null,
      isLoggedIn: false,
      isSigningOut: false,
      status: "anonymous",
      user: null,
    });
    notifyAuthTabs("signout");

    return {};
  },
  syncSession: async () => {
    set({ error: null, status: "syncing" });

    const session = await getCurrentUserSession();

    if (session.error) {
      set({
        error: session.error,
        isLoggedIn: false,
        status: "anonymous",
        user: null,
      });

      return null;
    }

    if (!session.profileComplete || !session.user) {
      set({
        error: null,
        isLoggedIn: false,
        status: "anonymous",
        user: null,
      });

      return null;
    }

    const user = toAuthUser(session.user);

    set({
      error: null,
      isLoggedIn: true,
      status: "authenticated",
      user,
    });

    return user;
  },
  syncUser: (user) =>
    set({
      error: null,
      isLoggedIn: Boolean(user),
      status: user ? "authenticated" : "anonymous",
      user,
    }),
}));
