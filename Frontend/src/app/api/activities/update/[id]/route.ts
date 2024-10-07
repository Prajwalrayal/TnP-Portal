import activityList from "@/utils/Activities.json";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { id, logs, ...updatedData } = await request.json();

  const activityIndex = activityList.findIndex(
    (activity) => activity.id === id
  );
  if (activityIndex === -1) {
    return NextResponse.json({ error: "Activity not found" }, { status: 404 });
  }

  const updatedActivity = {
    ...activityList[activityIndex],
    ...updatedData,
  };

  if (logs) {
    updatedActivity.logs = logs;
  }

  activityList[activityIndex] = updatedActivity;

  return NextResponse.json(updatedActivity);
}
