import { BACKEND_URL } from "@constants";
import axios, { AxiosResponse } from "axios";

export const getChartData = async (tokenId: string) => {
  try {
    const res = await axios.get(
      `${BACKEND_URL}info/tokenId/${tokenId}/option/1234`
    );
    if (res?.data?.data) {
      const data: any = res.data.data;
      console.log("chart data: ", data);
      if (typeof data !== "object") {
        return [] as any;
      }
      return data as any;
    }
    return [] as any;
  } catch (e) {
    console.error("get chart data error: ", e);
    return [] as any;
  }
};
