import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response, NextFunction } from 'express';
import { TSummaryItem, TSummaryReport, TTokenInfo } from './utils';
import { BigNumber } from 'bignumber.js';
import { dbQuery } from './lpa_db';
import tokenSymbolList from './tokenSymbolList';
import { getEthAssets } from './utils';

const fs = require('fs');
const cors = require('cors');

const LP_BE_PORT = '55080';
const _Lptest = require('./_Lptest');

const app = express();
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// response code:
const RES_NO_ERROR = 200;
const RES_BAD_REQ = 5050;
const RES_NO_RESP = 5055;

///////////////////////
async function getSummary(account: string) {
  let res: TSummaryReport;
  let tokItems: TSummaryItem[] = [];
  try {
    const ethAssets = await getEthAssets(account);
    const values = Object.values(ethAssets);
    console.log('@tokenssss:', values.length);
    let uniTokens = [];
    for (let i = 0; i < values.length; i++) {
      const tokenInfo = values[i] as TTokenInfo;

      if (tokenInfo.tokenName.includes('Uniswap V3 Positions')) {
        uniTokens.push(values[i].tokenId);
      }
    }
    console.log(`@account :${account}, tokens:${uniTokens.length} / `, uniTokens);

    let resAlltoken = await _Lptest.getAllsummaryReportByAddress(account, uniTokens);

    let sumAmountUSD = new BigNumber(0);
    let sumDepositedUSD = new BigNumber(0);
    let sumLiquidity = new BigNumber(0);

    let totalProfit = '0.0';
    let totalLiquidity = '0.0';

    for (let i = 0; i < resAlltoken.length; i++) {
      let posInfo = resAlltoken[i] as TSummaryItem;
      // posInfo.account = account;

      // for summay
      sumAmountUSD = sumAmountUSD.plus(
        BigNumber(posInfo.totalOutAmountUSD).minus(BigNumber(posInfo.totalDepositedUSD)),
      );
      sumDepositedUSD = sumDepositedUSD.plus(BigNumber(posInfo.totalDepositedUSD));
      sumLiquidity = sumLiquidity.plus(BigNumber(posInfo.totalBalanceUSD));
    }

    // convert : bignumber to string.
    // profit : percentage (%)
    if (sumDepositedUSD.comparedTo(0) > 0) {
      totalProfit = sumAmountUSD.div(sumDepositedUSD).multipliedBy(100).toFixed(2);
    }

    // liquidity : usd ($)
    totalLiquidity = sumLiquidity.toString();

    // extra field
    // - portfolio : percentage (%)
    // - profitUSD : $
    resAlltoken.forEach((item: TSummaryItem) => {
      item.portfolio = BigNumber(item.totalBalanceUSD).div(sumLiquidity).multipliedBy(100).toFixed(2);
    });

    // sorting by portfolio
    resAlltoken = resAlltoken.sort(
      (a: TSummaryItem, b: TSummaryItem) => Number(b.portfolio) * 100 - Number(a.portfolio) * 100,
    );

    res = {
      info: {
        account: account,
        totalProfit: totalProfit,
        totalLiquidity: totalLiquidity,
        totalProfitUSD: sumAmountUSD.toString(),
        initDepositUSD: sumDepositedUSD.toString(),
      },
      // items: tokItems,
      items: resAlltoken,
    };
    // console.log('@@@ summary report', res);
  } catch (e) {
    console.log('error: ', e);
    return [];
  }
  return res;
}

///////////////////////
// API 1
app.get('/api/account/:account', async (req: Request, res: Response, next: NextFunction) => {
  const account = req.params.account;
  let resp = 'ok';
  let response = {};
  console.log('/api/account/' + `${account}`);
  try {
    const summary = await getSummary(account);

    if (resp) {
      response = {
        status: RES_NO_ERROR,
        data: summary,
      };
    } else {
      response = {
        status: RES_BAD_REQ,
        data: {},
      };
    }
    res.send(response);
  } catch (e) {
    response = {
      status: RES_BAD_REQ,
      data: {},
    };
    res.send(response);
  }
});

