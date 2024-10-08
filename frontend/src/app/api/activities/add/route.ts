import activityList from "@/utils/Activities.json";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { name, desc, student, status, init_date } = await request.json();

  const newId =
    activityList.length > 0 ? activityList[activityList.length - 1].id + 1 : 1;

  const currentDate = new Date();
  const initialLog = {
    [currentDate.toISOString()]: "Initial log",
  };

  const newActivity = {
    id: newId,
    name,
    desc,
    student,
    status,
    init_date: new Date(init_date),
    last_updated_on: currentDate,
    logs: [initialLog],
  };

  return NextResponse.json(newActivity, { status: 201 });
}
