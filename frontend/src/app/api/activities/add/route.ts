import { NextResponse } from "next/server";

interface Log {
  [key: string]: string;
}

interface ActivityDataType {
  id: number;
  desc: string;
  student: string;
  company: string;
  status: string;
  init_date: Date;
  last_updated_on: Date;
  logs: Log[];
}

const processActivityData = (item: any): ActivityDataType => {
  return {
    id: item.id || 0,
    desc: item.description || "No description provided",
    company: item.company?.name || "UNKNOWN",
    student: item.userEmail || "No email",
    status: item.status || "UNKNOWN",
    init_date: new Date(item.createdAt) || new Date(),
    last_updated_on: new Date(item.lastUpdated) || new Date(),
    logs: item.logs || [],
  };
};

export async function POST(request: Request) {
  const { desc, student, status, init_date, token, company } =
    await request.json();
  const backendUrl = `${process.env.NEXT_PUBLIC_SERVER_HOST}/activities`;

  const currentDate = new Date();

  const newActivity = {
    description: desc,
    userEmail: student,
    status,
    companyId: parseInt(company),
    init_date: new Date(init_date),
    last_updated_on: currentDate,
    logs: [],
  };

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

    let createdActivity = await response.json();
    createdActivity = processActivityData(createdActivity);
    return NextResponse.json(createdActivity, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while creating the activity" },
      { status: 500 }
    );
  }
}
