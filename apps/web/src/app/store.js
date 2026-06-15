import { configureStore } from "@reduxjs/toolkit";
import { api } from "../services/api";
import sessionReducer from "../features/session/sessionSlice";
import uiReducer from "../features/ui/uiSlice";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    session: sessionReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
});
