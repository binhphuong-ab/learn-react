import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

import { jsonError, parseObjectId } from "@/lib/api";
import { isDateKey } from "@/lib/date";
import { getCollections } from "@/lib/mongodb";
import { serializeReflection } from "@/lib/serialize";
import { getRequestUser } from "@/lib/session";

type RouteContext = {
  params: Promise<{ value: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const user = await getRequestUser(request);
  if (!user) {
    return jsonError("Unauthorized.", 401);
  }

  const { value } = await context.params;
  if (!isDateKey(value)) {
    return jsonError("Date must be in YYYY-MM-DD format.");
  }

  const userId = new ObjectId(user.id);
  const { dailyReflections } = await getCollections();
  const doc = await dailyReflections.findOne({ userId, dateKey: value });
  if (!doc) {
    return jsonError("Reflection not found.", 404);
  }

  return NextResponse.json({ item: serializeReflection(doc) });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const user = await getRequestUser(request);
  if (!user) {
    return jsonError("Unauthorized.", 401);
  }

  const { value } = await context.params;
  const reflectionId = parseObjectId(value);
  if (!reflectionId) {
    return jsonError("Invalid reflection id.");
  }

  const userId = new ObjectId(user.id);
  const { dailyReflections } = await getCollections();
  const result = await dailyReflections.deleteOne({ _id: reflectionId, userId });
  if (!result.deletedCount) {
    return jsonError("Reflection not found.", 404);
  }

  return NextResponse.json({ success: true });
}
