"use server";

import { revalidatePath } from "next/cache";

import { applicationStatusValues, type ApplicationStatusValue } from "@/features/applications/config";
import { requireCurrentUser } from "@/features/auth/server/session";
import { prisma } from "@/lib/prisma";

type UpdateApplicationStatusResult =
  | { status: "success" }
  | { status: "error"; message: string };

export async function updateApplicationStatus(
  applicationId: string,
  nextStatus: ApplicationStatusValue,
): Promise<UpdateApplicationStatusResult> {
  if (!applicationStatusValues.includes(nextStatus)) {
    return {
      status: "error",
      message: "The selected status is not valid.",
    };
  }

  const user = await requireCurrentUser();

  const application = await prisma.application.findFirst({
    where: {
      id: applicationId,
      userId: user.id,
    },
    select: {
      id: true,
    },
  });

  if (!application) {
    return {
      status: "error",
      message: "That application could not be found.",
    };
  }

  await prisma.application.update({
    where: {
      id: application.id,
    },
    data: {
      status: nextStatus,
    },
  });

  revalidatePath("/applications");
  revalidatePath("/pipeline");
  revalidatePath("/dashboard");

  return { status: "success" };
}
