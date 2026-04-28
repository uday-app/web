"use client";

import { Drawer, Modal, useMediaQuery } from "@heroui/react";
import { useRouter } from "next/navigation";
import { type ReactNode } from "react";

export function ModalDrawer({ children }: { children: ReactNode }) {
  const router = useRouter();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      router.back();
    }
  };

  if (isDesktop) {
    return (
      <Modal.Backdrop isOpen onOpenChange={handleOpenChange}>
        <Modal.Container>
          <Modal.Dialog aria-label="Login with phone" className="p-4">
            <Modal.CloseTrigger />
            <Modal.Body className="overflow-hidden p-2">{children}</Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    );
  }

  return (
    <Drawer.Backdrop isOpen onOpenChange={handleOpenChange}>
      <Drawer.Content placement="bottom">
        <Drawer.Dialog aria-label="Login with phone">
          <Drawer.Handle />
          <Drawer.Body>{children}</Drawer.Body>
        </Drawer.Dialog>
      </Drawer.Content>
    </Drawer.Backdrop>
  );
}
