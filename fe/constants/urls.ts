import * as process from "process";

export const EXPLORER_URL: string = "https://etherscan.io/address/";
export const COINT_GECKO_URL: string = "https://api.coingecko.com/api/v3/";
export const COINMARKETCAP_URL: string =
  "https://s2.coinmarketcap.com/static/cloud/img/dex/default-icon-day.svg?_=9dfbefa";
export const BACKEND_URL: string = process.env.NEXT_PUBLIC_BACKEND_URL || "";
export const ETH_PRICE_URL: string =
  process.env.NEXT_PUBLIC_ETH_PRICE_URL || "";
export const TOKEN_IMAGE_URL: string = process.env.NEXT_PUBLIC_TOKEN_URL || "";
export const COVALENTHQ_URL: string =
  process.env.NEXT_PUBLIC_COVALENTHQ_API || "";
