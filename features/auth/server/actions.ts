"use server";

import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { clearUserSession, createUserSession } from "@/features/auth/server/session";

export type AuthActionState = {
  error?: string;
};

export async function signInWithEmail(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = formData.get("email");

  if (typeof email !== "string" || email.trim().length === 0) {
    return { error: "Enter the email for an existing user." };
  }

  const normalizedEmail = email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: { id: true },
  });

  if (!user) {
    return {
      error:
        "No user was found for that email. Seed the database first or create a user through the auth flow later.",
    };
  }

  await createUserSession(user.id);
  redirect("/dashboard");
}

export async function signOut() {
  await clearUserSession();
  redirect("/sign-in");
}
