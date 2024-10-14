"use client";

import { useEffect, useState, MouseEvent } from "react";
import { Sidebar, FloatingSidebar } from "@/Components";
import Image from "next/image";
import { FaChevronRight } from "react-icons/fa";
import { LoadingSpinner } from "@/Components";
import Companies from "./Companies";
import Activities from "./Activities";
import HR from "./HR";
import AddPopup from "./AddPopup";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { updateCurrentSection } from "@/redux/reducers/sectionSlice";
import { MdLogout } from "react-icons/md";
import { logout } from "@/redux/reducers/userSlice";
import { useRouter } from "next/navigation";

const DashboardPage = () => {
  const { currentSection } = useAppSelector((state) => state.section);
  const [onBoardedCompanies, setOnBoardedCompanies] = useState([]);
  const [companyCount, setCompanyCount] = useState(0);
  const [hideNavbar, setHideNavbar] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleSectionClick = (section: number) => {
    dispatch(updateCurrentSection(section));
  };

  const handleAddCompanyClick = () => {
    setPopupOpen(true);
  };

  const handleLogout = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    dispatch(logout());
    router.push("/login");
  };

  return (
    <>
      {0 ? (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <LoadingSpinner />
        </div>
      ) : (
        <div
          className={`dashboard-outercontainer w-full ${
            currentSection === 0 ? "h-screen" : "h-full"
          } xl:h-screen overflow-hidden relative`}
        >
          {/* mobile navbar */}
          <div className="flex lg:hidden rounded-2xl mt-4 mx-4 md:mx-8 h-fit">
            <div className="flex flex-row items-center justify-between bg-white p-4 rounded-2xl shadow-[8px_8px_50px_0px_#00000014] w-full z-[1]">
              <Image
                alt="logo"
                height={28}
                width={160}
                src={`${process.env.NEXT_PUBLIC_BASE_PATH}/IIIT_logo.png`}
                className="h-full max-w-[160px]"
              />
              <div
                className={`cursor-pointer opacity-75 bg-neutral-600 rounded-xl p-2 text-neutral-100`}
                onClick={handleLogout}
              >
                <MdLogout size={25} />
              </div>
            </div>
          </div>
          <div className="dashboard-innercontainer w-full flex h-full py-3 md:px-8 gap-3 bg-neutral-50 relative pb-[15vh] xl:pb-3">
            <div className="hidden xl:block">
              <Sidebar
                currentSection={currentSection}
                handleSectionClick={handleSectionClick}
              />
            </div>

            <div className="h-full w-full relative">
              <div
                className={`relative flex items-center justify-center w-screen sm:w-[95vw] xl:w-full flex-[1] lg:rounded-2xl h-[90%] mx-auto overflow-hidden`}
              >
                {currentSection === 0 && <Companies />}
                {currentSection === 1 && <Activities />}
                {currentSection === 2 && <HR />}
              </div>
              <div className="hidden xl:block h-[10%] mt-1 mx-2 xl:mx-0 rounded-2xl bg-[#D0CFCF40] shadow-[8px_8px_50px_0px_#00000014] py-3 xl:py-2">
                <PlacementStatusBottomBar
                  onBoardedCompanies={onBoardedCompanies}
                  companyCount={companyCount}
                  currentSection={currentSection}
                  onAddClick={handleAddCompanyClick}
                />
              </div>
              <div
                className={`xl:hidden fixed ${
                  hideNavbar ? "bottom-5" : "bottom-20 md:bottom-24"
                } w-[95vw] h-[5rem] min-mobile-sm:h-[3rem] ml-[2.5vw] md:ml-0 rounded-full bg-slate-100 shadow-[8px_8px_50px_0px_#00000014]`}
              >
                <div className="w-full h-full relative flex justify-center items-end overflow-hidden">
                  <PlacementStatusFloatingBar
                    onBoardedCompanies={onBoardedCompanies}
                    companyCount={companyCount}
                    currentSection={currentSection}
                    onAddClick={handleAddCompanyClick}
                  />
                  <div
                    className={`w-full h-full bg-green-900 rounded-md min-mobile-sm:rounded-full absolute top-0 left-0 z-10 transition-all`}
                    style={{
                      width: `${
                        (onBoardedCompanies.length / companyCount) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 block xl:hidden">
            {hideNavbar ? (
              <></>
            ) : (
              <FloatingSidebar
                currentSection={currentSection}
                handleSectionClick={handleSectionClick}
              />
            )}
          </div>
        </div>
      )}
      <AddPopup
        isOpen={popupOpen}
        closePopup={() => setPopupOpen(false)}
        currentSection={currentSection}
      />
    </>
  );
};

const PlacementStatusFloatingBar = ({
  onBoardedCompanies,
  companyCount,
  currentSection,
  onAddClick,
}: any) => {
  let msg = "";
  switch (currentSection) {
    case 0:
      msg = "Add Company";
      break;
    case 1:
      msg = "Add Activity";
      break;
    case 2:
      msg = "Add HR Info";
      break;
    default:
      msg = "Add Company";
  }

  return (
    <div className="w-full flex min-mobile-sm:flex-row flex-col gap-2 items-center justify-center min-mobile-sm:justify-between min-mobile-sm:flex-[1] h-[90%] px-6 py-1 text-left rounded-md min-mobile-sm:rounded-full z-50 bg-white relative shadow-none overflow-hidden">
      <p className="w-fit text-xs sm:text-sm text-neutral-600 font-medium whitespace-nowrap">
        {`${
          onBoardedCompanies.length < 10
            ? "0" + onBoardedCompanies.length
            : onBoardedCompanies.length
        }/${
          companyCount < 10 ? "0" + companyCount : companyCount
        } Companies Onboarded`}
      </p>
      <div
        onClick={(e: React.MouseEvent) => {
          e.preventDefault();
          onAddClick();
        }}
        className={`opacity-100 cursor-pointer flex gap-x-1 items-center text-white bg-green-900 w-fit rounded-full px-7 py-2 font-medium text-xs sm:text-sm shadow-[8px_8px_50px_0px_#00000014]`}
      >
        <p className="m-0 p-0 cursor-pointer whitespace-nowrap">{msg}</p>
        <FaChevronRight />
      </div>
    </div>
  );
};

const PlacementStatusBottomBar = ({
  onBoardedCompanies,
  companyCount,
  currentSection,
  onAddClick,
}: any) => {
  let msg = "";
  switch (currentSection) {
    case 0:
      msg = "Add Company";
      break;
    case 1:
      msg = "Add Activity";
      break;
    case 2:
      msg = "Add HR Info";
      break;
    default:
      msg = "Add Company";
  }

  return (
    <div className="w-full flex gap-5 items-center justify-between flex-[1] h-full px-6 py-1 text-left rounded-full z-50 bg-white relative shadow-none overflow-hidden">
      <div className="block flex-grow md:px-2 lg:px-0 ml-auto mr-5 w-full lg:max-w-[65%] mt-2 lg:mt-0 flex-[2.5]">
        <div className="relative h-5 bg-neutral-200 rounded-full overflow-hidden">
          <div
            className={`h-5 bg-green-900 rounded-full max-w-full`}
            style={{
              width: `${(onBoardedCompanies.length / companyCount) * 100}%`,
            }}
          />
        </div>
      </div>
      <p className="w-fit text-xs sm:text-sm text-neutral-600 font-medium">
        {`${
          onBoardedCompanies.length < 10
            ? "0" + onBoardedCompanies.length
            : onBoardedCompanies.length
        }/${
          companyCount < 10 ? "0" + companyCount : companyCount
        } Companies Onboarded`}
      </p>
      <div
        onClick={(e: React.MouseEvent) => {
          e.preventDefault();
          onAddClick();
        }}
        className={`opacity-100 cursor-pointer flex gap-x-1 items-center text-white bg-green-900 w-fit rounded-full px-7 py-2 font-medium text-sm shadow-[8px_8px_50px_0px_#00000014]`}
      >
        <p className="m-0 p-0 cursor-pointer">{msg}</p>
        <FaChevronRight />
      </div>
    </div>
  );
};

export default DashboardPage;
