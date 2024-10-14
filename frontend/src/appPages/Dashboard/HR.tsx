import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchHRData,
  setHRData,
  setSearchQuery,
} from "@/redux/reducers/hrSlice";
import { HRCard, Search } from "@/Components";

interface HRDataType {
  id: number;
  name: string;
  email: string;
  company: string;
  position: string;
  phone_numbers: string[];
  linkedin: string;
}

const HR = () => {
  const dispatch = useAppDispatch();
  const [data, setData] = useState<HRDataType[]>([]);
  const { hrData, filteredData } = useAppSelector((state: any) => state.hr);
  const { hrSearchParam } = useAppSelector((state: any) => state.searchBar);
  const { user } = useAppSelector((state) => state.user);

  useEffect(() => {
    setData(hrSearchParam.length === 0 ? hrData : filteredData);
  }, [hrSearchParam, hrData, filteredData]);

  const handleSearch = (query: string) => {
    dispatch(setSearchQuery(query));
  };

  useEffect(() => {
    dispatch(fetchHRData(user.token));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return (
    <div className="w-full flex flex-col items-start justify-start h-full gap-y-3 lg:pt-10 overflow-y-scroll pr-2">
      <Search message={"Contacts"} search={handleSearch} page={"hr"} />
      {data.map((hr: HRDataType, index: number) => (
        <HRCard key={index} hr={hr} index={index} />
      ))}
    </div>
  );
};

export default HR;
