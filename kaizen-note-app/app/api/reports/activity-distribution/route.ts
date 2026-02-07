import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

import { jsonError } from "@/lib/api";
import { isDateKey } from "@/lib/date";
import { getCollections } from "@/lib/mongodb";
import { getRequestUser } from "@/lib/session";

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

  const rows = await tasks
    .aggregate<{
      activityTypeId: string;
      name?: string;
      color?: string;
      hours: number;
    }>([
      {
        $match: {
          userId,
          dateKey: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$activityTypeId",
          hours: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "activityTypes",
          localField: "_id",
          foreignField: "_id",
          as: "activity",
        },
      },
      {
        $unwind: {
          path: "$activity",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          activityTypeId: { $toString: "$_id" },
          name: "$activity.name",
          color: "$activity.color",
          hours: 1,
        },
      },
      {
        $sort: { hours: -1 },
      },
    ])
    .toArray();

  const totalHours = rows.reduce((sum, row) => sum + row.hours, 0);
  return NextResponse.json({
    startDate,
    endDate,
    totalHours,
    items: rows.map((row) => ({
      activityTypeId: row.activityTypeId,
      name: row.name ?? "Unknown",
      color: row.color ?? "#94a3b8",
      hours: row.hours,
      percentage: totalHours > 0 ? Number(((row.hours / totalHours) * 100).toFixed(2)) : 0,
    })),
  });
}