// API 2
app.get('/api/info/tokenId/:tokenId/option/:option', async (req: Request, res: Response, next: NextFunction) => {
  const tokenId = req.params.tokenId;

  let response;
  // Set sql files
  console.log('tokenId :', tokenId);
  const dailyData = await _Lptest.getDailyAmount(tokenId, true);

  try {
    console.log('data:', dailyData.length);
    response = {
      status: 200,
      data: dailyData,
    };
  } catch (e) {
    console.error('Error parsing JSON:', e);

    response = {
      status: 500,
      data: {},
    };
  }
  res.send(response);
});

// API 3.1
// query : deposit, deposit_date
const DEPO_MARGIN = 1; // 10%
app.get('/api/compare/price/:price/from/:from', async (req: Request, res: Response, next: NextFunction) => {
  const deposited = Number(req.params.price); // deposited
  const deposited_max = deposited + deposited * DEPO_MARGIN;
  const deposited_min = deposited - deposited * DEPO_MARGIN;
  const from = Number(req.params.from); // date

  const TS_A_DAY = 24 * 60 * 60; //      86400
  const ts_margin = TS_A_DAY * 7; //   abount 7 days (a week)?
  const from_max = (Number(from) + ts_margin).toString();
  const from_min = (Number(from) - ts_margin).toString();

  let resData;
  let response;

  let queryGetPoolList = '';
  let queryComparison = '';
  try {
    console.log('api/compare/', 'param:', deposited);
    console.log('api/compare/', 'from:', from);

    const tokenWhiteList = tokenSymbolList.join("','");

    let res;
    queryGetPoolList =
      `select poolid, tvlusd from lpa_pair_info` +
      ` where token0Symbol in ('${tokenWhiteList}')` +
      ` and token1Symbol in ('${tokenWhiteList}')` +
      ` order by tvlusd desc limit 100`;

    let interestedPoolList: string[] = [];
    res = await dbQuery(queryGetPoolList);
    if (res) {
      let resObj = Object.values(res);
      resObj.forEach(i => {
        interestedPoolList.push(i.poolid);
      });
    }

    let result: any[] = [];
    let pids = '';
    pids = interestedPoolList.join("','");
    // console.log(pid);

    queryComparison =
      `select * from lpa_asset_extra_position` +
      ` where  poolid in('${pids}') ` +
      ` and createdTimestamp > ${from_min} and  createdTimestamp < ${from_max}` +
      ` and totDepositedUSD > ${deposited_min} and totDepositedUSD < ${deposited_max}` +
      ` and liquidityUSd > 0 ` +
      ` order by realProfit desc limit 20`;

    res = await dbQuery(queryComparison);
    if (res) {
      result = Object.values(res);
    }
    if (result.length > 0) {
      result = result.sort((a, b) => b.realProfit - a.realProfit);
      result.forEach(item => {
        const tickUpperPrice0 =
          item.tickUpperPrice0 > item.tickLowerPrice0 ? item.tickUpperPrice0 : item.tickLowerPrice0;
        const tickLowerPrice0 =
          item.tickUpperPrice0 < item.tickLowerPrice0 ? item.tickUpperPrice0 : item.tickLowerPrice0;
        item.tickUpperPrice0 = tickUpperPrice0;
        item.tickLowerPrice0 = tickLowerPrice0;

        const tickUpperPrice1 =
          item.tickUpperPrice1 > item.tickLowerPrice1 ? item.tickUpperPrice1 : item.tickLowerPrice1;
        const tickLowerPrice1 =
          item.tickUpperPrice1 < item.tickLowerPrice1 ? item.tickUpperPrice1 : item.tickLowerPrice1;
        item.tickUpperPrice1 = tickUpperPrice1;
        item.tickLowerPrice1 = tickLowerPrice1;
      });
    }

    // console.log('@ dbQuery, resData:', res);
    response = {
      status: 200,
      data: result,
      // data: `{param:${param}, data:${res}}`,
    };
  } catch (e) {
    console.log('api/compare/', 'error:', e, queryGetPoolList, queryComparison);

    response = {
      status: 500,
      data: `{param:${e}}`,
    };
  }
  res.send(response);
});

