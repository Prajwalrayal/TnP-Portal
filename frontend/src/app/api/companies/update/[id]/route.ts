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
  token: string;
}

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

    const updatedCompany: CompanyDataType = await response.json();
    return NextResponse.json(updatedCompany);
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while updating the company" },
      { status: 500 }
    );
  }
}
