import { NextResponse } from "next/server";

interface Log {
  [key: string]: string;
}

interface ActivityDataType {
  id: number;
  desc: string;
  student: string;
  status: string;
  company: string;
  init_date: Date;
  last_updated_on: Date;
  logs: Log[];
}

const processActivityData = (data: any[]): ActivityDataType[] => {
  return data.map((item) => ({
    id: item.id || 0,
    desc: item.description || "No description provided",
    student: item.userEmail || "No email",
    status: item.status || "UNKNOWN",
    company: item.company?.name || "Unknown Company",
    init_date: new Date(item.createdAt) || new Date(),
    last_updated_on: new Date(item.lastUpdated) || new Date(),
    logs: item.logs || [],
  }));
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const offset = parseInt(searchParams.get("offset") || "0", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const backendUrl = `${process.env.NEXT_PUBLIC_SERVER_HOST}/activities`;

  try {
    const authorizationHeader = request.headers.get("authorization");

    if (!authorizationHeader) {
      return NextResponse.json(
        { error: "Authorization header is missing" },
        { status: 401 }
      );
    }

    const response = await fetch(backendUrl, {
      headers: {
        Authorization: `Bearer ${authorizationHeader}`,
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
