"use client";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from "next-themes";
import { useConfig } from "@/hooks/use-config";
import {
  getGridConfig,
  getXAxisConfig,
  getYAxisConfig,
} from "@/lib/appex-chart-options";
import { colors } from "@/lib/colors";

interface HistoryChartProps {
  height?: number;
  series?: {
    name: string;
    data: number[];
  }[];
}

const HistoryChart = ({
  height = 360,
  series = [
    {
      name: "Recargas",
      data: [1200, 1400, 1800, 1600, 2000, 2200, 2100], // exemplo de dados semanais
    },
    {
      name: "Reembolsos",
      data: [300, 500, 400, 600, 700, 650, 620],
    },
  ],
}: HistoryChartProps) => {
  const [config] = useConfig();
  const { theme: mode } = useTheme();

  const options: any = {
    chart: {
      toolbar: { show: false },
    },
    dataLabels: { enabled: false },
    stroke: { curve: "straight", width: 2 },
    colors: [colors.primary, colors.danger], // azul e vermelho por exemplo
    tooltip: {
      theme: mode === "dark" ? "dark" : "light",
    },
    grid: getGridConfig(),
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 0.3,
        opacityFrom: 0.4,
        opacityTo: 0.5,
        stops: [0, 30, 100],
      },
    },
    yaxis: getYAxisConfig(
      mode === "light" ? colors["default-600"] : colors["default-300"]
    ),
    xaxis: getXAxisConfig(
      mode === "light" ? colors["default-600"] : colors["default-300"]
    ),
    legend: {
      offsetY: 4,
      show: true,
      fontSize: "12px",
      fontFamily: "Inter",
      labels: {
        colors:
          mode === "light" ? colors["default-600"] : colors["default-300"],
      },
      markers: {
        width: 6,
        height: 6,
        offsetY: 0,
        offsetX: -5,
        radius: 12,
      },
      itemMargin: {
        horizontal: 18,
        vertical: 0,
      },
    },
  };

  return (
    <Chart
      options={options}
      series={series}
      type="area"
      height={height}
      width={"100%"}
    />
  );
};

export default HistoryChart;
