import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

const SESSION_COOKIE_NAME = "devapply_session";
const DEFAULT_SESSION_SECRET = "devapply-local-development-secret";

function getSessionSecret() {
  return process.env.AUTH_SESSION_SECRET ?? DEFAULT_SESSION_SECRET;
}

function createSignature(userId: string) {
  return createHmac("sha256", getSessionSecret()).update(userId).digest("hex");
}

function parseSessionValue(value: string) {
  const [userId, signature] = value.split(".");

  if (!userId || !signature) {
    return null;
  }

  return { userId, signature };
}

function isValidSignature(userId: string, signature: string) {
  const expectedSignature = createSignature(userId);

  if (signature.length !== expectedSignature.length) {
    return false;
  }

  return timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature),
  );
}

export async function createUserSession(userId: string) {
  const cookieStore = await cookies();
  const value = `${userId}.${createSignature(userId)}`;

  cookieStore.set(SESSION_COOKIE_NAME, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearUserSession() {
  const cookieStore = await cookies();

  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionCookie?.value) {
    return null;
  }

  const parsedValue = parseSessionValue(sessionCookie.value);

  if (!parsedValue) {
    return null;
  }

  if (!isValidSignature(parsedValue.userId, parsedValue.signature)) {
    return null;
  }

  return prisma.user.findUnique({
    where: { id: parsedValue.userId },
    select: {
      id: true,
      email: true,
      name: true,
      plan: true,
    },
  });
}

export async function requireCurrentUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return user;
}
