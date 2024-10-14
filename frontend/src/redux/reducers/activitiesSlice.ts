import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

interface Log {
  [key: string]: string;
}

interface Activity {
  id: number;
  desc: string;
  student: string;
  company: string;
  status: string;
  init_date: Date;
  last_updated_on: Date;
  logs: Log[];
}

interface ActivitiesState {
  upcomingActivities: Activity[];
  previousActivities: Activity[];
  filteredUpcoming: Activity[];
  filteredPrevious: Activity[];
  loading: boolean;
  loadingLogs: boolean;
  pendingUpdate: boolean;
  pendingLogUpdate: boolean;
  updateError: string | null;
  pendingAdd: boolean;
  addError: string | null;
  logUpdateError: string | null;
  error: string | null;
  logsError: string | null;
}

const initialState: ActivitiesState = {
  upcomingActivities: [],
  previousActivities: [],
  filteredUpcoming: [],
  filteredPrevious: [],
  loading: false,
  loadingLogs: false,
  pendingUpdate: false,
  pendingLogUpdate: false,
  updateError: null,
  pendingAdd: false,
  addError: null,
  logUpdateError: null,
  error: null,
  logsError: null,
};

const convertLogEntry = (logEntry: {
  id: number;
  log: string;
  timestamp: string;
}): Log => {
  return {
    [logEntry.timestamp]: logEntry.log,
  };
};

export const fetchActivitiesData = createAsyncThunk(
  "activities/fetchActivitiesData",
  async ({
    token,
    onSuccess,
  }: {
    token: string;
    onSuccess: (upcoming: Activity[], previous: Activity[]) => void;
  }) => {
    let upcoming = [],
      previous = [];
    const response = await fetch("/api/activities", {
      headers: {
        Authorization: token,
      },
    });
    const data = await response.json();
    if (Array.isArray(data)) {
      upcoming = data.filter(
        (activity: Activity) => activity.status === "INITIATED"
      );
      previous = data.filter(
        (activity: Activity) => activity.status !== "INITIATED"
      );
    }

    onSuccess(upcoming, previous);

    return { upcoming, previous };
  }
);

export const addActivity = createAsyncThunk(
  "activities/addActivity",
  async ({
    token,
    newActivityData,
  }: {
    token: string;
    newActivityData: {
      desc: string;
      student: string;
      status: string;
      init_date: Date;
    };
  }) => {
    const response = await fetch("/api/activities/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newActivityData, token }),
    });

    if (!response.ok) {
      throw new Error("Failed to add new activity.");
    }

    const data: Activity = await response.json();
    return data;
  }
);

export const fetchActivityLogsData = createAsyncThunk(
  "activities/fetchActivityLogData",
  async ({
    id,
    token,
    onSuccess,
  }: {
    id: number;
    token: string;
    onSuccess: (logs: Log[]) => void;
  }) => {
    const response = await fetch(`/api/activities/logs/${id}`, {
      headers: {
        Authorization: token,
      },
    });
    const data = await response.json();
    const formattedLogs: Log[] = data.map((log: any) => convertLogEntry(log));

    onSuccess(formattedLogs);

    return { id, logs: formattedLogs };
  }
);

export const updateActivityLogs = createAsyncThunk(
  "activities/updateActivityLogs",
  async ({
    id,
    logs,
    token,
    onSuccess,
  }: {
    id: number;
    logs: Log[];
    token: string;
    onSuccess: (logs: Log) => void;
  }) => {
    const response = await fetch(`/api/activities/logs/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ logs, token }),
    });
    const data = await response.json();
    if (data.hasOwnProperty("error")) {
      return {
        id,
        updatedLog: { "": "" },
      };
    }
    const updatedLog = convertLogEntry(data);
    onSuccess(updatedLog);
    return {
      id,
      updatedLog,
    };
  }
);

export const updateActivity = createAsyncThunk(
  "activities/updateActivity",
  async ({
    token,
    activity,
    updateOnSearch,
  }: {
    token: string;
    activity: Omit<Activity, "logs" | "init_date">;
    updateOnSearch: (updatedActivity: Activity) => void;
  }) => {
    const response = await fetch(`/api/activities/update/${activity.id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...activity, token }),
    });
    const data = await response.json();
    updateOnSearch(data);
    return data;
  }
);

const filterActivities = (
  activities: Activity[],
  searchText: string
): Activity[] => {
  if (!searchText) return activities;
  const afterFilter = activities.filter((activity) => {
    return activity.desc.toLowerCase().includes(searchText.toLowerCase());
  });

  return afterFilter;
};

const sortActivitiesChronologically = (activities: Activity[]) => {
  return activities.sort((a, b) => {
    return (
      new Date(b.last_updated_on).getTime() -
      new Date(a.last_updated_on).getTime()
    );
  });
};

