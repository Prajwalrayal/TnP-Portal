import activityList from "@/utils/Activities.json";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  const { id, logs, token, ...updatedData } = await request.json();
  const backendUrl = `${process.env.NEXT_PUBLIC_SERVER_HOST}/activities/${id}`;

  // const activityIndex = activityList.findIndex(
  //   (activity) => activity.id === id
  // );
  // if (activityIndex === -1) {
  //   return NextResponse.json({ error: "Activity not found" }, { status: 404 });
  // }

  // const updatedActivity = {
  //   ...activityList[activityIndex],
  //   ...updatedData,
  // };

  // if (logs) {
  //   updatedActivity.logs = logs;
  // }

  // activityList[activityIndex] = updatedActivity;

  // return NextResponse.json(updatedActivity);

  try {
    const sessionToken = token || "";

    const response = await fetch(backendUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        ...updatedData,
        logs: logs || [],
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Activity not found" },
        { status: 404 }
      );
    }

    const updatedActivity = await response.json();
    return NextResponse.json(updatedActivity);
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while updating the activity" },
      { status: 500 }
    );
  }
}
