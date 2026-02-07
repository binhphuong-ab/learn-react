import { MongoServerError, ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { jsonError, parseObjectId } from "@/lib/api";
import { getCollections } from "@/lib/mongodb";
import { serializeProject } from "@/lib/serialize";
import { getRequestUser } from "@/lib/session";

const projectSchema = z.object({
  name: z.string().trim().min(1).max(80),
  description: z.string().trim().max(500).optional().or(z.literal("")),
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
  const projectId = parseObjectId(id);
  if (!projectId) {
    return jsonError("Invalid project id.");
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return jsonError("Invalid request body.");
  }

  const parsed = projectSchema.safeParse(payload);
  if (!parsed.success) {
    return jsonError("Invalid project payload.");
  }

  const userId = new ObjectId(user.id);
  const { projects } = await getCollections();
  let result: Awaited<ReturnType<typeof projects.findOneAndUpdate>>;
  try {
    result = await projects.findOneAndUpdate(
      { _id: projectId, userId },
      {
        $set: {
          name: parsed.data.name,
          description: parsed.data.description?.trim() || undefined,
          color: parsed.data.color,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" },
    );
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) {
      return jsonError("Project name already exists.", 409);
    }
    throw error;
  }

  if (!result) {
    return jsonError("Project not found.", 404);
  }

  return NextResponse.json({ item: serializeProject(result) });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const user = await getRequestUser(request);
  if (!user) {
    return jsonError("Unauthorized.", 401);
  }

  const { id } = await context.params;
  const projectId = parseObjectId(id);
  if (!projectId) {
    return jsonError("Invalid project id.");
  }

  const userId = new ObjectId(user.id);
  const { projects, tasks } = await getCollections();
  const count = await tasks.countDocuments({ userId, projectId });
  if (count > 0) {
    return jsonError("Cannot delete project with existing tasks.", 409);
  }

  const result = await projects.deleteOne({ _id: projectId, userId });
  if (!result.deletedCount) {
    return jsonError("Project not found.", 404);
  }

  return NextResponse.json({ success: true });
}
