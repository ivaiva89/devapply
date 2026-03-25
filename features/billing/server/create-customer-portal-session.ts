"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

import { requireCurrentUser } from "@/features/auth/server/session";
import {
  getCustomerPortalError,
  getCustomerPortalUrl,
} from "@/features/billing/server/provider";

export type CreateCustomerPortalSessionState = {
  status: "idle" | "error";
  error?: string;
};

export async function createCustomerPortalSession(
  _prevState: CreateCustomerPortalSessionState,
): Promise<CreateCustomerPortalSessionState> {
  void _prevState;
  await requireCurrentUser();

  const configurationError = getCustomerPortalError();

  if (configurationError) {
    return {
      status: "error",
      error: configurationError,
    };
  }

  try {
    redirect(getCustomerPortalUrl());
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return {
      status: "error",
      error: "Polar billing portal could not be opened. Try again.",
    };
  }
}
