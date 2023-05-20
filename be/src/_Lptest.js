const Web3 = require('web3');
const fs = require('fs');
const BigNumber = require('bignumber.js');
const { default: axios } = require('axios');
const JSBI = require('jsbi');
const NFT_PM_ABI = require('./UniV3_NPM_ABI.js');
const POOL_ABI = require('./UniV3_POOL_ABI.js');
const INTERFACE_ABI = require('./UniV3_INTERFACE_ABI.js');
const { encodeSqrtRatioX96, TickMath, SqrtPriceMath } = require('@uniswap/v3-sdk');

const NFT_PM_ADDR = '0xC36442b4a4522E871399CD717aBDD847Ab11FE88';
const INTERFACE_ADDR = '0x1f98415757620b543a52e61c46b32eb19261f984';

const STABLE_LISTS = ['USDT', 'USDC', 'DAI', 'BUSD', 'TUSD'];
const NATIVE_LISTS = ['WETH', 'ETH'];
const POOI_ID_USDCWETH = '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640';
const POOL_TOKEN0_USDC = {
  symbol: 'USDC',
  decimals: 6,
  address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
};
const POOL_TOKEN1_WETH = {
  symbol: 'WETH',
  decimals: 18,
  address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
};

const token0 = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
const token1 = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
const poolfee = 500;
const token0_symbol = 'USDC';
const token1_symbol = 'WETH';
const token0_decimals = 6;
const token1_decimals = 18;

const Q96 = JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(96));
const Q192 = JSBI.exponentiate(Q96, JSBI.BigInt(2));

let providersIndex = 0;
const providers = [
  'https://mainnet.infura.io/v3/730a571f1f2e4da0befafcdc25237ad9',
  'https://mainnet.infura.io/v3/f6480f9098374ace9976b2f269970603',
];

let fastProvidersIndex = 0;
const fastResponseProviders = [
  'https://eth-mainnet.g.alchemy.com/v2/mJUMiBw5QqT7Q0J6KAt34VWYJKamhFrd',
  'https://rpc.ankr.com/eth',
  'https://cloudflare-eth.com',
  'https://eth.rpc.blxrbdn.com',
  'https://eth-mainnet.nodereal.io/v1/1659dfb40aa24bbb8153a677b98064d7',
];

function getNextfastProvider() {
  const provider = fastResponseProviders[fastProvidersIndex];
  fastProvidersIndex = (fastProvidersIndex + 1) % fastResponseProviders.length;
  //console.log(providersIndex)
  return provider;
}

function getNextProvider() {
  const provider = providers[providersIndex];
  providersIndex = (providersIndex + 1) % providers.length;
  //console.log(providersIndex)
  return provider;
}

const SWAP_SIGNATURE = '0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67';
const BURN_SIGNATURE = '0x0c396cd989a39f4459b5fa1aed6a9a8dcdbc45908acfd67e028cd568da98982c';
const COLLECT_SIGNATURE = '0x70935338e69775456a85ddef226c395fb668b63fa0115f5f20610b388e6ca9c0';
const MINT_SIGNATURE = '0x7a53080ba414158be7ec69b987b5fb7d07dee101fe85488f0853ae16239d0bde';
const IncreaseObservationCardinalityNext =
  '0xac49e518f90a358f652e4400164f05a5d8f7e35e7747279bc3a93dbf584e125a';
const FLASH_SIGNATURE = '0xbdbdb71d7860376ba52b25a5028beea23581364a40522f6bcfb86bb1f2dca633';

async function UniswapInterfaceCalls(calls, blockNumber) {
  const provider = getNextProvider();
  const web3 = new Web3(provider);
  web3.eth.handleRevert = true;

  try {
    const InterfaceContract = new web3.eth.Contract(INTERFACE_ABI, INTERFACE_ADDR);

    const callData = await InterfaceContract.methods
      .multicall(calls)
      .call({}, blockNumber || 'latest');
    //console.log(callData)
    return callData;
  } catch (error) {
    console.log('UniswapInterfaceCalls', error);
  }
}

const UNISWAP_INIT_BLOCK = 12369739;

async function getPositionIdsForAddressByPastEvent(owner) {
  const provider = getNextProvider();
  const web3 = new Web3(provider);
  web3.eth.handleRevert = true;
  let tokenIds = [];

  try {
    const contract = await new web3.eth.Contract(NFT_PM_ABI, NFT_PM_ADDR);
    const pastEvents = await contract.getPastEvents('Transfer', {
      filter: {
        to: owner,
      },
      address: NFT_PM_ADDR,
      fromBlock: UNISWAP_INIT_BLOCK, //12369739는 tokenId=1번째 mint가된 블럭
      toBlock: 'latest',
    });

    const filterRemoved = pastEvents.filter((item) => item.removed === false);
    tokenIds = filterRemoved.map((item) => item.returnValues.tokenId);
    //console.log(tokenIds)
    return tokenIds;
  } catch (error) {
    console.log(`(${web3.currentProvider.host})`, error);
    return tokenIds;
  }
}

function shouldRetry(error) {
  if (error.includes('request failed or timed out')) {
    return true;
  } else {
    return false;
  }
}

async function getPastEventsCache(tokenId, event, _fromBlock) {
  const cachefileName = '/cacheEvent/${tokenId}_${event}';
}

const MAX_WEB3_RETRY = 3;
async function getPastEvents(tokenId, eventName, _fromBlock, _toBlock) {
  let attemps = 0;
  let startBlock = _fromBlock || 12369739;
  const endBlock = _toBlock || 'latest';

  while (attemps < MAX_WEB3_RETRY) {
    const provider = getNextProvider();
    const web3 = new Web3(provider);
    web3.eth.handleRevert = true;

    try {
      const contract = await new web3.eth.Contract(NFT_PM_ABI, NFT_PM_ADDR);
      const pastEvents = await contract.getPastEvents(`${eventName}`, {
        filter: {
          tokenId: tokenId,
          //recipient
        },
        address: NFT_PM_ADDR,
        fromBlock: startBlock, //12369739는 tokenId=1번째 mint가된 블럭
        toBlock: endBlock,
      });

      //removed =true  tx삭제
      //const filterRemoved = pastEvents.filter( item => item.removed ==false)
      return pastEvents;
    } catch (error) {
      //console.log('reason:',error.message)
      if (shouldRetry(error.message)) {
        attemps++;
      } else {
        console.log(`(${web3.currentProvider.host})`, error);
        throw error;
      }
    }
  }
  throw new Error(Red(`Max Request failed in getPastEvents`));
}

async function getPastEventsUseCache(tokenId, eventName, _fromBlock, _toBlock) {
  let attemps = 0;
  let startBlock = _fromBlock || 12369739;
  const endBlock = _toBlock || 'latest';

  const fsData = await loadEventsCache(tokenId, eventName);
  startBlock = fsData?.blockNumber || startBlock;
  const cachedEvents = fsData.datas || [];

  while (attemps < MAX_WEB3_RETRY) {
    const provider = getNextProvider();
    const web3 = new Web3(provider);
    web3.eth.handleRevert = true;

    try {
      const contract = await new web3.eth.Contract(NFT_PM_ABI, NFT_PM_ADDR);
      const pastEvents = await contract.getPastEvents(`${eventName}`, {
        filter: {
          tokenId: tokenId,
          //recipient
        },
        address: NFT_PM_ADDR,
        fromBlock: startBlock, //12369739는 tokenId=1번째 mint가된 블럭
        toBlock: endBlock,
      });

      //removed =true  tx삭제
      //const filterRemoved = pastEvents.filter( item => item.removed ==false)
      const mergedEvents = [...cachedEvents, ...pastEvents];
      if (mergedEvents.length === 0 || cachedEvents.length < mergedEvents.length) {
        saveEventsCache(tokenId, eventName, mergedEvents, endBlock);
      }
      return mergedEvents;
    } catch (error) {
      //console.log('reason:',error.message)
      if (shouldRetry(error.message)) {
        attemps++;
      } else {
        console.log(`(${web3.currentProvider.host})`, error);
        throw error;
      }
    }
  }
  throw new Error(Red(`Max Request failed in getPastEvents`));
}

