import { NextResponse } from "next/server";

interface CompanyDataType {
  name: string;
  description: string;
  ctc_lpa: number;
  base_inr: number;
  roles: string[];
  criteria: string;
  logoUrl: string;
  website: string;
  location: string;
  categories: string[];
  id?: string;
  email?: string;
}

interface BodyType
  extends Omit<CompanyDataType, "description" | "roles" | "categories"> {
  desc: string;
  roles: string;
  categories: string;
  token?: string;
}

const processCompanyData = (item: any): BodyType => {
  return {
    id: item.id?.toString() || "0",
    name: item.name || "Unnamed Company",
    desc: item.description || "No description available",
    ctc_lpa: item.salaries?.[0]?.ctc || 0,
    base_inr: item.salaries?.[0]?.baseSalary || 0,
    roles: item.rolesOffered || [],
    criteria: item.criteria || "Not specified",
    logoUrl:
      item.logoUrl || "https://via.placeholder.com/128x128/FFFFFF/000000",
    website: item.website || "https://default-website.com",
    location: item.address || "No location provided",
    categories: item.categories || [],
  };
};

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

  const newCompanyData = {
    name,
    email: "",
    description: desc,
    salary: [
      {
        ctc: ctc_lpa,
        baseSalary: base_inr,
        description: roles.split(",").map((role: string) => role.trim())[0],
      },
    ],
    criteria,
    logoUrl:
      logoUrl.length === 0
        ? "https://via.placeholder.com/128x128/FFFFFF/000000"
        : logoUrl,
    website,
    address: location,
    rolesOffered: roles.split(",").map((role: string) => role.trim()),
    categories: categories
      .split(",")
      .map((category: string) => category.trim()),
  };

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

    let createdCompany = await response.json();
    createdCompany = processCompanyData(createdCompany);
    return NextResponse.json(createdCompany, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while creating the company" },
      { status: 500 }
    );
  }
}
