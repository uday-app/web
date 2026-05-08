"use client";

import {
  Button,
  DateField,
  Form,
  Input,
  InputGroup,
  Label,
  ListBox,
  Select,
  TextField,
} from "@heroui/react";
import {
  getLocalTimeZone,
  parseDate,
  today,
  type DateValue,
} from "@internationalized/date";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { I18nProvider } from "react-aria-components";
import { useShallow } from "zustand/react/shallow";

import { createUserProfile } from "@/actions/auth/create";
import { getPinCode } from "@/actions/pincode";
import { useAuthStore } from "@/store/auth";
import { useLoginStore } from "@/store/login";
import { USER_GENDERS, type UserGender } from "@/types/user";
import { Loader } from "@/ui/loader";
import { IconBulletList } from "nucleo-glass";

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

function getDateFieldValue(value: string): DateValue | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  try {
    return parseDate(value);
  } catch {
    return null;
  }
}

export function StepDetails() {
  const router = useRouter();
  const { closeLogin, updateAddressField, updateField, values } = useLoginStore(
    useShallow((state) => ({
      closeLogin: state.closeLogin,
      updateAddressField: state.updateAddressField,
      updateField: state.updateField,
      values: state.values,
    })),
  );
  const login = useAuthStore((state) => state.login);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLookingUpPincode, setIsLookingUpPincode] = useState(false);
  const [pincodeLookupError, setPincodeLookupError] = useState<string | null>(
    null,
  );
  const [showErrors, setShowErrors] = useState(false);
  const dateOfBirthValue = getDateFieldValue(values.date_of_birth);
  const maxDateOfBirth = today(getLocalTimeZone());
  const pincode = String(values.address.pincode ?? "").replace(/\D/g, "");

  const nameError =
    values.name.trim().length === 0
      ? "Enter your full name."
      : values.name.trim().length < 3
        ? "Enter your full name."
        : null;
  const dobError = values.date_of_birth ? null : "Select your date of birth.";
  const genderError = values.gender ? null : "Choose a gender.";
  const cityError =
    values.address.city.trim().length === 0
      ? "Enter your city."
      : values.address.city.trim().length < 2
        ? "Enter a valid city."
        : null;
  const pincodeError =
    pincode.length === 0
      ? "Enter your 6-digit pincode."
      : pincode.length !== 6
        ? "Enter a valid 6-digit pincode."
        : pincodeLookupError;
  const districtError =
    pincode.length === 6 && !values.address.district.trim()
      ? "District will be filled from pincode."
      : null;
  const stateError =
    pincode.length === 6 && !values.address.state.trim()
      ? "State will be filled from pincode."
      : null;

  const validationIssues = [
    nameError,
    dobError,
    genderError,
    pincodeError,
    cityError,
    districtError,
    stateError,
  ].filter((issue): issue is string => Boolean(issue));

  const shouldShowIssueSummary =
    Boolean(error) || (showErrors && validationIssues.length > 0);

  useEffect(() => {
    if (pincode.length !== 6) {
      return;
    }

    let isCurrent = true;
    const timer = window.setTimeout(() => {
      setIsLookingUpPincode(true);
      setPincodeLookupError(null);

      void getPinCode(pincode)
        .then((result) => {
          if (!isCurrent) {
            return;
          }

          setIsLookingUpPincode(false);

          if (!result) {
            setPincodeLookupError(
              "Could not find district and state for this pincode.",
            );
            return;
          }

          setPincodeLookupError(null);
          updateAddressField("district", result.district);
          updateAddressField("state", result.state);
        })
        .catch(() => {
          if (!isCurrent) {
            return;
          }

          setIsLookingUpPincode(false);
          setPincodeLookupError(
            "Could not find district and state for this pincode.",
          );
        });
    }, 300);

    return () => {
      isCurrent = false;
      window.clearTimeout(timer);
    };
  }, [pincode, updateAddressField]);

  const canSubmit =
    validationIssues.length === 0 &&
    !isLookingUpPincode &&
    Boolean(values.gender);

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
            country: "India",
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
       <div className="space-y-0.5">
        <h1 className="flex items-center gap-1.5 text-xl font-bold text-foreground"> <IconBulletList /> Account details</h1>
        <p className="text-xs text-muted">Complete the basic profile details required for your account.</p>
      </div> 
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            aria-label="Full name"
            className="sm:col-span-2"
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
            <Input placeholder="Rock Star" variant="secondary" />
          </TextField>

          <I18nProvider locale="en-GB">
            <DateField
              aria-label="Date of birth"
              isInvalid={showErrors && Boolean(dobError)}
              isRequired
              maxValue={maxDateOfBirth}
              name="dateOfBirth"
              shouldForceLeadingZeros
              value={dateOfBirthValue}
              onChange={(value) => {
                if (error) {
                  setError(null);
                }

                updateField("date_of_birth", value?.toString() ?? "");
              }}
            >
              <Label>Date of birth</Label>
              <DateField.Group fullWidth variant="secondary">
                <DateField.Input>
                  {(segment) => <DateField.Segment segment={segment} />}
                </DateField.Input>
              </DateField.Group>
            </DateField>
          </I18nProvider>

          <div className="space-y-2">
            <Select
              aria-label="Gender"
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
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            aria-label="Pincode"
            isInvalid={showErrors && Boolean(pincodeError)}
            isRequired
            name="pincode"
            onChange={(value) => {
              if (error) {
                setError(null);
              }

              setPincodeLookupError(null);
              setIsLookingUpPincode(false);
              updateAddressField("district", "");
              updateAddressField("state", "");
              updateAddressField(
                "pincode",
                value.replace(/\D/g, "").slice(0, 6),
              );
            }}
            value={String(values.address.pincode ?? "")}
          >
            <Label>Pincode</Label>
            <InputGroup variant="secondary">
              <InputGroup.Input
                className="w-full"
                inputMode="numeric"
                maxLength={6}
                placeholder="203205"
              />

              <InputGroup.Suffix>
                {isLookingUpPincode && <Loader />}
              </InputGroup.Suffix>
            </InputGroup>
          </TextField>

          <TextField
            aria-label="City"
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
            <Input placeholder="Sikandrabad" variant="secondary" />
          </TextField>

          <TextField
            aria-label="District"
            isInvalid={showErrors && Boolean(districtError)}
            isRequired
            isReadOnly
            name="district"
            value={values.address.district}
          >
            <Label>District</Label>
            <Input placeholder="Bulandshahr" variant="secondary" />
          </TextField>

          <TextField
            aria-label="State"
            isInvalid={showErrors && Boolean(stateError)}
            isRequired
            isReadOnly
            name="state"
            value={values.address.state}
          >
            <Label>State</Label>
            <Input placeholder="Uttar Pradesh" variant="secondary" />
          </TextField>
        </div>
      </div>

      <Button
        fullWidth
        isDisabled={isSubmitting || isLookingUpPincode}
        type="submit"
      >
        {isSubmitting ? (
          <>
            <Loader />
            Creating account . . .
          </>
        ) : (
          "Create account"
        )}
      </Button>

      {shouldShowIssueSummary ? (
        <div className="rounded-md border border-danger/35 bg-danger/8 p-3 text-sm text-danger">
          {error ? <p>{error}</p> : null}
          {validationIssues.length > 0 ? (
            <ul className="list-disc space-y-1 ps-5">
              {validationIssues.map((issue) => (
                <li key={issue}>{issue}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </Form>
  );
}
