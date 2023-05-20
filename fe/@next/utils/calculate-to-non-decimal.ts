import BigNumber from "bignumber.js";

export const calculateNonDecimalNumber = (
  amount: string,
  decimals?: number
) => {
  const tokenDecimals = new BigNumber(10).pow(decimals ?? 0);
  return new BigNumber(amount).dividedBy(tokenDecimals).toFixed(6).toString();
};

export const convertDecimals = (amount: string, decimals?: number) => {
  if (!amount?.length) return "0";
  const tokenDecimals = new BigNumber(10).pow(
    new BigNumber(18).minus(new BigNumber(decimals ?? 18))
  );

  return new BigNumber(amount ?? "0").dividedBy(tokenDecimals).toString(10);
};
