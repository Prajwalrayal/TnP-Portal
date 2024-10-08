import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const searchSlice = createSlice({
  name: "search",
  initialState: {
    activitySearchParam: "",
    hrSearchParam: "",
    companySearchParam: "",
  },
  reducers: {
    setSearchParams: (
      state,
      action: PayloadAction<{ searchText: string; page: string }>
    ) => {
      if (action.payload.page === "companies")
        state.companySearchParam = action.payload.searchText;
      else if (action.payload.page === "hr")
        state.hrSearchParam = action.payload.searchText;
      else state.activitySearchParam = action.payload.searchText;
    },
    clearSearchParams: (state) => {
      state.companySearchParam = "";
      state.hrSearchParam = "";
      state.activitySearchParam = "";
    },
  },
});

export const { setSearchParams, clearSearchParams } = searchSlice.actions;

export default searchSlice.reducer;
