import { useState, FC, useEffect, use, useRef } from "react";
import { IoMdClose } from "react-icons/io";
import classNames from "classnames";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addActivity } from "@/redux/reducers/activitiesSlice";
import { toastError } from "@/utils/toasts.mjs";
import { addHRData } from "@/redux/reducers/hrSlice";
import { IoClose } from "react-icons/io5";
import { addCompany } from "@/redux/reducers/companySlice";
import useOnClickOutside from "@/custom-hooks/useOnClickOutside";

interface Log {
  [key: string]: string;
}

interface Activity {
  id: number;
  desc: string;
  name: string;
  student: string;
  status: string;
  company: string;
  init_date: Date;
  last_updated_on: Date;
  logs: Log[];
}

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

interface InputCompanyDataType
  extends Omit<CompanyDataType, "ctc_lpa" | "base_inr"> {
  ctc_lpa: number | "";
  base_inr: number | "";
}

const fields: { name: string; type: string; errorMessage: string }[] = [
  { name: "name", type: "string", errorMessage: "Company Name is required" },
  { name: "desc", type: "string", errorMessage: "Description is required" },
  { name: "website", type: "string", errorMessage: "Website is required" },
  { name: "location", type: "string", errorMessage: "Location is required" },
  { name: "logoUrl", type: "string", errorMessage: "Logo URL is required" },
  { name: "criteria", type: "string", errorMessage: "Criteria is required" },
  { name: "roles", type: "string", errorMessage: "Roles is required" },
  {
    name: "categories",
    type: "string",
    errorMessage: "Categories is required",
  },
];

const isCompanyDataType = (data: InputCompanyDataType) => {
  for (const field of fields) {
    if (typeof data[field.name as keyof InputCompanyDataType] !== field.type) {
      toastError(field.errorMessage);
      return false;
    }
  }

  if (typeof data.ctc_lpa !== "number") {
    data.ctc_lpa = parseInt(data.ctc_lpa);
  }
  if (typeof data.base_inr !== "number") {
    data.base_inr = parseInt(data.base_inr);
  }

  return true;
};

