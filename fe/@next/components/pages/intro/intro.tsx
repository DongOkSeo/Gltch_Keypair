/* eslint-disable @next/next/no-img-element */
import { ReactNode, useEffect, useState } from "react";
import AssetList from "@/components/ui/assetlist/AssetList";
import Search from "@/components/ui/assetlist/Search";
import { useAppDispatch } from "@hooks";
import { getLpAnalyze } from "@ApiReq";
import { dataActions } from "@store";
import { PageLayout } from "@layouts";
import { convertUnit } from "@/components/ui/assetlist/utils";

export const Intro = () => {
  const dispatch = useAppDispatch();
  const [isSearchFin, setSearchFin] = useState<boolean>(false);
  const [searchAddress, setSearchAddress] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSearchResult = (res: boolean) => {
    setSearchFin(res);
  };

  useEffect(() => {
    if (isSearchFin) {
      (async () => {
        setIsLoading(true);
        const lp: any = await getLpAnalyze(searchAddress ?? "");
        dispatch(dataActions.setLpData(lp));
        dispatch(dataActions.setInputAddress(searchAddress));
        setIsLoading(false);
        setSearchFin(false);
      })();
    }
  }, [isSearchFin]);

  return (
    <>
      <Search
        setSearchAddress={setSearchAddress}
        handleSearchResult={handleSearchResult}
      />
      <AssetList isLoading={isLoading} />
    </>
  );
};

Intro.getLayout = (page: ReactNode) => <PageLayout>{page}</PageLayout>;
