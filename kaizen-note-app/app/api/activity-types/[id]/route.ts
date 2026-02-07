import { MongoServerError, ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { jsonError, parseObjectId } from "@/lib/api";
import { getCollections } from "@/lib/mongodb";
import { serializeActivityType } from "@/lib/serialize";
import { getRequestUser } from "@/lib/session";

const activityUpdateSchema = z.object({
  name: z.string().trim().min(1).max(50),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/),
});

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: NextRequest, context: RouteContext) {
  const user = await getRequestUser(request);
  if (!user) {
    return jsonError("Unauthorized.", 401);
  }

  const { id } = await context.params;
  const activityId = parseObjectId(id);
  if (!activityId) {
    return jsonError("Invalid activity id.");
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return jsonError("Invalid request body.");
  }

  const parsed = activityUpdateSchema.safeParse(payload);
  if (!parsed.success) {
    return jsonError("Invalid activity payload.");
  }

  const userId = new ObjectId(user.id);
  const { activityTypes } = await getCollections();
  let result: Awaited<ReturnType<typeof activityTypes.findOneAndUpdate>>;
  try {
    result = await activityTypes.findOneAndUpdate(
      { _id: activityId, userId },
      {
        $set: {
          name: parsed.data.name,
          color: parsed.data.color,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" },
    );
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) {
      return jsonError("Activity name already exists.", 409);
    }
    throw error;
  }

  if (!result) {
    return jsonError("Activity type not found.", 404);
  }

  return NextResponse.json({ item: serializeActivityType(result) });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const user = await getRequestUser(request);
  if (!user) {
    return jsonError("Unauthorized.", 401);
  }

  const { id } = await context.params;
  const activityId = parseObjectId(id);
  if (!activityId) {
    return jsonError("Invalid activity id.");
  }

  const userId = new ObjectId(user.id);
  const { activityTypes, tasks } = await getCollections();
  const count = await tasks.countDocuments({ userId, activityTypeId: activityId });
  if (count > 0) {
    return jsonError("Cannot delete activity type with existing tasks.", 409);
  }

  const result = await activityTypes.deleteOne({ _id: activityId, userId });
  if (!result.deletedCount) {
    return jsonError("Activity type not found.", 404);
  }

  return NextResponse.json({ success: true });
}
