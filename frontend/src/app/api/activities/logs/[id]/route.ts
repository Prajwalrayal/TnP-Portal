import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const authorizationHeader = request.headers.get("authorization");

  if (!authorizationHeader) {
    return NextResponse.json(
      { error: "Authorization header is missing" },
      { status: 401 }
    );
  }
  const sessionToken = authorizationHeader || "";
  const backendUrl = `${process.env.NEXT_PUBLIC_SERVER_HOST}/activities/logs/${id}`;

  try {
    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || "Failed to fetch activity logs" },
        { status: response.status }
      );
    }

    const logs = await response.json();
    return NextResponse.json(logs);
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while fetching activity logs" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const backendUrl = `${process.env.NEXT_PUBLIC_SERVER_HOST}/activities/add-log`;

  try {
    const body = await request.json();
    const log = body.logs[0];
    const sessionToken = body.token || "";

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
      body: JSON.stringify({ activityId: id, log: Object.values(log)[0] }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log(errorData);
      return NextResponse.json(
        { error: errorData.message || "Failed to add log" },
        { status: response.status }
      );
    }

    const addedLog = await response.json();
    console.log(addedLog);
    return NextResponse.json(addedLog, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while adding the log" },
      { status: 500 }
    );
  }
}
