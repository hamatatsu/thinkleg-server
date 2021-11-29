import type { NextPage } from 'next';
import Head from 'next/head';
import RealtimeChart from '../components/realtimechart';

const Test: NextPage = () => {
  return (
    <>
      <Head>
        <title>Test AVG</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="app">
        <div className="row">
          <div className="mixed-chart">
            <RealtimeChart type="stds" device="test" />
            <RealtimeChart type="average" device="" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Test;
