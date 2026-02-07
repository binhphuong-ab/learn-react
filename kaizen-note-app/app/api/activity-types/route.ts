import { MongoServerError, ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { jsonError } from "@/lib/api";
import { getCollections } from "@/lib/mongodb";
import { serializeActivityType } from "@/lib/serialize";
import { getRequestUser } from "@/lib/session";

const activitySchema = z.object({
  name: z.string().trim().min(1).max(50),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/),
});

export async function GET(request: NextRequest) {
  const user = await getRequestUser(request);
  if (!user) {
    return jsonError("Unauthorized.", 401);
  }

  const { activityTypes } = await getCollections();
  const userId = new ObjectId(user.id);
  const docs = await activityTypes.find({ userId }).sort({ createdAt: 1 }).toArray();

  return NextResponse.json({ items: docs.map(serializeActivityType) });
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

  const parsed = activitySchema.safeParse(payload);
  if (!parsed.success) {
    return jsonError("Invalid activity payload.");
  }

  const { activityTypes } = await getCollections();
  const userId = new ObjectId(user.id);
  const now = new Date();
  let insert: { insertedId: ObjectId };
  try {
    insert = await activityTypes.insertOne({
      _id: new ObjectId(),
      userId,
      name: parsed.data.name,
      color: parsed.data.color,
      createdAt: now,
      updatedAt: now,
    });
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) {
      return jsonError("Activity name already exists.", 409);
    }
    throw error;
  }

  const created = await activityTypes.findOne({ _id: insert.insertedId });
  return NextResponse.json(
    { item: created ? serializeActivityType(created) : null },
    { status: 201 },
  );
}
