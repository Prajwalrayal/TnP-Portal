import hrList from "@/utils/HR.json";
import { NextResponse } from "next/server";

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

    const updatedHR = await response.json();
    return NextResponse.json(updatedHR);
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while updating the HR" },
      { status: 500 }
    );
  }
}
