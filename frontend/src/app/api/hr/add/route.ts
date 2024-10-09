import { NextResponse } from "next/server";
import hrDataList from "@/utils/HR.json";

interface HRDataType {
  id: number;
  name: string;
  email: string;
  company: string;
  phone_numbers: string[];
  linkedin: string;
}

const processHRData = (item: any): HRDataType => {
  return {
    id: item.id || 0,
    name: `${item.firstName || "Unknown"} ${item.lastName || "Name"}`,
    email: item.email || "No email provided",
    company: item.company?.name || "Unknown Company",
    phone_numbers: item.mobileNumbers || [],
    linkedin: item.linkedinUrl || "No LinkedIn profile",
  };
};

export async function POST(request: Request) {
  const { name, email, company, phone_numbers, linkedin, token } =
    await request.json();

  const backendUrl = `${process.env.NEXT_PUBLIC_SERVER_HOST}/hr`;

  const currentDate = new Date();

  const newHRData = {
    // id: hrDataList.length > 0 ? hrDataList[hrDataList.length - 1].id + 1 : 1,
    name,
    email,
    company,
    phone_numbers,
    linkedin,
    created_at: currentDate,
  };

  // return NextResponse.json(newHRData, { status: 201 });

  try {
    const sessionToken = token || "";

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newHRData),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to create HR" },
        { status: response.status }
      );
    }

    let createdHR = await response.json();
    createdHR = processHRData(createdHR);
    return NextResponse.json(createdHR, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while creating the HR" },
      { status: 500 }
    );
  }
}
