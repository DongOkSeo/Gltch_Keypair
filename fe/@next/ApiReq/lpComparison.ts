import { object } from "yup";
import { BACKEND_URL } from "@constants";
import axios, { AxiosResponse } from "axios";
import { times } from "lodash";

export const getLpComparison = async (
  poolId: string,
  deposit: string,
  timeStamp: string
) => {
  try {
    const res = await axios.get(
      `${BACKEND_URL}compare/price/${deposit}/from/${timeStamp}/pid/${poolId}`
    );

    if (res?.data?.data) {
      const data: any = res.data.data;
      console.log("lp comparison: ", data);
      if (typeof data !== "object") {
        return [] as any;
      }
      return data as any;
    }
    return [] as any;
  } catch (e) {
    console.error("get lp comparison error: ", e);
    return [] as any;
  }
};
