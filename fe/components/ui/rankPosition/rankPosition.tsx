/* eslint-disable @next/next/no-img-element */

import { TOKEN_IMAGE_URL } from "@constants";
import { useAppSelector } from "@hooks";
import { selectLpData } from "@store";
import { LpAnalyze } from "interfaces/interface";
import { FunctionComponent, useMemo, useState } from "react";
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

type RankPositionProps = {
  selectedIndex: number;
};

const RankPosition: FunctionComponent<RankPositionProps> = (
  Props: RankPositionProps
) => {
  const { selectedIndex } = Props;
  const lpData: LpAnalyze = useAppSelector(selectLpData);
  const investmentPeriod = useMemo(
    () => calcPeriod(Number(lpData?.items[selectedIndex]?.timestamp)),
    [lpData]
  );

  const [isRange, setIsRange] = useState<Boolean>(true);

  return (
    <>
      <div className="mt-6 font-['TT-Commons']">
        <div className="w-full rounded-md">
          <div className="relative overflow-x-auto">
            <div className="p-[22px] rounded-2xl bg-[#f6f6f6]">
              <div className="font-bold text-2xl mb-6">My Position</div>
              <table className="w-full rounded-2xl text-sm text-left dark:text-gray-400">
                <thead className="text-xs rounded-2xl dark:bg-gray-500 dark:text-gray-400">
                  <tr className="text-lg font-bold text-black bg-[#ececec]">
                    <th
                      scope="col"
                      className="w-3/12 ml-20 px-6 py-3 rounded-l-xl"
                    >
                      LP Pair
                    </th>
                    <th scope="col" className="w-3/12 text-center py-3">
                      Range
                    </th>
                    <th scope="col" className="w-2/12 text-center py-3">
                      Profit
                    </th>
                    <th scope="col" className="w-2/12 text-center py-3">
                      Initial Liquidity
                    </th>
                    <th
                      scope="col"
                      className="w-2/12 text-center py-3 rounded-r-xl"
                    >
                      Investment Period
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <>
                    <tr>
                      <td
                        colSpan={5}
                        className="dark:bg-gray-800 dark:border-gray-700 font-['TT-Commons']"
                      >
                        <th
                          scope="row"
                          className="flex w-full  mt-5 rounded-2xl bg-white font-bold text-xl"
                        >
                          <div className="w-3/12 h-24 px-6 font-bold text-base flex items-center whitespace-nowrap dark:text-white">
                            <div className="w-12 h-12 flex items-center justify-center">
                              <div className="w-10 h-10 rounded-full  overflow-hidden">
                                <img
                                  src={`${TOKEN_IMAGE_URL}${lpData?.items[selectedIndex]?.token0address}/logo.png`}
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
                                  src={`${TOKEN_IMAGE_URL}${lpData?.items[selectedIndex]?.token1address}/logo.png`}
                                  className="object-contain"
                                  alt="LP_Scanner"
                                  onLoad={onLoadEvent}
                                  onError={onErrorEvent}
                                />
                              </div>
                            </div>

                            <div className="ml-6 text-3xl flex items-center">
                              {getSymbol(
                                lpData?.items[selectedIndex]?.symbol0
                              ) +
                                " / " +
                                getSymbol(
                                  lpData?.items[selectedIndex]?.symbol1
                                )}
                            </div>
                          </div>
                          <div className="w-3/12 flex items-center justify-center">
                            <div className="w-[44%] text-black text-center text-xl">
                              $
                              {convertUnit(
                                isRange
                                  ? lpData?.items[selectedIndex]
                                      ?.tickLowerPrice0
                                  : lpData?.items[selectedIndex]
                                      ?.tickLowerPrice1
                              )}
                              <div className="text-sm text-gray-500">
                                {getSymbol(
                                  isRange
                                    ? lpData?.items[selectedIndex]?.symbol0
                                    : lpData?.items[selectedIndex]?.symbol1
                                ) +
                                  " / " +
                                  getSymbol(
                                    isRange
                                      ? lpData?.items[selectedIndex]?.symbol1
                                      : lpData?.items[selectedIndex]?.symbol0
                                  )}
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

                            <div className="w-[44%] text-black text-center text-xl">
                              $
                              {convertUnit(
                                isRange
                                  ? lpData?.items[selectedIndex]
                                      ?.tickUpperPrice0
                                  : lpData?.items[selectedIndex]
                                      ?.tickUpperPrice1
                              )}
                              <div className="text-sm text-gray-500">
                                {getSymbol(
                                  isRange
                                    ? lpData?.items[selectedIndex]?.symbol0
                                    : lpData?.items[selectedIndex]?.symbol1
                                ) +
                                  " / " +
                                  getSymbol(
                                    isRange
                                      ? lpData?.items[selectedIndex]?.symbol1
                                      : lpData?.items[selectedIndex]?.symbol0
                                  )}
                              </div>
                            </div>
                          </div>
                          <div
                            className={`w-2/12 px-6 flex items-center justify-center ${getProfitColor(
                              lpData?.items[selectedIndex]?.realProfit
                            )}`}
                          >
                            <div className="">
                              {getProfit(
                                lpData?.items[selectedIndex]?.realProfit,
                                false
                              )}
                            </div>
                          </div>
                          <div className="w-2/12 px-6 flex items-center justify-center">
                            {getLiquidity(
                              lpData?.items[selectedIndex]?.totDepositedUSD
                            )}
                          </div>
                          <div className="w-2/12 px-6 flex items-center justify-center">
                            {`${investmentPeriod} Days`}
                          </div>
                        </th>
                      </td>
                    </tr>
                  </>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RankPosition;
