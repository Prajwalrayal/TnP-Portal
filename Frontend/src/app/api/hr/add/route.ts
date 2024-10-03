import { NextResponse } from "next/server";
import hrDataList from "@/utils/HR.json";

export async function POST(request: Request) {
  const { name, email, company, phone_numbers, linkedin } =
    await request.json();

  const newId =
    hrDataList.length > 0 ? hrDataList[hrDataList.length - 1].id + 1 : 1;

  const currentDate = new Date();

  const newHRData = {
    id: newId,
    name,
    email,
    company,
    phone_numbers,
    linkedin,
    created_at: currentDate,
  };

  return NextResponse.json(newHRData, { status: 201 });
}
