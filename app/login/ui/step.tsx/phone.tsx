"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Button,
  Checkbox,
  Description,
  FieldError,
  Form,
  InputGroup,
  Label,
  TextField,
} from "@heroui/react";
import { useShallow } from "zustand/react/shallow";

import { sendOtp } from "@/actions/auth/otp";
import { useLoginStore } from "@/store/login";

import { Loader } from "@/ui/loader";
import { IconUser } from "nucleo-glass";

export function StepPhone() {
  const {
    phone,
    phoneNational,
    phoneError,
    otpError,
    isSendingOtp,
    phonePlaceholder,
    phoneMaxLength,
    setPhoneNational,
    startOtpRequest,
    finishOtpRequest,
    setStep,
  } = useLoginStore(
    useShallow((state) => ({
      phone: state.values.phone,
      phoneNational: state.values.phone_national,
      phoneError: state.phoneError,
      otpError: state.otpError,
      isSendingOtp: state.isSendingOtp,
      phonePlaceholder: state.phonePlaceholder,
      phoneMaxLength: state.phoneMaxLength,
      setPhoneNational: state.setPhoneNational,
      startOtpRequest: state.startOtpRequest,
      finishOtpRequest: state.finishOtpRequest,
      setStep: state.setStep,
    })),
  );
  const [showPhoneError, setShowPhoneError] = useState(false);
  const isSubmitDisabled =
    isSendingOtp || Boolean(phoneError) || !phoneNational.trim();

  async function handleSendOtp() {
    if (isSubmitDisabled) {
      return;
    }

    startOtpRequest();
    const result = await sendOtp(phone);
    finishOtpRequest(result.error);

    if (!result.error) {
      setStep("otp");
    }
  }

  return (
    <Form
      className="flex flex-col gap-4"
      aria-label="Phone login"
      validationBehavior="aria"
      onSubmit={async (event) => {
        event.preventDefault();
        setShowPhoneError(true);
        if (phone) {
          await handleSendOtp();
        }
      }}
    >
      <div className="space-y-0.5">
        <h1 className="flex items-center gap-1.5 text-xl font-bold text-foreground"> <IconUser /> User Login</h1>
        <p className="text-xs text-muted">Login to your account - enjoy exclusive features and many more.</p>
      </div>
      <TextField
        aria-label="Phone"
        isInvalid={showPhoneError && Boolean(phoneError)}
        isRequired
        name="phone"
        onChange={(value) => {
          if (showPhoneError) {
            setShowPhoneError(false);
          }
          setPhoneNational(value);
        }}
        value={phoneNational}
      >
        <Label>Phone</Label>
        <InputGroup variant="secondary">
          <InputGroup.Prefix>+91</InputGroup.Prefix>
          <InputGroup.Input
            aria-label="Enter mobile number"
            autoComplete="tel-national"
            inputMode="tel"
            maxLength={phoneMaxLength + Math.floor(phoneMaxLength / 2)}
            placeholder={phonePlaceholder}
          />
        </InputGroup>
        {showPhoneError && phoneError ? (
          <FieldError>{phoneError}</FieldError>
        ) : (
          <Description>
            We will send you an OTP to verify your number.
          </Description>
        )}
      </TextField>

      {otpError ? <p className="text-sm text-danger">{otpError}</p> : null}
      <Checkbox defaultSelected id="terms" className="mx-auto">
        <Checkbox.Control>
          <Checkbox.Indicator />
        </Checkbox.Control>
        <Checkbox.Content className="flex-row gap-1">
          <p className="text-xs text-center">I agree to</p>
          <Link className="text-muted text-xs" href="/terms" target="_blank">
            Terms & Conditions
          </Link>
        </Checkbox.Content>
      </Checkbox>
      <Button fullWidth isDisabled={isSubmitDisabled} type="submit">
        {isSendingOtp ? (
          <>
            <Loader />
            Sending OTP . . .
          </>
        ) : (
          "Send OTP"
        )}
      </Button>
    </Form>
  );
}
