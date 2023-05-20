/* eslint-disable @next/next/no-img-element */
import { useAppSelector } from "@hooks";
import { selectLpData } from "@store";
import { LpAnalyze, LpComparison, RankComparison } from "interfaces/interface";
import { clone, cloneDeep } from "lodash";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import { RxDotFilled } from "react-icons/rx";
import { findIndex } from "../assetlist/utils";
import MyPosition from "./myPosition";
import RankTable from "./rankTable";

type RankComparisonProps = {
  selectedIndex: number;
  comparison: any[];
  isLoading: boolean;
};

const RankComparison: FunctionComponent<RankComparisonProps> = (
  Props: RankComparisonProps
) => {
  const lpData: LpAnalyze = useAppSelector(selectLpData);
  const { selectedIndex, comparison, isLoading } = Props;
  const myData = lpData?.items[selectedIndex];
  const myProfit = Number(lpData?.items[selectedIndex]?.realProfit);
  // const myProfit = 1000000;
  const assetsPerPage = 5;
  const currentAssets: LpComparison[] = comparison?.slice(0, assetsPerPage);
  // console.log("currentAssets: ", currentAssets);
  const RankComparisionRef = useRef<RankComparison>({
    isInPosition: false,
    myRank: -1,
  });
  const objMydata: any = {
    token0Id: myData?.token0address,
    token1Id: myData?.token1address,
    token0Symbol: myData?.symbol0,
    token1Symbol: myData?.symbol1,
    tickLowerPrice0: Number(myData?.tickLowerPrice0),
    tickLowerPrice1: Number(myData?.tickLowerPrice1),
    tickUpperPrice0: Number(myData?.tickUpperPrice0),
    tickUpperPrice1: Number(myData?.tickUpperPrice1),
    realProfit: Number(myData?.realProfit),
    totDepositedUSD: Number(myData?.totDepositedUSD),
    createdTimestamp: Number(myData?.timestamp),
    unCollectedfee1: myData?.unCollectedfee1,
    poolId: myData?.poolId,
    // unCollectedfee0: Number(myData?.unCollectedfee0)
  };

  // const sortedAssets: any[] = [];
  const sortedAssets = cloneDeep(currentAssets);
  sortedAssets.push(objMydata);
  sortedAssets.sort(
    (a: LpComparison, b: LpComparison) => b.realProfit - a.realProfit
  );
  RankComparisionRef.current.myRank = findIndex(
    sortedAssets,
    myProfit,
    assetsPerPage
  );
  if (RankComparisionRef.current.myRank >= 0 && sortedAssets.length > 1) {
    RankComparisionRef.current.isInPosition = true;
  } else {
    RankComparisionRef.current.myRank = -1;
  }
  if (sortedAssets.length > assetsPerPage) {
    sortedAssets.pop();
  }

  const skeletonCount: number[] = Array.from({ length: 5 });

  return (
    <>
      <div className="mt-6 font-['TT-Commons']">
        <div className="w-full rounded-md">
          <div className="relative overflow-x-auto">
            <div className="mt-4 p-[22px] rounded-2xl bg-[#f6f6f6]">
              <div className="font-bold text-2xl mb-6">Position Comparison</div>
              {/* {comparison?.length > 0 ? ( */}
              <table className="w-full rounded-2xl text-sm text-left dark:text-gray-400">
                <thead className="text-xs rounded-2xl bg-gray-100 dark:bg-gray-500 dark:text-gray-400">
                  <tr className="text-lg font-bold bg-[#ececec] font-['TT-Commons']">
                    <th scope="col" className="py-3 rounded-l-xl">
                      <div className="w-[38px] text-base flex items-center justify-center">
                        No.
                      </div>
                    </th>
                    <th scope="col" className="w-3/12 py-3 ">
                      <div className="">LP Pair</div>
                    </th>
                    <th scope="col" className="w-4/12 py-3 ">
                      <div className="w-full">
                        <div className="text-center">Range</div>
                      </div>
                    </th>
                    <th scope="col" className="w-2/12 py-3 ">
                      <div className="w-full text-center ">Profit</div>
                    </th>
                    <th scope="col" className="w-2/12 py-3 ">
                      <div className="text-center">Initial Liquidity</div>
                    </th>
                    <th
                      scope="col"
                      className="w-1/12 py-3 text-center rounded-r-xl "
                    >
                      <div className="text-center">Period</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td
                      colSpan={7}
                      // key={index}
                      className=""
                    >
                      {isLoading ? (
                        <>
                          {skeletonCount.map((_, index) => (
                            <th
                              scope="row"
                              key={index}
                              className="w-full h-24 mt-[22px] rounded-xl bg-white animate-pulse flex items-center"
                            >
                              <div className="w-3/12 h-20 px-6 py-4 flex items-center rounded-xl relative">
                                <div className="h-12 w-12 bg-gray-300 rounded-full dark:bg-gray-600 self-center" />
                                <div className="h-12 w-12 ml-8 bg-gray-200 rounded-full dark:bg-gray-600 self-center absolute" />
                                <div className="ml-10">
                                  <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-600 w-32 self-center" />
                                  <div className="h-2.5 mt-4 bg-gray-400 rounded-full dark:bg-gray-600 w-44 self-center" />
                                </div>
                              </div>
                              <div className="w-4/12 h-20 flex items-center justify-center">
                                <div className="ml-10">
                                  <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-600 w-20 self-center" />
                                  <div className="h-2.5 mt-4 bg-gray-400 rounded-full dark:bg-gray-600 w-32 self-center" />
                                </div>
                                <div className="ml-10">
                                  <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-600 w-20 self-center" />
                                  <div className="h-2.5 mt-4 bg-gray-400 rounded-full dark:bg-gray-600 w-32 self-center" />
                                </div>
                              </div>
                              <div className="w-2/12 h-20 flex items-center">
                                <div className="ml-24">
                                  <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-600 w-20 self-center" />
                                  <div className="h-2.5 mt-4 bg-gray-400 rounded-full dark:bg-gray-600 w-28 self-center" />
                                </div>
                              </div>
                              <div className="w-2/12 h-20 flex items-center">
                                <div className="ml-14">
                                  <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-600 w-20 self-center" />
                                  <div className="h-2.5 mt-4 bg-gray-400 rounded-full dark:bg-gray-600 w-32 self-center" />
                                </div>
                              </div>
                              <div className="w-1/12 h-20 flex items-center">
                                <div className="ml-8">
                                  <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-600 w-10 self-center" />
                                  <div className="h-2.5 mt-4 bg-gray-400 rounded-full dark:bg-gray-600 w-16 self-center" />
                                </div>
                              </div>
                            </th>
                          ))}
                        </>
                      ) : (
                        <>
                          {RankComparisionRef.current.isInPosition ? (
                            <>
                              {sortedAssets && sortedAssets.length > 1 ? (
                                <RankTable
                                  currentAssets={sortedAssets}
                                  myRank={RankComparisionRef.current.myRank}
                                />
                              ) : (
                                <>
                                  <div className="mt-3 flex items-center justify-center">
                                    <div>
                                      <img src="/nodata.png" />
                                    </div>
                                  </div>
                                </>
                              )}
                            </>
                          ) : (
                            <>
                              {sortedAssets?.length > 1 &&
                              RankComparisionRef.current.myRank <
                                assetsPerPage ? (
                                <RankTable
                                  currentAssets={sortedAssets}
                                  myRank={RankComparisionRef.current.myRank}
                                />
                              ) : null}
                              {sortedAssets?.length > 1 ? (
                                <>
                                  <div className="mt-3 flex items-center justify-center">
                                    <div>
                                      <RxDotFilled size="28" color="#8f8f8f" />
                                      <RxDotFilled size="28" color="#8f8f8f" />
                                      <RxDotFilled size="28" color="#8f8f8f" />
                                    </div>
                                  </div>
                                  <MyPosition
                                    selectedIndex={selectedIndex}
                                    myRank={RankComparisionRef.current.myRank}
                                  />
                                </>
                              ) : (
                                <>
                                  <div className="mt-3 flex items-center justify-center">
                                    <div>
                                      <img src="/nodata.png" />
                                    </div>
                                  </div>
                                </>
                              )}
                            </>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RankComparison;
