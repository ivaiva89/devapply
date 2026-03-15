import "server-only";

import { prisma } from "@/lib/prisma";
import type { ResumePageData } from "@/features/resumes/types";

export const FREE_RESUME_LIMIT = 1;

export async function getResumePageDataForUser(
  userId: string,
): Promise<ResumePageData> {
  const [user, resumes, applications] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        plan: true,
      },
    }),
    prisma.resume.findMany({
      where: {
        userId,
      },
      orderBy: [{ createdAt: "desc" }],
      select: {
        id: true,
        label: true,
        fileName: true,
        storageKey: true,
        mimeType: true,
        fileSizeBytes: true,
        createdAt: true,
        attachments: {
          select: {
            application: {
              select: {
                id: true,
                company: true,
                role: true,
              },
            },
          },
        },
      },
    }),
    prisma.application.findMany({
      where: {
        userId,
      },
      orderBy: [{ updatedAt: "desc" }],
      select: {
        id: true,
        company: true,
        role: true,
      },
    }),
  ]);

  if (!user) {
    return {
      plan: "FREE",
      resumeCount: 0,
      canUpload: false,
      resumes: [],
      applicationOptions: [],
    };
  }

  const resumeCount = resumes.length;
  const canUpload = user.plan === "PRO" || resumeCount < FREE_RESUME_LIMIT;

  return {
    plan: user.plan,
    resumeCount,
    canUpload,
    resumes: resumes.map((resume) => ({
      id: resume.id,
      title: resume.label,
      fileName: resume.fileName,
      fileUrl: resume.storageKey,
      mimeType: resume.mimeType,
      fileSizeBytes: resume.fileSizeBytes,
      uploadedAt: resume.createdAt.toISOString(),
      attachedApplications: resume.attachments.map(
        (attachment) => attachment.application,
      ),
    })),
    applicationOptions: applications.map((application) => ({
      id: application.id,
      label: `${application.company} - ${application.role}`,
    })),
  };
}
