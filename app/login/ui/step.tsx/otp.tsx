"use client";

import { useEffect, useState } from "react";

import {
  Button,
  Form,
  InputOTP,
  REGEXP_ONLY_DIGITS,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { useShallow } from "zustand/react/shallow";

import { sendOtp } from "@/actions/auth/otp";
import { verifyOtp } from "@/actions/auth/verify";
import { useAuthStore } from "@/store/auth";
import { useLoginStore } from "@/store/login";
import { Loader } from "@/ui/loader";
import { IconGearKeyhole } from "nucleo-glass";

const OTP_LENGTH = 6;
const OTP_TTL_SECONDS = 60;

function formatCountdown(seconds: number) {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const remainingSeconds = (seconds % 60).toString().padStart(2, "0");

  return `${minutes}:${remainingSeconds}`;
}

function toAuthPhone(value: string) {
  return Number(value.replace(/\D/g, "") || "0");
}

export function StepOtp() {
  const router = useRouter();
  const { closeLogin, hydrateFromUser, otp, phone, setStep, updateField } =
    useLoginStore(
      useShallow((state) => ({
        closeLogin: state.closeLogin,
        hydrateFromUser: state.hydrateFromUser,
        otp: state.values.otp,
        phone: state.values.phone,
        setStep: state.setStep,
        updateField: state.updateField,
      })),
    );
  const login = useAuthStore((state) => state.login);
  const [error, setError] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(OTP_TTL_SECONDS);

  function goBackOrHome() {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/");
  }

  useEffect(() => {
    if (secondsLeft === 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      setSecondsLeft((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [secondsLeft]);

  async function handleVerify(nextOtp = otp) {
    const token = nextOtp.replace(/\D/g, "").slice(0, OTP_LENGTH);

    if (token.length !== OTP_LENGTH || isVerifying) {
      return;
    }

    setError(null);
    setIsVerifying(true);

    const res = await verifyOtp(phone, token);

    setIsVerifying(false);

    if (res.error) {
      setError(res.error);

      if (res.editNumber) {
        updateField("otp", "");
        setStep("phone");
      }

      return;
    }

    if (res.needsDetails) {
      hydrateFromUser(res.user);
      updateField("otp", "");
      setStep("details");
      return;
    }

    if (res.user) {
      login({
        avatarSrc: res.user.avatar_url,
        id: res.user.auth_id ?? res.user.id,
        name: res.user.name?.trim() || "User",
        phone: toAuthPhone(res.user.phone),
      });
      closeLogin();
      goBackOrHome();
      return;
    }

    setStep("details");
  }

  async function handleResendOtp() {
    if (secondsLeft > 0 || isResending || isVerifying) {
      return;
    }

    setError(null);
    setIsResending(true);

    const res = await sendOtp(phone);

    setIsResending(false);

    if (res.error) {
      setError(res.error);
      return;
    }

    updateField("otp", "");
    setSecondsLeft(OTP_TTL_SECONDS);
  }

  return (
    <Form
      aria-label="Verification code"
      className="flex flex-col gap-2"
      onSubmit={async (event) => {
        event.preventDefault();

        if (otp) {
          await handleVerify();
        }
      }}
    >
       <div className="space-y-0.5">
        <h1 className="flex items-center gap-1.5 text-xl font-bold text-foreground"> <IconGearKeyhole /> Verify code</h1>
        <p className="text-xs text-muted">Sent to {phone} <button
              type="button"
              onClick={() => {
                setError(null);
                updateField("otp", "");
                setStep("phone");
              }}
            >
              Edit
            </button></p>
      </div> 

      <InputOTP
        autoFocus
        aria-label="Enter verification code"
        className="justify-center overflow-hidden p-2"
        maxLength={OTP_LENGTH}
        onChange={(value) => {
          const nextOtp = value.replace(/\D/g, "").slice(0, OTP_LENGTH);

          if (error) {
            setError(null);
          }

          updateField("otp", nextOtp);

          if (nextOtp.length === OTP_LENGTH) {
            void handleVerify(nextOtp);
          }
        }}
        pattern={REGEXP_ONLY_DIGITS}
        value={otp}
        variant="secondary"
      >
        <InputOTP.Group>
          <InputOTP.Slot index={0} />
          <InputOTP.Slot index={1} />
          <InputOTP.Slot index={2} />
        </InputOTP.Group>
        <InputOTP.Separator />
        <InputOTP.Group>
          <InputOTP.Slot index={3} />
          <InputOTP.Slot index={4} />
          <InputOTP.Slot index={5} />
        </InputOTP.Group>
      </InputOTP>

      <div className="flex items-center justify-between gap-3 text-sm text-foreground/62">
        <p className="text-foreground">{formatCountdown(secondsLeft)}</p>
        <Button
          isDisabled={secondsLeft > 0 || isResending || isVerifying}
          size="sm"
          type="button"
          variant="ghost"
          onPress={handleResendOtp}
        >
          {isResending ? "Sending . . ." : "Resend OTP"}
        </Button>
      </div>

      <Button
        fullWidth
        isDisabled={isVerifying || otp.length !== OTP_LENGTH}
        type="submit"
      >
        {isVerifying ? (
          <>
            <Loader />
            Verifying . . .
          </>
        ) : (
          "Verify OTP"
        )}
      </Button>
      {error ? (
        <p className="text-sm text-danger text-center">{error}</p>
      ) : null}
    </Form>
  );
}
