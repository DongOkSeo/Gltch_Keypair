/* eslint-disable @next/next/no-img-element */
import { FunctionComponent, useEffect, useState } from "react";
import { LpAnalyze } from "interfaces/interface";
import { useAppSelector } from "@hooks";
import { selectLpData } from "@store";
import { LpTable } from "./Table";
import { Card } from "./Card";
import { Pagination } from "./Pagination";

type ListProps = {
  isLoading: boolean;
};

const AssetList: FunctionComponent<ListProps> = ({ isLoading }) => {
  const lpData: LpAnalyze = useAppSelector(selectLpData);
  const [currentPage, setCurrentPage] = useState(1);
  const assetsPerPage = 5;
  const skeletonCount: number[] = Array.from({ length: assetsPerPage });

  const indexOfLastAsset = currentPage * assetsPerPage;
  const indexOfFirstAsset = indexOfLastAsset - assetsPerPage;
  const currentAssets = lpData.items?.slice(
    indexOfFirstAsset,
    indexOfLastAsset
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [lpData]);

  return (
    <div className="mt-[30px]">
      <div className="w-full rounded-md">
        <div className="relative overflow-x-auto ">
          <div className="flex justify-between font-['TT-Commons']">
            <Card
              title="Total Profit"
              subTitle={lpData?.info?.totalProfit}
              data={lpData}
              isLoading={isLoading}
            />
            <Card
              title="Total Initial Liquidity"
              subTitle={lpData?.info?.initDepositUSD}
              data={lpData}
              isLoading={isLoading}
            />
            <Card
              title="Total Current Liquidity"
              subTitle={lpData?.info?.totalLiquidity}
              data={lpData}
              isLoading={isLoading}
            />
          </div>
          <div className="pb-12">
            <div className="mt-[40px] p-[22px] bg-[#f6f6f6] rounded-2xl">
              <LpTable
                currentAssets={currentAssets}
                currentPage={currentPage}
                assetsPerPage={assetsPerPage}
                skeletonCount={skeletonCount}
                isLoading={isLoading}
              />
              <Pagination
                data={lpData?.items}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                assetsPerPage={assetsPerPage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetList;
