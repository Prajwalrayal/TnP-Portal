import hrList from "@/utils/HR.json";
import { NextResponse } from "next/server";

interface HRDataType {
  id: number;
  name: string;
  email: string;
  company: string;
  position: string;
  phone_numbers: string[];
  linkedin: string;
}

const processHRData = (data: any[]): HRDataType[] => {
  return data.map((item) => ({
    id: item.id || 0,
    name: `${item.firstName || "Unknown Name"} ${item.lastName || ""}`,
    email: item.email || "No email provided",
    company: item.company?.name || "Unknown Company",
    position: item.position || "Unknown Position",
    phone_numbers: item.mobileNumbers || [],
    linkedin: item.linkedinUrl || "No LinkedIn profile",
  }));
};

export async function GET(request: Request) {
  // if (typeof hrList === "undefined" || hrList.length === 0) {
  //   return NextResponse.json([]);
  // }

  // return NextResponse.json(hrList);
  const backendUrl = `${process.env.NEXT_PUBLIC_SERVER_HOST}/clients`;

  try {
    const authorizationHeader = request.headers.get("authorization");

    if (!authorizationHeader) {
      return NextResponse.json(
        { error: "Authorization header is missing" },
        { status: 401 }
      );
    }

    const response = await fetch(backendUrl, {
      headers: {
        Authorization: `Bearer ${authorizationHeader}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch HR data" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const processedData = processHRData(data);
    return NextResponse.json(processedData);
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while fetching HR data" },
      { status: 500 }
    );
  }
}
