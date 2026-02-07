import { MongoServerError, ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { jsonError } from "@/lib/api";
import { getCollections } from "@/lib/mongodb";
import { serializeProject } from "@/lib/serialize";
import { getRequestUser } from "@/lib/session";

const projectSchema = z.object({
  name: z.string().trim().min(1).max(80),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/),
});

export async function GET(request: NextRequest) {
  const user = await getRequestUser(request);
  if (!user) {
    return jsonError("Unauthorized.", 401);
  }

  const { projects } = await getCollections();
  const userId = new ObjectId(user.id);
  const docs = await projects.find({ userId }).sort({ createdAt: 1 }).toArray();

  return NextResponse.json({ items: docs.map(serializeProject) });
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

  const parsed = projectSchema.safeParse(payload);
  if (!parsed.success) {
    return jsonError("Invalid project payload.");
  }

  const { projects } = await getCollections();
  const userId = new ObjectId(user.id);
  const now = new Date();
  let insert: { insertedId: ObjectId };
  try {
    insert = await projects.insertOne({
      _id: new ObjectId(),
      userId,
      name: parsed.data.name,
      description: parsed.data.description?.trim() || undefined,
      color: parsed.data.color,
      createdAt: now,
      updatedAt: now,
    });
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) {
      return jsonError("Project name already exists.", 409);
    }
    throw error;
  }
  const created = await projects.findOne({ _id: insert.insertedId });

  return NextResponse.json(
    { item: created ? serializeProject(created) : null },
    { status: 201 },
  );
}
