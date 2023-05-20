/* eslint-disable @next/next/no-img-element */
import { ReactNode, useEffect, useState } from "react";
import { PageLayout } from "@next/layouts/pageLayout";
import Chart from "@/components/ui/chart/chart";
import { getChartData } from "@next/ApiReq/chart";
import LpHistory from "@/components/ui/profitHistory/profitHistory";
import { useRouter } from "next/router";
import { LpAnalyze } from "interfaces/interface";
import { useAppSelector } from "@hooks";
import { selectLpData } from "@store";

// test address
// 0x1a386b524682a952354b5fde8e16a8b3c7863c46

export const Analysis = () => {
  const router = useRouter();
  const lpData: LpAnalyze = useAppSelector(selectLpData);
  const idx = Number(router.query.index);
  const [chartData, setChartData] = useState<any[]>([]);
  useEffect(() => {
    (async () => {
      const chartData: any[] = await getChartData(lpData?.items[idx]?.tokenId);
      setChartData(chartData);
    })();
  }, []);

  return (
    <>
      <div className="font-bold text-4xl">Yield Analysis</div>
      <Chart selectedIndex={Number(router.query.index)} chartData={chartData} />
      <div className="font-bold text-4xl ml-1 mt-14 mb-8">History</div>
      <LpHistory selectedIndex={Number(router.query.index)} />
    </>
  );
};

Analysis.getLayout = (page: ReactNode) => <PageLayout>{page}</PageLayout>;
