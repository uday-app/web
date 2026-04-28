"use client";

import { Card } from "@heroui/react";

import { useLoginStore } from "@/store/login";
import type { LoginSurface } from "@/types/login";

import { StepDetails } from "./details";
import { StepOtp } from "./otp";
import { StepPhone } from "./phone";

export function LoginStepFlow({ surface }: LoginSurface) {
  const step = useLoginStore((state) => state.step);

  if (surface === "page") {
    return (
      <Card className="min-w-sm">
        {step === "phone" ? <StepPhone /> : null}
        {step === "otp" ? <StepOtp /> : null}
        {step === "details" ? <StepDetails /> : null}
      </Card>
    );
  }

  return (
    <>
      {step === "phone" ? <StepPhone /> : null}
      {step === "otp" ? <StepOtp /> : null}
      {step === "details" ? <StepDetails /> : null}
    </>
  );
}
