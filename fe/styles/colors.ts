//color design tokens
export interface commonColorInterface {
  lightBlackWhiteAccent: string;
  lightBlackGreyAccent: string;
  blackWhiteAccent: string;
  blackGradientAccent: string;
  brownLightYellowAccent: string;
  white: string;
  grey: string;
  textField: string;
  greyText: string;
  border: string;
  icon: string;
  button: string;
  mainLinear: string;
  darkBlackWhiteAccent: string;
  yellowWhiteAccent: string;

  backdrop: string;
  darkBlackGreyAccent: string;
  lightGreyDarkGrey: string;
  greyIconGreyAccent: string;
  greyIconWhiteAccent: string;
  mainGreyIconGrey: string;
  lightGreyMainGrey: string;
  chart: string;
  chartLabel: string;
  balanceColor: string;
  tooltipColor: string;

  greyLightGreyAccent: string;
  lightGreyWhiteGrey: string;
  mainGreyTextGrey: string;
  mainGreyBlack: string;
}
export const getColors = (mode: string) => ({
  ...(mode === "dark"
    ? {
        primary: "#FEBF32",
        background: "#17171A",
        success: "#66BF5A",
        error: "#D92D20",
        warning: "#FEDF89",
        button: "#222531",
        common: {
          darkBlackWhiteAccent: "#17171A",
          yellowWhiteAccent: "#FEBF32",
          darkBlackGrayAccent: "#222531",
          darkBlackprimary: "##222531",
          darkBlackGreyAccent: "#17171A",
          lightBlackWhiteAccent: "#222531",
          lightBlackGreyAccent: "#222531",
          blackWhiteAccent: "#FFFFFF",
          lightGreyMainGrey: "#888DAA",
          lightGreyWhiteGrey: "#888DAA",
          lightGreyDarkGrey: "#494A55",
          blackGradientAccent:
            "linear-gradient(91.26deg, #A9CDFF 0%, #72F6D1 21.87%, #A0ED8D 55.73%, #FED365 81.77%, #FAA49E 100%)",
          greyLightGreyAccent: "#888DAA",
          greyIconGreyAccent: "#888DAA",
          greyIconWhiteAccent: "#FFFFFF",
          brownLightYellowAccent: "#4C3A28",
          mainGreyIconGrey: "#A7A9BA",
          mainGreyTextGrey: "#A7A9BA",
          mainGreyBlack: "#A7A9BA",
          white: "#FFFFFF",
          grey: "#A7A9BA",
          textField: "#17171A",
          lightTextField: "#222531",
          greyText: "#949494",
          border: "#2A2D3C",
          button: "#222531",
          icon: "#FFFFFF",
          mainLinear:
            "linear-gradient(91.26deg, #A9CDFF 0%, #72F6D1 21.87%, #A0ED8D 55.73%, #FED365 81.77%, #FAA49E 100%)",
          backdrop: "rgba(0, 0, 0, 0.4)",
          balanceColor: "#A7A9BA",
          tooltipColor: "#ffffff",
          chart: "#D0D6DE",

          chartLabel: "#A3A3A3",
        },
      }
    : {
        primary: "#FEBF32",
        background: "#F8FCFF",
        success: "#66BF5A",
        error: "#D92D20",
        warning: "#FEDF89",
        button: "#222531",
        common: {
          darkBlackWhiteAccent: "#FFFFFF",
          darkBlackGrayAccent: "#F4F4F4",
          darkBlackGreyAccent: "#F4F4F4",
          darkBlackprimary: "#FEBF32",
          lightBlackWhiteAccent: "#FFFFFF",
          yellowWhiteAccent: "#181D18",
          lightBlackGreyAccent: "#F4F4F4",
          blackWhiteAccent: "#181D18",
          lightGreyMainGrey: "#D0D0D0",
          lightGreyWhiteGrey: "#FFFFFF",
          lightGreyDarkGrey: "#D0D0D0",
          blackGradientAccent: "#181D18",
          greyLightGreyAccent: "#949494",
          greyIconWhiteAccent: "#A1A1A1",
          greyIconGreyAccent: "#A1A1A1",
          brownLightYellowAccent: "#febf3233",
          mainGreyIconGrey: "#A1A1A1",
          mainGreyTextGrey: "#949494",
          mainGreyBlack: "#181D18",
          white: "#FFFFFF",
          grey: "#A7A9BA",
          textField: "#F4F4F4",
          lightTextField: "#F4F4F4",
          greyText: "#949494",
          border: "#D0D0D0",
          icon: "#A1A1A1",
          button: "#222531",
          mainLinear:
            "linear-gradient(91.26deg, #A9CDFF 0%, #72F6D1 21.87%, #A0ED8D 55.73%, #FED365 81.77%, #FAA49E 100%)",
          backdrop: "rgba(140, 140, 140, 0.4)",
          chart: "#D0D6DE",
          chartLabel: "#949494",
          balanceColor: "#949494",
          tooltipColor: "#181D18;",
        },
      }),
});
