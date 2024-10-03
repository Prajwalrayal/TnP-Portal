import activityList from "@/utils/Activities.json";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const offset = parseInt(searchParams.get("offset") || "0", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);

  if (typeof activityList === "undefined" || activityList.length === 0) {
    return NextResponse.json([]);
  }

  const paginatedActivities = activityList.slice(offset, offset + limit);
  return NextResponse.json(paginatedActivities);
}
