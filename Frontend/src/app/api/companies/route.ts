import companyList from "@/utils/Companies.json";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  if (typeof companyList === "undefined" || companyList.length === 0) {
    return NextResponse.json([]);
  }

  return NextResponse.json(companyList);
}
