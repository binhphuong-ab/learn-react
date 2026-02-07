import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

import { jsonError } from "@/lib/api";
import { shiftDateKey, startOfWeekDateKey } from "@/lib/date";
import { getCollections } from "@/lib/mongodb";
import { getRequestUser } from "@/lib/session";

export async function GET(request: NextRequest) {
  const user = await getRequestUser(request);
  if (!user) {
    return jsonError("Unauthorized.", 401);
  }

  const weeksParam = request.nextUrl.searchParams.get("weeks");
  const weeks = Math.max(1, Math.min(52, Number(weeksParam ?? 8) || 8));
  const currentWeekStart = startOfWeekDateKey();
  const oldestWeekStart = shiftDateKey(currentWeekStart, -(weeks - 1) * 7);
  const endDate = shiftDateKey(currentWeekStart, 6);
  const userId = new ObjectId(user.id);

  const { tasks } = await getCollections();
  const docs = await tasks
    .find({
      userId,
      dateKey: {
        $gte: oldestWeekStart,
        $lte: endDate,
      },
    })
    .project({ dateKey: 1 })
    .toArray();

  const trendMap = new Map<string, number>();
  for (let i = 0; i < weeks; i += 1) {
    const weekStart = shiftDateKey(oldestWeekStart, i * 7);
    trendMap.set(weekStart, 0);
  }

  for (const task of docs) {
    const weekStart = startOfWeekDateKey(task.dateKey);
    if (trendMap.has(weekStart)) {
      trendMap.set(weekStart, (trendMap.get(weekStart) ?? 0) + 1);
    }
  }

  const items = Array.from(trendMap.entries()).map(([weekStart, hours]) => ({
    weekStart,
    weekEnd: shiftDateKey(weekStart, 6),
    hours,
  }));

  return NextResponse.json({ weeks, items });
}
