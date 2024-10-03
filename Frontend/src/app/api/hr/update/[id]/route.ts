import hrList from "@/utils/HR.json";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { id, ...updatedData } = await request.json();

  const hrIndex = hrList.findIndex((hr) => hr.id === id);
  if (hrIndex === -1) {
    return NextResponse.json({ error: "HR not found" }, { status: 404 });
  }

  const updatedHR = {
    ...hrList[hrIndex],
    ...updatedData,
  };

  hrList[hrIndex] = updatedHR;

  return NextResponse.json(updatedHR);
}
