"use client";

import { create } from "zustand";
import {
  AsYouType,
  getExampleNumber,
  parsePhoneNumberFromString,
} from "libphonenumber-js";
import examples from "libphonenumber-js/mobile/examples";

import type { LoginStep } from "@/types/login";
import type {
  UserAddress,
  UserGender,
  UserRole,
  UserRow,
  UserUpdate,
} from "@/types/user";

type LoginDraft = {
  phone_national: string;
  phone: string;
  otp: string;
  name: string;
  date_of_birth: string;
  gender: UserGender | null;
  role: UserRole;
  address: UserAddress;
};

type LoginStore = {
  isOpen: boolean;
  step: LoginStep;
  values: LoginDraft;
  phoneError: string | null;
  otpError: string | null;
  isSendingOtp: boolean;
  phonePlaceholder: string;
  phoneMaxLength: number;
  openLogin: () => void;
  closeLogin: () => void;
  resetFlow: () => void;
  setStep: (step: LoginStep) => void;
  updateField: <K extends keyof LoginDraft>(
    field: K,
    value: LoginDraft[K],
  ) => void;
  updateAddressField: <K extends keyof UserAddress>(
    field: K,
    value: UserAddress[K],
  ) => void;
  setPhoneNational: (value: string) => void;
  startOtpRequest: () => void;
  finishOtpRequest: (error?: string | null) => void;
  hydrateFromUser: (
    user?: Partial<UserRow> | Partial<UserUpdate> | null,
  ) => void;
};

const INDIA_CALLING_CODE = "+91";
const INDIA_COUNTRY = "IN";
const INDIA_PHONE_EXAMPLE =
  getExampleNumber(INDIA_COUNTRY, examples)?.formatNational() ?? "99272 41144";
const INDIA_PHONE_LENGTH =
  getExampleNumber(INDIA_COUNTRY, examples)?.nationalNumber.length ?? 10;

function buildPhoneState(value: string) {
  const digitsOnly = value.replace(/\D/g, "").slice(0, INDIA_PHONE_LENGTH);
  const formatter = new AsYouType(INDIA_COUNTRY);
  const phoneNational = formatter.input(digitsOnly);
  const parsedNumber = formatter.getNumber();
  const digits = phoneNational.replace(/\D/g, "");
  const phone = parsedNumber?.number ?? `${INDIA_CALLING_CODE}${digits}`;
  const phoneError =
    value.trim().length > 0 && !parsedNumber?.isValid()
      ? "Enter a valid mobile number."
      : null;

  return {
    phone,
    phoneError,
    phoneNational,
  };
}

function toStringValue(value: string | number | undefined) {
  if (typeof value === "number") {
    return String(value);
  }

  return value ?? "";
}

const initialValues = (): LoginDraft => ({
  phone_national: "",
  phone: INDIA_CALLING_CODE,
  otp: "",
  name: "",
  date_of_birth: "",
  gender: null,
  role: "user",
  address: {
    city: "",
    district: "",
    state: "",
    country: "India",
    pincode: "",
  },
});

export const useLoginStore = create<LoginStore>((set) => ({
  isOpen: false,
  step: "phone",
  values: initialValues(),
  phoneError: null,
  otpError: null,
  isSendingOtp: false,
  phonePlaceholder: INDIA_PHONE_EXAMPLE,
  phoneMaxLength: INDIA_PHONE_LENGTH,
  openLogin: () => set({ isOpen: true }),
  closeLogin: () =>
    set({
      isOpen: false,
      step: "phone",
      values: initialValues(),
      phoneError: null,
      otpError: null,
      isSendingOtp: false,
      phonePlaceholder: INDIA_PHONE_EXAMPLE,
      phoneMaxLength: INDIA_PHONE_LENGTH,
    }),
  resetFlow: () =>
    set({
      step: "phone",
      values: initialValues(),
      phoneError: null,
      otpError: null,
      isSendingOtp: false,
      phonePlaceholder: INDIA_PHONE_EXAMPLE,
      phoneMaxLength: INDIA_PHONE_LENGTH,
    }),
  setStep: (step) => set({ step }),
  updateField: (field, value) =>
    set((state) => ({
      values: {
        ...state.values,
        [field]: value,
      },
    })),
  updateAddressField: (field, value) =>
    set((state) => ({
      values: {
        ...state.values,
        address: {
          ...state.values.address,
          [field]: value,
        },
      },
    })),
  setPhoneNational: (value) =>
    set((state) => {
      const nextPhoneState = buildPhoneState(value);

      return {
        phoneError: nextPhoneState.phoneError,
        otpError: null,
        values: {
          ...state.values,
          phone_national: nextPhoneState.phoneNational,
          phone: nextPhoneState.phone,
        },
      };
    }),
  startOtpRequest: () => set({ isSendingOtp: true, otpError: null }),
  finishOtpRequest: (error) =>
    set({
      isSendingOtp: false,
      otpError: error ?? null,
    }),
  hydrateFromUser: (user) => {
    if (!user) {
      return;
    }

    const parsedPhone = user.phone
      ? parsePhoneNumberFromString(user.phone)
      : null;
    const nextPhoneState = parsedPhone
      ? buildPhoneState(parsedPhone.formatNational())
      : null;

    set((state) => ({
      phoneError: nextPhoneState?.phoneError ?? state.phoneError,
      values: {
        ...state.values,
        phone_national:
          nextPhoneState?.phoneNational ?? state.values.phone_national,
        phone: nextPhoneState?.phone ?? user.phone ?? state.values.phone,
        name: user.name ?? state.values.name,
        date_of_birth: user.date_of_birth ?? state.values.date_of_birth,
        gender: user.gender ?? state.values.gender,
        role: user.role ?? state.values.role,
        address: {
          city: user.address?.city ?? state.values.address.city,
          district: user.address?.district ?? state.values.address.district,
          state: user.address?.state ?? state.values.address.state,
          country: user.address?.country ?? state.values.address.country,
          pincode:
            toStringValue(user.address?.pincode) ||
            toStringValue(state.values.address.pincode),
        },
      },
    }));
  },
}));
