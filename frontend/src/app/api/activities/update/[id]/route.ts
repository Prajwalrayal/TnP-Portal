import activityList from "@/utils/Activities.json";
import { NextResponse } from "next/server";

interface Log {
  [key: string]: string;
}

interface ActivityDataType {
  id: number;
  desc: string;
  name: string;
  student: string;
  status: string;
  init_date: Date;
  last_updated_on: Date;
  logs: Log[];
}

const processActivityData = (item: any): ActivityDataType => {
  return {
    id: item.id || 0,
    desc: item.description || "No description provided",
    name: item.userName || "Unknown",
    student: item.userEmail || "No email",
    status: item.status || "UNKNOWN",
    init_date: new Date(item.createdAt) || new Date(),
    last_updated_on: new Date(item.lastUpdated) || new Date(),
    logs: item.logs || [],
  };
};

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

    let updatedActivity = await response.json();
    updatedActivity = processActivityData(updatedActivity);
    return NextResponse.json(updatedActivity, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while updating the activity" },
      { status: 500 }
    );
  }
}
