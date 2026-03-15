"use server";

import { revalidatePath } from "next/cache";

import { requireCurrentUser } from "@/features/auth/server/session";
import { prisma } from "@/lib/prisma";

export type AttachResumeActionState = {
  status: "idle" | "error" | "success";
  error?: string;
};

export async function attachResumeToApplication(
  resumeId: string,
  _prevState: AttachResumeActionState,
  formData: FormData,
): Promise<AttachResumeActionState> {
  const user = await requireCurrentUser();
  const applicationId = formData.get("applicationId");

  if (typeof applicationId !== "string" || applicationId.length === 0) {
    return {
      status: "error",
      error: "Choose an application to attach this resume to.",
    };
  }

  const [resume, application] = await Promise.all([
    prisma.resume.findFirst({
      where: {
        id: resumeId,
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
        id: applicationId,
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
