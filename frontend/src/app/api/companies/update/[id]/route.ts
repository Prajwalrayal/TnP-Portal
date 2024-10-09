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

interface BodyType extends Omit<CompanyDataType, "roles" | "categories"> {
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

export async function PUT(request: Request) {
  const {
    id,
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

  const backendUrl = `${process.env.NEXT_PUBLIC_SERVER_HOST}/companies/${id}`;

  // const companyIndex = companyList.findIndex((company) => company.id === id);
  // if (companyIndex === -1) {
  //   return NextResponse.json({ error: "Company not found" }, { status: 404 });
  // }

  // const updatedCompany: CompanyDataType = {
  //   ...companyList[companyIndex],
  //   name,
  //   desc,
  //   ctc_lpa,
  //   base_inr,
  //   criteria,
  //   logoUrl,
  //   website,
  //   location,
  //   roles: roles.split(",").map((role: string) => role.trim()),
  //   categories: categories
  //     .split(",")
  //     .map((category: string) => category.trim()),
  // };

  // companyList[companyIndex] = updatedCompany;

  // return NextResponse.json(updatedCompany);

  try {
    const sessionToken = token || "";

    const response = await fetch(backendUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        name,
        desc,
        ctc_lpa,
        base_inr,
        criteria,
        logoUrl,
        website,
        location,
        roles: roles.split(",").map((role: string) => role.trim()),
        categories: categories
          .split(",")
          .map((category: string) => category.trim()),
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    let updatedCompany = await response.json();
    updatedCompany = processCompanyData(updatedCompany);
    return NextResponse.json(updatedCompany, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while updating the company" },
      { status: 500 }
    );
  }
}
