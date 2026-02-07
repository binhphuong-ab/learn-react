import { hash } from "bcryptjs";
import { MongoServerError, ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { jsonError } from "@/lib/api";
import { createSessionToken, setSessionCookie } from "@/lib/auth";
import { DEFAULT_ACTIVITY_TYPES } from "@/lib/constants";
import { getCollections } from "@/lib/mongodb";

const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(32, "Username must be 32 characters or fewer")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username may only contain letters, numbers, and underscores",
    ),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(request: NextRequest) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return jsonError("Invalid request body.");
  }

  const parsed = registerSchema.safeParse(payload);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid input.");
  }

  const { username, password } = parsed.data;
  const { users, activityTypes } = await getCollections();

  const exists = await users.findOne({ username });
  if (exists) {
    return jsonError("Username already exists.", 409);
  }

  const now = new Date();
  const passwordHash = await hash(password, 12);
  const userId = new ObjectId();
  let insertResult: { insertedId: ObjectId };
  try {
    insertResult = await users.insertOne({
      _id: userId,
      username,
      passwordHash,
      createdAt: now,
      updatedAt: now,
    });

    await activityTypes.insertMany(
      DEFAULT_ACTIVITY_TYPES.map((activity) => ({
        _id: new ObjectId(),
        userId: insertResult.insertedId,
        name: activity.name,
        color: activity.color,
        createdAt: now,
        updatedAt: now,
      })),
    );
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) {
      return jsonError("Username already exists.", 409);
    }
    throw error;
  }

  const user = {
    id: insertResult.insertedId.toHexString(),
    username,
  };

  const token = await createSessionToken(user);
  const response = NextResponse.json({ user }, { status: 201 });
  setSessionCookie(response, token, request);
  return response;
}
