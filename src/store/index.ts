import { configureStore } from "@reduxjs/toolkit";
import notesReducer from "../features/notes/NotesSlice";

export const store = configureStore({
  reducer: {
    notes: notesReducer,
  },
  devTools: process.env.NODE_ENV === "development",
});

export type RootState = ReturnType<typeof store.getState>;