// API 3.2
// query : deposit, deposit_date
app.get('/api/compare/price/:price/from/:from/pid/:pid', async (req: Request, res: Response, next: NextFunction) => {
  console.log('req:', req.params);
  const pid = req.params.pid;
  const deposited = Number(req.params.price); // deposited
  const deposited_max = deposited + deposited * DEPO_MARGIN;
  const deposited_min = deposited - deposited * DEPO_MARGIN;
  const from = Number(req.params.from); // date

  const TS_A_DAY = 24 * 60 * 60; //      86400
  const ts_margin = TS_A_DAY * 7; //   abount 7 days (a week)?
  const from_max = (Number(from) + ts_margin).toString();
  const from_min = (Number(from) - ts_margin).toString();

  let resData;
  let response;

  let queryGetPoolList = '';
  let queryComparison = '';
  try {
    console.log('api/compare/', 'param:', deposited);
    console.log('api/compare/', 'from:', from);
    console.log('api/compare/', 'pid:', pid);

    const tokenWhiteList = tokenSymbolList.join("','");

    let res;
    queryGetPoolList =
      `select poolid, tvlusd from lpa_pair_info` +
      ` where token0Symbol in ('${tokenWhiteList}')` +
      ` and token1Symbol in ('${tokenWhiteList}')` +
      ` order by tvlusd desc limit 100`;

    let interestedPoolList: string[] = [];
    res = await dbQuery(queryGetPoolList);
    if (res) {
      let resObj = Object.values(res);
      resObj.forEach(i => {
        interestedPoolList.push(i.poolid);
      });
    }
    let result: any[] = [];
    let pids = '';
    pids = interestedPoolList.join("','");

    queryComparison =
      `select * from lpa_asset_extra_position` +
      ` where  poolid in('${pids}') ` +
      // ` and poolid != '${pid}'` +
      ` and createdTimestamp > ${from_min} and  createdTimestamp < ${from_max}` +
      ` and totDepositedUSD > ${deposited_min} and totDepositedUSD < ${deposited_max}` +
      ` and liquidityUSd > 0 ` +
      ` order by realProfit desc limit 20`;
    // console.log(queryComparison);

    res = await dbQuery(queryComparison);
    if (res) {
      result = Object.values(res);
    }

    // sort
    if (result.length > 0) {
      result = result.sort((a, b) => b.realProfit - a.realProfit);
      result.forEach(item => {
        const tickUpperPrice0 =
          item.tickUpperPrice0 > item.tickLowerPrice0 ? item.tickUpperPrice0 : item.tickLowerPrice0;
        const tickLowerPrice0 =
          item.tickUpperPrice0 < item.tickLowerPrice0 ? item.tickUpperPrice0 : item.tickLowerPrice0;
        item.tickUpperPrice0 = tickUpperPrice0;
        item.tickLowerPrice0 = tickLowerPrice0;

        const tickUpperPrice1 =
          item.tickUpperPrice1 > item.tickLowerPrice1 ? item.tickUpperPrice1 : item.tickLowerPrice1;
        const tickLowerPrice1 =
          item.tickUpperPrice1 < item.tickLowerPrice1 ? item.tickUpperPrice1 : item.tickLowerPrice1;
        item.tickUpperPrice1 = tickUpperPrice1;
        item.tickLowerPrice1 = tickLowerPrice1;
      });
    }

    // console.log('@ dbQuery, resData:', res);
    response = {
      status: 200,
      data: result,
      // data: `{param:${param}, data:${res}}`,
    };
  } catch (e) {
    console.log('api/compare/', 'error:', e, queryGetPoolList, queryComparison);

    response = {
      status: 500,
      data: `{param:${e}}`,
    };
  }
  res.send(response);
});

app.listen(LP_BE_PORT, () => {
  console.log(`Welcome Keypair. port:${LP_BE_PORT}`);
});
