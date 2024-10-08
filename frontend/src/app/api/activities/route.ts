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

const processActivityData = (data: any[]): ActivityDataType[] => {
  return data.map((item) => ({
    id: item.id || 0,
    desc: item.description || "No description provided",
    name: item.userName || "Unknown",
    student: item.userEmail || "No email",
    status: item.status || "UNKNOWN",
    init_date: new Date(item.createdAt) || new Date(),
    last_updated_on: new Date(item.lastUpdated) || new Date(),
    logs: item.logs || [],
  }));
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const offset = parseInt(searchParams.get("offset") || "0", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const backendUrl = `${process.env.NEXT_PUBLIC_SERVER_HOST}/activities?offset=${offset}&limit=${limit}`;

  // if (typeof activityList === "undefined" || activityList.length === 0) {
  //   return NextResponse.json([]);
  // }

  // const paginatedActivities = activityList.slice(offset, offset + limit);
  // return NextResponse.json(paginatedActivities);

  try {
    const body = await request.json();
    const token = body.token || "";

    const response = await fetch(backendUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch activities" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const processedData = processActivityData(data);
    return NextResponse.json(processedData);
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while fetching activities" },
      { status: 500 }
    );
  }
}
