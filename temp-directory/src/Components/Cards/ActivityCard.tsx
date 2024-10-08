import { MouseEvent } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  updateActivity,
  updateActivityLogs,
} from "@/redux/reducers/activitiesSlice";
import { useEffect, useState } from "react";
import { FaChevronDown, FaEdit } from "react-icons/fa";
import { toastError } from "@/utils/toasts.mjs";

interface Log {
  [key: string]: string;
}

interface Activity {
  id: number;
  desc: string;
  name: string;
  student: string;
  status: string;
  init_date: Date;
  last_updated_on: Date;
  logs: Log[];
  setUpcomingData?: any;
  setPreviousData?: any;
}

const ActivityCard: React.FC<Activity> = ({
  id,
  desc,
  name,
  student,
  status,
  init_date,
  last_updated_on,
  logs,
  setUpcomingData,
  setPreviousData,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [updatedLogs, setUpdatedLogs] = useState<string>(JSON.stringify(logs));
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(name);
  const [editDesc, setEditDesc] = useState(desc);
  const [editStudent, setEditStudent] = useState(student);
  const dispatch = useAppDispatch();
  const {
    upcomingActivities,
    filteredUpcoming,
    previousActivities,
    filteredPrevious,
    pendingUpdate,
    updateError,
    pendingLogUpdate,
    logUpdateError,
  } = useAppSelector((state) => state.activities);

  const handleToggleLogs = () => {
    setIsExpanded(!isExpanded);
  };

  const handleUpdateLogs = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    try {
      const parsedLogs = JSON.parse(updatedLogs);

      const isLog = (log: any): log is Log => {
        return (
          typeof log === "object" &&
          log !== null &&
          !Array.isArray(log) &&
          Object.keys(log).length > 0
        );
      };

      if (Array.isArray(parsedLogs) && parsedLogs.every(isLog)) {
        dispatch(updateActivityLogs({ id, logs: JSON.parse(updatedLogs) }));
        setIsExpanded(false);
      } else
        toastError("Logs must be an array of objects of type {date: message}.");
    } catch (err) {
      toastError("Invalid JSON format in logs");
    }
  };

  const handleOpenEditPopup = () => {
    setIsEditing(true);
  };

  const handleCloseEditPopup = () => {
    setIsEditing(false);
  };

  const updateOnSearch = (updatedActivity: Activity) => {
    const updateActivityInArray = (
      activities: Activity[],
      updatedActivity: Activity
    ) => {
      return activities.map((activity) =>
        activity.id === updatedActivity.id
          ? { ...activity, ...updatedActivity }
          : activity
      );
    };

    if (
      upcomingActivities.some((activity) => activity.id === updatedActivity.id)
    ) {
      setUpcomingData(
        updateActivityInArray(upcomingActivities, updatedActivity)
      );
    }
    if (
      filteredUpcoming.some((activity) => activity.id === updatedActivity.id)
    ) {
      setUpcomingData(updateActivityInArray(filteredUpcoming, updatedActivity));
    }
    if (
      previousActivities.some((activity) => activity.id === updatedActivity.id)
    ) {
      setPreviousData(
        updateActivityInArray(previousActivities, updatedActivity)
      );
    }
    if (
      filteredPrevious.some((activity) => activity.id === updatedActivity.id)
    ) {
      setPreviousData(updateActivityInArray(filteredPrevious, updatedActivity));
    }
  };

  const handleUpdateActivity = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const updatedActivity = {
      id,
      name: editName,
      desc: editDesc,
      student: editStudent,
      status,
      last_updated_on: new Date(),
    };

    dispatch(updateActivity({ activity: updatedActivity, updateOnSearch }));
  };

  useEffect(() => {
    if (!pendingUpdate) setIsEditing(false);
  }, [pendingUpdate]);

  useEffect(() => {
    if (logUpdateError) toastError(logUpdateError);
  }, [logUpdateError]);

  useEffect(() => {
    if (updateError) toastError(updateError);
  }, [updateError]);

  const initDate = new Date(init_date);
  const lastUpdatedOn = new Date(last_updated_on);
  const dateDisplay = `${initDate.getDate()} - ${lastUpdatedOn.getDate()}`;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "upcoming":
        return "border-green-500";
      case "confirmed":
        return "border-blue-500";
      case "pending":
        return "border-yellow-500";
      case "cancelled":
        return "border-red-500";
      default:
        return "border-gray-500";
    }
  };

  return (
    <div className="flex flex-col w-full p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          <div className="flex-shrink-0 flex flex-col justify-start items-center bg-green-800 text-white w-[4.5rem] h-24 rounded-lg relative">
            <p className="whitespace-nowrap border-b border-white w-full text-center font-semibold py-1">
              {dateDisplay}
            </p>
            <p className="whitespace-nowrap w-full text-center font-bold text-lg tracking-wider pt-1">
              {initDate.toLocaleString("default", { month: "short" })}
            </p>
            <p className="tracking-wider text-sm pt-1">
              {initDate.getFullYear()}
            </p>
          </div>
          <div className="flex flex-col ml-4">
            <div className="flex gap-x-1 items-center justify-start">
              <div
                className={`w-4 h-4 rounded-full border-[1.5px] ${getStatusColor(
                  status
                )}`}
                title={`Status: ${status}`}
              />
              <h3 className="font-bold group-hover:text-primary">{name}</h3>
            </div>
            <p>{desc}</p>
            <p>{`Student: ${student}`}</p>
            <div className="flex gap-x-2 items-center justify-start">
              <p>{"Logs: "}</p>
              <span
                onClick={(e) => {
                  e.preventDefault();
                  handleToggleLogs();
                }}
                className={`cursor-pointer px-3 py-1 text-xs inline-flex gap-x-1 flex-nowrap items-center select-none rounded-full leading-none border border-green-500 bg-green-500 bg-opacity-20 text-green-700`}
              >
                {`${logs.length} updates`}
                <FaChevronDown
                  size={12}
                  className={`transition-all ${
                    isExpanded ? "rotate-180" : "rotate-0"
                  }`}
                />
              </span>
            </div>
          </div>
        </div>

        <FaEdit
          size={20}
          className="ml-4 cursor-pointer text-green-700  opacity-75 hover:opacity-100 transition-all"
          onClick={(e) => {
            e.preventDefault();
            handleOpenEditPopup();
          }}
        />
      </div>

      {isExpanded && (
        <div className="w-full p-4 bg-gray-100 rounded-lg mt-2">
          <label htmlFor={`logs-${id}`} className="block mb-2 font-medium">
            Activity Logs
          </label>
          <textarea
            id={`logs-${id}`}
            value={updatedLogs}
            onChange={(e) => {
              const inputValue = e.target.value;
              setUpdatedLogs(inputValue);
            }}
            className="w-full h-32 resize-none border rounded cursor-text focus:outline-green-800 p-1 no-scrollbar"
            placeholder="Update activity logs here..."
            aria-label={`Update logs for activity ${name}`}
          />

          <button
            type="button"
            onClick={handleUpdateLogs}
            className="mt-2 bg-green-900 text-white px-4 py-2 rounded"
          >
            {pendingLogUpdate ? (
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-neutral-200 border-solid" />
            ) : (
              <p>{"Update Logs"}</p>
            )}
          </button>
        </div>
      )}

      {/* Edit Activity Popup */}
      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-[1000]">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-md">
            <h2 className="text-lg font-bold mb-4">Edit Activity</h2>

            <label htmlFor={`edit-name-${id}`} className="block mb-2">
              Name
            </label>
            <input
              id={`edit-name-${id}`}
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="border rounded w-full mb-4 p-2 focus:outline-green-700"
            />

            <label htmlFor={`edit-desc-${id}`} className="block mb-2">
              Description
            </label>
            <textarea
              id={`edit-desc-${id}`}
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              className="border rounded w-full mb-4 p-2 resize-none focus:outline-green-700"
            />

            <label htmlFor={`edit-student-${id}`} className="block mb-2">
              Student
            </label>
            <input
              id={`edit-student-${id}`}
              type="text"
              value={editStudent}
              onChange={(e) => setEditStudent(e.target.value)}
              className="border rounded w-full mb-4 p-2 focus:outline-green-700"
            />

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleCloseEditPopup}
                className="mr-2 bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdateActivity}
                className="bg-green-800 text-white px-4 py-2 rounded cursor-pointer"
              >
                {pendingUpdate ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-neutral-200 border-solid" />
                ) : (
                  <p className="cursor-pointer">{"Save Changes"}</p>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityCard;
