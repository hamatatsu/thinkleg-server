import ApexChart from 'apexcharts';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import useSWR from 'swr';

interface Props {
  type: string;
  device: string;
}
type Data = number[][];
class FetchError extends Error {
  info: unknown;
  status: number;
  constructor(e?: string, info?: string, status?: number) {
    super(e);
    this.name = new.target.name;
    Object.setPrototypeOf(this, new.target.prototype);
    this.info = info ? info : {};
    this.status = status ? status : 500;
  }
}

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
const fetcher = async (url: RequestInfo) => {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new FetchError('An error occurred while fetching the data.');
    error.info = (await res.json()) as { message: string };
    error.status = res.status;
    throw error;
  }

  return res.json();
};

const RealtimeChart: NextPage<Props> = (props) => {
  const apiUrl = `/api/${props.type}/${props.device}`;
  const { data, error } = useSWR<Data, Error>(apiUrl, fetcher, {
    refreshInterval: 10000,
  });
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
