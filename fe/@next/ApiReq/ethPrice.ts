import { BACKEND_URL, ETH_PRICE_URL } from "@constants";
import axios, { AxiosResponse } from "axios";

export const getEthPrice = async (): Promise<AxiosResponse<unknown, any>> => {
  // const ret = await axios.get(ETH_PRICE_URL);
  // return ret?.data?.data ? ret.data.data : [];
  return await axios.get(ETH_PRICE_URL);
};
