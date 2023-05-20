/* eslint-disable @next/next/no-img-element */
import { ReactNode, useEffect, useLayoutEffect, useState } from "react";
import RankPosition from "@/components/ui/rankPosition/rankPosition";
import RankComparison from "@/components/ui/rankComparison/rankComparison";
import { PageLayout } from "@next/layouts/pageLayout";
import { useRouter } from "next/router";
import { getLpComparison } from "@next/ApiReq/lpComparison";
import { LpAnalyze } from "interfaces/interface";
import { useAppSelector } from "@hooks";
import { selectLpData } from "@store";

interface Props {}

export const Ranking = () => {
  const router = useRouter();
  const [comparison, setComparison] = useState<any[]>([]);
  const lpData: LpAnalyze = useAppSelector(selectLpData);
  const idx = Number(router.query.index);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useLayoutEffect(() => {
    (async () => {
      setIsLoading(true);
      const comparison: any[] = await getLpComparison(
        lpData?.items[idx]?.poolId,
        lpData?.items[idx]?.totDepositedUSD,
        lpData?.items[idx]?.timestamp
      );
      setIsLoading(false);
      setComparison(comparison);
    })();
  }, []);

  return (
    <>
      <div className="font-bold text-4xl">Investment Ranking</div>
      <RankPosition selectedIndex={idx} />
      <RankComparison
        selectedIndex={idx}
        comparison={comparison}
        isLoading={isLoading}
      />
    </>
  );
};

Ranking.getLayout = (page: ReactNode) => <PageLayout>{page}</PageLayout>;
