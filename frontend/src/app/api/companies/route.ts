import companyList from "@/utils/Companies.json";
import { NextResponse } from "next/server";

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
  id: string;
}

const processCompanyData = (data: any[]): CompanyDataType[] => {
  return data.map((item) => ({
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
  }));
};

export async function GET(request: Request) {
  // if (typeof companyList === "undefined" || companyList.length === 0) {
  //   return NextResponse.json([]);
  // }

  // return NextResponse.json(companyList);

  const backendUrl = `${process.env.NEXT_PUBLIC_SERVER_HOST}/companies`;

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
        { error: "Failed to fetch companies" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const processedData = processCompanyData(data);
    return NextResponse.json(processedData);
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while fetching companies" },
      { status: 500 }
    );
  }
}
