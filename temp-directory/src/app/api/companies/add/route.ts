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
  id: string;
}

interface BodyType
  extends Omit<CompanyDataType, "roles" | "categories" | "id"> {
  roles: string;
  categories: string;
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
  }: BodyType = await request.json();

  const newId =
    companyList.length > 0 ? companyList[companyList.length - 1].id + 1 : 1;

  const newCompanyData: CompanyDataType = {
    id: `${newId}`,
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

  return NextResponse.json(newCompanyData, { status: 201 });
}
