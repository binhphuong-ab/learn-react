import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

import { jsonError } from "@/lib/api";
import { isDateKey, shiftDateKey, startOfWeekDateKey, weekDateKeys } from "@/lib/date";
import { getCollections } from "@/lib/mongodb";
import { getRequestUser } from "@/lib/session";

export async function GET(request: NextRequest) {
  const user = await getRequestUser(request);
  if (!user) {
    return jsonError("Unauthorized.", 401);
  }

  const weekStartParam = request.nextUrl.searchParams.get("weekStart");
  if (weekStartParam && !isDateKey(weekStartParam)) {
    return jsonError("weekStart must be YYYY-MM-DD.");
  }

  const weekStart = startOfWeekDateKey(weekStartParam ?? undefined);
  const weekEnd = shiftDateKey(weekStart, 6);
  const days = weekDateKeys(weekStart);
  const userId = new ObjectId(user.id);

  const { tasks } = await getCollections();
  const docs = await tasks
    .find({
      userId,
      dateKey: {
        $gte: weekStart,
        $lte: weekEnd,
      },
    })
    .toArray();

  const dayTotalsMap = new Map<string, number>();
  const heatmapMap = new Map<string, number>();
  for (const day of days) {
    dayTotalsMap.set(day, 0);
  }

  for (const task of docs) {
    dayTotalsMap.set(task.dateKey, (dayTotalsMap.get(task.dateKey) ?? 0) + 1);
    const key = `${task.dateKey}|${task.hour}`;
    heatmapMap.set(key, (heatmapMap.get(key) ?? 0) + 1);
  }

  const dayTotals = days.map((dateKey) => ({
    dateKey,
    hours: dayTotalsMap.get(dateKey) ?? 0,
  }));
  const heatmap = Array.from(heatmapMap.entries()).map(([key, value]) => {
    const [dateKey, hourString] = key.split("|");
    return {
      dateKey,
      hour: Number(hourString),
      count: value,
    };
  });

  return NextResponse.json({
    weekStart,
    weekEnd,
    totalHours: docs.length,
    dayTotals,
    heatmap,
  });
}
