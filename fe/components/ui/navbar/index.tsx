/* eslint-disable @next/next/no-img-element */
import { useAppDispatch, useAppSelector } from "@hooks";
import { lpDataInit } from "@next/store/slices/data/costants";
import { dataActions } from "@store";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { handleCopyClipBoard } from "../assetlist/utils";

const Navbar: NextPage = () => {
  const { inputAddress } = useAppSelector((store) => store.dataReducer);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const goHome = () => {
    if (router.asPath === "/") {
      dispatch(dataActions.setLpData(lpDataInit));
      router.reload();
    } else {
      router.push("/");
    }
  };
  return (
    <>
      <div className="rounded-lg flex justify-between items-center">
        <div className="h-full">
          <button onClick={goHome}>
            <img
              // className="w-[287] h-[17.53px]"
              // src="/lp_logo.png"
              className="h-[44px] mt-2"
              src="/lP_logo_4.png"
              alt="LP_Scanner"
            />
          </button>
        </div>

        <button
          className="w-[240px] h-[44px] font-bold bg-opacity-10 border-2 font-['TT-Commons'] rounded-2xl flex items-center justify-center hover:bg-[rgba(255,106,204,0.2)] bg-walletAddress border-[#ff6acc] text-[#ff6acc]"
          onClick={() => handleCopyClipBoard(inputAddress)}
        >
          {inputAddress
            ? `Wallet Address: ${
                inputAddress.substring(0, 4) + "..." + inputAddress.slice(-4)
              }`
            : "Wallet Address"}
        </button>
      </div>
    </>
  );
};

export default Navbar;
