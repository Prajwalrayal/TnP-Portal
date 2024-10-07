"use client";

import { useEffect, useState, useRef } from "react";
import {
  fetchCompanyData,
  filterCompaniesBySearch,
} from "@/redux/reducers/companySlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { CompanyCard, Search } from "@/Components";

const CompaniesPage = () => {
  const dispatch = useAppDispatch();
  const companyContRef = useRef<HTMLDivElement>(null);
  const { companyData, filteredCompanyData, loading, error } = useAppSelector(
    (state: any) => state.companies
  );
  const { companySearchParam } = useAppSelector(
    (state: any) => state.searchBar
  );

  const [visibleCompanies, setVisibleCompanies] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    dispatch(fetchCompanyData());
  }, [dispatch]);

  useEffect(() => {
    setVisibleCompanies(
      companySearchParam.length === 0 ? companyData : filteredCompanyData
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companySearchParam]);

  useEffect(() => {
    if (companyData.length > 0) {
      setVisibleCompanies(companyData.slice(0, 15));
    }
  }, [companyData]);

  const handleLoadMore = () => {
    const moreCompanies = companyData.slice(
      visibleCompanies.length,
      visibleCompanies.length + 15
    );

    if (moreCompanies.length > 0) {
      setVisibleCompanies((prev) => [...prev, ...moreCompanies]);
    }
    setIsFetching(false);
  };

  const handleScroll = () => {
    if (companyContRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = companyContRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        setIsFetching(true);
      }
    }
  };

  useEffect(() => {
    if (isFetching) {
      handleLoadMore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching]);

  useEffect(() => {
    const container = companyContRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const handleSearch = (query: string) => {
    dispatch(filterCompaniesBySearch(query));
  };

  return (
    <div ref={companyContRef} className="w-full h-full p-4 overflow-y-auto">
      {loading ? (
        <div className="flex w-full h-full justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-green-900 border-solid" />
        </div>
      ) : error ? (
        <div className="flex w-full h-full justify-center items-center">
          <div className="text-neutral-200 text-lg bg-red-500 px-3 py-1.5 rounded-lg">
            {`Error fetching companies: ${error}`}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-start justify-start gap-y-2">
          <div className="flex items-center justify-between mb-4 w-full relative">
            <Search
              message={"Companies"}
              search={handleSearch}
              page={"companies"}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full h-full relative">
            {visibleCompanies.map((company, index) => (
              <CompanyCard key={company.id} company={company} index={index} />
            ))}
          </div>
        </div>
      )}

      {isFetching && (
        <div className="flex justify-center mt-6">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-green-900 border-solid" />
          </div>
        </div>
      )}
    </div>
  );
};

export default CompaniesPage;
