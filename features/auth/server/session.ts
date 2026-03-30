import "server-only";

import { Prisma } from "@prisma/client";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

export type AuthenticatedAppUser = {
  id: string;
  clerkUserId: string | null;
  email: string;
  name: string | null;
  plan: "FREE" | "PRO";
};

export class AuthSyncError extends Error {
  code: "email_already_linked" | "missing_email";

  constructor(code: "email_already_linked" | "missing_email", message: string) {
    super(message);
    this.code = code;
  }
}

function getPrimaryEmailAddress(
  user: Awaited<ReturnType<typeof currentUser>>,
): string | null {
  if (!user) {
    return null;
  }

  const primaryEmail =
    user.primaryEmailAddress?.emailAddress ??
    user.emailAddresses[0]?.emailAddress;

  return primaryEmail?.trim().toLowerCase() ?? null;
}

function getDisplayName(user: Awaited<ReturnType<typeof currentUser>>) {
  if (!user) {
    return null;
  }

  const fullName = [user.firstName, user.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  if (fullName.length > 0) {
    return fullName;
  }

  if (user.username && user.username.trim().length > 0) {
    return user.username.trim();
  }

  return null;
}

async function syncClerkUserToDatabase(
  clerkUserId: string,
): Promise<AuthenticatedAppUser | null> {
  const clerkProfile = await currentUser();

  if (!clerkProfile) {
    return null;
  }

  const email = getPrimaryEmailAddress(clerkProfile);

  if (!email) {
    throw new AuthSyncError(
      "missing_email",
      "Authenticated Clerk user is missing a valid email address.",
    );
  }

  const name = getDisplayName(clerkProfile);
  const imageUrl = clerkProfile.imageUrl ?? null;

  const existingByClerkUserId = await prisma.user.findUnique({
    where: { clerkUserId },
    select: {
      id: true,
      clerkUserId: true,
      email: true,
      name: true,
      plan: true,
      imageUrl: true,
    },
  });

  if (existingByClerkUserId) {
    if (
      existingByClerkUserId.email !== email ||
      existingByClerkUserId.name !== name ||
      existingByClerkUserId.imageUrl !== imageUrl
    ) {
      const updatedUser = await prisma.user.update({
        where: { id: existingByClerkUserId.id },
        data: {
          email,
          imageUrl,
          name,
        },
        select: {
          id: true,
          clerkUserId: true,
          email: true,
          name: true,
          plan: true,
        },
      });

      return updatedUser;
    }

    return {
      id: existingByClerkUserId.id,
      clerkUserId: existingByClerkUserId.clerkUserId,
      email: existingByClerkUserId.email,
      name: existingByClerkUserId.name,
      plan: existingByClerkUserId.plan,
    };
  }

  const existingByEmail = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      clerkUserId: true,
      email: true,
      name: true,
      plan: true,
    },
  });

  if (existingByEmail) {
    if (
      existingByEmail.clerkUserId &&
      existingByEmail.clerkUserId !== clerkUserId
    ) {
      throw new AuthSyncError(
        "email_already_linked",
        "This email is already linked to a different user.",
      );
    }

    return prisma.user.update({
      where: { id: existingByEmail.id },
      data: {
        clerkUserId,
        imageUrl,
        name,
      },
      select: {
        id: true,
        clerkUserId: true,
        email: true,
        name: true,
        plan: true,
      },
    });
  }

  try {
    return await prisma.user.create({
      data: {
        clerkUserId,
        email,
        imageUrl,
        name,
      },
      select: {
        id: true,
        clerkUserId: true,
        email: true,
        name: true,
        plan: true,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const recoveredUser = await prisma.user.findFirst({
        where: {
          OR: [{ clerkUserId }, { email }],
        },
        select: {
          id: true,
          clerkUserId: true,
          email: true,
          name: true,
          plan: true,
        },
      });

      if (recoveredUser) {
        if (!recoveredUser.clerkUserId) {
          return prisma.user.update({
            where: { id: recoveredUser.id },
            data: {
              clerkUserId,
              imageUrl,
              name,
            },
            select: {
              id: true,
              clerkUserId: true,
              email: true,
              name: true,
              plan: true,
            },
          });
        }

        if (recoveredUser.clerkUserId === clerkUserId) {
          return recoveredUser;
        }
      }
    }

    throw error;
  }
}

export async function getCurrentUser() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  return syncClerkUserToDatabase(userId);
}

export async function requireCurrentUser() {
  let user: Awaited<ReturnType<typeof getCurrentUser>>;

  try {
    user = await getCurrentUser();
  } catch (error) {
    if (error instanceof AuthSyncError) {
      redirect(`/sign-in?auth_error=${error.code}`);
    }

    throw error;
  }

  if (!user) {
    const { redirectToSignIn } = await auth();
    return redirectToSignIn();
  }

  return user;
}
