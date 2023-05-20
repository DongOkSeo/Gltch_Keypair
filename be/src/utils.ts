import axios from 'axios';

const MORALIS_API_KEY = 'HQxXRTZ9gdzTTqCVFmkErRhnLZNSFjbxT4eerDjYx12cJ28LO3682zs0iSKgOqbN';
const INFURA_API_KEY = 'a891fa5596594e32adb45f27bc7522a7';
// const INFURA_API_KEY = '84842078b09946638c03157f83405213';

const ETH_API = 'https://deep-index.moralis.io/api/v2';

export type TTokenInfo = {
  account: string;
  contract: string;
  tokenId: string;
  amount: string;
  tokenName: string;
};

export type TTokenRes = {
  token_address: string;
  token_id: string;
  amount: string;
  owner_of: string;
  token_hash: string;
  metadata: string;
  name: string;
};

export type TSummaryReport = {
  info: TSummaryInfo;
  items: TSummaryItem[];
};

export type TSummaryInfo = {
  account: string;
  totalProfit: string;
  totalLiquidity: string;
  totalProfitUSD: string;
  initDepositUSD: string;
};

export type TSummaryItem = {
  // token info
  account: string;
  contract: string;
  tokenName: string;
  tokenId: string;
  poolId: string;
  pollFeeTier: string;
  timestamp: string;
  // amount
  totalOutAmountUSD: string;
  totalDepositedUSD: string;
  // symbol
  symbol0: string;
  symbol1: string;
  // token0,1 address
  token0address: string;
  token1address: string;
  //
  tick: string;
  tickPrice0: string;
  tickPrice1: string;
  tickUpper: string;
  tickUpperPrice0: string;
  tickUpperPrice1: string;
  tickLower: string;
  tickLowerPrice0: string;
  tickLowerPrice1: string;
  // deposited
  deposited0: string;
  deposited1: string;
  totDepositedUSD: string;
  // withdrawn
  withdrawn0: string;
  withdrawn1: string;
  totWithdrawnUSD: string;
  // collected
  collectedfee0: string;
  collectedfee1: string;
  totCollectedfeeUSD: string;
  // liquidity
  liquidityToken0: string;
  liquidityToken1: string;
  liquidityUSD: string;

  unCollectedfee0: string;
  unCollectedfee1: string;
  curFeeAmountUSD: string;
  // balance
  token0TotalBalance: string;
  token1TotalBalance: string;
  // totalBalance(USD)
  totalBalanceUSD: string;
  // profit
  realProfit: string;
  holdProfit: string;
  // profit (USD)
  realProfitUSD: string;
  holdProfitUSD: string;
  // portfolio
  portfolio: string;
  // history
  history: [];
  // inRange check : boolean
  inRange: boolean;
};

export type TAccountInfo = {
  account: string;
  assets: {
    [assets: string]: {
      profit: string;
      liquidity: string;
      portfolio: string;
    };
  };
};

/**
 * getEthAssets
 */
export async function getEthAssets(account: string) {
  try {
    let res: any = await axios
      .get(`${ETH_API}/${account}/nft?chain=eth&format=decimal`, {
        headers: {
          accept: 'application/json',
          'X-API-Key': `${MORALIS_API_KEY}`,
        },
      })
      .catch(function (e) {
        console.error('get eth nft parse error: ', e);
      });

    const result = res.data.result;

    let tokens: TTokenInfo[] = [];
    result.forEach((i: TTokenRes) => {
      let item: TTokenInfo = {
        account: account,
        contract: i.token_address,
        tokenId: i.token_id,
        amount: i.amount,
        tokenName: i.name,
      };

      tokens.push(item);
    });
    // console.log('@account. tokens:', tokens);
    return tokens;
  } catch (e) {
    console.error('get eth NFTs error: ', e);
    return [];
  }
  return [];
}

module.exports = {
  getEthAssets: getEthAssets,
};
