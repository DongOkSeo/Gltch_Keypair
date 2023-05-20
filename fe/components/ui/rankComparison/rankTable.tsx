import { TOKEN_IMAGE_URL } from "@constants";
import { LpComparison } from "interfaces/interface";
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
import { INDEX_COLOR } from "./utils";
import { useAppSelector } from "@hooks";
import { TbArrowsExchange2 } from "react-icons/tb";

type RankTableProps = {
  currentAssets: LpComparison[];
  myRank: number;
};

const RankTable: FunctionComponent<RankTableProps> = ({
  currentAssets,
  myRank,
}) => {
  const [isRange, setIsRange] = useState<Array<Boolean>>(
    currentAssets?.map(() => true)
  );

  return (
    <>
      {currentAssets?.map((asset, index) => {
        return (
          <th
            scope="row"
            key={index}
            className={`w-full mt-5 flex font-bold text-lg rounded-xl bg-[#fcfcfc] shadow-sm font-['TT-Commons'] `}
          >
            <div className="w-[40px] flex relative">
              <div
                className={`h-[76px] w-1 self-center`}
                style={{
                  backgroundColor: INDEX_COLOR[index],
                  borderRadius: 10,
                }}
              />
              {/* {inputAddress && isRankPos ? ( */}
              {myRank === index ? (
                <div className="w-[130px] text-center absolute px-2 mt-[1px] ml-[50px] border border-[#ff6acc] rounded-full bg-walletAddress text-sm text-[#ff6acc]">
                  My Position
                </div>
              ) : (
                <></>
              )}
              <div className="w-[40px] h-full absolute text-base flex items-center justify-center">
                {index + 1}
              </div>
            </div>
            <div className="w-3/12 h-24 my-auto flex items-center whitespace-nowrap">
              <div className="ml-3 relative flex">
                <div className="w-12 h-12 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full  overflow-hidden">
                    <img
                      src={`${TOKEN_IMAGE_URL}${asset?.token0Id}/logo.png`}
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
                      src={`${TOKEN_IMAGE_URL}${asset?.token1Id}/logo.png`}
                      className="object-contain"
                      alt="LP_Scanner"
                      onLoad={onLoadEvent}
                      onError={onErrorEvent}
                    />
                  </div>
                </div>
              </div>
              <div>
                <div className="pt-[4px] ml-8 text-2xl">
                  {getSymbol(asset?.token0Symbol) +
                    " / " +
                    getSymbol(asset?.token1Symbol)}
                </div>
                <div className="ml-8 text-base text-gray-500">
                  {asset &&
                    asset?.poolId.substring(0, 4) +
                      "..." +
                      asset?.poolId.slice(-4)}
                </div>
              </div>
            </div>

            <div className="w-4/12 flex">
              <div className="flex w-full items-center">
                <div className="w-full flex items-center">
                  <div className={`flex w-full`}>
                    <div className="w-[44%] text-center text-xl">
                      $
                      {convertUnit(
                        isRange[index]
                          ? asset?.tickLowerPrice0
                          : asset?.tickLowerPrice1
                      )}
                      <div className="text-sm text-gray-500">
                        {getSymbol(
                          isRange[index]
                            ? asset?.token0Symbol
                            : asset?.token1Symbol
                        ) +
                          " / " +
                          getSymbol(
                            isRange[index]
                              ? asset?.token1Symbol
                              : asset?.token0Symbol
                          )}
                      </div>
                    </div>

                    {/* <div className="w-[12%] text-center text-gray-400 my-auto">{`< - >`}</div> */}
                    <button
                      className="w-[12%] flex justify-center text-gray-400 my-auto border border-gray-300 rounded-full"
                      onClick={() => {
                        setIsRange((prevState) => {
                          const newState = [...prevState];
                          newState[index] = !newState[index];
                          return newState;
                        });
                      }}
                    >
                      <TbArrowsExchange2 />
                    </button>
                    <div className="w-[44%] text-center text-xl">
                      $
                      {convertUnit(
                        isRange[index]
                          ? asset?.tickUpperPrice0
                          : asset?.tickUpperPrice1
                      )}
                      <div className="text-sm text-gray-500">
                        {getSymbol(
                          isRange[index]
                            ? asset?.token0Symbol
                            : asset?.token1Symbol
                        ) +
                          " / " +
                          getSymbol(
                            isRange[index]
                              ? asset?.token1Symbol
                              : asset?.token0Symbol
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-2/12 flex items-center ">
              <div
                className={`w-full text-center ${getProfitColor(
                  asset?.realProfit
                )}`}
              >
                {getProfit(asset?.realProfit, false)}
              </div>
            </div>
            <div className={`w-2/12 flex items-center `}>
              <div className="w-full text-center">
                {getLiquidity(asset?.totDepositedUSD?.toString())}
              </div>
            </div>
            <div
              className={`w-1/12 flex items-center `}
              style={{
                color: INDEX_COLOR[index],
              }}
            >
              <div className="w-full text-center">
                {`${calcPeriod(asset?.createdTimestamp)} Days`}
              </div>
            </div>
          </th>
        );
      })}
    </>
  );
};

export default RankTable;
