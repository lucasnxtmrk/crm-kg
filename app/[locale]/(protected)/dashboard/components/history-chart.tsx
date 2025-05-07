'use client';
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

import { useTheme } from 'next-themes';
import { useConfig } from '@/hooks/use-config';
import {
  getGridConfig,
  getXAxisConfig,
  getYAxisConfig,
} from '@/lib/appex-chart-options';
import { colors } from '@/lib/colors';

interface HistoryChartProps {
  height?: number;
  series: {
    name: string;
    data: number[];
  }[];
  categories?: string[]; // Dias da semana, por exemplo
}

const HistoryChart = ({
  height = 360,
  series,
  categories = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
}: HistoryChartProps) => {
  const [config] = useConfig();
  const { theme: mode } = useTheme();

  const options: any = {
    chart: {
      toolbar: { show: false },
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    colors: [colors.primary, colors.danger],
    tooltip: {
      theme: mode === 'dark' ? 'dark' : 'light',
    },
    grid: getGridConfig(),
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 0.3,
        opacityFrom: 0.4,
        opacityTo: 0.5,
        stops: [0, 30, 100],
      },
    },
    yaxis: getYAxisConfig(
      mode === 'light' ? colors['default-600'] : colors['default-300']
    ),
    xaxis: {
      ...getXAxisConfig(
        mode === 'light' ? colors['default-600'] : colors['default-300']
      ),
      categories: categories,
    },
    legend: {
      offsetY: 4,
      show: true,
      fontSize: '12px',
      fontFamily: 'Inter',
      labels: {
        colors:
          mode === 'light' ? colors['default-600'] : colors['default-300'],
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
      width="100%"
    />
  );
};

export default HistoryChart;
