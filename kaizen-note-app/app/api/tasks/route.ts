import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { jsonError, parseObjectId } from "@/lib/api";
import { isDateKey } from "@/lib/date";
import { getCollections } from "@/lib/mongodb";
import { serializeTask } from "@/lib/serialize";
import { getRequestUser } from "@/lib/session";

const taskSchema = z.object({
  dateKey: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  hour: z.number().int().min(0).max(23),
  note: z.string().max(300).optional().default(""),
  activityTypeId: z.string().min(1),
  projectId: z.string().optional().nullable(),
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
  const { tasks } = await getCollections();
  const docs = await tasks
    .find({
      userId,
      dateKey: {
        $gte: startDate,
        $lte: endDate,
      },
    })
    .sort({ dateKey: 1, hour: 1 })
    .toArray();

  return NextResponse.json({ items: docs.map(serializeTask) });
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

  const parsed = taskSchema.safeParse(payload);
  if (!parsed.success) {
    return jsonError("Invalid task payload.");
  }

  const activityTypeId = parseObjectId(parsed.data.activityTypeId);
  if (!activityTypeId) {
    return jsonError("Invalid activityTypeId.");
  }

  const projectId = parsed.data.projectId ? parseObjectId(parsed.data.projectId) : null;
  if (parsed.data.projectId && !projectId) {
    return jsonError("Invalid projectId.");
  }

  const userId = new ObjectId(user.id);
  const { activityTypes, projects, tasks } = await getCollections();
  const activityExists = await activityTypes.findOne({ _id: activityTypeId, userId });
  if (!activityExists) {
    return jsonError("Activity type not found.", 404);
  }

  if (projectId) {
    const projectExists = await projects.findOne({ _id: projectId, userId });
    if (!projectExists) {
      return jsonError("Project not found.", 404);
    }
  }

  const now = new Date();
  const setFields: Record<string, unknown> = {
    note: parsed.data.note,
    activityTypeId,
    updatedAt: now,
  };
  const unsetFields: Record<string, "" | 1> = {};
  if (projectId) {
    setFields.projectId = projectId;
  } else {
    unsetFields.projectId = "";
  }

  const updated = await tasks.findOneAndUpdate(
    {
      userId,
      dateKey: parsed.data.dateKey,
      hour: parsed.data.hour,
    },
    {
      $set: setFields,
      ...(Object.keys(unsetFields).length > 0 ? { $unset: unsetFields } : {}),
      $setOnInsert: {
        createdAt: now,
      },
    },
    { upsert: true, returnDocument: "after" },
  );

  if (!updated) {
    return jsonError("Unable to save task.", 500);
  }

  return NextResponse.json({ item: serializeTask(updated) }, { status: 201 });
}
