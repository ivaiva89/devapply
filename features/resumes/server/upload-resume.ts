"use server";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

import { revalidatePath } from "next/cache";

import { trackServerEvent } from "@/features/analytics/server/track-event";
import { requireCurrentUser } from "@/features/auth/server/session";
import { FREE_PLAN_LIMITS } from "@/features/billing/config";
import { getPlanGate } from "@/features/billing/server/plan-enforcement";
import { prisma } from "@/lib/prisma";

export type UploadResumeActionState = {
  status: "idle" | "error" | "success";
  error?: string;
};

const allowedMimeTypes = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

function sanitizeFileName(value: string) {
  return value.replace(/[^a-zA-Z0-9._-]/g, "-");
}

function getUploadPathParts(userId: string, fileName: string) {
  const uniqueName = `${randomUUID()}-${sanitizeFileName(fileName)}`;
  const relativeUrl = `/uploads/resumes/${userId}/${uniqueName}`;
  const absolutePath = path.join(
    process.cwd(),
    "public",
    "uploads",
    "resumes",
    userId,
    uniqueName,
  );

  return { relativeUrl, absolutePath };
}

export async function uploadResume(
  _prevState: UploadResumeActionState,
  formData: FormData,
): Promise<UploadResumeActionState> {
  const user = await requireCurrentUser();
  const title = formData.get("title");
  const file = formData.get("file");

  if (typeof title !== "string" || title.trim().length === 0) {
    return {
      status: "error",
      error: "Enter a title for this resume.",
    };
  }

  if (!(file instanceof File) || file.size === 0) {
    return {
      status: "error",
      error: "Choose a resume file to upload.",
    };
  }

  if (!allowedMimeTypes.has(file.type)) {
    return {
      status: "error",
      error: "Upload a PDF, DOC, or DOCX resume file.",
    };
  }

  if (file.size > 5 * 1024 * 1024) {
    return {
      status: "error",
      error: "Resume files must be 5 MB or smaller.",
    };
  }

  const gate = await getPlanGate(user.id, "resumes");

  if (!gate.allowed) {
    return {
      status: "error",
      error:
        `Free plan users can upload ${FREE_PLAN_LIMITS.resumes} resume. Upgrade to Pro to store multiple versions.`,
    };
  }

  const resumeCount = gate.used;
  const { relativeUrl, absolutePath } = getUploadPathParts(user.id, file.name);
  const arrayBuffer = await file.arrayBuffer();

  await mkdir(path.dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, Buffer.from(arrayBuffer));

  const resume = await prisma.resume.create({
    data: {
      userId: user.id,
      label: title.trim(),
      fileName: file.name,
      storageKey: relativeUrl,
      mimeType: file.type,
      fileSizeBytes: file.size,
      isDefault: resumeCount === 0,
    },
  });

  await trackServerEvent({
    distinctId: user.id,
    event: "resume_uploaded",
    properties: {
      fileSizeBytes: resume.fileSizeBytes,
      resumeId: resume.id,
    },
  });

  revalidatePath("/resumes");

  return {
    status: "success",
  };
}
