import { createSlice } from "@reduxjs/toolkit";

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState: {
    isSidebarOpen: false,
    expanded: false,
  },
  reducers: {
    openSidebar: (state) => {
      state.isSidebarOpen = true;
    },
    closeSidebar: (state) => {
      state.isSidebarOpen = false;
    },
    expandSidebar: (state) => {
      state.expanded = true;
    },
    collapseSidebar: (state) => {
      state.expanded = false;
    },
  },
});

export const { openSidebar, closeSidebar, expandSidebar, collapseSidebar } =
  sidebarSlice.actions;
export default sidebarSlice.reducer;
