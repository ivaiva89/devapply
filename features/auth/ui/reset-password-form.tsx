"use client";

import { NativeFormProvider, useNativeForm } from "@stackform/native";
import { useRouter } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";

import { authClient } from "@/shared/lib/auth/client";

import { PasswordField, validatePassword } from "./auth-form-fields";

interface ResetPasswordValues extends Record<string, unknown> {
  password: string;
}

interface ResetPasswordFormProps {
  // The token from the emailed link.
  token: string;
}

const INITIAL_VALUES: ResetPasswordValues = { password: "" };

const SAVE_FAILED = "We couldn't save the new password. Try again.";

// Uses the link's token up, and only when Save is pressed: mail scanners open
// links before people do, so rendering the page must save nothing.
export function ResetPasswordForm({
  token,
}: ResetPasswordFormProps): ReactNode {
  const router = useRouter();
  const form = useNativeForm<ResetPasswordValues>(INITIAL_VALUES);
  const [formError, setFormError] = useState<string | null>(null);

  async function submit(values: ResetPasswordValues): Promise<void> {
    setFormError(null);
    const passwordError = validatePassword(values.password);
    form.setFieldError("password", passwordError);
    if (passwordError) return;

    let refused: { code?: string; message?: string } | null;
    try {
      ({ error: refused } = await authClient.resetPassword({
        newPassword: values.password,
        token,
      }));
    } catch {
      // No answer came back at all: offline, or the connection dropped.
      refused = {};
    }
    if (!refused) {
      // A reset signs nobody in. Replaces the page, so Back does not return
      // to a link that no longer works.
      router.replace("/sign-in");
      return;
    }
    // The link was used, replaced by a newer one or ran out after the page
    // was opened: the page is asked again, and now answers with the expired
    // screen. No error line is shown first.
    if (refused.code === "INVALID_TOKEN") {
      router.refresh();
      return;
    }
    // An empty message from the server counts as none.
    setFormError(refused.message || SAVE_FAILED);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    // A second press while the first is in flight sends nothing.
    if (form.isSubmitting) return;
    void form.handleSubmit(submit);
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
      <NativeFormProvider form={form} formId="reset-password">
        <PasswordField
          label="New password"
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
        className="bg-text text-canvas rounded-button h-[44px] text-[14px] font-medium hover:opacity-90 disabled:opacity-60 sm:h-[36px]"
      >
        Save new password
      </button>
    </form>
  );
}
