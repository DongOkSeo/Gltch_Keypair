import { FunctionComponent, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import ProfitDetail from "../profitDetail/profitDetail";
import { initSeries } from "./constants";
import { ApexOptions } from "apexcharts";
import moment from "moment";
import { LineChartSeries } from "interfaces/interface";
import { cloneDeep } from "lodash";
import { convertUnit, getSeriesMax, getSeriesMin } from "../assetlist/utils";

type ChartProps = {
  selectedIndex: number;
  chartData: any[];
};

const Chart: FunctionComponent<ChartProps> = (Props: ChartProps) => {
  const { selectedIndex, chartData } = Props;
  const ReactApexChart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
  });
  const [series, setSeries] = useState<LineChartSeries>(initSeries);
  const [axisYRange, setAxisYRange] = useState<Number[]>([1, 0]);

  useEffect(() => {
    const series: LineChartSeries = cloneDeep(initSeries);
    // const recent10 = chartData?.slice(-10);
    // min / max
    if (chartData.length > 0) {
      let ymax = 0;
      let ymin = 0;
      chartData.forEach((data) => {
        const { timestamp, ethPrice, liquidityUSD, holdBasedUSD, action } =
          data;
        const l_value = Number(liquidityUSD);
        const h_value = Number(holdBasedUSD);
        if (l_value > h_value) {
          if (l_value > ymax) ymax = l_value;
        } else {
          if (h_value > ymax) ymax = h_value;
        }
      });
      ymin = ymax;
      chartData.forEach((data) => {
        const { timestamp, ethPrice, liquidityUSD, holdBasedUSD, action } =
          data;
        const l_value = Number(liquidityUSD);
        const h_value = Number(holdBasedUSD);
        if (l_value < h_value) {
          if (l_value < ymin) ymin = l_value;
        } else {
          if (h_value < ymin) ymin = h_value;
        }
      });
      setAxisYRange([ymax, ymin]);

      const recent10 = chartData;
      recent10.forEach((data) => {
        const { timestamp, ethPrice, liquidityUSD, holdBasedUSD, action } =
          data;
        series.timeStamp.push(
          moment.unix(Number(timestamp)).format("YYYY-MM-DD")
        );
        series.ethPrice.push(Number(ethPrice).toFixed(2));
        series.liquidityUSD.push(Number(liquidityUSD).toFixed(2));
        series.holdBasedUSD.push(Number(holdBasedUSD).toFixed(2));
        series.action.push(action);
      });

      setSeries(series);
    }
  }, [chartData]);

  const options: ApexOptions = {
    chart: {
      type: "line",
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    legend: {
      show: true,
      position: "top",
      fontWeight: "bold",
      fontFamily: "TT-Commons",
      fontSize: "15px",
      itemMargin: {
        horizontal: 20,
        vertical: 20,
      },
      markers: {
        offsetY: -1,
        offsetX: -4,
      },
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    markers: {
      hover: {
        size: 12,
      },
    },
    xaxis: {
      categories: series.timeStamp,
      labels: {
        style: {
          fontFamily: "TT-Commons",
          fontSize: "15px",
          colors: "#828282",
          fontWeight: "600",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          fontFamily: "TT-Commons",
          fontSize: "15px",
          colors: "#828282",
          fontWeight: "600",
        },
        formatter: function (value: any, timestamp: any, index: any) {
          return "$" + convertUnit(value, 2);
        } as any,
        offsetY: -0,
      },
      min: series?.liquidityUSD.length > 0 ? ~~axisYRange[1] * 0.98 : 0,
      max: series?.liquidityUSD.length > 0 ? ~~axisYRange[0] * 1.02 : 5000,
      //      min: getSeriesMin(series),
      //      max: getSeriesMax(series),
    },
    noData: {
      text: "Loading...",
      style: {
        color: "#303030",
        fontSize: "40px",
        fontFamily: "TT-Commons",
      },
      align: "center",
      verticalAlign: "middle",
      offsetX: 0,
      offsetY: 0,
    },
    tooltip: {
      enabled: true,
      followCursor: true,
      custom: function ({ series, seriesIndex, dataPointIndex }: any) {
        return (
          `<div style="
            font-family: TT-Commons; 
            width: 160px; 
            font-weight: bold;
            padding-top: 10px;
            padding-bottom: 10px;
            background-color: rgba(255, 255, 255, 0.01);
            border-width: 1px;
            border-color: rgba(255, 255, 255, 0.5);
            box-shadow: rgba(230, 230, 230, 0.1) 10px 1px 10px 1px;
            ">` +
          // '<div class="pb-1 ml-2 ">ETH Price</div>' +
          // '<div class="text-gray-400 ml-2">' +
          // "$" +
          // series[0][dataPointIndex] +
          // "</div>" +
          '<div class="py-1 ml-2">' +
          "LP" +
          "</div>" +
          '<div class="text-gray-400 ml-2">' +
          "$" +
          series[0][dataPointIndex] +
          "</div>" +
          '<div class="py-1 ml-2">' +
          "Hold" +
          "</div>" +
          '<div class="text-gray-400 ml-2">' +
          "$" +
          series[1][dataPointIndex] +
          "</div>" +
          "</div>"
        );
      },
    },
  };

  return (
    <>
      <div>
        <div className="mt-3 text-gray-400">{`Investment Period : ${
          series?.timeStamp[0] ?? ""
        } ~ ${series?.timeStamp[series?.timeStamp?.length - 1] ?? ""}`}</div>
        <div id="chart" className="w-full mt-[17px] rounded-2xl bg-white">
          <ReactApexChart
            options={options}
            series={[
              // {
              //   name: "ETH Price",
              //   data: series.ethPrice as any,
              //   color: "#14C9C9",
              // },
              {
                name: "LP",
                data: series.liquidityUSD as any,
                color: "#165DFF",
              },
              {
                name: "Hold",
                data: series.holdBasedUSD as any,
                color: "#865DFF",
              },
            ]}
            width={1380}
            height={440}
          />
          <ProfitDetail selectedIndex={Number(selectedIndex)} />
        </div>
      </div>
    </>
  );
};

export default Chart;
