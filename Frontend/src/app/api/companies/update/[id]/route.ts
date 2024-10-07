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
}

export async function POST(request: Request) {
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
  }: BodyType = await request.json();

  const companyIndex = companyList.findIndex((company) => company.id === id);
  if (companyIndex === -1) {
    return NextResponse.json({ error: "Company not found" }, { status: 404 });
  }

  const updatedCompany: CompanyDataType = {
    ...companyList[companyIndex],
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
  };

  companyList[companyIndex] = updatedCompany;

  return NextResponse.json(updatedCompany);
}
