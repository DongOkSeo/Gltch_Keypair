import { LpAnalyze } from "./../../interfaces/interface";
import { BACKEND_URL } from "@constants";
import axios, { AxiosResponse } from "axios";

export const getLpAnalyze = async (
  address: string
): Promise<AxiosResponse<unknown, any>> => {
  try {
    const res = await axios.get(`${BACKEND_URL}account/${address}`);
    if (res?.data?.data) {
      const data: LpAnalyze = res.data.data;
      console.log("lp data: ", data);
      return data as any;
    }
    return [] as any;
  } catch (e) {
    console.error("get lp analyze error: ", e);
    return [] as any;
  }
};
