"use client";

import Image from "next/image";
import {
  Button,
  Description,
  Drawer,
  Label,
  ListBox,
  useMediaQuery,
  useOverlayState,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { useShallow } from "zustand/react/shallow";

import { useAuthStore } from "@/store/auth";
import Icon from "@/utils/iconify";
import { IconUser } from "nucleo-glass";

const menuItems = [
  {
    description: "Profile, password, and preferences",
    icon: "solar:user-id-linear",
    id: "account-settings",
    label: "Account settings",
  },
  {
    description: "Alerts, mentions, and email updates",
    icon: "solar:bell-linear",
    id: "notifications",
    label: "Notifications",
  },
  {
    description: "Plan, invoices, and payment methods",
    icon: "solar:wallet-money-linear",
    id: "billing",
    label: "Billing",
  },
  {
    description: "Shortcuts, theme, and appearance",
    icon: "solar:widget-5-linear",
    id: "app-preferences",
    label: "App preferences",
  },
  {
    description: "Support docs and contact options",
    icon: "solar:question-circle-linear",
    id: "help-support",
    label: "Help and support",
  },
] as const;

export function UserMenu() {
  const router = useRouter();
  const state = useOverlayState();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { isSigningOut, signOut, user } = useAuthStore(
    useShallow((auth) => ({
      isSigningOut: auth.isSigningOut,
      signOut: auth.signOut,
      user: auth.user,
    })),
  );

  async function handleSignOut() {
    const result = await signOut();

    if (result.error) {
      return;
    }

    state.close();
    router.refresh();
  }

  return (
    <>
      <Button
        aria-label="Open user menu"
        isIconOnly
        size="sm"
        variant="ghost"
        onPress={!user ? () => router.push("/login") : state.open}
      >
        {user ? (
          <Image
            alt={user?.name ?? "User"}
            src={
              user?.avatarSrc ??
              `https://avatar.vercel.sh/vercel.svg?text=${user?.name?.slice(0, 1).toUpperCase()}`
            }
            width={24}
            height={24}
            className="rounded-full"
          />
        ) : (
          <IconUser className="size-5.5" />
        )}
      </Button>

      <Drawer.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
        <Drawer.Content placement={isDesktop ? "right" : "bottom"}>
          <Drawer.Dialog className={isDesktop ? "w-85 rounded-l-2xl p-4" : ""}>
            <Drawer.Handle />
            <Drawer.Header>
              <div className="flex items-center gap-3">
                <Image
                  alt={user?.name ?? "User"}
                  src={
                    user?.avatarSrc ??
                    `https://avatar.vercel.sh/vercel.svg?text=${user?.name?.slice(0, 1).toUpperCase()}`
                  }
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div className="flex flex-col">
                  <p className="text-sm font-medium">
                    {user?.name ?? "Sarah Johnson"}
                  </p>
                </div>
              </div>
            </Drawer.Header>
            <Drawer.Body>
              <ListBox
                aria-label="User navigation"
                className="w-full"
                selectionMode="none"
              >
                {menuItems.map((item) => (
                  <ListBox.Item
                    key={item.id}
                    id={item.id}
                    textValue={item.label}
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-default">
                      <Icon
                        icon={item.icon}
                        width={18}
                        height={18}
                        className="text-foreground"
                      />
                    </div>
                    <div className="flex flex-col">
                      <Label>{item.label}</Label>
                      <Description>{item.description}</Description>
                    </div>
                    <Icon
                      icon="solar:alt-arrow-right-linear"
                      width={16}
                      height={16}
                      className="ms-auto text-muted"
                    />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Drawer.Body>
            <Drawer.Footer>
              <Button
                fullWidth
                isDisabled={isSigningOut}
                slot="close"
                variant="danger"
                onPress={handleSignOut}
              >
                <Icon icon="solar:logout-2-linear" width={18} height={18} />
                {isSigningOut ? "Logging out..." : "Logout"}
              </Button>
            </Drawer.Footer>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </>
  );
}
