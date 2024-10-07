/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { IoLocationOutline } from "react-icons/io5";
import { GoLinkExternal } from "react-icons/go";
import { FaEdit } from "react-icons/fa";
import { FC, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { toastError } from "@/utils/toasts.mjs";
import { updateCompany } from "@/redux/reducers/companySlice";

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

interface UpdateCompanyData
  extends Omit<CompanyDataType, "roles" | "categories"> {
  roles: string;
  categories: string;
}

function formatToIndianCurrency(num: number): string {
  const numStr = num.toString();
  let [integerPart, decimalPart] = numStr.split(".");

  const lastThreeDigits = integerPart.slice(-3);
  const otherDigits = integerPart.slice(0, -3);

  const formattedNumber =
    otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ",") +
    (otherDigits ? "," : "") +
    lastThreeDigits;

  return decimalPart ? `${formattedNumber}.${decimalPart}` : formattedNumber;
}

const CompanyCard = ({
  company,
  index,
}: {
  company: CompanyDataType;
  index: number;
}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentCompanyData, setCurrentCompanyData] =
    useState<CompanyDataType>(company);
  return (
    <div
      key={index}
      className={`rounded-2xl mobile-sm:min-w-[90vw] mobile-sm:w-[90vw] min-w-23rem h-fit min-h-[470px] border border-gray-100 dark:border-gray-700 flex flex-col dark:shadow-neutral-800 shadow-lg hover:shadow-xl`}
    >
      <UpdateCompanyPopup
        isOpen={isPopupOpen}
        closePopup={() => setIsPopupOpen(false)}
        companyData={currentCompanyData}
      />
      <header className="relative pl-4 flex rounded-t-2xl justify-between bg-gradient-to-r from-green-primary via-green-secondary to-green-primary hover:bg-gradient-to-r hover:from-green-primary hover:via-green-secondary hover:to-green-primary dark:hover:from-slate-900 dark:hover:via-slate-800 dark:hover:to-green-secondary dark:bg-gradient-to-r dark:from-slate-900 dark:via-slate-900 dark:to-green-primary p-2 py-3 border-b dark:border-b-slate-700">
        <FaEdit
          size={20}
          className="cursor-pointer absolute top-4 right-4 text-blue-600 opacity-75 hover:opacity-100 transition-all"
          onClick={(e) => {
            e.preventDefault();
            setIsPopupOpen(true);
            setCurrentCompanyData(company);
          }}
        />
        <div className="flex items-center justify-between w-full gap-2 my-10">
          <h2 className="absolute bottom-[-1rem] left-6 group-hover:underline text-md font-medium text-green-primary bg-neutral-100 rounded-md px-3 py-2 shadow-md">
            {company.name}
          </h2>
          {company.logoUrl && (
            <div
              className={`absolute bottom-[-1.5rem] right-6 shadow-lg bg-white h-fit w-fit rounded-full flex items-center justify-center overflow-hidden`}
            >
              <img
                src={company.logoUrl}
                alt="logo"
                className="object-cover h-[4rem] w-[4rem]"
              />
            </div>
          )}
        </div>
      </header>
      <main className="flex pl-4 mt-4 justify-center items-center ">
        <div className="px-3 pt-3 flex-1 flex justify-between flex-col pb-4">
          <div className="mb-4 h-fit overflow-auto scrollbar-hide !cursor-default">
            {/* Description (first 50 characters) */}
            <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
              {company.desc.length > 50
                ? `${company.desc.slice(0, 50)}...`
                : company.desc}
            </p>

            {/* Website */}
            <div className="flex items-center justify-start gap-x-1 py-2">
              <IoLocationOutline className="h-4 w-4 text-green-secondary" />
              <Link
                target="_blank"
                href={company.website}
                className="hover:underline text-sm text-neutral-400 font-medium"
              >
                {company.website}
              </Link>
            </div>

            {/* Location */}
            <div className="flex items-center pl-0.5 pb-2">
              {company.location !== null && (
                <h2 className="flex items-center justify-start gap-x-1 text-sm text-neutral-400 font-medium">
                  <GoLinkExternal className="h-3 w-3 text-green-secondary" />
                  {company.location}
                </h2>
              )}
            </div>

            {/* Categories */}
            <div className="flex flex-wrap">
              {company.categories?.length > 0 && (
                <div className="flex py-2">
                  <div className="flex flex-wrap items-center gap-2 px-2">
                    {company.categories
                      .slice(0, 4)
                      .map((el: string, idx: number) => (
                        <span
                          key={idx}
                          className={`px-3 py-1 text-xs inline-flex flex-nowrap items-center select-none rounded-full leading-none cursor-default border border-amber-500 bg-amber-500 bg-opacity-20 text-amber-900`}
                        >
                          {el}
                        </span>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* CTC */}
            <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
              <strong>CTC:</strong> {company.ctc_lpa} LPA
            </p>

            {/* Base */}
            <p className="text-sm text-gray-500 dark:text-gray-300">
              <strong>Base Salary:</strong>{" "}
              {formatToIndianCurrency(company.base_inr)} INR
            </p>

            {/* Criteria */}
            <p className="text-sm text-gray-500 dark:text-gray-300">
              <strong>Criteria:</strong> {company.criteria}
            </p>

            {/* Roles */}
            <div className="flex flex-wrap mt-4">
              {company.roles?.length > 0 && (
                <div className="flex py-2">
                  <div className="flex flex-wrap items-center gap-2 px-2">
                    {company.roles
                      .slice(0, 4)
                      .map((role: string, idx: number) => (
                        <span
                          key={idx}
                          className={`px-3 py-1 text-xs inline-flex flex-nowrap items-center select-none rounded-full leading-none cursor-default border border-blue-500 bg-blue-500 bg-opacity-20 text-blue-900`}
                        >
                          {role}
                        </span>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

interface InputFieldProps {
  id: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
}) => (
  <div className="mb-2 w-full relative">
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="border p-2 w-full flex-1 focus:outline-green-800 rounded-md"
    />
  </div>
);

const UpdateCompanyPopup: FC<{
  isOpen: boolean;
  closePopup: () => void;
  companyData: CompanyDataType;
}> = ({ isOpen, closePopup, companyData }) => {
  const dispatch = useAppDispatch();

  const [updatedCompanyData, setUpdatedCompanyData] =
    useState<UpdateCompanyData>({
      ...companyData,
      roles: companyData.roles.join(", "),
      categories: companyData.categories.join(", "),
    });
  const { pendingCompanyUpdate, updateCompanyError } = useAppSelector(
    (state) => state.companies
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedCompanyData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = () => {
    const updatedData: UpdateCompanyData = {
      ...updatedCompanyData,
      ctc_lpa: parseFloat(updatedCompanyData.ctc_lpa.toString()),
      base_inr: parseFloat(updatedCompanyData.base_inr.toString()),
    };
    dispatch(updateCompany(updatedData));
  };

  useEffect(() => {
    if (updateCompanyError) toastError(updateCompanyError);
  }, [updateCompanyError]);

  useEffect(() => {
    if (!pendingCompanyUpdate) {
      closePopup();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingCompanyUpdate]);

  if (!isOpen) return null;

  const fields = [
    { id: "name", name: "Name", value: updatedCompanyData.name },
    { id: "desc", name: "Description", value: updatedCompanyData.desc },
    { id: "ctc_lpa", name: "CTC (LPA)", value: updatedCompanyData.ctc_lpa },
    {
      id: "base_inr",
      name: "Base Salary (INR)",
      value: updatedCompanyData.base_inr,
    },
    { id: "criteria", name: "Criteria", value: updatedCompanyData.criteria },
    { id: "logoUrl", name: "Logo URL", value: updatedCompanyData.logoUrl },
    { id: "website", name: "Website", value: updatedCompanyData.website },
    { id: "location", name: "Location", value: updatedCompanyData.location },
    { id: "roles", name: "Roles", value: updatedCompanyData.roles },
    {
      id: "categories",
      name: "Categories",
      value: updatedCompanyData.categories,
    },
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[100]">
      <div className="bg-white w-[30rem] p-5 rounded-lg shadow-lg relative">
        <div className="absolute top-0 left-0 w-full flex justify-end items-end px-3 pt-4">
          <div
            onClick={closePopup}
            className="hover:bg-neutral-200 transition-all text-green-900 p-1 rounded-md cursor-pointer"
          >
            <IoMdClose size={24} />
          </div>
        </div>

        <h2 className="text-lg font-bold">Update Company Info</h2>
        <p className="text-xs text-neutral-600 mb-4">
          (Please provide the following details:)
        </p>

        {fields.map((field) => (
          <InputField
            key={field.id}
            id={field.id}
            name={field.id}
            value={field.value}
            onChange={handleChange}
            placeholder={field.name}
          />
        ))}

        <div className="w-full flex justify-end items-end">
          <button
            type="button"
            onClick={handleSave}
            className="mt-4 bg-green-900 text-white px-4 py-2 rounded"
          >
            {pendingCompanyUpdate ? (
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-neutral-200 border-solid" />
            ) : (
              <p className="cursor-pointer">{"Save"}</p>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;
