import activityList from "@/utils/Activities.json";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { name, desc, student, status, init_date, token } =
    await request.json();
  const backendUrl = `${process.env.NEXT_PUBLIC_SERVER_HOST}/activities`;

  const currentDate = new Date();
  const initialLog = {
    [currentDate.toISOString()]: "Initial log",
  };

  const newActivity = {
    // id: activityList.length > 0 ? activityList[activityList.length - 1].id + 1 : 1,
    name,
    desc,
    student,
    status,
    init_date: new Date(init_date),
    last_updated_on: currentDate,
    logs: [initialLog],
  };

  // return NextResponse.json(newActivity, { status: 201 });

  try {
    const sessionToken = token || "";

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newActivity),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to create activity" },
        { status: response.status }
      );
    }

    const createdActivity = await response.json();
    return NextResponse.json(createdActivity, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while creating the activity" },
      { status: 500 }
    );
  }
}
