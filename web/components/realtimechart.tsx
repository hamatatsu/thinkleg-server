import ApexChart from 'apexcharts';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface Props {
  series: Array<{ name: string; data: Array<{ x: number; y: number }> }>;
  height: number;
  range: number;
}

const RealtimeChart: NextPage<Props> = (props) => {
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
        enabled: false,
      },
    },
    stroke: {
      width: 1,
      curve: 'straight',
    },
    tooltip: {
      enabled: false,
    },
    xaxis: {
      type: 'datetime',
      range: props.range,
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

  return (
    <Chart
      options={options}
      series={props.series}
      type="line"
      width={1000}
      height={props.height}
    />
  );
};

export default RealtimeChart;
