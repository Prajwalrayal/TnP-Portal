import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { emailid, password } = await request.json();

  try {
    // const response = await fetch("YOUR_DJANGO_API_REGISTER_URL", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ emailid, password }),
    // });

    // if (!response.ok) {
    //   return NextResponse.json(
    //     { error: "Registration failed" },
    //     { status: response.status }
    //   );
    // }

    // const data = await response.json();
    return NextResponse.json({ emailid, password }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
