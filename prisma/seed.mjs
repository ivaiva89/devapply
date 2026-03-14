import {
  PrismaClient,
  ApplicationSource,
  ApplicationStatus,
  AttachmentKind,
  InterviewResult,
  InterviewType,
  Plan,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.applicationAttachment.deleteMany();
  await prisma.interview.deleteMany();
  await prisma.reminder.deleteMany();
  await prisma.resume.deleteMany();
  await prisma.application.deleteMany();
  await prisma.user.deleteMany();

  const ava = await prisma.user.create({
    data: {
      email: "ava.chen@example.com",
      name: "Ava Chen",
      plan: Plan.PRO,
      timezone: "America/Los_Angeles",
      resumes: {
        create: [
          {
            label: "Backend Resume",
            version: "2026-Q1",
            fileName: "ava-chen-backend-2026.pdf",
            storageKey: "seed/users/ava-chen/resumes/backend-2026-q1.pdf",
            mimeType: "application/pdf",
            fileSizeBytes: 248312,
            isDefault: true,
          },
          {
            label: "Platform Resume",
            version: "2026-Q1",
            fileName: "ava-chen-platform-2026.pdf",
            storageKey: "seed/users/ava-chen/resumes/platform-2026-q1.pdf",
            mimeType: "application/pdf",
            fileSizeBytes: 263904,
            isDefault: false,
          },
        ],
      },
    },
    include: {
      resumes: true,
    },
  });

  const avaBackendResume = ava.resumes.find((resume) => resume.isDefault);
  const avaPlatformResume = ava.resumes.find((resume) => !resume.isDefault);

  const stripeApplication = await prisma.application.create({
    data: {
      userId: ava.id,
      company: "Stripe",
      role: "Senior Backend Engineer",
      location: "Remote (US)",
      source: ApplicationSource.COMPANY_SITE,
      status: ApplicationStatus.INTERVIEW,
      salaryMin: 210000,
      salaryMax: 245000,
      currency: "USD",
      jobUrl: "https://jobs.stripe.com/openings/senior-backend-engineer",
      appliedDate: new Date("2026-02-03T18:00:00.000Z"),
      lastActivityAt: new Date("2026-02-12T16:30:00.000Z"),
      notes:
        "Hiring manager is focused on API reliability, operational maturity, and product-minded collaboration.",
    },
  });

  const vercelApplication = await prisma.application.create({
    data: {
      userId: ava.id,
      company: "Vercel",
      role: "Software Engineer, Developer Experience",
      location: "San Francisco, CA",
      source: ApplicationSource.REFERRAL,
      status: ApplicationStatus.APPLIED,
      salaryMin: 185000,
      salaryMax: 220000,
      currency: "USD",
      jobUrl: "https://vercel.com/careers/software-engineer-developer-experience",
      appliedDate: new Date("2026-02-20T18:00:00.000Z"),
      lastActivityAt: new Date("2026-02-20T18:00:00.000Z"),
      notes:
        "Referred by former teammate. Strong fit on DX and platform documentation work.",
    },
  });

  const linearApplication = await prisma.application.create({
    data: {
      userId: ava.id,
      company: "Linear",
      role: "Product Engineer",
      location: "Remote",
      source: ApplicationSource.WELLFOUND,
      status: ApplicationStatus.WISHLIST,
      salaryMin: 175000,
      salaryMax: 205000,
      currency: "USD",
      jobUrl: "https://linear.app/careers/product-engineer",
      lastActivityAt: new Date("2026-03-01T09:00:00.000Z"),
      notes: "Interesting role, but wait until portfolio refresh is complete.",
    },
  });

  await prisma.interview.createMany({
    data: [
      {
        userId: ava.id,
        applicationId: stripeApplication.id,
        type: InterviewType.RECRUITER_SCREEN,
        result: InterviewResult.PASSED,
        title: "Recruiter screen",
        interviewerName: "Morgan Lee",
        scheduledAt: new Date("2026-02-08T17:00:00.000Z"),
        completedAt: new Date("2026-02-08T17:30:00.000Z"),
        notes: "Passed to technical screen. Discussed distributed systems and API ownership.",
      },
      {
        userId: ava.id,
        applicationId: stripeApplication.id,
        type: InterviewType.TECHNICAL_SCREEN,
        result: InterviewResult.PENDING,
        title: "Technical systems interview",
        interviewerName: "Priya Raman",
        scheduledAt: new Date("2026-03-18T16:00:00.000Z"),
        notes: "Prepare examples around incident response and schema design tradeoffs.",
      },
    ],
  });

  await prisma.applicationAttachment.createMany({
    data: [
      {
        userId: ava.id,
        applicationId: stripeApplication.id,
        resumeId: avaBackendResume?.id,
        kind: AttachmentKind.RESUME,
        label: "Backend resume submitted",
        fileName: avaBackendResume?.fileName ?? "ava-chen-backend-2026.pdf",
      },
      {
        userId: ava.id,
        applicationId: vercelApplication.id,
        resumeId: avaPlatformResume?.id,
        kind: AttachmentKind.RESUME,
        label: "Platform-focused resume",
        fileName: avaPlatformResume?.fileName ?? "ava-chen-platform-2026.pdf",
      },
      {
        userId: ava.id,
        applicationId: linearApplication.id,
        resumeId: avaPlatformResume?.id,
        kind: AttachmentKind.RESUME,
        label: "Draft resume to tailor later",
        fileName: avaPlatformResume?.fileName ?? "ava-chen-platform-2026.pdf",
      },
    ],
  });

  await prisma.reminder.createMany({
    data: [
      {
        userId: ava.id,
        applicationId: stripeApplication.id,
        title: "Technical screen prep",
        notes: "Review API versioning, observability, and recent incidents.",
        dueAt: new Date("2026-03-17T19:00:00.000Z"),
      },
      {
        userId: ava.id,
        applicationId: vercelApplication.id,
        title: "Referral follow-up",
        notes: "Check whether the hiring manager has reviewed the referral packet.",
        dueAt: new Date("2026-03-22T18:00:00.000Z"),
      },
    ],
  });

  const mateo = await prisma.user.create({
    data: {
      email: "mateo.rivera@example.com",
      name: "Mateo Rivera",
      plan: Plan.FREE,
      timezone: "America/New_York",
      resumes: {
        create: {
          label: "General Resume",
          version: "2026-Q1",
          fileName: "mateo-rivera-general-2026.pdf",
          storageKey: "seed/users/mateo-rivera/resumes/general-2026-q1.pdf",
          mimeType: "application/pdf",
          fileSizeBytes: 198406,
          isDefault: true,
        },
      },
    },
    include: {
      resumes: true,
    },
  });

  const mateoResume = mateo.resumes[0];

  const githubApplication = await prisma.application.create({
    data: {
      userId: mateo.id,
      company: "GitHub",
      role: "Full-Stack Engineer",
      location: "Remote",
      source: ApplicationSource.LINKEDIN,
      status: ApplicationStatus.OFFER,
      salaryMin: 165000,
      salaryMax: 190000,
      currency: "USD",
      jobUrl: "https://github.careers/full-stack-engineer",
      appliedDate: new Date("2026-01-18T15:00:00.000Z"),
      lastActivityAt: new Date("2026-02-25T20:00:00.000Z"),
      notes: "Offer expected this week after final round.",
    },
  });

  const cloudflareApplication = await prisma.application.create({
    data: {
      userId: mateo.id,
      company: "Cloudflare",
      role: "Systems Engineer",
      location: "Austin, TX",
      source: ApplicationSource.INDEED,
      status: ApplicationStatus.REJECTED,
      salaryMin: 155000,
      salaryMax: 180000,
      currency: "USD",
      jobUrl: "https://careers.cloudflare.com/systems-engineer",
      appliedDate: new Date("2026-01-07T16:00:00.000Z"),
      lastActivityAt: new Date("2026-01-29T14:00:00.000Z"),
      notes: "Rejected after take-home. Good benchmark for future prep.",
    },
  });

  await prisma.interview.createMany({
    data: [
      {
        userId: mateo.id,
        applicationId: githubApplication.id,
        type: InterviewType.FINAL_ROUND,
        result: InterviewResult.PASSED,
        title: "Final panel",
        interviewerName: "Hiring committee",
        scheduledAt: new Date("2026-02-21T18:00:00.000Z"),
        completedAt: new Date("2026-02-21T20:00:00.000Z"),
        notes: "Strong feedback on product intuition and frontend execution.",
      },
      {
        userId: mateo.id,
        applicationId: cloudflareApplication.id,
        type: InterviewType.TAKE_HOME,
        result: InterviewResult.FAILED,
        title: "Take-home review",
        interviewerName: "Systems team",
        scheduledAt: new Date("2026-01-25T17:00:00.000Z"),
        completedAt: new Date("2026-01-25T18:00:00.000Z"),
        notes: "Need a tighter write-up on operational tradeoffs next time.",
      },
    ],
  });

  await prisma.applicationAttachment.create({
    data: {
      userId: mateo.id,
      applicationId: githubApplication.id,
      resumeId: mateoResume.id,
      kind: AttachmentKind.RESUME,
      label: "General resume submitted",
      fileName: mateoResume.fileName,
    },
  });

  await prisma.reminder.create({
    data: {
      userId: mateo.id,
      applicationId: githubApplication.id,
      title: "Offer follow-up",
      notes: "If no update by Tuesday, send a concise follow-up note.",
      dueAt: new Date("2026-03-18T14:00:00.000Z"),
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
