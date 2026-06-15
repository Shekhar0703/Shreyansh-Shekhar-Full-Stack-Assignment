import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeRequest: null,
  response: null,
  insights: [],
  status: "idle",
  error: null,
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    requestStarted(state, action) {
      state.activeRequest = action.payload;
      state.status = "loading";
      state.error = null;
    },
    requestSucceeded(state, action) {
      const { request, response, append = false } = action.payload;
      state.activeRequest = request;
      state.response = response;
      state.status = response.status === "NEEDS_CLARIFICATION" ? "clarification" : "success";
      state.error = null;
      state.insights = append ? [...state.insights, ...response.insights] : response.insights;
    },
    requestFailed(state, action) {
      state.status = "error";
      state.error = action.payload;
    },
    clearSession() {
      return initialState;
    },
  },
});

export const { requestStarted, requestSucceeded, requestFailed, clearSession } = sessionSlice.actions;
export default sessionSlice.reducer;
