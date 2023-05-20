export interface LpData {
  owner: string;
  index: string;
  name: string;
  feePercent: string;
  nonce: string;
  operator: string;
  token0: string;
  token1: string;
  fee: string;
  tickLower: string;
  tickUpper: string;
  liquidity: string;
  feeGrowthInside0LastX128: string;
  feeGrowthInside1LastX128: string;
  tokensOwed0: string;
  tokensOwed1: string;
  image: string;
}

// export interface LpAnalyze {
//   // token info
//   account: string;
//   contract: string;
//   tokenName: string;
//   tokenId: string;
//   poolId: string;
//   // symbol
//   symbol0: string;
//   symbol1: string;
//   // mint amount
//   curMintAmountUSD: string;
//   // token0,1 address
//   token0address: string;
//   token1address: string;
//   // balance
//   token0TotalBalance: string;
//   token1TotalBalance: string;
//   // totalBalance(USD)
//   totalBalanceUSD: string;
//   // profit
//   realProfit: string;
//   holdProfit: string;
//   portFolio: string;
//   totalLiquidity: number;
// }

export interface LpHistory {
  amount0: string;
  amount1: string;
  amountUSD: string;
  blockNumber: number;
  ethPrice: string;
  gasPrice: string;
  gasUsed: string;
  liquidity: string;
  price0: string;
  price1: string;
  sqrtPriceX96: string;
  tick: string;
  timestamp: string;
  txId: string;
  type: string;
}

export interface LpItem {
  // token info
  account: string;
  contract: string;
  tokenName: string;
  tokenId: string;
  poolId: string;
  // symbol
  symbol0: string;
  symbol1: string;
  // mint amount
  curMintAmountUSD: string;
  // token0,1 address
  token0address: string;
  token1address: string;
  // balance
  token0TotalBalance: string;
  token1TotalBalance: string;
  // totalBalance(USD)
  totalBalanceUSD: string;
  // profit
  realProfit: string;
  realProfitUSD: string;
  holdProfit: string;
  holdProfitUSD: string;
  portfolio: string;
  // in range
  inRange: boolean;
  // history
  timestamp: string;
  history: LpHistory[];
  // total
  totCollectedfeeUSD: string;
  totDepositedUSD: string;
  totWithdrawnUSD: string;
  totalOutAmountUSD: string;
  // fee
  curFeeAmountUSD: string;
  pollFeeTier: string;
  // tick
  tickLower: string;
  tickLowerPrice0: string;
  tickLowerPrice1: string;
  tickPrice0: string;
  tickPrice1: string;
  tickUpper: string;
  tickUpperPrice0: string;
  tickUpperPrice1: string;
  liquidityUSD: string;
  unCollectedfee1: number;
}
export interface LpAnalyze {
  info: {
    account: string;
    totalLiquidity: string;
    totalProfit: string;
    totalProfitUSD: string;
    initDepositUSD: string;
  };
  items: LpItem[];
}

export interface AssetItem {
  balance: string;
  balance_24h: string;
  contract_address: string;
  contract_decimals: number;
  contract_name: string;
  contract_ticker_symbol: string;
  last_transferred_at: string;
  logo_url: string;
  native_token: boolean;
  nft_data: any;
  pretty_quote: string;
  pretty_quote_24h: string;
  quote: number;
  quote_24h: number;
  quote_rate: number;
  quote_rate_24h: number;
  supports_erc: any;
  type: string;
}
export interface AssetRes {
  address: string;
  chain_id: number;
  chain_name: string;
  items: AssetItem[];
  next_update_at: string;
  pagination: any;
  quote_currency: string;
  update_at: string;
}

export interface Asset {
  name: string;
  symbol: string;
  balance: number;
  logoUrl: string;
  quote: number;
  isNative: boolean;
  portfolio?: string;
}

export interface LineChartSeries {
  timeStamp: string[];
  ethPrice: string[];
  liquidityUSD: string[];
  holdBasedUSD: string[];
  action: string[];
}

export interface LpComparison {
  PID: string;
  collectedfee0: number;
  collectedfee1: number;
  createdTimestamp: number;
  curFeeAmountUSD: number;
  deposited0: number;
  deposited1: number;
  expid: number;
  holdProfit: number;
  liquidityToken0: number;
  liquidityToken1: number;
  liquidityUSD: number;
  nftId: number;
  ownerOf: string;
  poolFee: number;
  poolId: string;
  priceRange: number;
  realProfit: number;
  tickLower: number;
  tickLowerPrice0: number;
  tickLowerPrice1: number;
  tickPrice0: number;
  tickPrice1: number;
  tickUpper: number;
  tickUpperPrice0: number;
  tickUpperPrice1: number;
  token0Decimals: number;
  token0Id: string;
  token0Symbol: string;
  token1Decimals: number;
  token1Id: string;
  token1Symbol: string;
  totBalance0: number;
  totBalance1: number;
  totBalanceUSD: number;
  totCollectedfeeUSD: number;
  totDepositedUSD: number;
  totWithdrawnUSD: number;
  unCollectedfee0: number;
  unCollectedfee1: number;
  withdrawn0: number;
  withdrawn1: number;
}

export interface RankComparison {
  isInPosition: boolean;
  myRank: number;
}
