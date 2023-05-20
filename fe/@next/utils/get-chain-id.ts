export const getNetworkId = (chainId: number | undefined) => {
  switch (chainId) {
    case 97:
      return 56;
    case 5:
      return 1;
    case 80001:
      return 137;
    default:
      return chainId;
  }
};

export const getTypeOfGasFeePerChainId = (chainId: any) => {
  return chainId === 56 || chainId === 97;
};
