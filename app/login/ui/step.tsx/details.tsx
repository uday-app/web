"use client";

import {
  Button,
  Description,
  FieldError,
  Form,
  Input,
  Label,
  ListBox,
  Select,
  TextField,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";

import { createUserProfile } from "@/actions/auth/create";
import { useAuthStore } from "@/store/auth";
import { useLoginStore } from "@/store/login";
import {
  USER_GENDERS,
  type UserGender,
} from "@/types/user";

import { LoginTitle } from "../title";

const genderLabels: Record<UserGender, string> = {
  male: "Male",
  female: "Female",
  other: "Other",
  prefer_not_to_say: "Prefer not to say",
};

function getPhoneNumberValue(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return Number(digits || "0");
}

export function StepDetails() {
  const router = useRouter();
  const { closeLogin, setStep, updateAddressField, updateField, values } =
    useLoginStore(
      useShallow((state) => ({
        closeLogin: state.closeLogin,
        setStep: state.setStep,
        updateAddressField: state.updateAddressField,
        updateField: state.updateField,
        values: state.values,
      })),
    );
  const login = useAuthStore((state) => state.login);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const nameError =
    values.name.trim().length > 0 && values.name.trim().length < 3
      ? "Enter your full name."
      : null;
  const dobError = values.date_of_birth ? null : "Select your date of birth.";
  const genderError = values.gender ? null : "Choose a gender.";
  const cityError =
    values.address.city.trim().length > 0 &&
    values.address.city.trim().length < 2
      ? "Enter a valid city."
      : null;
  const districtError =
    values.address.district.trim().length > 0 &&
    values.address.district.trim().length < 2
      ? "Enter a valid district."
      : null;
  const stateError =
    values.address.state.trim().length > 0 &&
    values.address.state.trim().length < 2
      ? "Enter a valid state."
      : null;
  const countryError =
    values.address.country.trim().length > 0 &&
    values.address.country.trim().length < 2
      ? "Enter a valid country."
      : null;

  const canSubmit =
    values.name.trim().length >= 3 &&
    Boolean(values.date_of_birth) &&
    Boolean(values.gender) &&
    values.address.city.trim().length >= 2 &&
    values.address.district.trim().length >= 2 &&
    values.address.state.trim().length >= 2 &&
    values.address.country.trim().length >= 2;

  function goBackOrHome() {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/");
  }

  return (
    <Form
      aria-label="Profile details"
      className="flex flex-col gap-5"
      validationBehavior="aria"
      onSubmit={async (event) => {
        event.preventDefault();
        setShowErrors(true);

        if (!canSubmit || isSubmitting || !values.gender) {
          return;
        }

        setError(null);
        setIsSubmitting(true);

        const result = await createUserProfile({
          address: {
            city: values.address.city.trim(),
            country: values.address.country.trim(),
            district: values.address.district.trim(),
            pincode: String(values.address.pincode ?? "").trim(),
            state: values.address.state.trim(),
          },
          date_of_birth: values.date_of_birth,
          gender: values.gender,
          name: values.name.trim(),
        });

        setIsSubmitting(false);

        if (result.error || !result.user) {
          setError(result.error ?? "Unable to create your profile.");
          return;
        }

        login({
          avatarSrc: result.user.avatar_url,
          id: result.user.auth_id ?? result.user.id,
          name: result.user.name?.trim() || values.name.trim(),
          phone: getPhoneNumberValue(result.user.phone),
        });
        closeLogin();
        goBackOrHome();
      }}
    >
      <LoginTitle
        description="Complete the basic profile details required for your account."
        icon="fa7-solid:user-pen"
        title="Account details"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          isInvalid={showErrors && Boolean(nameError)}
          isRequired
          name="name"
          onChange={(value) => {
            if (error) {
              setError(null);
            }

            updateField("name", value);
          }}
          value={values.name}
        >
          <Label>Full name</Label>
          <Input placeholder="Aarav Sharma" variant="secondary" />
          {nameError ? (
            <FieldError>{nameError}</FieldError>
          ) : (
            <Description>Use your full name.</Description>
          )}
        </TextField>

        <TextField
          isInvalid={showErrors && Boolean(dobError)}
          isRequired
          name="dateOfBirth"
          onChange={(value) => {
            if (error) {
              setError(null);
            }

            updateField("date_of_birth", value);
          }}
          value={values.date_of_birth}
        >
          <Label>Date of birth</Label>
          <Input type="date" variant="secondary" />
          {showErrors && dobError ? <FieldError>{dobError}</FieldError> : null}
        </TextField>

        <div className="space-y-2">
          <Select
            isInvalid={showErrors && Boolean(genderError)}
            isRequired
            selectedKey={values.gender ?? null}
            variant="secondary"
            onSelectionChange={(key) =>
              updateField("gender", key ? (String(key) as UserGender) : null)
            }
          >
            <Label>Gender</Label>
            <Select.Trigger>
              <Select.Value>
                {({ selectedText }) => selectedText || "Select gender"}
              </Select.Value>
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox aria-label="Gender options">
                {USER_GENDERS.map((gender) => (
                  <ListBox.Item
                    id={gender}
                    key={gender}
                    textValue={genderLabels[gender]}
                  >
                    {genderLabels[gender]}
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
          {showErrors && genderError ? (
            <p className="text-sm text-danger">{genderError}</p>
          ) : null}
        </div>

        <TextField
          isInvalid={showErrors && Boolean(cityError)}
          isRequired
          name="city"
          onChange={(value) => {
            if (error) {
              setError(null);
            }

            updateAddressField("city", value);
          }}
          value={values.address.city}
        >
          <Label>City</Label>
          <Input placeholder="Indore" variant="secondary" />
          {cityError ? <FieldError>{cityError}</FieldError> : null}
        </TextField>

        <TextField
          isInvalid={showErrors && Boolean(districtError)}
          isRequired
          name="district"
          onChange={(value) => {
            if (error) {
              setError(null);
            }

            updateAddressField("district", value);
          }}
          value={values.address.district}
        >
          <Label>District</Label>
          <Input placeholder="Indore" variant="secondary" />
          {districtError ? <FieldError>{districtError}</FieldError> : null}
        </TextField>

        <TextField
          isInvalid={showErrors && Boolean(stateError)}
          isRequired
          name="state"
          onChange={(value) => {
            if (error) {
              setError(null);
            }

            updateAddressField("state", value);
          }}
          value={values.address.state}
        >
          <Label>State</Label>
          <Input placeholder="Madhya Pradesh" variant="secondary" />
          {stateError ? <FieldError>{stateError}</FieldError> : null}
        </TextField>

        <TextField
          isInvalid={showErrors && Boolean(countryError)}
          isRequired
          name="country"
          onChange={(value) => {
            if (error) {
              setError(null);
            }

            updateAddressField("country", value);
          }}
          value={values.address.country}
        >
          <Label>Country</Label>
          <Input placeholder="India" variant="secondary" />
          {countryError ? <FieldError>{countryError}</FieldError> : null}
        </TextField>

        <TextField
          className="sm:col-span-2"
          name="pincode"
          onChange={(value) => {
            if (error) {
              setError(null);
            }

            updateAddressField("pincode", value.replace(/\D/g, ""));
          }}
          value={String(values.address.pincode ?? "")}
        >
          <Label>Pincode</Label>
          <Input inputMode="numeric" placeholder="452001" variant="secondary" />
          <Description>
            Optional, but useful for delivery and billing defaults.
          </Description>
        </TextField>
      </div>

      {error ? <p className="text-sm text-danger">{error}</p> : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <Button
          fullWidth
          type="button"
          variant="secondary"
          onPress={() => setStep("otp")}
        >
          Back to verification
        </Button>
        <Button fullWidth isDisabled={isSubmitting || !canSubmit} type="submit">
          <Icon className="size-5" icon="solar:user-check-linear" />
          {isSubmitting ? "Creating account..." : "Finish sign in"}
        </Button>
      </div>
    </Form>
  );
}