//pool :0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8
//Collect
//DecreaseLiquidity
//IncreaseLiquidity
//getPastEvents("298591","IncreaseLiquidity")

async function getPriceAtBlock(poolId, blockNumber) {
  const provider = getNextProvider();
  const web3 = new Web3(provider);
  web3.eth.handleRevert = true;

  const Pool = new web3.eth.Contract(POOL_ABI, poolId);

  try {
    const slot0 = await Pool.methods.slot0().call({}, blockNumber || 'latest');
    //const slot0 = await Pool.methods.slot0().call({},undefined)
    //const slot0 = await Pool.methods.slot0().call()
    //console.log(slot0.tick)

    return slot0;
  } catch (error) {
    console.log(Red('error getPriceAtBlock'), error);
  }
}
//getPriceAtBlock("0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640");

async function updateEthPriceAtBlock(events) {
  //ETH Price.
  const provider = getNextProvider();
  const web3 = new Web3(provider);
  web3.eth.handleRevert = true;

  try {
    const USDETHPool = new web3.eth.Contract(POOL_ABI, POOI_ID_USDCWETH);

    const _USDETH_slot0 = await Promise.all(
      events.map((item) => USDETHPool.methods.slot0().call({}, item.blockNumber))
    );

    for (let i = 0; i < events.length; i++) {
      const price = decodeSqrtRatioX96ByBigNumber(
        POOL_TOKEN0_USDC,
        POOL_TOKEN1_WETH,
        _USDETH_slot0[i].sqrtPriceX96
      );
      events[i].ethPrice = price.price0;
      //console.log(`ethPrice = ${price.price0}`)
    }
  } catch (error) {
    console.log(Red(`updateEthPriceAtBlock${web3.currentProvider.host}=${events.length}`), error);
  }
}

async function updatePriceAtBlock(poolId, token0, token1, events) {
  const provider = getNextProvider();
  const web3 = new Web3(provider);
  web3.eth.handleRevert = true;

  try {
    const Pool = new web3.eth.Contract(POOL_ABI, poolId);

    const slot0s = await Promise.all(
      events.map((item) => Pool.methods.slot0().call({}, item.blockNumber))
    );
    //console.log(slot0s )

    for (let i = 0; i < events.length; i++) {
      events[i].tick = slot0s[i].tick;
      events[i].sqrtPriceX96 = slot0s[i].sqrtPriceX96;
    }

    await updateEthPriceAtBlock(events);
    await updateAmountUSD(token0, token1, events);
  } catch (error) {
    console.log(
      Red(`Error updatePriceAtBlock ${web3.currentProvider.host}=${events.length}`),
      error
    );
  }
}

async function updateGasTransaction(events) {
  const provider = getNextProvider();
  const web3 = new Web3(provider);
  web3.eth.handleRevert = true;

  try {
    const txReceipts = await Promise.all(
      events.map((item) => web3.eth.getTransactionReceipt(item.txId))
    );
    //console.log(txReceipts)
    //console.log(events);
    txReceipts.forEach((tx, i) => {
      events[i].gasUsed = tx.gasUsed;
      events[i].gasPrice = tx.effectiveGasPrice;
    });
  } catch (error) {
    console.log('updateGasTransaction', error);
  }
}

async function readFromFile(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        reject(err);
        return {};
      }
      jsonData = JSON.parse(data);
      resolve(jsonData);
    });
  });
}

function writeToFile(filename, datas, blockNumber) {
  //write to file
  //console.log(new Date(),datas.length, 'data writed');
  let jsondata = JSON.stringify(
    {
      blockNumber: blockNumber,
      datas,
    },
    null,
    2
  );
  fs.writeFileSync(filename, jsondata);
}

async function getTimestampAtBlock() {
  const web3 = new Web3('https://rpc.mevblocker.io');
  web3.eth.handleRevert = true;

  const startBlock = 16000000;
  //const startBlock =12369739;
  const fileName = `${startBlock}_blockTimeStamp.json`;
  let fsData = {};
  if (fs.existsSync(fileName)) {
    fsData = await readFromFile(fileName);
  }

  const _timeStamps = fsData.datas ? fsData.datas : {};
  const fsKeys = Object.keys(_timeStamps);
  //const lastBlock  =  fsKeys.length>0 ? Number(fsKeys[fsKeys.length-1])+1 : 12369739
  const lastBlock = fsKeys.length > 0 ? Number(fsKeys[fsKeys.length - 1]) + 1 : startBlock;

  //const lastBlock  =  fsKeys.length>0 ? Number(fsKeys[fsKeys.length-1])+1 : 12369739
  console.log(`fileLastBlockNumber = ${lastBlock}`);
  //12369739;

  // const lastBlockNumber =await web3.eth.getBlockNumber();
  // console.log(`BlockNumber =${lastBlockNumber}`);

  const REQ_LENGTH = 100;
  const blocknumbers = [];

  let nblock = lastBlock;
  for (let i = 0; i < REQ_LENGTH; i++) {
    blocknumbers.push(nblock.toString());
    nblock++;
  }
  const startTime = process.hrtime();
  const blocks = await Promise.all(blocknumbers.map((number) => web3.eth.getBlock(number)));
  const endTime = process.hrtime(startTime);
  console.log(
    `Execution time: \x1b[33m ${endTime[0]}s \x1b[0m \x1b[33m ${endTime[1] / 1000000}ms \x1b[0m`
  );
  //const _newBlocks = blocks.map(block => ({ [block.number]: { t: block.timestamp } }));
  const _addTimeStamps = {};
  blocks.forEach((block, index) => {
    _addTimeStamps[block.number] = block.timestamp;
  });

  //console.log(blockToTimes)
  const _newTimeStamps = Object.assign({}, _timeStamps, _addTimeStamps);
  const keys = Object.keys(_newTimeStamps);
  const first = keys[0];
  const last = keys[keys.length - 1];
  console.log(`record = ${first} ~ ${last}`);

  writeToFile(fileName, _newTimeStamps);
  // for (let i=0;i<blocks.length;i++) {
  //     console.log(`block=${blocks[i].number},timestamp=${blocks[i].timestamp} ${getReadableDateTime(blocks[i].timestamp)}`);
  // }
}
//setInterval(()=> {getTimestampAtBlock()},10000);

async function updateTimestampTransaction(events) {
  const provider = getNextProvider();
  const web3 = new Web3(provider);
  web3.eth.handleRevert = true;

  try {
    //const startTime =process.hrtime();
    const blocks = await Promise.all(events.map((item) => web3.eth.getBlock(item.blockNumber)));
    //const endTime =process.hrtime(startTime);
    //console.log(events);
    blocks.forEach((block, i) => {
      if (block) {
        events[i].timestamp = block.timestamp;
      }
    });
  } catch (error) {
    console.log('updateTimestampTransaction', error);
  }
}

