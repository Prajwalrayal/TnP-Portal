import { NextResponse } from "next/server";
import companyList from "@/utils/Companies.json";

interface CompanyDataType {
  name: string;
  description: string;
  ctc_lpa: number;
  base_inr: number;
  roles: string[];
  criteria: string;
  logoUrl: string;
  URL: string;
  location: string;
  categories: string[];
  id?: string;
  email?: string;
}

interface BodyType
  extends Omit<
    CompanyDataType,
    "URL" | "description" | "roles" | "categories"
  > {
  website: string;
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

  const newCompanyData: CompanyDataType = {
    // id: `${
    //   companyList.length > 0 ? companyList[companyList.length - 1].id + 1 : 1
    // }`,
    name,
    description: desc,
    ctc_lpa,
    base_inr,
    criteria,
    logoUrl:
      logoUrl.length === 0
        ? "https://via.placeholder.com/128x128/FFFFFF/000000"
        : logoUrl,
    URL: website,
    location,
    roles: roles.split(",").map((role: string) => role.trim()),
    categories: categories
      .split(",")
      .map((category: string) => category.trim()),
    email: "",
  };

  // return NextResponse.json(newCompanyData, { status: 201 });

  try {
    const sessionToken = token || "";
    console.log(sessionToken, newCompanyData);

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
