import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

interface HRState {
  hrData: any[];
  filteredData: any[];
  searchQuery: string;
  addLoading: boolean;
  addError: string | null;
  updateLoading: boolean;
  updateError: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: HRState = {
  hrData: [],
  filteredData: [],
  searchQuery: "",
  addLoading: false,
  updateLoading: false,
  addError: null,
  updateError: null,
  loading: false,
  error: null,
};

interface HRDataType {
  id: number;
  name: string;
  email: string;
  company: string;
  phone_numbers: string[];
  linkedin: string;
}

export const fetchHRData = createAsyncThunk(
  "hr/fetchHRData",
  async (token: string) => {
    const response = await fetch("/api/hr", {
      body: JSON.stringify({ token }),
    });
    const data = await response.json();
    return data;
  }
);

export const addHRData = createAsyncThunk(
  "hr/addHRData",
  async ({ token, hrData }: { token: string; hrData: HRDataType }) => {
    const response = await fetch("/api/hr/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...hrData, token }),
    });

    if (!response.ok) {
      throw new Error("Failed to add HR data");
    }

    const data = await response.json();
    return data;
  }
);

export const updateHRData = createAsyncThunk(
  "hr/updateHRData",
  async ({ token, hrData }: { token: string; hrData: HRDataType }) => {
    const response = await fetch(`/api/hr/update/${hrData.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...hrData, token }),
    });

    if (!response.ok) {
      throw new Error("Failed to update HR data");
    }

    const data = await response.json();
    return data;
  }
);

const filterData = (data: any[], query: string) => {
  if (!query) return data;
  const afterFilter = data.filter((item) => {
    return item.name.toLowerCase().includes(query.toLowerCase());
  });

  return afterFilter;
};

const hrSlice = createSlice({
  name: "hr",
  initialState,
  reducers: {
    setHRData(state, action: PayloadAction<any[]>) {
      state.hrData = action.payload;
      state.filteredData = filterData(action.payload, state.searchQuery);
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
      state.filteredData = filterData(state.hrData, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch HR Data
      .addCase(fetchHRData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHRData.fulfilled, (state, action) => {
        state.loading = false;
        state.hrData = action.payload;
        state.filteredData = filterData(action.payload, state.searchQuery);
      })
      .addCase(fetchHRData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch HR data";
      })

      // Add HR Data
      .addCase(addHRData.pending, (state) => {
        state.addLoading = true;
        state.addError = null;
      })
      .addCase(addHRData.fulfilled, (state, action) => {
        state.addLoading = false;
        const hrData = [action.payload, ...state.hrData];
        state.hrData = hrData;
      })
      .addCase(addHRData.rejected, (state, action) => {
        state.addLoading = false;
        state.addError = action.error.message || "Failed to add HR data";
      })

      // Update HR Data
      .addCase(updateHRData.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateHRData.fulfilled, (state, action) => {
        state.updateLoading = false;
        const hrIndex = state.hrData.findIndex(
          (hr) => hr.id === action.payload.id
        );
        if (hrIndex !== -1) {
          state.hrData[hrIndex] = action.payload;
          state.filteredData = filterData(state.hrData, state.searchQuery);
        }
      })
      .addCase(updateHRData.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.error.message || "Failed to update HR data";
      });
  },
});

export const { setHRData, setSearchQuery } = hrSlice.actions;
export default hrSlice.reducer;