async function getPositionsByNftManager(positionId, blockNumber) {
  const provider = getNextProvider();
  const web3 = new Web3(provider);
  web3.eth.handleRevert = true;

  const NFTpositionManager = new web3.eth.Contract(NFT_PM_ABI, NFT_PM_ADDR);

  try {
    const positions = await NFTpositionManager.methods
      .positions(new BigNumber(positionId))
      .call({}, blockNumber || 'latest');
    return positions;
  } catch (error) {
    console.log(error);
  }
}

const ZERO = new BigNumber(0);
const Q128 = new BigNumber(2).exponentiatedBy(BigNumber(128));
const Q256 = new BigNumber(2).exponentiatedBy(BigNumber(256));

function calculatePositionAmount(position) {
  const liquidity = JSBI.BigInt(position.liquidity);

  const CurreTick = Number(position.pool.tick);
  const LowerTick = Number(position.tickLower.tickIdx);
  const UpperTick = Number(position.tickUpper.tickIdx);

  const sqrtRatioX96AtCurrentTick = JSBI.BigInt(position.pool.sqrtPrice);
  const sqrtRatioX96AtLowerTick = TickMath.getSqrtRatioAtTick(LowerTick);
  const sqrtRatioX96AtUpperTick = TickMath.getSqrtRatioAtTick(UpperTick);

  //console.log("--------- caculate liquidity to amount ----------");
  let amount0 = JSBI.BigInt('0');
  let amount1 = JSBI.BigInt('0');

  if (CurreTick <= LowerTick) {
    amount0 = SqrtPriceMath.getAmount0Delta(
      sqrtRatioX96AtUpperTick,
      sqrtRatioX96AtLowerTick,
      liquidity,
      false
    );
    // amount1 = 0;
  } else if (CurreTick >= UpperTick) {
    //amount0 = 0;
    amount1 = SqrtPriceMath.getAmount1Delta(
      sqrtRatioX96AtUpperTick,
      sqrtRatioX96AtLowerTick,
      liquidity,
      false
    );
  } else {
    amount0 = SqrtPriceMath.getAmount0Delta(
      sqrtRatioX96AtCurrentTick,
      sqrtRatioX96AtUpperTick,
      liquidity,
      false
    );
    amount1 = SqrtPriceMath.getAmount1Delta(
      sqrtRatioX96AtCurrentTick,
      sqrtRatioX96AtLowerTick,
      liquidity,
      false
    );
  }

  //console.log( Math.pow(10,6) ,BigNumber(10).exponentiatedBy(6).toString())//
  const token0Balance = BigNumber(amount0).div(Math.pow(10, Number(position.token0.decimals)));
  const token1Balance = BigNumber(amount1).div(Math.pow(10, Number(position.token1.decimals)));
  //console.log(`liquidity(\x1b[32m${position.token0.symbol}\x1b[0m) : \x1b[33m${token0Balance}\x1b[0m`)
  //console.log(`liquidity(\x1b[32m${position.token1.symbol}\x1b[0m) : \x1b[33m${token1Balance}\x1b[0m `);

  return { token0Balance, token1Balance };
}

function subIn256(x, y) {
  const difference = BigNumber(x).minus(y);

  if (difference.isLessThan(ZERO)) {
    return BigNumber(Q256).plus(difference);
  } else {
    return difference;
  }
}

function calcculatePositionFees(position) {
  // Ref: https://ethereum.stackexchange.com/a/144704

  BigNumber.config({ EXPONENTIAL_AT: 999999, DECIMAL_PLACES: 40 });
  //console.log(position)

  const pool = position.pool;
  const tickCurrent = Number(pool.tick);
  const tickLower = Number(position.tickLower.tickIdx);
  const tickUpper = Number(position.tickUpper.tickIdx);
  const liquidity = new BigNumber(position.liquidity);

  const token0 = position.token0;
  const token1 = position.token1;
  // Check out the relevant formulas below which are from Uniswap Whitepaper Section 6.3 and 6.4
  // ???? =?????????(????)?????(????)
  // ???? =??·(????(??1)?????(??0))
  // Global fee growth per liquidity '????' for both token 0 and token 1
  let feeGrowthGlobal_0 = new BigNumber(pool.feeGrowthGlobal0X128);
  let feeGrowthGlobal_1 = new BigNumber(pool.feeGrowthGlobal1X128);

  // Fee growth outside '????' of our lower tick for both token 0 and token 1
  let tickLowerFeeGrowthOutside_0 = new BigNumber(position.tickLower.feeGrowthOutside0X128);
  let tickLowerFeeGrowthOutside_1 = new BigNumber(position.tickLower.feeGrowthOutside1X128);

  // Fee growth outside '????' of our upper tick for both token 0 and token 1
  let tickUpperFeeGrowthOutside_0 = new BigNumber(position.tickUpper.feeGrowthOutside0X128);
  let tickUpperFeeGrowthOutside_1 = new BigNumber(position.tickUpper.feeGrowthOutside1X128);

  // These are '????(????)' and '????(????)' from the formula
  // for both token 0 and token 1
  let tickLowerFeeGrowthBelow_0 = ZERO;
  let tickLowerFeeGrowthBelow_1 = ZERO;
  let tickUpperFeeGrowthAbove_0 = ZERO;
  let tickUpperFeeGrowthAbove_1 = ZERO;

  // These are the calculations for '??b(??)' from the formula
  // for both token 0 and token 1
  if (tickCurrent >= tickLower) {
    tickLowerFeeGrowthBelow_0 = tickLowerFeeGrowthOutside_0;
    tickLowerFeeGrowthBelow_1 = tickLowerFeeGrowthOutside_1;
  } else {
    // tickLowerFeeGrowthBelow_0 = feeGrowthGlobal_0.minus(tickLowerFeeGrowthOutside_0);
    // tickLowerFeeGrowthBelow_1 = feeGrowthGlobal_1.minus(tickLowerFeeGrowthOutside_1);
    tickLowerFeeGrowthBelow_0 = subIn256(feeGrowthGlobal_0, tickLowerFeeGrowthOutside_0);
    tickLowerFeeGrowthBelow_1 = subIn256(feeGrowthGlobal_1, tickLowerFeeGrowthOutside_1);
  }

  // These are the calculations for '????(??)' from the formula
  // for both token 0 and token 1
  if (tickCurrent < tickUpper) {
    tickUpperFeeGrowthAbove_0 = tickUpperFeeGrowthOutside_0;
    tickUpperFeeGrowthAbove_1 = tickUpperFeeGrowthOutside_1;
  } else {
    // tickUpperFeeGrowthAbove_0 = feeGrowthGlobal_0.minus(tickUpperFeeGrowthOutside_0);
    // tickUpperFeeGrowthAbove_1 = feeGrowthGlobal_1.minus(tickUpperFeeGrowthOutside_1);
    tickUpperFeeGrowthAbove_0 = subIn256(feeGrowthGlobal_0, tickUpperFeeGrowthOutside_0);
    tickUpperFeeGrowthAbove_1 = subIn256(feeGrowthGlobal_1, tickUpperFeeGrowthOutside_1);
  }

  // Calculations for '????(??1)' part of the '???? =??·(????(??1)?????(??0))' formula
  // for both token 0 and token 1
  let fr_t1_0 = subIn256(
    subIn256(feeGrowthGlobal_0, tickLowerFeeGrowthBelow_0),
    tickUpperFeeGrowthAbove_0
  );
  let fr_t1_1 = subIn256(
    subIn256(feeGrowthGlobal_1, tickLowerFeeGrowthBelow_1),
    tickUpperFeeGrowthAbove_1
  );

  // let fr_t1_0 = feeGrowthGlobal_0
  //     .minus(tickLowerFeeGrowthBelow_0)
  //     .minus(tickUpperFeeGrowthAbove_0);
  // let fr_t1_1 = feeGrowthGlobal_1
  //     .minus(tickLowerFeeGrowthBelow_1)
  //     .minus(tickUpperFeeGrowthAbove_1);

  // '????(??0)' part of the '???? =??·(????(??1)?????(??0))' formula
  // for both token 0 and token 1
  let feeGrowthInsideLast_0 = new BigNumber(position.feeGrowthInside0LastX128);
  let feeGrowthInsideLast_1 = new BigNumber(position.feeGrowthInside1LastX128);

  // The final calculations for the '???? =??·(????(??1)?????(??0))' uncollected fees formula
  // for both token 0 and token 1 since we now know everything that is needed to compute it
  let uncollectedFees_0 = liquidity
    .multipliedBy(subIn256(fr_t1_0, feeGrowthInsideLast_0))
    .div(Q128);

  let uncollectedFees_1 = liquidity
    .multipliedBy(subIn256(fr_t1_1, feeGrowthInsideLast_1))
    .div(Q128);

  // Decimal adjustment to get final results
  let uncollectedFeesAdjusted_0 = uncollectedFees_0
    .div(Math.pow(10, Number(token0.decimals)))
    .decimalPlaces(Number(token0.decimals), BigNumber.ROUND_DOWN);
  let uncollectedFeesAdjusted_1 = uncollectedFees_1
    .div(Math.pow(10, Number(token1.decimals)))
    .decimalPlaces(Number(token1.decimals), BigNumber.ROUND_DOWN);

  //console.log(`unCollected(\x1b[32m${token0.symbol}\x1b[0m) : \x1b[33m${uncollectedFeesAdjusted_0}\x1b[0m`);
  //console.log(`unCollected(\x1b[32m${token1.symbol}\x1b[0m) : \x1b[33m${uncollectedFeesAdjusted_1}\x1b[0m`)

  return {
    uncollectedFeesAdjusted_0,
    uncollectedFeesAdjusted_1,
  };
}

