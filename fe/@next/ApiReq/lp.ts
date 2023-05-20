import { OffChainOracleAbi, INFURA_KEY } from "@constants";
import { LpData } from "interfaces/interface";
import Web3 from "web3";

const web3 = new Web3(`https://mainnet.infura.io/v3/${INFURA_KEY}`);

export async function getLiquidityPool(address: string) {
  const offChainOracleAddress = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";
  const offChainOracleContract = new web3.eth.Contract(
    JSON.parse(OffChainOracleAbi),
    offChainOracleAddress
  );
  try {
    const ret: LpData[] = [];
    const rate = await offChainOracleContract.methods.balanceOf(address).call();

    for (let i = 0; i < rate; i++) {
      const index = await offChainOracleContract.methods
        .tokenOfOwnerByIndex(address, i)
        .call();
      const base64Encode = await offChainOracleContract.methods
        .tokenURI(index)
        .call();
      const base64Data = base64Encode.split(",")[1];
      const decodedData = window.atob(base64Data);
      const rowName = decodedData.split(",")[0];
      const name = rowName.slice(1);
      const nameValue = name.split(`"`)[3];
      const namePair = nameValue.split("-")[2];

      // const encodeSplitData = decodedData.split("image")[2];
      // const encodeData = encodeSplitData.split(",")[1].slice(0, -2);

      const encodeSplitData = decodedData.split(`"image": "`)[1];
      const encodeSplitData2 = encodeSplitData.slice(0, -2);

      // const decodedData2 = window.atob(encodeData);

      const res = await offChainOracleContract.methods.positions(index).call();
      //https://docs.uniswap.org/contracts/v3/reference/periphery/interfaces/INonfungiblePositionManager
      ret.push({
        owner: address, //NFT 소유자 주소
        index: rate, //NFT 번호
        name: nameValue.split(" - ")[2], // NFT
        feePercent: nameValue.split(" - ")[1], // 수수료 퍼센트
        nonce: res.nonce, // Nonce
        operator: res.operator, // 지출이 허용된 주소
        token0: (res?.token0 as string).toLowerCase(), // 포지션 1
        token1: (res?.token1 as string).toLowerCase(), // 포지션 2
        fee: res.fee, //수수료, 1,000,000 =  100%,
        tickLower: res.tickLower, // 자산의 최소값
        tickUpper: res.tickUpper, // 자산의 최대값
        liquidity: res.liquidity, // 유동성
        feeGrowthInside0LastX128: res.feeGrowthInside0LastX128, //특정 틱 범위에서 수집된 토큰0의 수수료 총액
        feeGrowthInside1LastX128: res.feeGrowthInside1LastX128, //특정 틱 범위에서 수집된 토큰1의 수수료 총액
        tokensOwed0: res.tokensOwed0, // 마지막 계산 시점의 위치에서 토큰0 수수료 미수금
        tokensOwed1: res.tokensOwed1, // 마지막 계산 시점의 위치에서 토큰1 수수료 미수금

        // image: decodedData2, // 이미지 svg값

        image: encodeSplitData2, // 이미지 base64 encoding 값
      });
    }

    return ret;
  } catch (e) {
    console.log("get liquidity pool error: ", e);
  }
}
