/**
 * @file Contains the auth slice of the app store state.
 * Here the slice is initialized.
 */

import { createSlice } from "@reduxjs/toolkit";
import { ThemesSliceStateProps } from "./theme.types";
// import { login } from "./auth-api";

export const ThemeIntitalState: ThemesSliceStateProps = {
  theme: "light",
};

const ThemeSlice = createSlice({
  name: "theme",
  initialState: ThemeIntitalState,

  reducers: {
    setTheme(state: any, payload) {
      state.theme = payload.payload;
    },
    updateTheme(state: any, payload) {
      state.theme = payload.payload;
      // storing last saved theme in local storage to load it on the screen refresh
      localStorage.setItem("theme", JSON.stringify(payload.payload));
    },
  },
});

export const themeActions = ThemeSlice.actions;
export const themeReducer = ThemeSlice.reducer;