async function getPositionIdEvents(positionId, blockNumber) {
  try {
    const [mintsData, burnsData, collectDatas] = await Promise.all([
      getPastEvents(positionId, 'IncreaseLiquidity', blockNumber),
      getPastEvents(positionId, 'DecreaseLiquidity', blockNumber),
      getPastEvents(positionId, 'Collect', blockNumber),
    ]);

    const mints_event = mintsData.map((item) => {
      return {
        type: 'mint',
        timestamp: 0,
        blockNumber: item.blockNumber,
        txId: item.transactionHash,
        liquidity: item.returnValues.liquidity,
        amount0: item.returnValues.amount0,
        amount1: item.returnValues.amount1,
      };
    });
    const burns_event = burnsData.map((item) => {
      return {
        type: 'burn',
        timestamp: 0,
        blockNumber: item.blockNumber,
        txId: item.transactionHash,
        liquidity: item.returnValues.liquidity,
        amount0: item.returnValues.amount0,
        amount1: item.returnValues.amount1,
      };
    });
    const collets_event = collectDatas.map((item) => {
      return {
        type: 'collect',
        timestamp: 0,
        blockNumber: item.blockNumber,
        txId: item.transactionHash,
        //liquidity : item.returnValues.liquidity,
        amount0: item.returnValues.amount0,
        amount1: item.returnValues.amount1,
      };
    });

    const events = [...mints_event, ...burns_event, ...collets_event];
    events.sort((a, b) => a.blockNumber - b.blockNumber);

    return events;
  } catch (error) {
    console.log(error);
    return [];
  }
}

//12749478 이 블록번호이전은 multicall{blocknumber} error
function isSameDay(timestamp1, timpstamp2) {
  const date1 = new Date(timestamp1 * 1000).setHours(0, 0, 0, 0);
  const date2 = new Date(timpstamp2 * 1000).setHours(0, 0, 0, 0);
  return date1 === date2;
}

