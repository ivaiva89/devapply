"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireCurrentUser } from "@/features/auth/server/session";
import { prisma } from "@/lib/prisma";
import {
  getFormString,
  getValidationErrorMessage,
} from "@/lib/server-action-validation";

export type AttachResumeActionState = {
  status: "idle" | "error" | "success";
  error?: string;
};

const attachResumeSchema = z.object({
  resumeId: z.string().trim().min(1, "That resume could not be found."),
  applicationId: z
    .string()
    .trim()
    .min(1, "Choose an application to attach this resume to."),
});

export async function attachResumeToApplication(
  resumeId: string,
  _prevState: AttachResumeActionState,
  formData: FormData,
): Promise<AttachResumeActionState> {
  const user = await requireCurrentUser();
  const result = attachResumeSchema.safeParse({
    resumeId,
    applicationId: getFormString(formData, "applicationId"),
  });

  if (!result.success) {
    return {
      status: "error",
      error: getValidationErrorMessage(
        result.error,
        "Choose an application to attach this resume to.",
      ),
    };
  }

  const input = result.data;

  const [resume, application] = await Promise.all([
    prisma.resume.findFirst({
      where: {
        id: input.resumeId,
        userId: user.id,
      },
      select: {
        id: true,
        label: true,
        fileName: true,
        storageKey: true,
        mimeType: true,
        fileSizeBytes: true,
      },
    }),
    prisma.application.findFirst({
      where: {
        id: input.applicationId,
        userId: user.id,
      },
      select: {
        id: true,
      },
    }),
  ]);

  if (!resume) {
    return {
      status: "error",
      error: "That resume could not be found.",
    };
  }

  if (!application) {
    return {
      status: "error",
      error: "That application could not be found.",
    };
  }

  const existingAttachment = await prisma.applicationAttachment.findFirst({
    where: {
      userId: user.id,
      applicationId: application.id,
      kind: "RESUME",
    },
    select: {
      id: true,
    },
  });

  if (existingAttachment) {
    await prisma.applicationAttachment.update({
      where: {
        id: existingAttachment.id,
      },
      data: {
        resumeId: resume.id,
        label: resume.label,
        fileName: resume.fileName,
        storageKey: resume.storageKey,
        mimeType: resume.mimeType,
        fileSizeBytes: resume.fileSizeBytes,
      },
    });
  } else {
    await prisma.applicationAttachment.create({
      data: {
        userId: user.id,
        applicationId: application.id,
        resumeId: resume.id,
        kind: "RESUME",
        label: resume.label,
        fileName: resume.fileName,
        storageKey: resume.storageKey,
        mimeType: resume.mimeType,
        fileSizeBytes: resume.fileSizeBytes,
      },
    });
  }

  revalidatePath("/resumes");
  revalidatePath("/applications");

  return {
    status: "success",
  };
}
