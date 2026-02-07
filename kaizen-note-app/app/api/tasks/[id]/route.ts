import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { jsonError, parseObjectId } from "@/lib/api";
import { getCollections } from "@/lib/mongodb";
import { serializeTask } from "@/lib/serialize";
import { getRequestUser } from "@/lib/session";

const taskUpdateSchema = z.object({
  note: z.string().max(300).optional(),
  activityTypeId: z.string().optional(),
  projectId: z.string().optional().nullable(),
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
  const taskId = parseObjectId(id);
  if (!taskId) {
    return jsonError("Invalid task id.");
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return jsonError("Invalid request body.");
  }
  const parsed = taskUpdateSchema.safeParse(payload);
  if (!parsed.success) {
    return jsonError("Invalid task payload.");
  }

  const userId = new ObjectId(user.id);
  const { tasks, activityTypes, projects } = await getCollections();
  const updates: Record<string, unknown> = { updatedAt: new Date() };
  const unsets: Record<string, "" | 1> = {};

  if (typeof parsed.data.note === "string") {
    updates.note = parsed.data.note;
  }

  if (parsed.data.activityTypeId) {
    const activityId = parseObjectId(parsed.data.activityTypeId);
    if (!activityId) {
      return jsonError("Invalid activityTypeId.");
    }
    const activityExists = await activityTypes.findOne({ _id: activityId, userId });
    if (!activityExists) {
      return jsonError("Activity type not found.", 404);
    }
    updates.activityTypeId = activityId;
  }

  if (parsed.data.projectId !== undefined) {
    if (!parsed.data.projectId) {
      unsets.projectId = "";
    } else {
      const projectId = parseObjectId(parsed.data.projectId);
      if (!projectId) {
        return jsonError("Invalid projectId.");
      }
      const projectExists = await projects.findOne({ _id: projectId, userId });
      if (!projectExists) {
        return jsonError("Project not found.", 404);
      }
      updates.projectId = projectId;
    }
  }

  const updated = await tasks.findOneAndUpdate(
    { _id: taskId, userId },
    {
      $set: updates,
      ...(Object.keys(unsets).length > 0 ? { $unset: unsets } : {}),
    },
    { returnDocument: "after" },
  );

  if (!updated) {
    return jsonError("Task not found.", 404);
  }

  return NextResponse.json({ item: serializeTask(updated) });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const user = await getRequestUser(request);
  if (!user) {
    return jsonError("Unauthorized.", 401);
  }

  const { id } = await context.params;
  const taskId = parseObjectId(id);
  if (!taskId) {
    return jsonError("Invalid task id.");
  }

  const userId = new ObjectId(user.id);
  const { tasks } = await getCollections();
  const result = await tasks.deleteOne({ _id: taskId, userId });
  if (!result.deletedCount) {
    return jsonError("Task not found.", 404);
  }

  return NextResponse.json({ success: true });
}
