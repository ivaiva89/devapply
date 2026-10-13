"use client";

import { NativeFormProvider, useNativeForm } from "@stackform/native";
import { useRouter } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";

import { authClient } from "@/shared/lib/auth/client";
import type { SocialProvider } from "@/shared/lib/auth/offered-providers";
import { detectTimezone } from "@/shared/lib/timezone/detect";

import {
  EmailField,
  PasswordField,
  validateEmail,
  validatePassword,
} from "./auth-form-fields";
import { OAuthButtons } from "./oauth-buttons";
import { TimezoneStep } from "./timezone-step";

interface SignUpValues extends Record<string, unknown> {
  email: string;
  password: string;
}

interface SignUpFormProps {
  // The social sign-in providers this environment offers.
  providers?: SocialProvider[];
}

const INITIAL_VALUES: SignUpValues = { email: "", password: "" };

const NO_PROVIDERS: SocialProvider[] = [];

export function SignUpForm({
  providers = NO_PROVIDERS,
}: SignUpFormProps): ReactNode {
  const router = useRouter();
  const form = useNativeForm<SignUpValues>(INITIAL_VALUES);
  const [formError, setFormError] = useState<string | null>(null);
  // The checked email and password of a sign-up that waits on the timezone
  // step, while that step is shown.
  const [waiting, setWaiting] = useState<SignUpValues | null>(null);

  // Whether the account was created.
  async function signUp(
    email: string,
    password: string,
    timezone: string,
  ): Promise<boolean> {
    // Better Auth requires a name; the design asks for none at sign-up, so
    // the email's local part stands in.
    const { error } = await authClient.signUp.email({
      email,
      password,
      name: email.split("@")[0] ?? email,
      timezone,
    });
    if (error) {
      setFormError(error.message ?? "Sign-up failed. Try again.");
      return false;
    }
    router.push(`/check-email?email=${encodeURIComponent(email)}`);
    return true;
  }

  async function submit(values: SignUpValues): Promise<void> {
    setFormError(null);
    const email = values.email.trim();
    const emailError = validateEmail(email);
    const passwordError = validatePassword(values.password);
    form.setFieldError("email", emailError);
    form.setFieldError("password", passwordError);
    if (emailError || passwordError) return;

    // A browser that reports UTC, or no usable zone, is asked first. Nothing
    // is sent until the step is answered.
    const timezone = detectTimezone();
    if (timezone === null || timezone === "UTC") {
      setWaiting({ email, password: values.password });
      return;
    }
    await signUp(email, values.password, timezone);
  }

  async function confirmTimezone(timezone: string): Promise<undefined> {
    if (!waiting) return;
    const isCreated = await signUp(waiting.email, waiting.password, timezone);
    // A refused sign-up goes back to the form, which shows the error.
    if (!isCreated) setWaiting(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    // A second press while the first is in flight sends nothing.
    if (form.isSubmitting) return;
    void form.handleSubmit(submit);
  }

  if (waiting) return <TimezoneStep onConfirm={confirmTimezone} />;

  return (
    <>
      <OAuthButtons providers={providers} />
      <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
        <NativeFormProvider form={form} formId="sign-up">
          <EmailField
            onValueChange={() => form.setFieldError("email", undefined)}
          />
          <PasswordField
            onValueChange={() => form.setFieldError("password", undefined)}
          />
        </NativeFormProvider>
        {formError ? (
          <p role="alert" className="text-danger text-[13px]">
            {formError}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={form.isSubmitting}
          className="bg-text text-canvas h-9 rounded-button text-[14px] font-medium hover:opacity-90 disabled:opacity-60"
        >
          Create account
        </button>
      </form>
    </>
  );
}
