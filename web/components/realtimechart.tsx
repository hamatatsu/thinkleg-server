import ApexChart from 'apexcharts';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import useSWR, { useSWRConfig } from 'swr';

interface Props {
  type: string;
  device: string;
}
type Data = number[][];

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
const fetcher = (url: RequestInfo) => fetch(url).then((res) => res.json());

const RealtimeChart: NextPage<Props> = (props) => {
  const apiUrl = `/api/${props.type}/${props.device}`;
  const { data, error } = useSWR<Data, Error>(apiUrl, fetcher, {
    refreshInterval: 10000,
  });

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     void mutate(apiUrl);
  //   }, 10000);
  //   return () => clearInterval(timer);
  // }, []);
  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

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
      categories: data[0],
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
      series={[{ name: props.device, data: data[1] }]}
      type="line"
      width={800}
      height={200}
    />
  );
};

export default RealtimeChart;
