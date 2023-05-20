import { LpAnalyze } from "interfaces/interface";
/**
 * @file Contains the auth slice of the app store state.
 * Here the slice is initialized.
 */

import { createSlice } from "@reduxjs/toolkit";
import { DataSliceStateProps } from "./data.types";
import { RootState } from "@next/store/app.store";

export const DataIntitalState: DataSliceStateProps = {
  lpData: {
    info: {
      account: "",
      totalProfit: "",
      totalLiquidity: "",
      totalProfitUSD: "",
      initDepositUSD: "",
    },
    items: [],
  } as LpAnalyze,
  timeStamp: "",
  inputAddress: "",
};

const DataSlice = createSlice({
  name: "data",
  initialState: DataIntitalState,

  reducers: {
    setLpData(state: any, payload) {
      state.lpData = payload.payload;
    },
    setInputAddress(state: any, payload) {
      state.inputAddress = payload.payload;
    },
    setTimeStamp(state: any, payload) {
      state.timeStamp = payload.payload;
    },
  },
});

export const selectLpData = (state: RootState) => {
  return state.dataReducer.lpData;
};

export const dataActions = DataSlice.actions;
export const dataReducer = DataSlice.reducer;
