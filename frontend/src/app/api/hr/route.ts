import hrList from "@/utils/HR.json";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  if (typeof hrList === "undefined" || hrList.length === 0) {
    return NextResponse.json([]);
  }

  return NextResponse.json(hrList);
}
