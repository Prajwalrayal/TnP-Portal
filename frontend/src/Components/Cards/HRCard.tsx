import useOnClickOutside from "@/custom-hooks/useOnClickOutside";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { resetHRError, updateHRData } from "@/redux/reducers/hrSlice";
import { toastError } from "@/utils/toasts.mjs";
import classNames from "classnames";
import { FC, useEffect, useRef, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { IoClose } from "react-icons/io5";

interface HRDataType {
  id: number;
  name: string;
  email: string;
  company: string;
  position: string;
  phone_numbers: string[];
  linkedin: string;
}

const HRCard = ({ hr, index }: { hr: HRDataType; index: number }) => {
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const toggleDropdown = (index: number) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  return (
    <div
      className={classNames({
        "w-full flex flex-col p-4 bg-white dark:bg-neutral-800 rounded-lg":
          true,
        "border border-transparent hover:border-green-secondary relative": true,
        "transition-all duration-300 shadow-md hover:shadow-lg": true,
      })}
    >
      <h3 className="font-bold group-hover:text-primary">{hr.name}</h3>
      <p className="text-neutral-600 text-sm">{`${hr.email} | ${hr.linkedin}`}</p>
      <p className="text-neutral-600 text-sm">{`${hr.position} | ${hr.company}`}</p>

      <FaEdit
        size={20}
        className="cursor-pointer absolute top-4 right-4 text-green-700  opacity-75 hover:opacity-100 transition-all"
        onClick={(e) => {
          e.preventDefault();
          setIsPopupOpen(true);
        }}
      />

      <UpdateHRPopup
        isOpen={isPopupOpen}
        closePopup={() => setIsPopupOpen(false)}
        hrData={hr}
      />

      {/* Dropdown button */}
      <div className="relative inline-block text-left my-2">
        <div className="relative w-fit h-fit">
          <button
            type="button"
            className="inline-flex w-fit justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 focus:outline-green-secondary shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            id={`menu-button-${index}`}
            onClick={() => toggleDropdown(index)}
          >
            {dropdownOpen === index
              ? "Hide Phone Numbers"
              : "Show Phone Numbers"}
            <svg
              className="-mr-1 h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {/* Dropdown menu */}
          {dropdownOpen === index && (
            <div
              className="absolute left-1/2 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby={`menu-button-${index}`}
              tabIndex={-1}
            >
              <div className="py-1" role="none">
                {hr.phone_numbers.map((phone, idx) => (
                  <span
                    key={idx}
                    className="block px-4 py-2 text-sm text-gray-700"
                    role="menuitem"
                    tabIndex={-1}
                  >
                    {phone}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <a
        href={hr.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="text-green-primary font-bold focus:outline-green-secondary w-fit px-3 py-1"
      >
        LinkedIn Profile
      </a>
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

const CompanyDropdown: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  const [search, setSearch] = useState(value || "");
  const [isDropdownOpen, setIsDropDownOpen] = useState(false);
  const { companyData } = useAppSelector((state: any) => state.companies);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const companyDropdownRef = useRef(null);

  useOnClickOutside(companyDropdownRef, () => {
    setIsDropDownOpen(false);
  });

  useEffect(() => {
    const company = companyData.find((company: any) => company.name === value);
    onChange(company.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const temp = companyData.filter((company: any) =>
      company.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredCompanies(temp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  useEffect(() => {
    if (search.trim() && filteredCompanies.length > 0) setIsDropDownOpen(true);
    else setIsDropDownOpen(false);
  }, [search, filteredCompanies]);

  return (
    <div className="mb-2 w-full relative">
      <input
        type="text"
        placeholder="Search Company"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 w-full focus:outline-green-800 rounded-md"
      />
      {isDropdownOpen && (
        <div
          ref={companyDropdownRef}
          className="absolute top-[2.5rem] w-full border p-2 mt-1 bg-neutral-200 shadow-xl rounded-md max-h-48 overflow-y-auto z-[100000]"
        >
          {filteredCompanies.map((company: any) => (
            <div
              key={company.id}
              onClick={() => {
                onChange(company.id);
                setIsDropDownOpen(false);
              }}
              className="p-2 cursor-pointer hover:bg-green-100"
            >
              {company.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const PositionDropdown: React.FC<{
  position: string;
  onChange: (value: string) => void;
}> = ({ position, onChange }) => {
  const options = [
    "VICE_PRESIDENT_OF_HIRING",
    "ENGINEERING_MANAGER",
    "TALENT_ACQUISITION_SPECIALIST",
    "SOFTWARE_ENGINEER",
    "SENIOR_SOFTWARE_ENGINEER",
    "CAMPUS_RECRUITER",
    "DIRECTOR_OF_ENGINEERING",
    "HIRING_MANAGER",
    "HR_MANAGER",
    "DIRECTOR_OF_TALENT_ACQUISITION",
  ];
  return (
    <select
      title={""}
      value={position}
      onChange={(e) => onChange(e.target.value)}
      className="border p-2 w-full focus:outline-green-800 mb-2"
    >
      <option value="" disabled>
        Select Position
      </option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option.charAt(0).toUpperCase() + option.slice(1)}
        </option>
      ))}
    </select>
  );
};

const UpdateHRPopup: FC<{
  isOpen: boolean;
  closePopup: () => void;
  hrData: HRDataType;
}> = ({ isOpen, closePopup, hrData }) => {
  const dispatch = useAppDispatch();

  const [updatedHRData, setUpdatedHRData] = useState<HRDataType>(hrData);
  const { updateLoading, updateError } = useAppSelector((state) => state.hr);
  const { user } = useAppSelector((state) => state.user);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedHRData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddPhoneNumber = () => {
    setUpdatedHRData((prev) => ({
      ...prev,
      phone_numbers: [...prev.phone_numbers, ""],
    }));
  };

  const handlePhoneNumberChange = (index: number, value: string) => {
    const updatedNumbers = [...updatedHRData.phone_numbers];
    updatedNumbers[index] = value;
    setUpdatedHRData((prev) => ({
      ...prev,
      phone_numbers: updatedNumbers,
    }));
  };

  const handleRemovePhoneNumber = (index: number) => {
    const updatedNumbers = updatedHRData.phone_numbers.filter(
      (_, i) => i !== index
    );
    setUpdatedHRData((prev) => ({
      ...prev,
      phone_numbers: updatedNumbers,
    }));
  };

  const handleSave = () => {
    dispatch(updateHRData({ token: user.token, hrData: updatedHRData }));
  };

  useEffect(() => {
    if (updateError) {
      toastError(updateError);
      dispatch(resetHRError());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateError]);

  useEffect(() => {
    if (!updateLoading) {
      closePopup();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateLoading]);

  if (!isOpen) return null;

  const fields = [
    { id: "name", name: "Name", value: updatedHRData.name },
    { id: "email", name: "Email", value: updatedHRData.email },
    { id: "company", name: "Company", value: updatedHRData.company },
    {
      id: "position",
      name: "Position",
      value: (updateHRData as any).position,
    },
    { id: "linkedin", name: "LinkedIn", value: updatedHRData.linkedin },
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
        <h2 className="text-lg font-bold">Update HR Info</h2>
        <p className="text-xs text-neutral-600 mb-4">
          (Please provide the following details:)
        </p>
        {fields.map((field) => {
          if (field.id === "company") {
            return (
              <CompanyDropdown
                key={field.id}
                value={field.value}
                onChange={(value) =>
                  setUpdatedHRData((prev: any) => ({ ...prev, company: value }))
                }
              />
            );
          }
          if (field.id === "position") {
            return (
              <PositionDropdown
                key={field.id}
                position={field.value}
                onChange={(value) => {
                  setUpdatedHRData((prev: any) => ({
                    ...prev,
                    psotion: value,
                  }));
                }}
              />
            );
          }
          return (
            <InputField
              key={field.id}
              id={field.id}
              name={field.id}
              value={field.value}
              onChange={handleChange}
              placeholder={field.name}
            />
          );
        })}
        <h3 className="font-medium text-neutral-600 mt-4 mb-2">
          Add Phone Numbers
        </h3>
        {updatedHRData.phone_numbers.map((phoneNumber, index) => (
          <div
            key={index}
            className="flex items-center relative h-fit w-full gap-x-2 mb-2"
          >
            <InputField
              id={`phone_${index}`}
              name={`phone_${index}`}
              value={phoneNumber}
              onChange={(e) => handlePhoneNumberChange(index, e.target.value)}
              placeholder="Phone Number"
            />
            <div
              onClick={(e) => {
                e.preventDefault();
                handleRemovePhoneNumber(index);
              }}
              className="bg-red-600 text-white p-0.5 rounded-full h-full opacity-75 hover:opacity-100 transition-all"
            >
              <IoClose size={18} />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddPhoneNumber}
          className="bg-green-800 font-medium text-white rounded-full text-sm px-3 py-1 opacity-75 hover:opacity-100 transition-all"
        >
          Add Phone Number
        </button>
        <div className="w-full flex justify-end items-end">
          <button
            type="button"
            onClick={handleSave}
            className="mt-4 bg-green-900 text-white px-4 py-2 rounded"
          >
            {updateLoading ? (
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

export default HRCard;
