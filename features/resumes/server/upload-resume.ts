"use server";

import { randomUUID } from "node:crypto";

import { revalidatePath } from "next/cache";
import { del, put } from "@vercel/blob";

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

function getBlobPathname(userId: string, fileName: string) {
  const uniqueName = `${randomUUID()}-${sanitizeFileName(fileName)}`;
  return `resumes/${userId}/${uniqueName}`;
}

function getBlobToken() {
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  return token && token.length > 0 ? token : null;
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

  const blobToken = getBlobToken();

  if (!blobToken) {
    return {
      status: "error",
      error:
        "Resume storage is not configured yet. Add BLOB_READ_WRITE_TOKEN to enable uploads.",
    };
  }

  const resumeCount = gate.used;
  const pathname = getBlobPathname(user.id, file.name);
  let blobUrl: string | null = null;

  try {
    const blob = await put(pathname, file, {
      access: "private",
      addRandomSuffix: false,
      contentType: file.type,
      token: blobToken,
    });

    blobUrl = blob.url;

    const resume = await prisma.resume.create({
      data: {
        userId: user.id,
        label: title.trim(),
        fileName: file.name,
        storageKey: blob.pathname,
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
  } catch {
    if (blobUrl) {
      await del(blobUrl, { token: blobToken }).catch(() => undefined);
    }

    return {
      status: "error",
      error: "The resume could not be uploaded. Try again.",
    };
  }
}
