import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const sectionSlice = createSlice({
  name: "section",
  initialState: {
    currentSection: 0,
  },
  reducers: {
    updateCurrentSection: (state, action: PayloadAction<number>) => {
      state.currentSection = action.payload;
    },
  },
});

export const { updateCurrentSection } = sectionSlice.actions;
export default sectionSlice.reducer;
