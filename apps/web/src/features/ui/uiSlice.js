import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchQuery: "",
  sortMode: "title-asc",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
    setSortMode(state, action) {
      state.sortMode = action.payload;
    },
  },
});

export const { setSearchQuery, setSortMode } = uiSlice.actions;
export default uiSlice.reducer;
