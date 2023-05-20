/* eslint-disable @next/next/no-img-element */
import { useAppSelector } from "@hooks";
import { selectLpData } from "@store";
import moment from "moment";
import { cloneDeep } from "lodash";
import { LpAnalyze } from "interfaces/interface";
import { FunctionComponent, useEffect, useState } from "react";
import { Pagination } from "../assetlist/Pagination";
import { getAmount, getLiquidity, getType } from "../assetlist/utils";

type ProfitHistoryProps = {
  selectedIndex: number;
};

const ProfitHistory: FunctionComponent<ProfitHistoryProps> = (
  Props: ProfitHistoryProps
) => {
  const { selectedIndex } = Props;
  const lpData: LpAnalyze = useAppSelector(selectLpData);
  const [currentPage, setCurrentPage] = useState(1);
  const [assetsPerPage] = useState(5);
  const indexOfLastAsset = currentPage * assetsPerPage;
  const indexOfFirstAsset = indexOfLastAsset - assetsPerPage;
  const reverse = cloneDeep(lpData?.items[selectedIndex]?.history)?.sort(
    (a, b) => Number(b.timestamp) - Number(a.timestamp)
  );
  const currentAssets = reverse?.slice(indexOfFirstAsset, indexOfLastAsset);
  const symbol0 = lpData.items[selectedIndex]?.symbol0;
  const symbol1 = lpData.items[selectedIndex]?.symbol1;

  const convertUnixTime = (timeStamp: string) => {
    const dateString = moment
      .unix(Number(timeStamp))
      .format("YYYY-MM-DD HH:mm:ss");
    return dateString;
  };

  return (
    <div className="mt-[20px] p-[22px] bg-[#fbfbfb] rounded-2xl mb-4">
      <table className="w-full font-['TT-Commons'] text-sm text-left">
        <thead>
          <tr className="text-[20px] text-black">
            <th className="w-1/5 pt-1 pb-5 pl-10 border-b-gray-200 border-b-[1.5px]">
              Date
            </th>
            <th className="w-1/5 pt-1 pl-5 pb-5 border-b-gray-200 border-b-[1.5px]">
              Action
            </th>
            <th className="w-1/5 pt-1 pb-5 border-b-gray-200 border-b-[1.5px]">
              Amount
            </th>
            <th className="w-1/5 pt-1 pb-5 border-b-gray-200 border-b-[1.5px]">
              Pair A
            </th>
            <th className="w-1/5 pt-1 pb-5 border-b-gray-200 border-b-[1.5px]">
              Pair B
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={6}>
              {currentAssets?.map((asset, index) => (
                <>
                  <td
                    scope="row"
                    className="flex w-full items-center font-bold text-[17px] text-lg text-zinc-500"
                  >
                    <div className="w-1/5 pl-10 border-b-gray-200 border-b-[1.5px] py-4">
                      {convertUnixTime(asset?.timestamp)}
                    </div>
                    <div className="w-1/5 pl-5 border-b-gray-200 border-b-[1.5px] py-4">
                      {getType(asset?.type)}
                    </div>
                    <div className="w-1/5 border-b-gray-200 border-b-[1.5px] py-4">
                      {getLiquidity(asset?.amountUSD)}
                    </div>
                    <div className="w-1/5 border-b-gray-200 border-b-[1.5px] py-4">
                      {`${getAmount(asset?.amount0)} ${symbol0}`}
                    </div>
                    <div className="w-1/5 border-b-gray-200 border-b-[1.5px] py-4">
                      {`${getAmount(asset?.amount1)} ${symbol1}`}
                    </div>
                  </td>
                </>
              ))}
            </td>
          </tr>
        </tbody>
      </table>
      <Pagination
        data={lpData.items[selectedIndex]?.history}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        assetsPerPage={assetsPerPage}
      />
    </div>
  );
};

export default ProfitHistory;
