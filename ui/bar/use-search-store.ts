import type { RefObject } from "react";
import { create } from "zustand";

export const SEARCH_PAGES = {
  root: "root",
  navigation: "navigation",
  utilities: "utilities",
  workflow: "workflow",
} as const;

export type SearchPage = (typeof SEARCH_PAGES)[keyof typeof SEARCH_PAGES];

type SearchKeyboardEvent = {
  key: string;
  metaKey: boolean;
  ctrlKey: boolean;
  preventDefault(): void;
};

type SearchStore = {
  isOpen: boolean;
  page: SearchPage;
  query: string;
  ref: RefObject<HTMLInputElement | null> | null;
  shouldFilter: boolean;
  setOpen: (isOpen: boolean) => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
  reset: () => void;
  setPage: (page: SearchPage) => void;
  setQuery: (query: string) => void;
  setRef: (ref: RefObject<HTMLInputElement | null> | null) => void;
  setShouldFilter: (shouldFilter: boolean) => void;
  onSelect: (value: string) => void;
  onKeyDown: (event: SearchKeyboardEvent) => void;
};

const initialState = {
  isOpen: false,
  page: SEARCH_PAGES.root,
  query: "",
  ref: null,
  shouldFilter: true,
} satisfies Pick<
  SearchStore,
  "isOpen" | "page" | "query" | "ref" | "shouldFilter"
>;

function getClosedState(
  ref: SearchStore["ref"],
): Pick<SearchStore, "isOpen" | "page" | "query" | "ref" | "shouldFilter"> {
  return {
    isOpen: false,
    page: SEARCH_PAGES.root,
    query: "",
    ref,
    shouldFilter: true,
  };
}

export const useSearchStore = create<SearchStore>()((set, get) => ({
  ...initialState,
  setOpen: (isOpen) =>
    set((state) => (isOpen ? { ...state, isOpen } : getClosedState(state.ref))),
  open: () => set({ isOpen: true }),
  close: () => set((state) => getClosedState(state.ref)),
  toggle: () => {
    if (get().isOpen) {
      get().close();
      return;
    }

    get().open();
  },
  reset: () =>
    set((state) => ({
      ...getClosedState(state.ref),
      isOpen: state.isOpen,
    })),
  setPage: (page) => set({ page, query: "" }),
  setQuery: (query) => set({ query }),
  setRef: (ref) => set({ ref }),
  setShouldFilter: (shouldFilter) => set({ shouldFilter }),
  onSelect: (value) => {
    void value;

    set((state) => getClosedState(state.ref));
  },
  onKeyDown: (event) => {
    const key = event.key.toLowerCase();

    if ((event.metaKey || event.ctrlKey) && key === "k") {
      event.preventDefault();
      get().toggle();
      return;
    }

    if (key === "escape") {
      event.preventDefault();

      if (get().query) {
        get().setQuery("");
        return;
      }

      if (get().page !== SEARCH_PAGES.root) {
        get().setPage(SEARCH_PAGES.root);
        return;
      }

      get().close();
      return;
    }

    if (
      key === "backspace" &&
      !get().query &&
      get().page !== SEARCH_PAGES.root
    ) {
      event.preventDefault();
      get().setPage(SEARCH_PAGES.root);
    }
  },
}));
