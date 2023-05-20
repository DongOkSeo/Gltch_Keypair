/* eslint-disable @next/next/no-img-element */

import { useAppDispatch } from "@hooks";
import { lpDataInit } from "@next/store/slices/data/costants";
import { dataActions } from "@store";
import { ethers } from "ethers";
import Link from "next/link";
import {
  ChangeEvent,
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useRef,
  useState,
} from "react";

type SearchProps = {
  setSearchAddress: Dispatch<SetStateAction<string>>;
  handleSearchResult: (res: boolean) => void;
};

const Search: FunctionComponent<SearchProps> = ({
  setSearchAddress,
  handleSearchResult,
}) => {
  const dispatch = useAppDispatch();
  const [inputValue, setInputValue] = useState("");
  const [isValid, setValid] = useState<boolean>(true);
  const inputValueRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const searchData = (e: React.FormEvent<HTMLFormElement>) => {
    dispatch(dataActions.setLpData(lpDataInit));
    dispatch(dataActions.setInputAddress(""));
    e.preventDefault();
    if (ethers.utils.isAddress(inputValue)) {
      handleSearchResult(true);
      setValid(true);
      setSearchAddress(inputValue);
    } else {
      alert("Invalid address");
      setValid(false);
      handleSearchResult(false);
    }
    if (inputValueRef.current) {
      inputValueRef.current.value = "";
      inputValueRef.current.blur();
    }
  };

  return (
    <>
      <div className="w-full h-[188px] mt-[17px] rounded-xl flex relative bg-[#896AFF]">
        <div className="ml-8 my-auto h-[154px] text-white z-20">
          <div className="font-medium text-4xl font-['TT-Commons'] mt-3">
            Liquidation Pool Profitability Analyzer
          </div>

          <div className="mt-8 mb-2 font-['TT-Commons']">
            Check your profits :&nbsp;
            <Link className="hover:underline hover:text-[#70acec]" href="https://keywallet.co.kr/lppa.htm" target="_blank">https://keywallet.co.kr/lppa.htm</Link>
          </div>

          <form className="w-[506px] h-[45px]" onSubmit={searchData}>
            <label
              htmlFor="default-search"
              className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
            >
              Search
            </label>
            <div className="relative">
              <input
                type="search"
                ref={inputValueRef}
                id="default-search"
                className="block w-full h-[25px] p-4 pl-4 text-sm text-gray-900 border border-gray-100 rounded-lg bg-gray-50 bg-opacity-10 focus:ring-gray-500 font-['TT-Commons']
                placeholder-white focus:border-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
                placeholder="Enter your wallet address"
                onChange={handleInputChange}
                required
              />
              <button
                type="submit"
                className="text-white h-[22px] absolute right-2.5 bottom-1.5  hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-4"
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-[#bdbdbd] dark:text-gray-400 "
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
                <span className="sr-only">Icon description</span>
              </button>
            </div>
          </form>
        </div>
        <img className="absolute mt-[-6px]" src="/lp_search_img.png" />
      </div>
    </>
  );
};

export default Search;
