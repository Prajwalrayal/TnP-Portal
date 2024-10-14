import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchActivitiesData,
  filterActivitiesBySearch,
} from "@/redux/reducers/activitiesSlice";
import { Search } from "@/Components";
import { ActivityCard } from "@/Components";
import classNames from "classnames";

interface Log {
  [key: string]: string;
}

interface ActivityDataType {
  id: number;
  desc: string;
  student: string;
  company: string;
  status: string;
  init_date: Date;
  last_updated_on: Date;
  logs: Log[];
}

const Activities = () => {
  const dispatch = useAppDispatch();
  const activitiesRef = useRef<HTMLDivElement>(null);
  const [upcomingData, setUpcomingData] = useState<ActivityDataType[]>([]);
  const [previousData, setPreviousData] = useState<ActivityDataType[]>([]);
  const {
    upcomingActivities,
    previousActivities,
    filteredUpcoming,
    filteredPrevious,
    loading,
    error,
  } = useAppSelector((state) => state.activities);
  const { activitySearchParam } = useAppSelector(
    (state: any) => state.searchBar
  );
  const { user } = useAppSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState<"upcoming" | "previous">(
    "upcoming"
  );
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    setUpcomingData(
      activitySearchParam.length === 0 ? upcomingActivities : filteredUpcoming
    );
    setPreviousData(
      activitySearchParam.length === 0 ? previousActivities : filteredPrevious
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activitySearchParam]);

  useEffect(() => {
    if (activitySearchParam.length === 0) {
      setUpcomingData(upcomingActivities);
      setPreviousData(previousActivities);
    } else {
      setUpcomingData(filteredUpcoming);
      setPreviousData(filteredPrevious);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    upcomingActivities,
    previousActivities,
    filteredUpcoming,
    filteredPrevious,
  ]);

  const onSuccess = (
    upcoming: ActivityDataType[],
    previous: ActivityDataType[]
  ) => {
    setUpcomingData(upcoming);
    setPreviousData(previous);
    setIsLoadingMore(false);
  };

  useEffect(() => {
    dispatch(fetchActivitiesData({ token: user.token, onSuccess }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const handleSearch = (query: string) => {
    dispatch(filterActivitiesBySearch(query));
  };

  const handleScroll = () => {
    if (activitiesRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = activitiesRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        setIsLoadingMore(true);
        dispatch(fetchActivitiesData({ token: user.token, onSuccess }));
      }
    }
  };

  useEffect(() => {
    const container = activitiesRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading && upcomingData.length === 0 && previousData.length === 0) {
    return (
      <div className="flex w-full h-full justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-green-900 border-solid" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex w-full h-full justify-center items-center">
        <div className="text-neutral-200 text-lg bg-red-500 px-3 py-1.5 rounded-lg">
          {`Error fetching activities: ${error}`}
        </div>
      </div>
    );
  }

  const handleTabSwitch = (tab: "upcoming" | "previous") => {
    setActiveTab(tab);
  };

  const renderActivities = (activities: ActivityDataType[]) => {
    return activities.map((activity: ActivityDataType, index: number) => {
      return (
        <div key={activity.id}>
          <ActivityCard
            id={activity.id}
            desc={activity.desc}
            student={activity.student}
            status={activity.status}
            company={activity.company}
            init_date={activity.init_date}
            last_updated_on={activity.last_updated_on}
            logs={activity.logs}
            setUpcomingData={setUpcomingData}
            setPreviousData={setPreviousData}
          />
        </div>
      );
    });
  };

  return (
    <div
      ref={activitiesRef}
      className="w-full flex flex-col items-start justify-start lg:pt-10 h-full relative"
    >
      <div className="flex sm:flex-row flex-col gap-y-2 items-center justify-center sm:justify-between mb-4 w-full relative">
        <Search
          message={"Activities/Events"}
          search={handleSearch}
          page={"activities"}
        />
        <div className="flex items-center justify-center max-sm:w-full">
          <button
            type="button"
            className={classNames(
              "p-2 border rounded mobile:w-[45%] anti-mobile:w-[45%]",
              {
                "bg-green-900 text-white": activeTab === "upcoming",
                "bg-gray-200": activeTab !== "upcoming",
              }
            )}
            onClick={() => handleTabSwitch("upcoming")}
          >
            Upcoming
          </button>
          <button
            type="button"
            className={classNames(
              "p-2 border rounded ml-2 mobile:w-[45%] anti-mobile:w-[45%]",
              {
                "bg-green-900 text-white": activeTab === "previous",
                "bg-gray-200": activeTab !== "previous",
              }
            )}
            onClick={() => handleTabSwitch("previous")}
          >
            Previous
          </button>
        </div>
      </div>

      {activeTab === "upcoming" && (
        <div className="flex flex-col overflow-y-scroll w-full h-full gap-y-4 pr-2">
          {renderActivities(upcomingData)}
          {isLoadingMore && (
            <div className="flex justify-center my-6 w-full">
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-green-900 border-solid" />
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "previous" && (
        <div className="flex flex-col overflow-y-scroll w-full h-full gap-y-4 pr-2">
          {renderActivities(previousData)}
          {isLoadingMore && (
            <div className="flex justify-center my-6 w-full">
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-green-900 border-solid" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Activities;
