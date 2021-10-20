import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import RealtimeChart from '../components/realtimechart';


const Test: NextPage = () => {
  const nameList = ["a"];
  const defaultDataList = nameList.map(name => ({
    name: name,
    data: []
  } as { name: string, data: Array<{ x: number, y: number }> }));
  const [dataList, setDataList] = useState(defaultDataList)

  useEffect(() => {
    const addDataRandomly = (data: Array<{ x: number, y: number }>) => {
      return [
        ...data,
        {
          x: Date.now(),
          y: 500 * Math.random() // データの量に応じて最大値が増えるランダムな数
        }
      ];
    };
    const interval = setInterval(() => {
      setDataList(
        dataList.map(val => { // ラベルごとにデータを更新する
          return {
            name: val.name,
            data: addDataRandomly(val.data)
          };
        })
      );
    }, 20);
    return () => clearInterval(interval);
  }, [dataList])

  return (
    <>
      <Head>
        <title>Test Page</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="app">
        <div className="row">
          <div className="mixed-chart">
            <RealtimeChart
              dataList={dataList}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default Test
