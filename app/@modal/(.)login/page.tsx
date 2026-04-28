"use client";

import { ModalDrawer } from "@/app/login/ui/modaldrawer";
import { LoginStepFlow } from "@/app/login/ui/step.tsx";

export default function LoginPage() {
  return (
    <ModalDrawer>
      <LoginStepFlow surface="modal" />
    </ModalDrawer>
  );
}
