import "server-only";

import { getPlanGateFromUsage } from "@/features/billing/server/plan-enforcement";
import { prisma } from "@/lib/prisma";
import type { ResumePageData } from "@/features/resumes/types";

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
  const canUpload = getPlanGateFromUsage(
    user.plan,
    resumeCount,
    "resumes",
  ).allowed;

  return {
    plan: user.plan,
    resumeCount,
    canUpload,
    resumes: resumes.map((resume) => ({
      id: resume.id,
      title: resume.label,
      fileName: resume.fileName,
      fileUrl: `/api/resumes/${resume.id}`,
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
