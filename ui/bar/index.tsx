"use client";

import {
  CloseButton,
  Drawer,
  InputGroup,
  Modal,
  ScrollShadow,
  SearchField,
  TextField,
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
        <SearchInput
          className="fixed bottom-2 left-1/2 z-50 w-[95%] -translate-x-1/2 md:w-160"
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
        header={<SearchInput onChange={setQuery} value={query} />}
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

  if (isDesktop) {
    return (
      <Modal.Backdrop isOpen={isOpen} onOpenChange={handleOpenChange}>
        <Modal.Container>
          <Modal.Dialog
            aria-label="Search Modal"
            className="h-[60dvh] max-h-[calc(100%-10px)] max-w-160 p-2.5"
          >
            <Modal.Header>{header}</Modal.Header>
            <Modal.Body>{body}</Modal.Body>
            <Modal.Footer className="mt-0">{footer}</Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    );
  }

  return (
    <Drawer.Backdrop isOpen={isOpen} onOpenChange={handleOpenChange}>
      <Drawer.Content placement="bottom">
        <Drawer.Dialog aria-label="Search Drawer" className="h-[60dvh] p-2.5">
          <Drawer.Handle />
          <Drawer.Header>{header}</Drawer.Header>
          <Drawer.Body>{body}</Drawer.Body>
          <Drawer.Footer className="mt-0">{footer}</Drawer.Footer>
        </Drawer.Dialog>
      </Drawer.Content>
    </Drawer.Backdrop>
  );
}

type SearchInputProps = {
  className?: string;
  onActivate?: () => void;
  onChange: (value: string) => void;
  value: string;
};

function SearchInput({
  className,
  onActivate,
  onChange,
  value,
}: SearchInputProps) {
  return (
    <TextField
      aria-label="Search"
      className={className}
      onChange={onChange}
      value={value}
    >
      <InputGroup>
        <InputGroup.Prefix>
          <SearchField.SearchIcon />
        </InputGroup.Prefix>
        <Command.Input
          asChild
          onValueChange={onChange}
          placeholder="What do you need ?"
          value={value}
        />
        <InputGroup.Input
          onClick={onActivate}
          onFocus={onActivate}
          placeholder="What do you need ?"
        />
        <InputGroup.Suffix className="gap-1">
          <CloseButton
            aria-label="Clear search"
            className={value ? undefined : "invisible"}
            isDisabled={!value}
            onPress={() => onChange("")}
          />
          <UserMenu />
        </InputGroup.Suffix>
      </InputGroup>
    </TextField>
  );
}
