import { NextResponse } from "next/server";
import companyList from "@/utils/Companies.json";

interface CompanyDataType {
  name: string;
  desc: string;
  ctc_lpa: number;
  base_inr: number;
  roles: string[];
  criteria: string;
  logoUrl: string;
  website: string;
  location: string;
  categories: string[];
  id?: string;
}

interface BodyType
  extends Omit<CompanyDataType, "roles" | "categories" | "id"> {
  roles: string;
  categories: string;
  token: string;
}

export async function POST(request: Request) {
  const {
    name,
    desc,
    ctc_lpa,
    base_inr,
    roles,
    criteria,
    logoUrl,
    website,
    location,
    categories,
    token,
  }: BodyType = await request.json();

  const backendUrl = `${process.env.NEXT_PUBLIC_SERVER_HOST}/companies`;

  const newCompanyData: CompanyDataType = {
    // id: `${
    //   companyList.length > 0 ? companyList[companyList.length - 1].id + 1 : 1
    // }`,
    name,
    desc,
    ctc_lpa,
    base_inr,
    criteria,
    logoUrl:
      logoUrl.length === 0
        ? "https://via.placeholder.com/128x128/FFFFFF/000000"
        : logoUrl,
    website,
    location,
    roles: roles.split(",").map((role: string) => role.trim()),
    categories: categories
      .split(",")
      .map((category: string) => category.trim()),
  };

  // return NextResponse.json(newCompanyData, { status: 201 });

  try {
    const sessionToken = token || "";

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCompanyData),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to create company" },
        { status: response.status }
      );
    }

    const createdCompany: CompanyDataType = await response.json();
    return NextResponse.json(createdCompany, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while creating the company" },
      { status: 500 }
    );
  }
}
