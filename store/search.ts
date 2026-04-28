"use client";

import { createRef } from "react";
import type React from "react";
import { create } from "zustand";

import type { Navigation } from "@/types/navigation";

type SearchStore = {
  query: string;
  setQuery: (value: string) => void;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;

  ref: React.RefObject<HTMLDivElement>;
  bounce: () => void;

  page: string | null;
  setPage: (id: string | null) => void;

  tab: string;
  setTab: (tab: string) => void;

  onSelect: (
    item: Navigation,
    router?: { push: (href: string) => void },
    setTheme?: (theme: string) => void,
  ) => void;

  onKeyDown: (e: React.KeyboardEvent) => void;

  shouldFilter: boolean;
  setShouldFilter: (v: boolean) => void;
};

export const useSearchStore = create<SearchStore>((set, get) => ({
  query: "",
  setQuery: (value) => set({ query: value }),

  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () =>
    set({ isOpen: false, page: null, query: "", shouldFilter: true }),

  ref: createRef<HTMLDivElement>() as React.RefObject<HTMLDivElement>,
  bounce: () => {
    const el = get().ref.current;
    if (!el) {
      return;
    }

    el.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(0.985)" },
        { transform: "scale(1)" },
      ],
      { duration: 220, easing: "ease-out" },
    );
  },

  page: null,
  setPage: (id) => set({ page: id }),

  tab: "actions",
  setTab: (tab) => set({ tab }),

  onSelect: (item, router, setTheme) => {
    if (item.children?.length) {
      get().bounce();
      set({
        page: item.action?.type === "section" ? item.action.value : item.id,
        query: "",
        shouldFilter: true,
      });
      return;
    }

    if (item.action?.type === "section") {
      set({ page: item.action.value, query: "", shouldFilter: true });
      return;
    }

    if (item.action?.type === "tab") {
      set({ tab: item.action.value });
    }

    if (item.action?.type === "theme" && setTheme) {
      setTheme(item.action.value);
      set({ isOpen: false, page: null, query: "", shouldFilter: true });
      return;
    }

    if (item.href && router) {
      router.push(item.href);
      set({ isOpen: false, page: null, query: "", shouldFilter: true });
      return;
    }

    set({ isOpen: false, page: null, shouldFilter: true });
  },

  onKeyDown: (e) => {
    const { page, query, onClose, bounce } = get();

    if (e.key === "Escape") {
      if (page) {
        e.preventDefault();
        bounce();
        set({ page: null, query: "", shouldFilter: true });
        return;
      }

      onClose();
      return;
    }

    if (e.key === "Backspace" && !query && page) {
      e.preventDefault();
      bounce();
      set({ page: null, query: "", shouldFilter: true });
      return;
    }

    if (e.key === "Enter" && !query) {
      bounce();
    }
  },

  shouldFilter: true,
  setShouldFilter: (v) => set({ shouldFilter: v }),
}));
