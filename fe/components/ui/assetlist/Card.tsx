import { LpAnalyze } from "interfaces/interface";
import { getProfit, getLiquidity, getProfitColor } from "./utils";

export const Card = ({
  title,
  subTitle,
  data,
  isLoading,
}: {
  title: string;
  subTitle: string;
  data: LpAnalyze;
  isLoading: Boolean;
}) => {
  return (
    <div className="w-[442px] h-[169px] rounded-2xl text-lg text-black font-bold bg-white">
      <div className="w-full py-2 bg-[#d3c8ff] rounded-t-2xl text-center">
        {title}
      </div>
      {title === "Total Profit" ? (
        <div className="flex justify-center items-center">
          {isLoading ? (
            <div className="mt-6 py-3 animate-pulse">
              <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-600 w-40" />
              <div className="h-2.5 mt-4 bg-gray-400 rounded-full dark:bg-gray-600 w-56" />
            </div>
          ) : (
            <>
              <p
                className={`mt-6 font-bold text-4xl text-black text-center py-3`}
              >
                {data?.items.length > 0
                  ? getLiquidity(data?.info?.totalProfitUSD)
                  : ""}
              </p>
              <p
                className={`mt-6 ml-2 font-bold text-1xl text-black text-center py-3
            ${getProfitColor(data?.info?.totalProfit)}`}
              >
                {data?.items.length > 0
                  ? getProfit(data?.info?.totalProfit)
                  : ""}
              </p>
            </>
          )}
        </div>
      ) : (
        <>
          {isLoading ? (
            <div className="flex justify-center items-center">
              <div className="mt-6 py-3 animate-pulse">
                <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-600 w-40" />
                <div className="h-2.5 mt-4 bg-gray-400 rounded-full dark:bg-gray-600 w-56" />
              </div>
            </div>
          ) : (
            <>
              <p className="mt-6 font-bold text-4xl text-black text-center py-3">
                {data?.items.length > 0 ? getLiquidity(subTitle) : ""}
              </p>
            </>
          )}
        </>
      )}
    </div>
  );
};
