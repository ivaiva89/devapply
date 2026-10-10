import { TextField, type TextFieldClassNames } from "@stackform/core";
import type { ReactNode } from "react";

// Better Auth's default minimum: the story keeps its password rule.
export const PASSWORD_MIN_LENGTH = 8;

const fieldClassNames: TextFieldClassNames = {
  wrapper: "flex flex-col gap-1.5",
  label: "text-text text-[13px] font-medium",
  // Heights in exact pixels: h-9 has no token and would resolve against the
  // 14px root. 44px is the touch target below sm, 36px the design's desktop.
  input:
    "border-border-strong bg-surface-1 text-text placeholder:text-text-4 aria-invalid:border-danger h-[44px] rounded-input border px-3 text-[14px] sm:h-[36px]",
  hint: "text-text-3 text-[12px]",
  error: "text-danger text-[12px]",
};

interface AuthFieldProps {
  onValueChange?: (value: string) => void;
}

// StackForm renders each field's error inline, wires it to the input through
// aria-describedby and announces it with role="alert".
export function EmailField({ onValueChange }: AuthFieldProps): ReactNode {
  return (
    <TextField
      name="email"
      label="Email"
      type="email"
      placeholder="you@example.com"
      classNames={fieldClassNames}
      onValueChange={onValueChange}
    />
  );
}

interface PasswordFieldProps extends AuthFieldProps {
  // The length rule under the field: shown where a password is chosen (sign
  // up), left out where one is only entered (sign in).
  hasHint?: boolean;
}

export function PasswordField({
  onValueChange,
  hasHint = true,
}: PasswordFieldProps): ReactNode {
  return (
    <TextField
      name="password"
      label="Password"
      type="password"
      hint={hasHint ? `At least ${PASSWORD_MIN_LENGTH} characters` : undefined}
      classNames={fieldClassNames}
      onValueChange={onValueChange}
    />
  );
}

export function validateEmail(value: string): string | undefined {
  const email = value.trim();
  if (email === "") return "Enter your email.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Enter a valid email address.";
  }
  return undefined;
}

export function validatePassword(value: string): string | undefined {
  if (value === "") return "Enter a password.";
  if (value.length < PASSWORD_MIN_LENGTH) {
    return `Use at least ${PASSWORD_MIN_LENGTH} characters.`;
  }
  return undefined;
}
