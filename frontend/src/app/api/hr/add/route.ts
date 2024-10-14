import { NextResponse } from "next/server";
import hrDataList from "@/utils/HR.json";

interface HRDataType {
  id: number;
  name: string;
  email: string;
  company: string;
  position: string;
  phone_numbers: string[];
  linkedin: string;
}

const processHRData = (item: any): HRDataType => {
  return {
    id: item.id || 0,
    name: `${item.firstName || "Unknown Name"} ${item.lastName || ""}`,
    email: item.email || "No email provided",
    company: item.company?.name || "Unknown Company",
    position: item.position || "Unknown Position",
    phone_numbers: item.mobileNumbers || [],
    linkedin: item.linkedinUrl || "No LinkedIn profile",
  };
};

export async function POST(request: Request) {
  const { name, email, company, position, phone_numbers, linkedin, token } =
    await request.json();

  const backendUrl = `${process.env.NEXT_PUBLIC_SERVER_HOST}/clients`;

  const newHRData = {
    email,
    firstName: name,
    lastName: "",
    description: "",
    company: {
      id: parseInt(company),
    },
    position,
    mobileNumbers: phone_numbers,
    linkedinUrl: linkedin,
  };

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
