import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { jsonError } from "@/lib/api";
import { isDateKey } from "@/lib/date";
import { getCollections } from "@/lib/mongodb";
import { serializeReflection } from "@/lib/serialize";
import { getRequestUser } from "@/lib/session";

const reflectionSchema = z.object({
  dateKey: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  plan: z.string().max(2000).optional().default(""),
  result: z.string().max(2000).optional().default(""),
  improvement: z.string().max(2000).optional().default(""),
});

export async function GET(request: NextRequest) {
  const user = await getRequestUser(request);
  if (!user) {
    return jsonError("Unauthorized.", 401);
  }

  const startDate = request.nextUrl.searchParams.get("startDate");
  const endDate = request.nextUrl.searchParams.get("endDate");
  if (!startDate || !endDate || !isDateKey(startDate) || !isDateKey(endDate)) {
    return jsonError("startDate and endDate are required (YYYY-MM-DD).");
  }

  const userId = new ObjectId(user.id);
  const { dailyReflections } = await getCollections();
  const docs = await dailyReflections
    .find({
      userId,
      dateKey: {
        $gte: startDate,
        $lte: endDate,
      },
    })
    .sort({ dateKey: 1 })
    .toArray();

  return NextResponse.json({ items: docs.map(serializeReflection) });
}

export async function POST(request: NextRequest) {
  const user = await getRequestUser(request);
  if (!user) {
    return jsonError("Unauthorized.", 401);
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return jsonError("Invalid request body.");
  }

  const parsed = reflectionSchema.safeParse(payload);
  if (!parsed.success) {
    return jsonError("Invalid reflection payload.");
  }

  const userId = new ObjectId(user.id);
  const { dailyReflections } = await getCollections();
  const now = new Date();
  const updated = await dailyReflections.findOneAndUpdate(
    {
      userId,
      dateKey: parsed.data.dateKey,
    },
    {
      $set: {
        plan: parsed.data.plan,
        result: parsed.data.result,
        improvement: parsed.data.improvement,
        updatedAt: now,
      },
      $setOnInsert: {
        createdAt: now,
      },
    },
    { upsert: true, returnDocument: "after" },
  );

  if (!updated) {
    return jsonError("Unable to save reflection.", 500);
  }

  return NextResponse.json({ item: serializeReflection(updated) });
}
