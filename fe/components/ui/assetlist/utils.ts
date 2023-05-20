import { LineChartSeries, LpComparison } from "interfaces/interface";
import moment from "moment";
import { SyntheticEvent } from "react";

export const INDEX_COLOR = [
  "#754cff",
  "#fd4cc0",
  "#fdb73e",
  "#18bb3d",
  "#3268dc",
];

export const getProfit = (profit: string | number, bracket?: boolean) => {
  try {
    if (typeof profit === "string") {
      profit = Number(profit);
    }
    const displayBracket = bracket ?? true;
    if (profit) {
      const ret = Number(profit);
      if (!isNaN(ret)) {
        if (displayBracket) {
          return ret > 0
            ? "(+" +
                profit.toLocaleString("ko-KR", {
                  maximumFractionDigits: 2,
                }) +
                "%)"
            : "(" +
                profit.toLocaleString("ko-KR", {
                  maximumFractionDigits: 2,
                }) +
                "%)";
        } else {
          return ret > 0
            ? profit.toLocaleString("ko-KR", {
                maximumFractionDigits: 2,
              }) + "%"
            : profit.toLocaleString("ko-KR", {
                maximumFractionDigits: 2,
              }) + "%";
        }
      }
    }
    return "-";
  } catch (e) {
    return "-";
  }
};

export const getProfitColor = (profit: string | number) => {
  if (typeof profit === "string") {
    profit = Number(profit);
  }
  if (profit > 0) {
    return "text-red-600";
  } else {
    return "text-blue-600";
  }
};

export const calcPeriod = (timeStamp: number | string) => {
  if (typeof timeStamp === "string") {
    timeStamp = Number(timeStamp);
  }
  const todayStamp = Date.now();
  const day = moment.unix(timeStamp);
  const today = moment.unix(todayStamp / 1000);
  const diff = today.diff(day);
  const duration = moment.duration(diff);
  return duration.days();
};

export const getType = (type: string) => {
  if (type === "mint") {
    type = "Inc LQ";
  } else if (type === "burn") {
    type = "Dec LQ";
  } else if (type === "collect") {
    type = "Claimed Fee";
  }
  // return type[0].toUpperCase() + type.substring(1, type.length);
  return type;
};

export const findIndex = (
  data: LpComparison[],
  value: number,
  arrLength: number
) => {
  if (data.length < arrLength) {
    let ret = -1;
    let i = 0;
    for (i = 0; i < data.length; i++) {
      if (value > data[i]?.realProfit) {
        ret = i;
        break;
      }
    }
    return ret > 0 ? ret - 1 : i - 1;
  } else {
    for (let i = 0; i < data.length; i++) {
      if (value > data[i]?.realProfit) {
        return i - 1;
      }
    }
  }
  return -1;
};

export const getLiquidity = (liquidity: string) => {
  try {
    if (liquidity) {
      if (liquidity === "-Infinity" || liquidity === "Infinity") {
        return "-";
      }
      const ret = Number(liquidity);
      if (!isNaN(ret)) {
        return ret < 0
          ? liquidity[0] +
              "$" +
              Number(
                liquidity.substring(1, liquidity.length - 1)
              ).toLocaleString("ko-KR", {
                maximumFractionDigits: 2,
              })
          : "$" +
              ret.toLocaleString("ko-KR", {
                maximumFractionDigits: 2,
              });
      }
    }
    return "-";
  } catch (e) {
    return "-";
  }
};

export const getSymbol = (symbol: string) => {
  if (symbol) {
    return symbol.slice(0, 5);
  }
  return "";
};

export const getSeriesMin = (series: LineChartSeries) => {
  let min = Number(series?.liquidityUSD[0]) ?? 0;
  for (let i = 0; i < series?.liquidityUSD.length; i++) {
    if (min > Number(series?.liquidityUSD[i])) {
      min = Number(series?.liquidityUSD[i]);
    }
    if (min > Number(series?.holdBasedUSD[i])) {
      min = Number(series?.holdBasedUSD[i]);
    }
  }
  return min / 10;
};

export const getSeriesMax = (series: LineChartSeries) => {
  let max = Number(series?.liquidityUSD[0]) ?? 0;
  for (let i = 0; i < series?.liquidityUSD.length; i++) {
    if (max < Number(series?.liquidityUSD[i])) {
      max = Number(series?.liquidityUSD[i]);
    }
    if (max < Number(series?.holdBasedUSD[i])) {
      max = Number(series?.holdBasedUSD[i]);
    }
  }
  return max * 1.5;
};

export const getAmount = (amount: string) => {
  if (amount) {
    const ret = Number(amount);
    if (!isNaN(ret)) {
      return Number(ret).toLocaleString();
    }
  }
  return "";
};

export const convertSuffix = (value: string) => {
  let num = 0;
  if (value.includes("K")) {
    num = Number(value.slice(0, value.length - 1));
    num *= 1000;
    return num;
  } else if (value.includes("M")) {
    num = Number(value.slice(0, value.length - 1));
    num *= 1000000;
    return num;
  } else if (value.includes("B")) {
    num = Number(value.slice(0, value.length - 1));
    num *= 1000000000;
    return num;
  }
  return Number(value);
};

export const convertUnit = (value: string | number, decimal?: number) => {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    value = Number(value);
  }

  if (value >= 1000000000000) {
    return value.toExponential(2);
  }

  let suffix = "";
  if (value >= 1000000000) {
    value /= 1000000000;
    suffix = "B";
  } else if (value >= 1000000) {
    value /= 1000000;
    suffix = "M";
  } else if (value >= 1000) {
    value /= 1000;
    suffix = "K";
  } else if (value <= 0.0000000001) {
    return value.toExponential(2);
  } else if (value <= 0.0000001) {
    return value.toFixed(8);
  } else if (value <= 0.001) {
    return value.toFixed(5);
  } else if (value <= 0.01) {
    return value.toFixed(3);
  } else if (value <= 0.1) {
    return value.toFixed(2);
  }

  const ret = value % 1 === 0 ? value.toFixed(0) : value.toFixed(decimal);
  return ret.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + suffix;
};

export const getInRange = (isInRange: boolean) => {
  if (isInRange) {
    return "In Range";
  }
  return "Out Range";
};

export const onLoadEvent = (event: SyntheticEvent<HTMLImageElement, Event>) => {
  if (event.currentTarget.className !== "error") {
    event.currentTarget.className = "success";
  }
};

export const onErrorEvent = (
  event: SyntheticEvent<HTMLImageElement, Event>
) => {
  event.currentTarget.src =
    "https://s2.coinmarketcap.com/static/cloud/img/dex/default-icon-day.svg?_=9dfbefa";
  event.currentTarget.className = "error";
  event.currentTarget.width = 40;
  event.currentTarget.height = 40;
};

export const handleCopyClipBoard = (text: string) => {
  if (typeof navigator.clipboard == "undefined") {
    console.log("navigator.clipboard");
    var textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed"; //avoid scrolling to bottom
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      var successful = document.execCommand("copy");
      var msg = successful ? "Address copied" : "Copy failed";
      alert(msg);
    } catch (err) {
      alert("Copy failed");
    }

    document.body.removeChild(textArea);
    return;
  }
  navigator.clipboard.writeText(text).then(
    function () {
      alert(`Address copied`);
    },
    function (err) {
      alert("Copy failed");
    }
  );
};
