import ApexChart from 'apexcharts';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface Props {
  series: number[];
  categories: Date[];
}

const RealtimeChart: NextPage<Props> = (props) => {
  const labelFormatter = (value: string): string => {
    const d = new Date(value);
    return (
      d.toLocaleTimeString('ja-JP', { hour12: false }) +
      `.${('000' + d.getMilliseconds().toString()).slice(-3)}`
    );
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
      type: 'numeric',
      categories: props.categories,
      tickAmount: 10,
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
      width={1600}
      height={900}
    />
  );
};

export default RealtimeChart;
