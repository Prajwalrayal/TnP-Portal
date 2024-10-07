import { MouseEvent, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { IoIosChatboxes } from "react-icons/io";
import { DashboardSectionData } from "@/utils/DashboardSectionData";
import { MdLogout } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout } from "@/redux/reducers/userSlice";
import { useRouter } from "next/navigation";

const Sidebar = ({
  currentSection,
  handleSectionClick,
}: {
  currentSection: number;
  handleSectionClick: any;
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.user);
  const handleLogout = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    dispatch(logout());
    router.push("/login");
  };

  return (
    <div className="relative section-bar thin-scrollbar flex flex-col justify-between w-[230px] h-full pb-1 pt-5 rounded-xl shadow overflow-y-scroll">
      {/* Logo + Navitems */}
      <div className="flex flex-col w-full">
        {/* Logo */}
        <div className="shrink-0 px-5">
          <Link href="https://wiser.eco/" rel="nofollow noreferrer">
            <Image
              alt="logo"
              height={28}
              width={230}
              src={`${process.env.NEXT_PUBLIC_BASE_PATH}/IIIT_logo.png`}
              className="h-7 sm:h-full max-w-[160px]"
            />
          </Link>
        </div>
        {/* Navitems */}
        <div className="mt-8 flex flex-col">
          {DashboardSectionData.map((section, index) => {
            return (
              <div
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  handleSectionClick(index);
                }}
                className={`flex gap-x-3 py-5 px-2 items-center cursor-pointer relative ${
                  currentSection === index &&
                  "text-primary opacity-90 bg-[#E4EBEA]"
                }`}
              >
                {currentSection === index && (
                  <div className="bg-primary absolute h-[40%] w-[4px] rounded-full top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2" />
                )}
                <div
                  className={`flex flex-row items-center justify-start gap-x-2 cursor-pointer w-full`}
                >
                  {section.icon}
                  <p className=" cursor-pointer font-medium leading-[1.3]">
                    {section.name}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Enquiry/Feedback */}
      <div className="w-full bottom-5 px-3 mt-10">
        <div
          className={`flex flex-col font-bold gap-x-3 py-3 rounded-xl px-5 mb-2 justify-between items-center opacity-[60] relative bg-[#D0CFCF40] shadow-sm`}
        >
          <div className="p-2 bg-neutral-300 rounded-xl absolute top-[-2rem]">
            <div className="opacity-[0.3]">
              <IoIosChatboxes size={25} />
            </div>
          </div>
          <div className="text-center text-sm text-[#4F4F4F]">
            {"For any enquiry and feedback"}
          </div>
          <Link target="_blank" href="#" rel="noopener noreferrer">
            <div className="mt-3 flex gap-x-1 items-center text-white bg-gray-500 w-fit rounded-full px-7 py-2 font-medium text-sm cursor-pointer shadow-[8px_8px_50px_0px_#00000014]">
              <p className="cursor-pointer">{"Enquiry/Feedback"}</p>
            </div>
          </Link>
        </div>
        <div
          className={`flex gap-x-3 py-3 font-bold rounded-xl px-5 mb-2 justify-between  items-center cursor-pointer opacity-[60] relative bg-[#D0CFCF40] shadow-sm`}
          onClick={handleLogout}
        >
          <div className="text-sm text-[#4F4F4F] capitalize">
            {user && user.emailid.split("@")[0].slice(0, 12)}
          </div>
          <div className="bg-neutral-500 rounded-lg p-2 text-white">
            <MdLogout size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

// responsive sidebar
const FloatingSidebar = ({
  currentSection,
  handleSectionClick,
}: {
  currentSection: number;
  handleSectionClick: any;
}) => {
  return (
    <div className="bg-white shadow-[8px_8px_50px_0px_#00000014] h-fit w-[90vw] max-w-[400px] mb-2 md:mb-5 rounded-xl px-3 py-2">
      {/* Navitems */}
      <div className="flex">
        {DashboardSectionData.map((section, index) => {
          return (
            <div
              key={index}
              onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                handleSectionClick(index);
              }}
              className={`flex flex-1 items-center justify-center rounded-xl cursor-pointer opacity-60 relative py-1 ${
                currentSection === index &&
                "text-primary opacity-90 bg-[#E4EBEA]"
              } cursor-pointer`}
            >
              {currentSection === index && (
                <div className="bg-primary absolute h-[4px] w-[30%] rounded-full left-1/2 bottom-0 transform -translate-x-1/2 -translate-y-1/2" />
              )}
              <div
                className={`flex flex-col items-center justify-center ${
                  section.name === "Upgrade" &&
                  "upgrade-button-gradient rounded-lg"
                } w-fit h-fit p-2`}
              >
                {section.icon}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export { Sidebar, FloatingSidebar };
