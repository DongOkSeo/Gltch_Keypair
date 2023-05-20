import { useRouter } from "next/router";
import React from "react";
import { FiMoreVertical } from "react-icons/fi";
import { INDEX_COLOR } from "../assetlist/utils";
import Dropdown from "./dropdown";

interface Props {
  index: number;
}

export default function DropdownMenu(Props: Props) {
  const { index } = Props;
  const router = useRouter();

  return (
    <Dropdown
      button={
        <button className="rounded-xl transition duration-1000 ">
          <FiMoreVertical
            size="28"
            style={{
              color: INDEX_COLOR[Props.index],
            }}
          />
        </button>
      }
      children={
        <div className="flex mt-10 h-max w-56 flex-col rounded-[20px] bg-dropdown-menu pb-4 shadow-[0px_5px_10px_-1px_rgba(0,0,0,0.1)]">
          <div className="mt-3 mx-4 flex flex-col">
            <button
              className="hover:bg-purple-100 mt-3 text-sm text-gray-800 hover:text-gray-400 rounded-xl"
              onClick={() =>
                router.push({
                  pathname: "analysis",
                  query: { index },
                })
              }
            >
              Yield Analysis
            </button>
            <button
              className="hover:bg-purple-100 mt-3 text-sm text-gray-800 hover:text-gray-400 rounded-xl"
              onClick={() => {
                router.push({
                  pathname: "ranking",
                  query: { index },
                });
              }}
            >
              Investment Ranking
            </button>
          </div>
        </div>
      }
      classNames={"py-2 bottom-[-30px] -left-[180px] w-max"}
    />
  );
}
