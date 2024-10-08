import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { emailid, password } = await request.json();
  const backendUrl = `${process.env.NEXT_PUBLIC_SERVER_HOST}/users/register`;

  try {
    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: emailid, password }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Registration failed" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(
      { token: data.token, emailid, password },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
