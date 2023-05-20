import React from "react";
import { TOKEN_IMAGE_URL } from "@constants";
import DropdownMenu from "../dropdown/dropdownMenu";
import {
  getInRange,
  getLiquidity,
  getProfit,
  getProfitColor,
  getSymbol,
  INDEX_COLOR,
  onErrorEvent,
  onLoadEvent,
} from "./utils";
import { LpItem } from "interfaces/interface";

interface LpTableProps {
  currentAssets: LpItem[];
  currentPage: number;
  assetsPerPage: number;
  skeletonCount: number[];
  isLoading: boolean;
}

export const LpTable = (Props: LpTableProps) => {
  const {
    isLoading,
    currentAssets,
    skeletonCount,
    currentPage,
    assetsPerPage,
  } = Props;
  return (
    <table className="w-full font-['TT-Commons'] text-sm text-left text-gray-500 mt-2">
      <thead className="text-xs text-gray-400 dark:bg-gray-500 dark:text-gray-400 h-20">
        <tr className="bg-[#ececec]">
          <th
            scope="col"
            className="w-4/12 px-10 py-3 font-bold text-lg text-black rounded-l-xl"
          >
            LP Pair
          </th>
          <th
            scope="col"
            className="w-3/12 py-3 px-1 font-bold text-lg text-black"
          >
            Profit
          </th>
          <th scope="col" className="w-2/12 py-3 font-bold text-lg text-black">
            Liquidity
          </th>
          <th
            scope="col"
            className="w-2/12 text-center py-3 font-bold text-lg text-black"
          >
            Portfolio
          </th>
          <th
            scope="col"
            className="w-1/12 px-6 py-3 font-normal text-lg rounded-r-xl"
          />
        </tr>
      </thead>
      <tbody>
        {currentAssets?.length > 0 ? (
          <>
            <tr>
              <td colSpan={6} className="dark:bg-gray-800 dark:border-gray-700">
                {currentAssets?.map((asset, index) => (
                  <th
                    scope="row"
                    key={index}
                    className="flex w-full mt-[22px] bg-[#fcfcfc] shadow-sm"
                    style={{ borderRadius: 10 }}
                  >
                    <div
                      className="h-[76px] w-1 self-center"
                      style={{
                        backgroundColor: INDEX_COLOR[index],
                        borderRadius: 10,
                        marginLeft: 2,
                      }}
                    />
                    <div className="w-4/12 h-20 px-6 font-bold text-base text-gray-900 flex items-center whitespace-nowrap dark:text-white">
                      <div className="relative flex">
                        <div className="w-12 h-12 flex items-center justify-center">
                          <div className="w-10 h-10 flex items-center justify-center">
                            <img
                              src={`${TOKEN_IMAGE_URL}${asset?.token0address}/logo.png`}
                              className="mr-3 h-10"
                              alt="LP_Scanner"
                              onLoad={onLoadEvent}
                              onError={onErrorEvent}
                            />
                          </div>
                        </div>
                        <div className="w-12 h-12 ml-6 absolute flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full overflow-hidden">
                            <img
                              src={`${TOKEN_IMAGE_URL}${asset?.token1address}/logo.png`}
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
                          {getSymbol(asset?.symbol0) +
                            " / " +
                            getSymbol(asset?.symbol1)}
                        </div>
                        <div
                          className="ml-8 text-md font-semibold flex"
                          style={{
                            color: INDEX_COLOR[index],
                          }}
                        >
                          {getInRange(asset?.inRange)}
                          <div className={`text-sm ml-1 pt-[2px]`}>
                            {getProfit(
                              Number(asset?.pollFeeTier) / 10000,
                              false
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`w-3/12 flex items-center font-bold text-xl  `}
                    >
                      <div className={"flex text-black"}>
                        {/* {asset?.realProfitUSD} */}
                        {/* {(asset?.realProfitUSD).toLocaleString()} */}
                        {getLiquidity(asset?.realProfitUSD)}
                        <div
                          className={`flex ml-1 text-sm items-center font-bold ${getProfitColor(
                            asset?.realProfit
                          )}`}
                        >
                          {getProfit(asset?.realProfit)}
                        </div>
                      </div>
                    </div>
                    <div className="w-2/12 flex items-center font-bold text-xl  text-gray-900">
                      ${Number(asset?.liquidityUSD).toLocaleString()}
                    </div>
                    <div className="w-2/12 flex items-center justify-center font-bold text-xl  text-gray-900">
                      {asset?.portfolio + "%"}
                    </div>
                    <div className="w-1/12 px-6 flex items-center justify-center font-bold text-xl text-gray-900">
                      <DropdownMenu
                        index={(currentPage - 1) * assetsPerPage + index}
                      />
                    </div>
                  </th>
                ))}
              </td>
            </tr>
          </>
        ) : isLoading ? (
          <>
            <tr>
              <td
                colSpan={6}
                className="items-center justify-center border-b animate-pulse"
              >
                {skeletonCount.map((_, index) => (
                  <th scope="row" className="flex w-full mt-[22px] bg-white">
                    <div className="w-4/12 h-20 px-6 py-4 flex items-center rounded-xl relative">
                      <div className="h-12 w-12 bg-gray-300 rounded-full dark:bg-gray-600 self-center" />
                      <div className="h-12 w-12 ml-8 bg-gray-200 rounded-full dark:bg-gray-600 self-center absolute" />
                      <div className="ml-10">
                        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-600 w-36 self-center" />
                        <div className="h-2.5 mt-4 bg-gray-400 rounded-full dark:bg-gray-600 w-52 self-center" />
                      </div>
                    </div>
                    {/* <div className="w-1/12 h-20 flex items-center justify-center">
                      <div className="ml-2">
                        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-600 w-12 self-center" />
                        <div className="h-2.5 mt-4 bg-gray-400 rounded-full dark:bg-gray-600 w-20 self-center" />
                      </div>
                    </div> */}
                    <div className="w-3/12 h-20 flex items-center">
                      <div className="">
                        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-600 w-28 self-center" />
                        <div className="h-2.5 mt-4 bg-gray-400 rounded-full dark:bg-gray-600 w-44 self-center" />
                      </div>
                    </div>
                    <div className="w-2/12 h-20 flex items-center">
                      <div className="">
                        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-600 w-20 self-center" />
                        <div className="h-2.5 mt-4 bg-gray-400 rounded-full dark:bg-gray-600 w-32 self-center" />
                      </div>
                    </div>
                    <div className="w-2/12 h-20 flex items-center">
                      <div className="ml-20">
                        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-600 w-20 self-center" />
                        <div className="h-2.5 mt-4 bg-gray-400 rounded-full dark:bg-gray-600 w-32 self-center" />
                      </div>
                    </div>
                    <div className="w-1/12 h-20 flex items-center">
                      <div className=""></div>
                    </div>
                  </th>
                ))}
              </td>
            </tr>
          </>
        ) : (
          <tr>
            <td colSpan={5} className="p-6 text-center">
              <p className="p-10 text-black font-bold text-xl">No data</p>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};
