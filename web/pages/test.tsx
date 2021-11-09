import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import RealtimeChart from '../components/realtimechart';

type Data = number[][];

const fetcher = (url: RequestInfo): Promise<Data> =>
  fetch(url).then((r) => r.json() as Data);

const Test: NextPage = () => {
  const device = 'test';
  const apiUrl = `/api/legdata/?device=${device}&limit=6000`;
  const [chartData, setchartData] = useState<Data>();
  const { mutate } = useSWRConfig();
  const { data } = useSWR(apiUrl, fetcher);

  useEffect(() => {
    if (data) {
      setchartData(data);
    }
  }, [data]);

  useEffect(() => {
    const timer = setInterval(() => {
      void mutate(apiUrl);
    }, 500);
    return () => clearInterval(timer);
  });

  return (
    <>
      <Head>
        <title>Test Page</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="app">
        <div className="row">
          {chartData && (
            <div className="mixed-chart">
              <RealtimeChart
                series={[{ name: device, data: chartData }]}
                range={100000}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Test;
