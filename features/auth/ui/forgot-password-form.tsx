"use client";

import { NativeFormProvider, useNativeForm } from "@stackform/native";
import { useState, type FormEvent, type ReactNode } from "react";

import { authClient } from "@/shared/lib/auth/client";

import { EmailField, validateEmail } from "./auth-form-fields";

interface ForgotPasswordValues extends Record<string, unknown> {
  email: string;
}

type RequestState =
  | { status: "idle" }
  | { status: "failed"; message: string }
  | { status: "sent"; email: string };

const INITIAL_VALUES: ForgotPasswordValues = { email: "" };

export function ForgotPasswordForm(): ReactNode {
  const form = useNativeForm<ForgotPasswordValues>(INITIAL_VALUES);
  const [state, setState] = useState<RequestState>({ status: "idle" });

  async function submit(values: ForgotPasswordValues): Promise<void> {
    setState({ status: "idle" });
    const email = values.email.trim();
    const emailError = validateEmail(email);
    form.setFieldError("email", emailError);
    if (emailError) return;

    // The server answers an address with an account and one without in the
    // same way, and builds the emailed link itself.
    const { error } = await authClient.requestPasswordReset({ email });
    if (error) {
      setState({
        status: "failed",
        message: error.message ?? "We couldn't send the link. Try again.",
      });
      return;
    }
    setState({ status: "sent", email });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    // A second press while the first is in flight sends nothing.
    if (form.isSubmitting) return;
    void form.handleSubmit(submit);
  }

  return (
    <>
      {/* Mounted from the first render and empty until the request is
          accepted, so the line is announced when it appears. The line is the
          same whether or not the address has an account. */}
      <div role="status">
        {state.status === "sent" ? (
          <p className="text-text-2 mt-1 text-[14px]">
            If {state.email} has an account, we sent a reset link to it. The
            link works once and expires in one hour.
          </p>
        ) : null}
      </div>
      {state.status === "sent" ? null : (
        <>
          <p className="text-text-2 mt-1 mb-6 text-[14px]">
            Enter the email you signed up with and we&apos;ll send a reset link.
          </p>
          <form
            noValidate
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >
            <NativeFormProvider form={form} formId="forgot-password">
              <EmailField
                onValueChange={() => form.setFieldError("email", undefined)}
              />
            </NativeFormProvider>
            {state.status === "failed" ? (
              <p role="alert" className="text-danger text-[13px]">
                {state.message}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={form.isSubmitting}
              className="bg-text text-canvas rounded-button h-[44px] text-[14px] font-medium hover:opacity-90 disabled:opacity-60 sm:h-[36px]"
            >
              Send reset link
            </button>
          </form>
        </>
      )}
    </>
  );
}