const activitiesSlice = createSlice({
  name: "activities",
  initialState,
  reducers: {
    filterActivitiesBySearch(state, action: PayloadAction<string>) {
      const searchText = action.payload;
      state.filteredUpcoming = filterActivities(
        state.upcomingActivities,
        searchText
      );
      state.filteredPrevious = filterActivities(
        state.previousActivities,
        searchText
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Activities...
      .addCase(fetchActivitiesData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchActivitiesData.fulfilled,
        (
          state,
          action: PayloadAction<{ upcoming: Activity[]; previous: Activity[] }>
        ) => {
          state.loading = false;
          state.upcomingActivities = sortActivitiesChronologically(
            action.payload.upcoming
          );
          state.previousActivities = sortActivitiesChronologically(
            action.payload.previous
          );
          state.filteredUpcoming = [...state.upcomingActivities];
          state.filteredPrevious = [...state.previousActivities];
        }
      )
      .addCase(fetchActivitiesData.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch activities data.";
      })

      // Fetch Activity Logs...
      .addCase(fetchActivityLogsData.pending, (state) => {
        state.loadingLogs = true;
        state.logsError = null;
      })
      .addCase(fetchActivityLogsData.fulfilled, (state, action) => {
        const { id, logs } = action.payload;

        const updateLogsInActivity = (list: Activity[]) => {
          const index = list.findIndex(
            (activity) => activity.id === Number(id)
          );
          if (index !== -1) {
            list[index].logs = logs;
          }
        };

        updateLogsInActivity(state.upcomingActivities);
        updateLogsInActivity(state.previousActivities);
        updateLogsInActivity(state.filteredUpcoming);
        updateLogsInActivity(state.filteredPrevious);

        state.upcomingActivities = sortActivitiesChronologically(
          state.upcomingActivities
        );
        state.previousActivities = sortActivitiesChronologically(
          state.previousActivities
        );
        state.filteredUpcoming = sortActivitiesChronologically(
          state.filteredUpcoming
        );
        state.filteredPrevious = sortActivitiesChronologically(
          state.filteredPrevious
        );

        state.loadingLogs = false;
        state.logsError = null;
      })
      .addCase(fetchActivityLogsData.rejected, (state, action) => {
        state.loadingLogs = false;
        state.logsError =
          action.error.message || "Failed to update activity logs.";
      })

      // Update Activity Logs...
      .addCase(updateActivityLogs.pending, (state) => {
        state.pendingLogUpdate = true;
        state.logUpdateError = null;
      })
      .addCase(updateActivityLogs.fulfilled, (state, action) => {
        const { id, updatedLog } = action.payload;

        const updateLogsInActivity = (list: Activity[]) => {
          const index = list.findIndex((activity) => activity.id === id);
          if (index !== -1) {
            list[index].logs = [...list[index].logs, updatedLog];
          }
        };

        updateLogsInActivity(state.upcomingActivities);
        updateLogsInActivity(state.previousActivities);
        updateLogsInActivity(state.filteredUpcoming);
        updateLogsInActivity(state.filteredPrevious);

        state.upcomingActivities = sortActivitiesChronologically(
          state.upcomingActivities
        );
        state.previousActivities = sortActivitiesChronologically(
          state.previousActivities
        );
        state.filteredUpcoming = sortActivitiesChronologically(
          state.filteredUpcoming
        );
        state.filteredPrevious = sortActivitiesChronologically(
          state.filteredPrevious
        );

        state.pendingLogUpdate = false;
        state.logUpdateError = null;
      })
      .addCase(updateActivityLogs.rejected, (state, action) => {
        state.pendingLogUpdate = false;
        state.logUpdateError =
          action.error.message || "Failed to update activity logs.";
      })

      // Update Activity...
      .addCase(updateActivity.pending, (state) => {
        state.pendingUpdate = true;
        state.updateError = null;
      })
      .addCase(updateActivity.fulfilled, (state, action) => {
        const updatedActivity = action.payload;
        const updateInList = (list: Activity[]) => {
          const index = list.findIndex(
            (activity) => activity.id === updatedActivity.id
          );
          if (index !== -1) list[index] = updatedActivity;
        };
        updateInList(state.upcomingActivities);
        updateInList(state.previousActivities);
        updateInList(state.filteredUpcoming);
        updateInList(state.filteredPrevious);
        state.upcomingActivities = sortActivitiesChronologically(
          state.upcomingActivities
        );
        state.previousActivities = sortActivitiesChronologically(
          state.previousActivities
        );
        state.filteredUpcoming = sortActivitiesChronologically(
          state.filteredUpcoming
        );
        state.filteredPrevious = sortActivitiesChronologically(
          state.filteredPrevious
        );
        state.pendingUpdate = false;
        state.updateError = null;
      })
      .addCase(updateActivity.rejected, (state, action) => {
        state.pendingUpdate = false;
        state.updateError =
          action.error.message || "Failed to update activity details.";
      })

      // Add Activity
      .addCase(addActivity.pending, (state) => {
        state.pendingAdd = true;
        state.addError = null;
      })
      .addCase(addActivity.fulfilled, (state, action) => {
        const newActivity = action.payload;
        const upcomingActivities = state.upcomingActivities;
        const filteredUpcoming = state.filteredUpcoming;

        if (
          upcomingActivities.some((activity) => activity.id === newActivity.id)
        ) {
          state.pendingAdd = false;
          return;
        }

        upcomingActivities.push(newActivity);

        const matchesInUpcoming = filteredUpcoming.some((activity) =>
          activity.desc.toLowerCase().includes(newActivity.desc.toLowerCase())
        );

        if (matchesInUpcoming) filteredUpcoming.push(newActivity);

        state.pendingAdd = false;
        state.upcomingActivities =
          sortActivitiesChronologically(upcomingActivities);
        if (matchesInUpcoming)
          state.filteredUpcoming =
            sortActivitiesChronologically(filteredUpcoming);
      })
      .addCase(addActivity.rejected, (state, action) => {
        state.pendingAdd = false;
        state.addError = action.error.message || "Failed to add new activity.";
      });
  },
});

export const { filterActivitiesBySearch } = activitiesSlice.actions;
export default activitiesSlice.reducer;
