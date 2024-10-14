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

export async function PUT(request: Request) {
  const { id, name, email, company, position, phone_numbers, linkedin, token } =
    await request.json();
  const backendUrl = `${process.env.NEXT_PUBLIC_SERVER_HOST}/clients/${id}`;

  const updatedData = {
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
    updatedHR = processHRData(updatedData);
    return NextResponse.json(updatedHR, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while updating the HR" },
      { status: 500 }
    );
  }
}
