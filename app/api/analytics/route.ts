import { NextResponse } from "next/server";
import { z } from "zod";

import { analyticsEventNames } from "@/features/analytics/events";
import { getCurrentUser } from "@/features/auth/server/session";
import { trackServerEvent } from "@/features/analytics/server/track-event";

const analyticsRequestSchema = z.object({
  distinctId: z.string().trim().min(1).max(200).optional(),
  event: z.enum(analyticsEventNames),
  properties: z.record(z.string(), z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
  ])).optional(),
});

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const result = analyticsRequestSchema.safeParse(json);

  if (!result.success) {
    return NextResponse.json({ error: "Invalid analytics payload." }, { status: 400 });
  }

  const user = await getCurrentUser();
  const distinctId = result.data.distinctId ?? user?.id;

  if (!distinctId) {
    return NextResponse.json({}, { status: 202 });
  }

  await trackServerEvent({
    distinctId,
    event: result.data.event,
    properties: result.data.properties,
  });

  return NextResponse.json({}, { status: 202 });
}
