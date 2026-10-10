"use client";

import { NativeFormProvider, useNativeForm } from "@stackform/native";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";

import { authClient } from "@/shared/lib/auth/client";

import { EmailField, PasswordField } from "./auth-form-fields";
import { LockedNotice } from "./locked-notice";

interface SignInValues extends Record<string, unknown> {
  email: string;
  password: string;
}

type SignInState =
  | { status: "idle" }
  | { status: "failed"; message: string }
  | { status: "locked" };

interface SignInFormProps {
  // The route the visitor asked for before being sent to sign-in, if any.
  returnTo?: string;
  // Shown under the form, and dropped with it once sign-in is locked.
  footer?: ReactNode;
}

const INITIAL_VALUES: SignInValues = { email: "", password: "" };

// The app's default route, until tracking-core ships Applications.
const DEFAULT_ROUTE = "/";

// Where to go after signing in: the route asked for when it is a place on
// this site. Anything that resolves to another origin is ignored.
function returnPath(requested: string | undefined): string {
  const { origin } = window.location;
  if (!requested || !URL.canParse(requested, origin)) return DEFAULT_ROUTE;
  const url = new URL(requested, origin);
  if (url.origin !== origin) return DEFAULT_ROUTE;
  return `${url.pathname}${url.search}${url.hash}`;
}

export function SignInForm({ returnTo, footer }: SignInFormProps): ReactNode {
  const router = useRouter();
  const form = useNativeForm<SignInValues>(INITIAL_VALUES);
  const [state, setState] = useState<SignInState>({ status: "idle" });

  async function submit(values: SignInValues): Promise<void> {
    setState({ status: "idle" });
    const { error } = await authClient.signIn.email({
      email: values.email.trim(),
      password: values.password,
    });
    if (!error) {
      // Replaces the sign-in page, so Back does not return to the form.
      router.replace(returnPath(returnTo));
      return;
    }
    // The server answers a locked account with 423, and nothing else with it.
    if (error.status === 423) {
      setState({ status: "locked" });
      return;
    }
    setState({
      status: "failed",
      message:
        error.code === "INVALID_EMAIL_OR_PASSWORD"
          ? "Wrong email or password."
          : (error.message ?? "Sign-in failed. Try again."),
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    // A second press while the first is in flight sends nothing.
    if (form.isSubmitting) return;
    void form.handleSubmit(submit);
  }

  if (state.status === "locked") return <LockedNotice />;

  return (
    <>
      <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
        {state.status === "failed" ? (
          <p
            role="alert"
            className="bg-danger-soft text-danger rounded-card px-3 py-[10px] text-[13px] leading-[1.5]"
          >
            {state.message}
          </p>
        ) : null}
        <NativeFormProvider form={form} formId="sign-in">
          <EmailField />
          <div className="relative">
            <PasswordField hasHint={false} />
            <Link
              href="/forgot-password"
              className="text-primary hover:text-primary-hover absolute top-0 right-0 text-[13px]"
            >
              Forgot password?
            </Link>
          </div>
        </NativeFormProvider>
        <button
          type="submit"
          disabled={form.isSubmitting}
          className="bg-text text-canvas rounded-button h-[44px] text-[14px] font-medium hover:opacity-90 disabled:opacity-60 sm:h-[36px]"
        >
          Sign in
        </button>
      </form>
      {footer}
    </>
  );
}
