/* eslint-disable @next/next/no-img-element */
import { useAppSelector } from "@hooks";
import { selectLpData } from "@store";
import { LpAnalyze } from "interfaces/interface";
import { FunctionComponent } from "react";
import {
  convertUnit,
  getInRange,
  getLiquidity,
  getProfit,
  getSymbol,
} from "../assetlist/utils";
import { Row } from "./row";

type ProfitDetailProps = {
  selectedIndex: number;
};

const ProfitDetail: FunctionComponent<ProfitDetailProps> = (
  Props: ProfitDetailProps
) => {
  const { selectedIndex } = Props;
  const lpData: LpAnalyze = useAppSelector(selectLpData);
  const data = lpData?.items[selectedIndex];
  return (
    <div className="pb-4 font-['TT-Commons']">
      <Row
        titleData={["LP Pair", "Range", "Current Price", "Position"]}
        subTitleData={[
          getSymbol(`${data?.symbol0}`) + " / " + getSymbol(`${data?.symbol1}`),
          convertUnit(data?.tickLowerPrice0, 3) +
            "<->" +
            convertUnit(data?.tickUpperPrice0, 3),
          "$" + convertUnit(data?.tickPrice0, 3),
          getInRange(data?.inRange),
        ]}
        token0Addr={data?.token0address}
        token1Addr={data?.token1address}
      />
      <Row
        titleData={[
          "Initial Liquidity",
          "Current Liquidity",
          "Real Profit",
          "Hold Profit",
        ]}
        subTitleData={[
          getLiquidity(data?.totDepositedUSD),
          getLiquidity(data?.totalOutAmountUSD),
          getLiquidity(data?.realProfitUSD),
          getLiquidity(data?.holdProfitUSD),
        ]}
      />
      <Row
        titleData={[
          "Unclaimed Fees",
          "Claimed Fees",
          "Total Fees",
          "Total Fee Profit",
        ]}
        subTitleData={[
          getLiquidity(data?.curFeeAmountUSD),
          getLiquidity(data?.totCollectedfeeUSD),
          getLiquidity(
            (
              Number(data?.curFeeAmountUSD) + Number(data?.totCollectedfeeUSD)
            ).toString()
          ),
          getProfit(
            ((Number(data?.curFeeAmountUSD) +
              Number(data?.totCollectedfeeUSD)) /
              Number(data?.totalOutAmountUSD)) *
              100,
            false
          ),
        ]}
      />
    </div>
  );
};

export default ProfitDetail;
