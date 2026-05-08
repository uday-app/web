"use client";

import { useCallback, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";

import { AUTH_SESSION_EVENT_KEY, useAuthStore } from "@/store/auth";

type AuthTabEvent = "login" | "signout";

let didSyncSession = false;

function readAuthTabEvent(value: string | null): AuthTabEvent | null {
  if (!value) {
    return null;
  }

  try {
    const payload = JSON.parse(value) as { event?: AuthTabEvent };

    return payload.event ?? null;
  } catch {
    return null;
  }
}

function getSnapshot() {
  return null;
}

export function AuthSync() {
  const router = useRouter();
  const syncSession = useAuthStore((state) => state.syncSession);
  const syncUser = useAuthStore((state) => state.syncUser);

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      let isActive = true;

      const syncThenRefresh = () => {
        void syncSession()
          .catch(() => undefined)
          .then(() => {
            if (isActive) {
              router.refresh();
            }
          });
      };

      if (!didSyncSession) {
        didSyncSession = true;
        void syncSession().catch(() => undefined);
      }

      const onStorage = (event: StorageEvent) => {
        if (event.key !== AUTH_SESSION_EVENT_KEY) {
          return;
        }

        onStoreChange();

        if (readAuthTabEvent(event.newValue) === "signout") {
          syncUser(null);
          router.refresh();
          return;
        }

        syncThenRefresh();
      };

      window.addEventListener("storage", onStorage);

      return () => {
        isActive = false;
        window.removeEventListener("storage", onStorage);
      };
    },
    [router, syncSession, syncUser],
  );

  useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  return null;
}