interface HRDataType {
  id: number;
  name: string;
  email: string;
  company: string;
  position: string;
  phone_numbers: string[];
  linkedin: string;
}

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
  const [search, setSearch] = useState("");
  const [isDropdownOpen, setIsDropDownOpen] = useState(false);
  const { companyData } = useAppSelector((state: any) => state.companies);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const companyDropdownRef = useRef(null);

  useOnClickOutside(companyDropdownRef, () => {
    setIsDropDownOpen(false);
  });

  useEffect(() => {
    const temp = companyData.filter((company: CompanyDataType) =>
      company.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredCompanies(temp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  useEffect(() => {
    if (search.trim() && filteredCompanies.length > 0) setIsDropDownOpen(true);
    else setIsDropDownOpen(false);
  }, [filteredCompanies, search]);

  return (
    <div className="mb-2 w-full relative">
      <input
        type="text"
        placeholder="Search Company"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 w-full focus:outline-green-800 rounded-md"
        autoComplete="false"
        autoCorrect="false"
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
                setSearch(company.name);
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

const StatusDropdown: React.FC<{
  status: string;
  onChange: (value: string) => void;
}> = ({ status, onChange }) => {
  const options = ["INITIATED", "COMPLETED", "REJECTED"];
  return (
    <select
      title={""}
      value={status}
      onChange={(e) => onChange(e.target.value)}
      className="border p-2 w-full focus:outline-green-800 mb-2"
    >
      <option value="" disabled>
        Select Status
      </option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option.charAt(0).toUpperCase() + option.slice(1)}
        </option>
      ))}
    </select>
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

interface PopupProps {
  isOpen: boolean;
  closePopup: () => void;
  currentSection: number;
}

const AddPopup: FC<PopupProps> = ({ isOpen, closePopup, currentSection }) => {
  const dispatch = useAppDispatch();
  const [companyData, setCompanyData] = useState<InputCompanyDataType>({
    name: "",
    desc: "",
    ctc_lpa: "",
    base_inr: "",
    roles: [],
    criteria: "",
    logoUrl: "",
    website: "",
    location: "",
    categories: [],
    id: "",
  });

  const [activityData, setActivityData] = useState<Activity>({
    id: 0,
    desc: "",
    name: "",
    student: "",
    status: "",
    company: "",
    init_date: new Date(),
    last_updated_on: new Date(),
    logs: [],
  });

  const [hrData, setHRData] = useState<HRDataType>({
    id: 0,
    name: "",
    email: "",
    company: "",
    position: "",
    phone_numbers: [],
    linkedin: "",
  });

  const { user } = useAppSelector((state) => state.user);
  const { pendingAdd, addError } = useAppSelector((state) => state.activities);
  const { addLoading, addError: hrAddError } = useAppSelector(
    (state) => state.hr
  );
  const { pendingCompanyCreate, addCompanyError } = useAppSelector(
    (state) => state.companies
  );

  const handleAddPhoneNumber = () => {
    setHRData((prev) => ({
      ...prev,
      phone_numbers: [...prev.phone_numbers, ""],
    }));
  };

  const handlePhoneNumberChange = (index: number, value: string) => {
    const updatedNumbers = [...hrData.phone_numbers];
    updatedNumbers[index] = value;
    setHRData((prev) => ({
      ...prev,
      phone_numbers: updatedNumbers,
    }));
  };

  const handleRemovePhoneNumber = (index: number) => {
    const updatedNumbers = hrData.phone_numbers.filter((_, i) => i !== index);
    setHRData((prev) => ({
      ...prev,
      phone_numbers: updatedNumbers,
    }));
  };

  const handleSave = () => {
    if (currentSection === 0 && isCompanyDataType(companyData))
      dispatch(addCompany({ token: user.token, companyData }));
    if (currentSection === 1)
      dispatch(
        addActivity({ token: user.token, newActivityData: activityData })
      );
    if (currentSection === 2) {
      if (hrData.company === null || hrData.company.length === 0) {
        toastError("Select a Company.");
        return;
      }
      dispatch(addHRData({ token: user.token, hrData }));
    }
  };

  // Error and Loader Controllers for Company Section...
  useEffect(() => {
    if (!addCompanyError) toastError(addCompanyError);
  }, [addCompanyError]);

  useEffect(() => {
    if (!pendingCompanyCreate) {
      setCompanyData({
        name: "",
        desc: "",
        ctc_lpa: "",
        base_inr: "",
        roles: [],
        criteria: "",
        logoUrl: "",
        website: "",
        location: "",
        categories: [],
        id: "",
      });
      closePopup();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingCompanyCreate]);

  // Error and Loader Controllers for Activity Section...
  useEffect(() => {
    if (!addError) toastError(addError);
  }, [addError]);

  useEffect(() => {
    if (!pendingAdd) {
      setActivityData({
        id: 0,
        desc: "",
        name: "",
        student: "",
        status: "",
        company: "",
        init_date: new Date(),
        last_updated_on: new Date(),
        logs: [],
      });
      closePopup();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingAdd]);

  // Error and Loader Controllers for HR Section...
  useEffect(() => {
    if (!hrAddError) toastError(hrAddError);
  }, [hrAddError]);

  useEffect(() => {
    if (!addLoading) {
      setHRData({
        id: 0,
        name: "",
        email: "",
        company: "",
        position: "",
        phone_numbers: [],
        linkedin: "",
      });
      closePopup();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addLoading]);

  const getPopupContent = () => {
    const sections = [
      {
        title: "Add Company",
        data: companyData,
        setData: setCompanyData,
        fields: [
          { name: "name", placeholder: "Company Name" },
          { name: "desc", placeholder: "Description" },
          { name: "website", placeholder: "Website" },
          { name: "location", placeholder: "Location" },
          { name: "logoUrl", placeholder: "Logo URL" },
          { name: "criteria", placeholder: "Criteria" },
          { name: "ctc_lpa", placeholder: "CTC (LPA)", type: "number" },
          {
            name: "base_inr",
            placeholder: "Base Salary (INR)",
            type: "number",
          },
          {
            name: "roles",
            placeholder: "Role (Comma Separated, e.g: Role 1, Role 2, ...)",
          },
          {
            name: "categories",
            placeholder: "Category (Comma Separated, e.g: Cat 1, Cat 2, ...)",
          },
        ],
      },
      {
        title: "Add Activity",
        data: activityData,
        setData: setActivityData,
        fields: [
          { name: "name", placeholder: "Activity Name" },
          { name: "desc", placeholder: "Description" },
          { name: "student", placeholder: "Student" },
          {
            name: "status",
            placeholder: "Status",
            isDropdown: true,
          },
          { name: "company", placeholder: "Company", isDropdown: true },
          {
            name: "init_date",
            placeholder: "Initial Date",
            type: "date",
            formatValue: (value: Date) => value.toISOString().split("T")[0],
            handleValueChange: (value: string) => new Date(value),
          },
        ],
      },
      {
        title: "Add HR Info",
        data: hrData,
        setData: setHRData,
        fields: [
          { name: "name", placeholder: "HR Name" },
          { name: "email", placeholder: "Email", type: "email" },
          { name: "company", placeholder: "Company", isDropdown: true },
          { name: "position", placeholder: "Position", isDropdown: true },
          { name: "linkedin", placeholder: "LinkedIn Profile" },
          {
            name: "phone_number",
            placeholder: "Phone Numbers",
            type: "mutiple",
          },
        ],
      },
    ];

    const { title, data, setData, fields } = sections[currentSection];

    return (
      <div>
        <h2 className="text-lg font-bold">{title}</h2>
        <p className="text-xs text-neutral-600 mb-4">
          (Please provide the following details:)
        </p>
        {fields.map(
          ({
            name,
            placeholder,
            type,
            formatValue,
            handleValueChange,
            isDropdown,
          }: any) => {
            if (isDropdown && name === "company") {
              return (
                <CompanyDropdown
                  key={name}
                  value={(data as any)[name]}
                  onChange={(value) =>
                    setData((prev: any) => ({ ...prev, company: value }))
                  }
                />
              );
            }
            if (isDropdown && name === "position") {
              return (
                <PositionDropdown
                  key={name}
                  position={(data as any)[name]}
                  onChange={(value) => {
                    setData((prev: any) => ({ ...prev, [name]: value }));
                  }}
                />
              );
            }
            if (isDropdown && name === "status") {
              return (
                <StatusDropdown
                  key={name}
                  status={(data as any)[name]}
                  onChange={(value) => {
                    setData((prev: any) => ({ ...prev, [name]: value }));
                  }}
                />
              );
            }

            if (type === "mutiple") {
              return (
                <>
                  {/* Render phone number fields */}
                  <h3 className="font-medium text-neutral-600 mt-4 mb-2">
                    {"Add Phone Numbers"}
                  </h3>
                  {hrData.phone_numbers.map((phoneNumber, index) => (
                    <div
                      key={index}
                      className="flex items-center relative h-fit w-full gap-x-2"
                    >
                      <div className="w-full relative flex flex-1">
                        <InputField
                          id={`phone_${index}`}
                          name={`phone_${index}`}
                          value={phoneNumber}
                          onChange={(e) =>
                            handlePhoneNumberChange(index, e.target.value)
                          }
                          placeholder="Phone Number"
                        />
                      </div>
                      <div
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemovePhoneNumber(index);
                        }}
                        className="bg-red-600 text-white p-0.5 rounded-full h-full opacity-75 hover:opacity-100 transition-all mb-2"
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
                </>
              );
            }

            return (
              <InputField
                key={name}
                id={name}
                name={name}
                value={
                  formatValue
                    ? formatValue((data as any)[name])
                    : (data as any)[name]
                }
                onChange={(e) => {
                  const newValue = handleValueChange
                    ? handleValueChange(e.target.value)
                    : e.target.value;
                  setData((prev: any) => ({ ...prev, [name]: newValue }));
                }}
                type={type}
                placeholder={placeholder}
              />
            );
          }
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-[30rem] p-5 rounded-lg shadow-lg relative">
        <div className="absolute top-0 left-0 w-full flex justify-end items-end px-3 pt-4">
          <div
            onClick={closePopup}
            className="hover:bg-neutral-200 transition-all text-green-900 p-1 rounded-md cursor-pointer"
          >
            <IoMdClose size={24} />
          </div>
        </div>
        {getPopupContent()}
        <div className="w-full flex justify-end items-end">
          <button
            type="button"
            onClick={handleSave}
            className="mt-4 bg-green-900 text-white px-4 py-2 rounded"
          >
            {pendingAdd || pendingCompanyCreate || addLoading ? (
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

export default AddPopup;
