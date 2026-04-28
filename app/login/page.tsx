"use client";

import { LoginStepFlow } from "./ui/step.tsx";

export default function LoginPage() {
  return (
    <main className="grow m-auto flex items-center p-2">
      <LoginStepFlow surface="page" />
    </main>
  );
}
