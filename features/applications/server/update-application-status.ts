"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { applicationStatusValues, type ApplicationStatusValue } from "@/features/applications/config";
import { requireCurrentUser } from "@/features/auth/server/session";
import { prisma } from "@/lib/prisma";

type UpdateApplicationStatusResult =
  | { status: "success" }
  | { status: "error"; message: string };

const updateApplicationStatusSchema = z.object({
  applicationId: z
    .string()
    .trim()
    .min(1, "That application could not be found."),
  nextStatus: z.enum(applicationStatusValues),
});

export async function updateApplicationStatus(
  applicationId: string,
  nextStatus: ApplicationStatusValue,
): Promise<UpdateApplicationStatusResult> {
  const result = updateApplicationStatusSchema.safeParse({
    applicationId,
    nextStatus,
  });

  if (!result.success) {
    return {
      status: "error",
      message:
        result.error.issues[0]?.message ?? "The selected status is not valid.",
    };
  }

  const input = result.data;

  const user = await requireCurrentUser();

  const application = await prisma.application.findFirst({
    where: {
      id: input.applicationId,
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
      status: input.nextStatus,
    },
  });

  revalidatePath("/applications");
  revalidatePath("/pipeline");
  revalidatePath("/dashboard");

  return { status: "success" };
}
