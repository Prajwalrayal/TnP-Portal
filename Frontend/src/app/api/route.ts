import { NextResponse } from "next/server";

export async function GET(request: Request) {
  return NextResponse.json({ msg: "Welcome to TnP Portal!" });
}
