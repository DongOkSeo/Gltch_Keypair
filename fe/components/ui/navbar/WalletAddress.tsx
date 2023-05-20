import { useAppSelector } from "@hooks";
import { handleCopyClipBoard } from "../assetlist/utils";

export const WalletAddress = () => {
  const { inputAddress } = useAppSelector((store) => store.dataReducer);

  return (
    <button
      className="w-[250px] h-[44px] font-bold bg-opacity-10 border-2 font-['TT-Commons'] rounded-2xl flex items-center justify-center hover:bg-[rgba(255,106,204,0.2)] bg-walletAddress border-[#ff6acc] text-[#ff6acc]"
      onClick={() => handleCopyClipBoard(inputAddress)}
    >
      {inputAddress
        ? `Wallet Address: ${
            inputAddress.substring(0, 6) + "..." + inputAddress.slice(-4)
          }`
        : "Wallet Address"}
    </button>
  );
};
