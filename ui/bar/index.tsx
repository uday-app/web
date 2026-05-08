"use client";

import {
  Button,
  cn,
  Drawer,
  Modal,
  ScrollShadow,
  useMediaQuery,
} from "@heroui/react";
import { type ReactNode } from "react";
import { Command } from "cmdk";
import { useTheme } from "next-themes";
import { useHotkeys } from "react-hotkeys-hook";

import { useSearchStore } from "@/store/search";

import { UserMenu } from "./login";
import { Orders } from "./orders";
import { QuickActions } from "./quick";
import { CommandTabs } from "./tabs";
import { IconCircleArrowLeft, IconDeleteX, IconMagnifier } from "nucleo-glass";
import { useAuthStore } from "@/store/auth";
import { useShallow } from "zustand/shallow";

export function SearchBar() {
  const { setTheme } = useTheme();
  const { query, setQuery, isOpen, onOpen, onKeyDown, shouldFilter, tab } =
    useSearchStore();

  useHotkeys("d", () => setTheme("dark"), [setTheme]);
  useHotkeys("l", () => setTheme("light"), [setTheme]);
  useHotkeys("s", () => setTheme("system"), [setTheme]);

  return (
    <Command
      label="Global search"
      onKeyDown={onKeyDown}
      shouldFilter={shouldFilter}
    >
      {!isOpen && (
        <CommandInput
          className="fixed bottom-2 left-1/2 z-50 w-[95%] -translate-x-1/2 md:w-160 bg-field shadow-field dark:bg-[#1C1C1E]/75 supports-backdrop-filter:backdrop-blur-xs supports-backdrop-filter:backdrop-saturate-150 rounded-field"
          onActivate={onOpen}
          onChange={setQuery}
          value={query}
        />
      )}

      <ModalDrawer
        body={
          <ScrollShadow className="h-full" hideScrollBar>
            <Command.List className="space-y-4 outline-none">
              <Command.Empty className="px-3 py-8 text-center text-sm text-muted">
                No results found.
              </Command.Empty>
              {tab === "actions" && <QuickActions />}
              {tab === "orders" && <Orders />}
            </Command.List>
          </ScrollShadow>
        }
        header={<CommandInput onChange={setQuery} value={query} />}
        footer={<CommandTabs />}
      />
    </Command>
  );
}

type ModalDrawerProps = {
  header?: ReactNode;
  body?: ReactNode;
  footer?: ReactNode;
};

function ModalDrawer({ header, body, footer }: ModalDrawerProps) {
  const { isOpen, onClose, onOpen } = useSearchStore();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleOpenChange = (open: boolean) => {
    if (open) {
      onOpen();
      return;
    }

    onClose();
  };
  const { user } = useAuthStore(
    useShallow((auth) => ({
      user: auth.user,
    })),
  );

  if (isDesktop) {
    return (
      <Modal.Backdrop isOpen={isOpen} onOpenChange={handleOpenChange}>
        <Modal.Container className="p-1">
          <Modal.Dialog
            aria-label="Search Modal"
            className="h-[60dvh] max-w-160 p-0"
          >
            <Modal.Header className="p-1 border-b">{header}</Modal.Header>
            <Modal.Body className="px-2">{body}</Modal.Body>
            {user && (
              <Modal.Footer className="mt-0 p-1 border-t">
                {footer}
              </Modal.Footer>
            )}
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    );
  }

  return (
    <Drawer.Backdrop isOpen={isOpen} onOpenChange={handleOpenChange}>
      <Drawer.Content placement="bottom">
        <Drawer.Dialog aria-label="Search Drawer" className="h-[70%] p-0">
          <Drawer.Handle />
          <Drawer.Header className="p-1 border-b">{header}</Drawer.Header>
          <Drawer.Body className="px-2">{body}</Drawer.Body>
          {user && (
            <Drawer.Footer className="mt-0 p-1 border-t">
              {footer}
            </Drawer.Footer>
          )}
        </Drawer.Dialog>
      </Drawer.Content>
    </Drawer.Backdrop>
  );
}

type CommandInputProps = {
  className?: string;
  onActivate?: () => void;
  onChange: (value: string) => void;
  value: string;
};

function CommandInput({
  className,
  onActivate,
  onChange,
  value,
}: CommandInputProps) {
  const { bounce, page, setPage, setShouldFilter } = useSearchStore();

  const handleBack = () => {
    bounce();
    setPage(null);
    setShouldFilter(true);
    onChange("");
  };
  return (
    <div
      className={cn("flex w-full items-center px-1 py-0.5", className)}
      data-slot="command-input-wrapper"
    >
      <div className="flex flex-1 items-center gap-0.5">
        <div className="flex items-center gap-2.5">
          <Button
            aria-label="Open user menu"
            isIconOnly
            size="sm"
            variant="ghost"
            onPress={page ? handleBack : undefined}
          >
            {page ? (
              <IconCircleArrowLeft className="size-5.5" />
            ) : (
              <IconMagnifier
                className="size-5.5"
                style={
                  {
                    "--nc-gradient-1-color-1": "#FF7A00",
                    "--nc-gradient-1-color-2": "#C40000",
                  } as React.CSSProperties
                }
              />
            )}
          </Button>
        </div>

        <Command.Input
          className="placeholder:text-foreground-500 text-medium flex w-full bg-transparent bg-clip-text font-normal outline-hidden placeholder:text-sm disabled:cursor-not-allowed disabled:opacity-50"
          onClick={onActivate}
          onFocus={onActivate}
          onValueChange={onChange}
          placeholder="What do you need ?"
          value={value}
        />
        <div className="flex items-center gap-0.5">
          {value && (
            <Button
              aria-label="Open user menu"
              isIconOnly
              size="sm"
              variant="ghost"
              onPress={() => onChange("")}
            >
              <IconDeleteX className="size-5.5" />
            </Button>
          )}
          <UserMenu />
        </div>
      </div>
    </div>
  );
}
