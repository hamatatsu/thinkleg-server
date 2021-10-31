import ApexChart from 'apexcharts';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const tooltipFormatter = (value: number): string => {
  const d = new Date(value);
  return d.toLocaleTimeString('ja-JP') + `.${d.getMilliseconds()}`;
};
const labelFormatter = (value: string, timestamp: number): string => {
  const d = new Date(timestamp);
  return d.toLocaleTimeString('ja-JP') + `.${d.getMilliseconds()}`;
};
const options = {
  chart: {
    zoom: {
      enabled: false,
    },
    animations: {
      easing: 'linear',
      dynamicAnimation: {
        speed: 500,
      },
    },
  },
  tooltip: {
    x: {
      formatter: tooltipFormatter,
    },
  },
  xaxis: {
    type: 'datetime',
    range: 5000,
    labels: {
      formatter: labelFormatter,
    },
  },
  yaxis: {
    labels: {
      formatter: (val) => val.toFixed(0),
    },
    min: 0,
    max: 500,
    title: { text: 'Value' },
  },
} as ApexChart.ApexOptions;

interface Props {
  series: Array<{ name: string; data: Array<{ x: number; y: number }> }>;
}

const RealtimeChart: NextPage<Props> = (props) => {
  return (
    <Chart options={options} series={props.series} type="line" width={1000} />
  );
};

export default RealtimeChart;
