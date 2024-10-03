import classNames from "classnames";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setSearchParams } from "@/redux/reducers/searchSlice";
import { useRef } from "react";

const Search = ({
  message,
  search,
  page,
}: {
  message: string;
  search: (searchText: string) => void;
  page: string;
}) => {
  const searchRef = useRef(null);
  const dispatch = useAppDispatch();
  const { activitySearchParam, hrSearchParam, companySearchParam } =
    useAppSelector((state: any) => state.searchBar);
  const { currentSection } = useAppSelector((state: any) => state.section);

  return (
    <div className="relative flex items-center justify-center w-full lg:w-fit sm:ml-2">
      <div className="relative mt-1 w-[97.5%]">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            ></path>
          </svg>
        </div>
        <input
          ref={searchRef}
          type="text"
          id="table-search"
          autoComplete="off"
          className={classNames(
            "block p-2 pl-10 w-full min-w-full sm:min-w-[20rem] bg-white text-sm text-neutral-800 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-neutral-700 focus:border-neutral-800 dark:bg-neutral-800 dark:border-neutral-600 dark:placeholder-gray-400 dark:text-white cursor-text"
          )}
          placeholder={`Search ${message}`}
          value={
            currentSection === 0
              ? companySearchParam
              : currentSection === 1
              ? activitySearchParam
              : hrSearchParam
          }
          onChange={(e) => {
            const searchText = e.currentTarget.value;
            dispatch(setSearchParams({ searchText, page }));
            search(searchText);
          }}
        />
      </div>
    </div>
  );
};

export default Search;