function getReadableDateTime(timestamp) {
  const date = new Date(timestamp * 1000);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  const sec = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hour}:${min}:${sec}`;
}

function getAgeDateTime(timestamp) {
  const curTimestamp = Date.now() / 1000;
  const createAtTime = new Date(timestamp * 1000);
  const diffDays = Math.floor((curTimestamp - timestamp) / 86400);
  const diffHrs = Math.floor((curTimestamp - timestamp) / 3600) % 24;

  const format = new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'long',
    timeStyle: 'medium',
  }).format(createAtTime);

  return `${diffDays} days ${diffHrs} hrs ago(${format}`;
}

async function saveEventsCache(positionId, eventName, events, blockNumber) {
  const cacheFile = `\cacheEvent\\${positionId}_${eventName}`;
  try {
    writeToFile(cacheFile, events, blockNumber);
  } catch (error) {
    console.log(error);
  }
}

async function saveDailyCache(positionId, poolId, blockNumber, datas) {
  const cacheFile = `\cacheDaily\\${positionId}_${poolId}_${blockNumber}`;
  try {
    writeToFile(cacheFile, datas, blockNumber);
  } catch (error) {
    console.log(error);
  }
}

async function loadDailyCache(positionId, poolId, blockNumber) {
  const cacheFile = `\cacheDaily\\${positionId}_${poolId}_${blockNumber}`;
  try {
    let fsData = [];
    if (fs.existsSync(cacheFile)) {
      fsData = await readFromFile(cacheFile);
    }
    fsData = fsData.datas || [];
    return fsData;
  } catch (error) {
    console.log(error);
  }
}

function Green(value) {
  return `\x1b[32m${value}\x1b[0m`;
}
function Red(value) {
  return `\x1b[31m${value}\x1b[0m`;
}

function Yellow(value) {
  return `\x1b[33m${value}\x1b[0m`;
}

function Blue(value) {
  return `\x1b[34m${value}\x1b[0m`;
}

function Cyan(value) {
  return `\x1b[36m${value}\x1b[0m`;
}

function Magenta(value) {
  return `\x1b[35m${value}\x1b[0m`;
}
async function getSummaryReportPosition(positionId, logOut) {
  const web3 = new Web3('https://rpc.ankr.com/eth');
  const lastBlockNumber = (await getLastBlockNumber()) - 1;
  const startTime = process.hrtime();
  const data = await getPositionInfo(positionId);
  let summaryResult = {};

  if (data?.position?.pool) {
    const positionId = data['position'] ? data['position'].id : '';
    const poolId = data['position']['pool'] ? data['position']['pool'].id : '-';
    const poolFee = data['position']['pool'] ? data['position']['pool'].feeTier : '-';
    const token0 = data['position']['token0'] ? data['position'].token0 : {};
    const token1 = data['position']['token1'] ? data['position'].token1 : {};
    const transaction = data['position']['transaction'] ? data['position'].transaction : {};

    const depositedToken0 = data['position'].depositedToken0;
    const depositedToken1 = data['position'].depositedToken1;

    const tickLower = data['position'].tickLower.tickIdx;
    const tickUpper = data['position'].tickUpper.tickIdx;

    const positionOwner = data['position'] ? data['position'].owner : '';
    const checkOrigin = await getMintFromTxId(transaction.id);
    const positionOrigin =
      checkOrigin && checkOrigin['mints'] ? checkOrigin['mints'][0].origin : positionOwner;

    console.log('-'.repeat(60));
    console.log(`ID=${Yellow(positionId)} ${getAgeDateTime(transaction.timestamp)})`);
    console.log(`Owner=${Yellow(positionOwner)}`);
    if (positionOrigin !== positionOwner) {
      console.log(`Origin=${Yellow(positionOrigin)}`);
    }
    console.log(`${token0.symbol}/${token1.symbol} : ${Green(poolId)}(${Yellow(poolFee)})`);
    console.log('-'.repeat(60));

    //Collect
    //DecreaseLiquidity
    //IncreaseLiquidity
    const [mintsData, burnsData, collectDatas] = await Promise.all([
      getPastEvents(positionId, 'IncreaseLiquidity', transaction.blockNumber, lastBlockNumber),
      getPastEvents(positionId, 'DecreaseLiquidity', transaction.blockNumber, lastBlockNumber),
      getPastEvents(positionId, 'Collect', transaction.blockNumber, lastBlockNumber),
    ]);

    const mints_event = mintsData.map((item) => {
      return {
        type: 'mint',
        timestamp: 0,
        blockNumber: item.blockNumber,
        txId: item.transactionHash,
        liquidity: item.returnValues.liquidity,
        amount0: item.returnValues.amount0,
        amount1: item.returnValues.amount1,
      };
    });
    const burns_event = burnsData.map((item) => {
      return {
        type: 'burn',
        timestamp: 0,
        blockNumber: item.blockNumber,
        txId: item.transactionHash,
        liquidity: item.returnValues.liquidity,
        amount0: item.returnValues.amount0,
        amount1: item.returnValues.amount1,
      };
    });
    const collets_event = collectDatas.map((item) => {
      return {
        type: 'collect',
        timestamp: 0,
        blockNumber: item.blockNumber,
        txId: item.transactionHash,
        //liquidity : item.returnValues.liquidity,
        amount0: item.returnValues.amount0,
        amount1: item.returnValues.amount1,
      };
    });

    const events = [...mints_event, ...burns_event, ...collets_event];
    events.sort((a, b) => a.blockNumber - b.blockNumber);

    await Promise.all([
      updateGasTransaction(events), //by web3
      updateTimestampTransaction(events), //by web3
      updatePriceAtBlock(poolId, token0, token1, events), //by web3
    ]);

    //console.log(events)

    let totMintAmount0 = BigNumber(0); //total mint token0
    let totMintAmount1 = BigNumber(0); //total mint token1
    let totDepositedUSD = BigNumber(0); //total mint USD

    let totBurnAmount0 = BigNumber(0); //total burn token0
    let totBurnAmount1 = BigNumber(0); //total burn token1
    let totwithdrawnUSD = BigNumber(0); //totla burn USD

    let totfeeAmount0 = BigNumber(0); //total fee token0
    let totfeeAmount1 = BigNumber(0); //total fee token1
    let totCollectedfeeUSD = BigNumber(0); //total fee USD

    for (i = 0; i < events.length; i++) {
      item = events[i];
      const price0AtBlock = events[i].price0;
      const price1AtBlock = events[i].price1;

      const Amount0 = BigNumber(item.amount0);
      const Amount1 = BigNumber(item.amount1);
      const amountUSD = BigNumber(item.amountUSD);

      const txTime = getReadableDateTime(item.timestamp);
      //console.log(`${token0.symbol}/${token1.symbol} => ${mintAmount0} : ${mintAmount1}`);
      if (item.type == 'burn') {
        totBurnAmount0 = totBurnAmount0.plus(Amount0);
        totBurnAmount1 = totBurnAmount1.plus(Amount1);
        totwithdrawnUSD = totwithdrawnUSD.plus(amountUSD);

        if (logOut) {
          console.log(
            `(${Yellow(item.type)}) ${txTime} ${token0.symbol}(${Yellow(Amount0)}) ${
              token1.symbol
            }(${Yellow(Amount1)})`
          );
          console.log(`${Yellow('withdrawn(USD)')} :${Yellow('$')}${Yellow(amountUSD)}`);
        }
      } else if (item.type === 'mint') {
        totMintAmount0 = totMintAmount0.plus(Amount0);
        totMintAmount1 = totMintAmount1.plus(Amount1);
        totDepositedUSD = totDepositedUSD.plus(amountUSD);

        if (logOut) {
          console.log(
            `(${Green(item.type)}) ${txTime} ${token0.symbol}(${Green(Amount0)}) ${
              token1.symbol
            }(${Green(Amount1)})`
          );
          console.log(`deposited(USD) : ${Green('$')}${Green(amountUSD)}`);
        }
      } else if (item.type === 'collect') {
        totfeeAmount0 = totfeeAmount0.plus(Amount0);
        totfeeAmount1 = totfeeAmount1.plus(Amount1);
        totCollectedfeeUSD = totCollectedfeeUSD.plus(amountUSD);

        if (logOut) {
          console.log(
            `(${Green(item.type)}) ${txTime} ${token0.symbol}(${Green(Amount0)}) ${
              token1.symbol
            }(${Green(Amount1)})`
          );
          console.log(`${Yellow('collectedfee(USD)')} :${Yellow('$')}${Yellow(amountUSD)}`);
        }
      }

      if (logOut) {
        console.log(`price0 = ${Cyan(price0AtBlock)}`);
        console.log(`price1 = ${Cyan(price1AtBlock)}`);

        console.log(`txid = ${item.txId}`);
        console.log('-'.repeat(60));
      }
    }
    let position = data['position'];
    const positionWeb3 = await getPositionInterfaceCalls(positionId, poolId);

    if (positionWeb3) {
      position.pool.liquidity = positionWeb3.pool.liquidity;
      position.pool.sqrtPrice = positionWeb3.pool.sqrtPrice;
      position.pool.tick = positionWeb3.pool.tick;
      position.liquidity = positionWeb3.liquidity;

      position.pool.feeGrowthGlobal0X128 = positionWeb3.pool.feeGrowthGlobal0X128;
      position.pool.feeGrowthGlobal1X128 = positionWeb3.pool.feeGrowthGlobal1X128;
      position.feeGrowthInside0LastX128 = positionWeb3.feeGrowthInside0LastX128;
      position.feeGrowthInside1LastX128 = positionWeb3.feeGrowthInside1LastX128;

      position.tickLower.feeGrowthOutside0X128 = positionWeb3.tickLower.feeGrowthOutside0X128;
      position.tickLower.feeGrowthOutside1X128 = positionWeb3.tickLower.feeGrowthOutside1X128;
      position.tickUpper.feeGrowthOutside1X128 = positionWeb3.tickUpper.feeGrowthOutside1X128;
      position.tickUpper.feeGrowthOutside0X128 = positionWeb3.tickUpper.feeGrowthOutside0X128;

      const price = decodeSqrtRatioX96ByBigNumber(token0, token1, position.pool.sqrtPrice);
      position.pool.token0Price = price.price0;
      position.pool.token1Price = price.price1;
    }

    const tickCurrent = position.pool.tick; //current
    const sqrtX96Price = position.sqrtPrice;
    const token0Price = position.pool.token0Price;
    const token1Price = position.pool.token1Price;

    const unCollectedfee = calcculatePositionFees(position);
    const positionAmount = calculatePositionAmount(position);

    const liquidity0 = BigNumber(positionAmount.token0Balance);
    const liquidity1 = BigNumber(positionAmount.token1Balance);

    const feeAmount0 = BigNumber(unCollectedfee.uncollectedFeesAdjusted_0);
    const feeAmount1 = BigNumber(unCollectedfee.uncollectedFeesAdjusted_1);

    const totBalance_0 = new BigNumber(feeAmount0).plus(liquidity0);
    const totBalance_1 = new BigNumber(feeAmount1).plus(liquidity1);

    let totBalanceUSD = BigNumber(0);
    let mintBasedUSD = BigNumber(0);
    let unCollectedFeeUSD = BigNumber(0);
    let liquidityUSD = BigNumber(0);

    if (STABLE_LISTS.includes(token0.symbol)) {
      totBalanceUSD = totBalanceUSD.plus(totBalance_1).multipliedBy(token0Price).plus(totBalance_0);
      mintBasedUSD = mintBasedUSD
        .plus(totMintAmount1)
        .multipliedBy(token0Price)
        .plus(totMintAmount0);
      unCollectedFeeUSD = unCollectedFeeUSD
        .plus(feeAmount1)
        .multipliedBy(token0Price)
        .plus(feeAmount0);
      liquidityUSD = liquidityUSD.plus(liquidity1).multipliedBy(token0Price).plus(liquidity0);
    } else if (STABLE_LISTS.includes(token1.symbol)) {
      totBalanceUSD = totBalanceUSD.plus(totBalance_0).multipliedBy(token1Price).plus(totBalance_1);
      mintBasedUSD = mintBasedUSD
        .plus(totMintAmount0)
        .multipliedBy(token1Price)
        .plus(totMintAmount1);
      unCollectedFeeUSD = unCollectedFeeUSD
        .plus(feeAmount0)
        .multipliedBy(token1Price)
        .plus(feeAmount1);
      liquidityUSD = liquidityUSD.plus(liquidity0).multipliedBy(token1Price).plus(liquidity1);
    } else if (NATIVE_LISTS.includes(token0.symbol)) {
      // const poolslot = await getPriceAtBlock(POOI_ID_USDCWETH,'latest')
      // const price = decodeSqrtRatioX96ByBigNumber(POOL_TOKEN0_USDC,POOL_TOKEN1_WETH,poolslot.sqrtPriceX96);
      const ethPrice = await getethPriceBySubgraph();

      const token0USD = new BigNumber(ethPrice); //price.price1 is ETH USD
      const token1USD = new BigNumber(token0USD).div(token1Price);
      totBalanceUSD = new BigNumber(totBalance_1)
        .multipliedBy(token1USD)
        .plus(BigNumber(totBalance_0).multipliedBy(token0USD));
      mintBasedUSD = new BigNumber(totMintAmount1)
        .multipliedBy(token1USD)
        .plus(BigNumber(totMintAmount0).multipliedBy(token0USD));
      unCollectedFeeUSD = new BigNumber(feeAmount1)
        .multipliedBy(token1USD)
        .plus(feeAmount0.multipliedBy(token0USD));

      liquidityUSD = new BigNumber(liquidity1)
        .multipliedBy(token1USD)
        .plus(liquidity0.multipliedBy(token0USD));
    } else if (NATIVE_LISTS.includes(token1.symbol)) {
      // const poolslot = await getPriceAtBlock(POOI_ID_USDCWETH,'latest')
      // const price = decodeSqrtRatioX96ByBigNumber(POOL_TOKEN0_USDC,POOL_TOKEN1_WETH,poolslot.sqrtPriceX96);

      const ethPrice = await getethPriceBySubgraph();
      const token1USD = ethPrice; //price.price0 is ETH USD
      const token0USD = new BigNumber(token1USD).div(token0Price);
      totBalanceUSD = new BigNumber(totBalance_0)
        .multipliedBy(token0USD)
        .plus(BigNumber(totBalance_1).multipliedBy(token1USD));
      mintBasedUSD = new BigNumber(totMintAmount0)
        .multipliedBy(token0USD)
        .plus(BigNumber(totMintAmount1).multipliedBy(token1USD));

      unCollectedFeeUSD = new BigNumber(feeAmount0)
        .multipliedBy(token0USD)
        .plus(feeAmount1.multipliedBy(token1USD));

      liquidityUSD = new BigNumber(liquidity0)
        .multipliedBy(token0USD)
        .plus(liquidity1.multipliedBy(token1USD));

      // console.log(price.price0.toString(),price.price1.toString())
      // console.log(`token0USD ${token0USD}`);
      // console.log(`token1USD ${token1USD}`);
    }

    const priceInRange =
      Number(tickLower) < Number(tickCurrent) && Number(tickCurrent) < Number(tickUpper);

    if (logOut) {
      console.log(`CurrentTick(${Yellow(tickCurrent)}) : ${tickLower} ~ ${tickUpper}`);
      if (!priceInRange) {
        console.log(`\x1b[35mTick out of range so you can't any more earn fee\x1b[0m`);
      }
      console.log(`price0 = ${Green(token0Price)}`);
      console.log(`price1 = ${Green(token1Price)}`);

      console.log('-'.repeat(60));
      console.log(`deposited(${token0.symbol}) = ${Green(totMintAmount0)}`);
      console.log(`deposited(${token1.symbol}) = ${Green(totMintAmount1)}`);
      console.log(Green(`deposited(USD) : $${totDepositedUSD}`));

      console.log(`withdrawn(${token0.symbol}) = ${totBurnAmount0}`);
      console.log(`withdrawn(${token1.symbol}) = ${totBurnAmount1}`);
      console.log(Yellow(`withdrawn(USD) : $${totwithdrawnUSD}`));
      console.log(`collectedFees(${token0.symbol}) = ${totfeeAmount0}`);
      console.log(`collectedFees(${token1.symbol}) = ${totfeeAmount1}`);
      console.log(Yellow(`collectedFees(USD) : $${totCollectedfeeUSD}`));
      console.log('-'.repeat(60));

      console.log(`liquidity(${token0.symbol}) : ${Yellow(positionAmount.token0Balance)}`);
      console.log(`liquidity(${token1.symbol}) : ${Yellow(positionAmount.token1Balance)}`);
      console.log(
        `unCollected(${token0.symbol}) : ${Yellow(unCollectedfee.uncollectedFeesAdjusted_0)}`
      );
      console.log(
        `unCollected(${token1.symbol}) : ${Yellow(unCollectedfee.uncollectedFeesAdjusted_1)}`
      );
      console.log(`TotBalance(${token0.symbol}) = ${Green(totBalance_0)}`);
      console.log(`TotBalance(${token1.symbol}) = ${Green(totBalance_1)}`);
      console.log(Green(`Balance(USD) = $${totBalanceUSD.toFixed(6)}`));
      console.log('-'.repeat(60));
    }
    ///RealProfit

    // RealProfit = OutAmountUSD - totAmountUSD/totAmountUSD
    let totOutAmountUSD = BigNumber(totwithdrawnUSD).plus(totCollectedfeeUSD).plus(totBalanceUSD);

    const realProfit = new BigNumber(totOutAmountUSD)
      .minus(totDepositedUSD)
      .div(totDepositedUSD)
      .multipliedBy(100);

    //HoldProfit
    const holdProfit = new BigNumber(mintBasedUSD)
      .minus(totDepositedUSD)
      .div(totDepositedUSD)
      .multipliedBy(100);

    //console.log(`(${positionId}=${totwithdrawnUSD},${totCollectedfeeUSD},${totBalanceUSD},${totDepositedUSD}`)

    console.log(`(${positionId})Real-Profit(%) =  ${Red(realProfit.toFixed(4))}`);
    console.log(`(${positionId})Hold-Profit(%) =  ${Red(holdProfit.toFixed(4))}`);
    //console.log(`Impermanent(%) =  \x1b[36m${impermanetLoss.toFixed(4)}%\x1b[0m`)
    token0.id = web3.utils.toChecksumAddress(token0.id);
    token1.id = web3.utils.toChecksumAddress(token1.id);

    const sqrtRatioX96AtLowerTick = TickMath.getSqrtRatioAtTick(Number(tickLower));
    const sqrtRatioX96AtUpperTick = TickMath.getSqrtRatioAtTick(Number(tickUpper));
    const priceAtLowTick = decodeSqrtRatioX96ByBigNumber(token0, token1, sqrtRatioX96AtLowerTick);
    const priceAtUpperTick = decodeSqrtRatioX96ByBigNumber(token0, token1, sqrtRatioX96AtUpperTick);
    // console.log(`${tickLower} , ${priceAtLowTick.price0} , ${priceAtLowTick.price1} `)
    // console.log(`${tickUpper} , ${priceAtUpperTick.price0} , ${priceAtUpperTick.price1} `)

    summaryResult.nftId = positionId;
    summaryResult.owner = positionOwner;
    summaryResult.createdTimestamp = transaction.timestamp;
    summaryResult.poolId = poolId;
    summaryResult.poolFee = poolFee;
    summaryResult.token0 = token0;
    summaryResult.token1 = token1;

    summaryResult.priceInRange = priceInRange;

    summaryResult.tick = position.tickCurrent;
    summaryResult.tickPrice0 = token0Price;
    summaryResult.tickPrice1 = token1Price;

    summaryResult.tickUpper = tickUpper;
    summaryResult.tickUpperPrice0 = priceAtUpperTick.price0;
    summaryResult.tickUpperPrice1 = priceAtUpperTick.price1;

    summaryResult.tickLower = tickLower;
    summaryResult.tickLowerPrice0 = priceAtLowTick.price0;
    summaryResult.tickLowerPrice1 = priceAtLowTick.price1;

    summaryResult.deposited0 = totMintAmount0.toString();
    summaryResult.deposited1 = totMintAmount1.toString();
    summaryResult.totDepositedUSD = totDepositedUSD.toFixed(6);

    summaryResult.withdrawn0 = totBurnAmount0.toString();
    summaryResult.withdrawn1 = totBurnAmount1.toString();
    summaryResult.totWithdrawnUSD = totwithdrawnUSD.toFixed(6);

    summaryResult.collectedfee0 = totfeeAmount0.toString();
    summaryResult.collectedfee1 = totfeeAmount1.toString();
    summaryResult.totCollectedfeeUSD = totCollectedfeeUSD.toFixed(6);

    summaryResult.liquidityToken0 = liquidity0.toString();
    summaryResult.liquidityToken1 = liquidity1.toString();
    summaryResult.liquidityUSD = liquidityUSD.toFixed(6);

    summaryResult.unCollectedfee0 = feeAmount0.toString();
    summaryResult.unCollectedfee1 = feeAmount1.toString();
    summaryResult.curFeeAmountUSD = unCollectedFeeUSD.toFixed(6);

    summaryResult.totBalance0 = totBalance_0.toString();
    summaryResult.totBalance1 = totBalance_1.toString();
    summaryResult.totBalanceUSD = totBalanceUSD.toFixed(6);

    summaryResult.realProfit = realProfit.toFixed(4);
    summaryResult.holdProfit = holdProfit.toFixed(4);

    console.log('-'.repeat(60));
    const endTime = process.hrtime(startTime);
    console.log(`(${positionId})Execution time: ${endTime[0]}s ${endTime[1] / 1000000}ms`);
    //return summaryResult;
    //--
    // resForm :TSummaryItem
    let resForm = {
      tokenId: positionId,
      poolId: poolId,
      pollFeeTier: poolFee,
      timestamp: transaction.timestamp,
      // amount
      totalOutAmountUSD: totOutAmountUSD,
      totalDepositedUSD: totDepositedUSD,
      // symbol
      symbol0: token0.symbol,
      symbol1: token1.symbol,

      // token0,1 address
      token0address: token0.id,
      token1address: token1.id,

      //
      tick: tickCurrent,
      tickPrice0: token0Price,
      tickPrice1: token1Price,

      tickUpper: tickUpper,
      // tickUpperPrice0: priceAtUpperTick.price0,
      tickUpperPrice0:
        priceAtLowTick.price0 < priceAtUpperTick.price0
          ? priceAtUpperTick.price0
          : priceAtLowTick.price0,
      // tickUpperPrice1: priceAtUpperTick.price1,
      tickUpperPrice1:
        priceAtLowTick.price1 < priceAtUpperTick.price1
          ? priceAtUpperTick.price1
          : priceAtLowTick.price1,
      tickLower: tickLower,
      // tickLowerPrice0: priceAtLowTick.price0,
      tickLowerPrice0:
        priceAtLowTick.price0 > priceAtUpperTick.price0
          ? priceAtUpperTick.price0
          : priceAtLowTick.price0,
      // tickLowerPrice1: priceAtLowTick.price1,
      tickLowerPrice1:
        priceAtLowTick.price1 > priceAtUpperTick.price1
          ? priceAtUpperTick.price1
          : priceAtLowTick.price1,

      //
      deposited0: totMintAmount0.toString(),
      deposited1: totMintAmount1.toString(),
      totDepositedUSD: totDepositedUSD.toString(),

      withdrawn0: totBurnAmount0.toString(),
      withdrawn1: totBurnAmount1.toString(),
      totWithdrawnUSD: totwithdrawnUSD.toString(),

      collectedfee0: totfeeAmount0.toString(),
      collectedfee1: totfeeAmount1.toString(),
      totCollectedfeeUSD: totCollectedfeeUSD.toString(),

      liquidityToken0: liquidity0.toString(),
      liquidityToken1: liquidity1.toString(),
      liquidityUSD: liquidityUSD.toFixed(6),
      // liquidityUSD: curMintAmountUSD.toString(),

      unCollectedfee0: feeAmount0.toString(),
      unCollectedfee1: feeAmount1.toString(),
      curFeeAmountUSD: unCollectedFeeUSD.toString(),

      // balance
      token0TotalBalance: totBalance_0.toString(),
      token1TotalBalance: totBalance_1.toString(),
      // totalBalance(USD)
      totalBalanceUSD: totBalanceUSD.toString(),
      // profit
      realProfit: realProfit.toFixed(4),
      holdProfit: holdProfit.toFixed(4),
      realProfitUSD: totOutAmountUSD.minus(totDepositedUSD).toFixed(4),
      holdProfitUSD: mintBasedUSD.minus(totDepositedUSD).toFixed(4),
      // history
      history: events,
      inRange: priceInRange,
    };

    if (Number(resForm.totalBalanceUSD) > 0 && Number(resForm.totalDepositedUSD) > 0) {
      return resForm;
    } else {
      return {};
    }
    //!--
  } else {
    console.log(`Red(${positionId}) getPositionInfo failed)`);
    return {};
  }
}

function chunkArray(array, chunkSize) {
  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
}

async function liqudityNotZero(tokenIds) {
  const provider = getNextProvider();
  const web3 = new Web3(provider);
  web3.eth.handleRevert = true;

  const NFTpositionManager = new web3.eth.Contract(NFT_PM_ABI, NFT_PM_ADDR);

  try {
    const outputs = [
      { name: 'nonce', type: 'uint96' },
      { name: 'operator', type: 'address' },
      { name: 'token0', type: 'address' },
      { name: 'token1', type: 'address' },
      { name: 'fee', type: 'uint24' },
      { name: 'tickLower', type: 'int24' },
      { name: 'tickUpper', type: 'int24' },
      { name: 'liquidity', type: 'uint128' },
      { name: 'feeGrowthInside0LastX128', type: 'uint256' },
      { name: 'feeGrowthInside1LastX128', type: 'uint256' },
      { name: 'tokensOwed0', type: 'uint128' },
      { name: 'tokensOwed1', type: 'uint128' },
    ];

    const calls = tokenIds.map((tokenId) => [
      NFT_PM_ADDR,
      50000,
      NFTpositionManager.methods.positions(tokenId).encodeABI(),
    ]);

    const results = await UniswapInterfaceCalls(calls);
    const positions = results[1].map((result) =>
      web3.eth.abi.decodeParameters(outputs, result.returnData)
    );
    return positions;
  } catch (error) {
    console.log(Red('liqudityNotZero error'), error);
  }
}

async function getAllsummaryReportByAddress(owner, ids) {
  try {
    const pageSize = 100;
    let pageIndex = 0; //default..

    const startTime = process.hrtime();
    let Ids = ids;

    const pagedIds = chunkArray(Ids, pageSize); // pageSize = 10
    if (pageIndex >= pagedIds.length) {
      pageIndex = pagedIds.length - 1;
    }
    console.log('pageIds:', pagedIds);
    const promises = pagedIds[pageIndex].map((id) => getSummaryReportPosition(id, false));
    const summaries = await Promise.all(promises);
    const endTime = process.hrtime(startTime);
    console.log(`(${owner}=${Ids.length})Execution time: ${endTime[0]}s ${endTime[1] / 1000000}ms`);

    // remove empty object
    const filteredArr = summaries.filter((obj) => Object.keys(obj).length !== 0);

    return filteredArr;
  } catch (error) {
    console.log('error :', error);
    return [];
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function decodeSqrtRatioX96ByJSBI(sqrtPriceX96) {
  const Q32 = JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(32));
  const Q96 = JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(96));
  const Q192 = JSBI.exponentiate(JSBI.BigInt(Q96), JSBI.BigInt(2));

  const sqrtX96 = JSBI.BigInt(sqrtPriceX96);

  const d18sqrtX96 = JSBI.multiply(
    JSBI.multiply(sqrtX96, sqrtX96),
    JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18))
  );
  const d18Q192 = JSBI.multiply(Q192, JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18)));

  const token0 = JSBI.divide(d18sqrtX96, Q192);
  const token1 = JSBI.divide(d18Q192, JSBI.multiply(sqrtX96, sqrtX96));
  console.log('JSBI', token0.toString(), token1.toString());
  return { token0, token1 };
}

function getTickFromPrice(price, token0Decimal, token1Decimal) {
  const token0 = expandDecimals(price, Number(token0Decimal));
  const token1 = expandDecimals(1, Number(token1Decimal));
  const sqrtPrice = encodeSqrtPriceX96(token1).div(encodeSqrtPriceX96(token0));

  return Math.log(sqrtPrice.toNumber()) / Math.log(Math.sqrt(1.0001));
}

function encodeSqrtPriceX96(price) {
  return new BigNumber(price).sqrt().multipliedBy(Q96).integerValue(3);
}

function getSqrtPriceX96(price, token0Decimal, token1Decimal) {
  const token0 = new BigNumber(1).times(10, token0Decimal);
  const token1 = new BigNumber(price).times(10, token1Decimal);

  return token0.div(token1).sqrt().multipliedBy(Q96);
}

function decodeSqrtRatioX96ByBigNumber(tokenA, tokenB, sqrtPriceX96) {
  BigNumber.config({ EXPONENTIAL_AT: 999999, DECIMAL_PLACES: 18 });

  const token0 = BigNumber(tokenA.address) < BigNumber(tokenB.address) ? tokenB : tokenA;
  const token1 = BigNumber(tokenA.address) < BigNumber(tokenB.address) ? tokenA : tokenB;

  const B_192 = new BigNumber(2).exponentiatedBy(192);
  const sqrtX96 = new BigNumber(sqrtPriceX96);
  const price0decimals = BigNumber(token0.decimals - token1.decimals);
  const price1decimals = BigNumber(token1.decimals - token0.decimals);

  // const price0 =B_192
  //     .times(BigNumber(10).exponentiatedBy(price1decimals))
  //     .div(sqrtX96.exponentiatedBy(2));

  // const price1 =BigNumber(sqrtX96)
  //     .exponentiatedBy(2)
  //     .div(B_192)
  //     .times(BigNumber(10).exponentiatedBy(price0decimals))

  const price1 = new BigNumber(
    (sqrtPriceX96 ** 2 / JSBI.toNumber(Q192)) * 10 ** (token0.decimals - token1.decimals)
  );
  const price0 = new BigNumber(
    (JSBI.toNumber(Q192) * 10 ** (token1.decimals - token0.decimals)) / sqrtPriceX96 ** 2
  );

  // console.log(`${token0.symbol}/${token1.symbol} = ${price0.toString()}`);
  // console.log(`${token1.symbol}/${token0.symbol} = ${price1.toString()}`);
  return { price0, price1 };
}

function _isSwapLog(log) {
  return (
    log.topics[0] == SWAP_SIGNATURE && log.topics.length == 3 // index 0 is the signature, and then 2 indexed topics
  );
}

function _isBurnLog(log) {
  return (
    log.topics[0] == BURN_SIGNATURE && log.topics.length == 4 // index 0 is the signature, and then 3 indexed topics
  );
}

function _isCollectLog(log) {
  return (
    log.topics[0] == COLLECT_SIGNATURE && log.topics.length == 4 // index 0 is the signature, and then 3 indexed topics
  );
}

function _isMintLog(log) {
  return (
    log.topics[0] == MINT_SIGNATURE && log.topics.length == 4 // index 0 is the signature, and then 3 indexed topics
  );
}

function _isFlashLog(log) {
  return (
    log.topics[0] == FLASH_SIGNATURE && log.topics.length == 3 // index 0 is the signature, and then 3 indexed topics
  );
}

async function getApiKeyValidTest() {
  try {
    for (let i = 0; i < providers.length; i++) {
      console.log(`Current = ${providers[providersIndex]}`);
      await getPastEvents('453844', 'Transfer');
      //const nextProvider = getNextProvider();
      //console.log(collectDatas)
    }
  } catch (error) {
    console.log('error', providers[providersIndex]);
  }
}

async function getLastBlockNumber() {
  const provider = getNextfastProvider();
  const web3 = new Web3(provider);
  try {
    //const startTime =process.hrtime();
    const lastBlockNumber = await web3.eth.getBlockNumber();
    //const endTime =process.hrtime(startTime);
    //console.log(`Execution time: \x1b[33m ${endTime[0]}s \x1b[0m \x1b[33m ${endTime[1] / 1000000}ms \x1b[0m`);
    return lastBlockNumber;
  } catch (error) {
    console.log(error);
    return 'latest';
  }
}

//--
module.exports = {
  getSummaryReportPosition: getSummaryReportPosition,
  getAllsummaryReportByAddress: getAllsummaryReportByAddress,
};
