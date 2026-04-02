import { NextResponse } from "next/server";
import { get } from "@vercel/blob";

import { requireCurrentUser } from "@/features/auth/server/session";
import { prisma } from "@/shared/lib/prisma";

function getBlobToken() {
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  return token && token.length > 0 ? token : null;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ resumeId: string }> },
) {
  const user = await requireCurrentUser();
  const { resumeId } = await context.params;
  const blobToken = getBlobToken();

  if (!blobToken) {
    return NextResponse.json(
      { error: "Resume storage is not configured." },
      { status: 500 },
    );
  }

  const resume = await prisma.resume.findFirst({
    where: {
      id: resumeId,
      userId: user.id,
    },
    select: {
      fileName: true,
      mimeType: true,
      storageKey: true,
    },
  });

  if (!resume) {
    return NextResponse.json({ error: "Resume not found." }, { status: 404 });
  }

  let blob;

  try {
    blob = await get(resume.storageKey, {
      access: "private",
      token: blobToken,
    });
  } catch (error) {
    console.error("Failed to fetch resume from blob storage", {
      resumeId,
      error,
    });
    return NextResponse.json(
      { error: "Resume file could not be retrieved." },
      { status: 500 },
    );
  }

  if (!blob || blob.statusCode !== 200) {
    return NextResponse.json(
      { error: "Resume file not found." },
      { status: 404 },
    );
  }

  return new Response(blob.stream, {
    headers: {
      "cache-control": blob.blob.cacheControl,
      "content-disposition": `inline; filename="${resume.fileName}"`,
      "content-type": resume.mimeType,
      etag: blob.blob.etag,
    },
  });
}
