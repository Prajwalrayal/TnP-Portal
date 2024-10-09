import hrList from "@/utils/HR.json";
import { NextResponse } from "next/server";

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

export async function PUT(request: Request) {
  const { id, token, ...updatedData } = await request.json();
  const backendUrl = `${process.env.NEXT_PUBLIC_SERVER_HOST}/hr/${id}`;

  // const hrIndex = hrList.findIndex((hr) => hr.id === id);
  // if (hrIndex === -1) {
  //   return NextResponse.json({ error: "HR not found" }, { status: 404 });
  // }

  // const updatedHR = {
  //   ...hrList[hrIndex],
  //   ...updatedData,
  // };

  // hrList[hrIndex] = updatedHR;

  // return NextResponse.json(updatedHR);

  try {
    const sessionToken = token || "";

    const response = await fetch(backendUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, ...updatedData }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "HR not found" }, { status: 404 });
    }

    let updatedHR = await response.json();
    updatedHR = processHRData(updatedHR);
    return NextResponse.json(updatedHR, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while updating the HR" },
      { status: 500 }
    );
  }
}
