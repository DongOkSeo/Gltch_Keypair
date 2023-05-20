import { TOKEN_IMAGE_URL } from "@constants";
import { convertSuffix, onErrorEvent, onLoadEvent } from "../assetlist/utils";
import { VariableColor } from "./constants";
import Progress from "../progress/progressBar";
import { isNaN } from "lodash";

export const Row = ({
  titleData,
  subTitleData,
  token0Addr,
  token1Addr,
}: {
  titleData: string[];
  subTitleData: string[];
  token0Addr?: string;
  token1Addr?: string;
}) => {
  const getColor = (index: number) => {
    if (subTitleData[index] === "In Range") {
      return "text-blue-600";
    } else if (subTitleData[index] === "Out Range") {
      return "text-stone-500";
    } else if (VariableColor.find((x) => x === titleData[index])) {
      if (subTitleData[index].startsWith("-")) {
        return "text-blue-700";
      } else {
        return "text-red-600";
      }
    }
  };

  const RenderLpPair = ({ value }: { value: string }) => {
    return (
      <div className="relative flex">
        <div className="pt-[2px] w-6 h-6 flex items-center justify-center">
          <div className="rounded-full  overflow-hidden">
            <img
              src={`${TOKEN_IMAGE_URL}${token0Addr}/logo.png`}
              className="mr-3 h-10"
              alt="LP_Scanner"
              onLoad={onLoadEvent}
              onError={onErrorEvent}
            />
          </div>
        </div>

        <div className="pt-[2px] w-6 h-6 ml-4 absolute flex items-center justify-center">
          <div className="rounded-full overflow-hidden">
            <img
              src={`${TOKEN_IMAGE_URL}${token1Addr}/logo.png`}
              className="mr-3 h-10"
              alt="LP_Scanner"
              onLoad={onLoadEvent}
              onError={onErrorEvent}
            />
          </div>
        </div>
        <div className="ml-5 flex items-center">{`${value}`}</div>
      </div>
    );
  };

  const Title = ({ data }: { data: string[] }) => {
    return (
      <div className="flex text-[16px] text-slate-400 font-semibold">
        <div className="ml-12" />
        {data.map((x) => (
          <div className="w-1/4">{`${x}`}</div>
        ))}
      </div>
    );
  };

  const SubTitle = ({ data }: { data: string[] }) => {
    const getProgressValue = (value: string) => {
      try {
        if (!data || value?.split("<->").length === 0) {
          return 0;
        }
        if (data[3] === "Out Range") {
          return 0;
        }
        const left = convertSuffix(value?.split("<->")[0].replace(/,/g, ""));
        const right = convertSuffix(value?.split("<->")[1].replace(/,/g, ""));
        const diff = Math.abs(right - left);
        const current = convertSuffix(
          data[2].substring(1, 18).replace(/,/g, "")
        );
        const ratio = ((current - left) / diff) * 100;
        return isNaN(ratio) ? 100 : ~~ratio;
      } catch (e) {
        return 0;
      }
    };

    return (
      <div className={`flex text-[21px] text-black font-semibold items-center`}>
        <div className="ml-12" />
        {data.map((v, _) => (
          <div className={`w-1/4 ${getColor(_)}`}>
            {titleData[_] === "LP Pair" ? (
              <RenderLpPair value={v} />
            ) : titleData[_] === "Range" ? (
              <div className="mt-[3px] ">
                <Progress
                  height="h-1"
                  width="w-[180px]"
                  value={getProgressValue(v)}
                  color="blue"
                />
                <div className="text-[16px] flex justify-between">
                  <div>${v?.split("<->")[0]}</div>
                  <div className="mr-[150px]">${v?.split("<->")[1]}</div>
                </div>
              </div>
            ) : (
              `${v}`
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="my-5">
      <Title data={titleData} />
      <SubTitle data={subTitleData} />
    </div>
  );
};
