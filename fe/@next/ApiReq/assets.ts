import { BACKEND_URL, COVALENTHQ_URL } from "@constants";
import { AxiosResponse } from "axios";
import axios from "axios";
import { COVALENTHQ_KEY } from "constants/key";
import { AssetRes, Asset } from "interfaces/interface";

// export const getWalletAssets = async (
//   networkId: number,
//   address: string
// ): Promise<AxiosResponse<unknown, any>> => {
//   // return await axios.get(`${BACKEND_URL}balance/${networkId}/${address}`);
//   const res = await axios.get(`${BACKEND_URL}balance/${networkId}/${address}`);
//   return res;
// };

export const getWalletAssets = async (networkId: number, address: string) => {
  // return await axios.get(`${BACKEND_URL}balance/${networkId}/${address}`);
  try {
    const res = await axios.get(
      `${COVALENTHQ_URL}/${networkId}/address/${address}/balances_v2/?quote-currency=USD&format=JSON&nft=false&no-nft-fetch=false&key=${COVALENTHQ_KEY}`
    );
    const asset: AssetRes = res?.data ? res.data?.data : undefined;
    const ret: Asset[] = [];
    let total: number = 0;
    for (let i = 0; i < asset.items.length; i++) {
      total += asset.items[i].quote;
      ret.push({
        name: asset.items[i].contract_name,
        symbol: asset.items[i].contract_ticker_symbol,
        balance:
          Number(asset.items[i].balance) /
          Math.pow(10, asset.items[i].contract_decimals),
        logoUrl: asset.items[i].logo_url,
        quote: asset.items[i].quote,
        isNative: asset.items[i].native_token,
      });
    }
    ret.map((x) => (x.portfolio = ((x.quote / total) * 100).toFixed(2) + "%"));
    return ret;
  } catch (e) {
    console.log("get wallet assets error: ", e);
  }
};
