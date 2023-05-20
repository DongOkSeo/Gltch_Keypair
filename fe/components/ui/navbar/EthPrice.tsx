import { useLayoutEffect } from "react";
import { useAxiosFetch } from "@hooks";
import { getEthPrice } from "@next/ApiReq/ethPrice";
import { TOKEN_IMAGE_URL } from "@constants";

export const EthPrice = () => {
  const { data: ethPrice, fetchData: fetchEthPrice } = useAxiosFetch(false);

  useLayoutEffect(() => {
    fetchEthPrice(async () => await getEthPrice());
  }, []);

  return (
    <div className="font-['TT-Commons'] text-md text-black font-bold items-center justify-center flex">
      <img
        src={`https://static.nftgo.io/icon/token/ETH.svg`}
        className="mr-1 mb-[3px] h-4"
      />
      {`$${(~~Number(ethPrice?.data?.rate)).toLocaleString()}`}
    </div>
  );
};
