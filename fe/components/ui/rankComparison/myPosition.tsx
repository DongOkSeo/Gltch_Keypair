import { TOKEN_IMAGE_URL } from "@constants";
import { useAppSelector } from "@hooks";
import { selectLpData } from "@store";
import { LpAnalyze } from "interfaces/interface";
import { FunctionComponent, useState } from "react";
import {
  calcPeriod,
  convertUnit,
  getLiquidity,
  getProfit,
  getProfitColor,
  getSymbol,
  onErrorEvent,
  onLoadEvent,
} from "../assetlist/utils";
import { TbArrowsExchange2 } from "react-icons/tb";

type MyPositionProps = {
  selectedIndex: number;
  myRank: number;
};

const MyPosition: FunctionComponent<MyPositionProps> = (
  Props: MyPositionProps
) => {
  const { selectedIndex, myRank } = Props;
  const lpData: LpAnalyze = useAppSelector(selectLpData);
  const myAsset = lpData?.items[selectedIndex];

  const [isRange, setIsRange] = useState<Boolean>(true);

  return (
    <th className="w-full h-32 mt-5 text-lg flex items-center justify-center bg-white font-bold rounded-xl shadow-sm font-['TT-Commons']">
      <div className="h-full flex relative z-20">
        <div className="w-[120px] text-center absolute px-2 mt-[6px] ml-[50px] border border-[#ff6acc] rounded-full bg-walletAddress text-sm text-[#ff6acc] z-30">
          My Position
        </div>
        <div className="w-[40px] text-xl flex items-center justify-center">
          {`${myRank > 0 && myRank < 6 ? myRank : ""}`}
        </div>
      </div>
      <div className="w-3/12 h-24 flex items-center whitespace-nowrap relative">
        <div className="ml-3 relative flex">
          <div className="w-12 h-12 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full  overflow-hidden">
              <img
                src={`${TOKEN_IMAGE_URL}${myAsset?.token0address}/logo.png`}
                className="mr-3 h-10"
                alt="LP_Scanner"
                onLoad={onLoadEvent}
                onError={onErrorEvent}
              />
            </div>
          </div>
          <div className="w-12 h-12 ml-6 absolute flex items-center justify-center">
            <div className="w-10 h-10 rounded-full  overflow-hidden">
              <img
                src={`${TOKEN_IMAGE_URL}${myAsset?.token1address}/logo.png`}
                className="object-contain"
                alt="LP_Scanner"
                onLoad={onLoadEvent}
                onError={onErrorEvent}
              />
            </div>
          </div>
        </div>
        <div>
          <div className="pt-[4px] ml-7 text-2xl">
            {getSymbol(myAsset?.symbol0) + " / " + getSymbol(myAsset?.symbol1)}
          </div>
          <div className="ml-7 text-base text-gray-500">
            {myAsset &&
              myAsset?.poolId.substring(0, 4) +
                "..." +
                myAsset?.poolId.slice(-4)}
          </div>
        </div>
      </div>
      <div className="w-4/12 flex items-center">
        <div className="flex w-full items-center">
          <div className="flex w-full">
            <div className={`flex w-full`}>
              <div className="w-[44%] text-center text-xl">
                $
                {convertUnit(
                  isRange ? myAsset?.tickLowerPrice0 : myAsset?.tickLowerPrice1
                )}
                <div className="text-sm text-gray-500">
                  {getSymbol(isRange ? myAsset?.symbol0 : myAsset?.symbol1) +
                    " / " +
                    getSymbol(isRange ? myAsset?.symbol1 : myAsset?.symbol0)}
                </div>
              </div>
              <button
                className="w-[12%] flex justify-center text-gray-400 my-auto border border-gray-300 rounded-full"
                onClick={() => {
                  setIsRange(!isRange);
                }}
              >
                <TbArrowsExchange2 />
              </button>
              <div className="w-[44%] text-center text-xl">
                $
                {convertUnit(
                  isRange ? myAsset?.tickUpperPrice0 : myAsset?.tickUpperPrice1
                )}
                <div className="text-sm text-gray-500">
                  {getSymbol(isRange ? myAsset?.symbol0 : myAsset?.symbol1) +
                    " / " +
                    getSymbol(isRange ? myAsset?.symbol1 : myAsset?.symbol0)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-2/12 flex items-center ">
        <div
          className={`w-full text-center ${getProfitColor(
            myAsset?.realProfit
          )}`}
        >
          {getProfit(myAsset?.realProfit, false)}
        </div>
      </div>
      <div className={`w-2/12 flex items-center `}>
        <div className="w-full text-center">
          {getLiquidity(myAsset?.totDepositedUSD)}
        </div>
      </div>
      <div className={`w-1/12 flex items-center `}>
        <div className="w-full text-center">
          {`${calcPeriod(myAsset?.timestamp)} Days`}
        </div>
      </div>
    </th>
  );
};

export default MyPosition;
