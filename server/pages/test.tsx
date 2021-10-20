import type { NextPage } from 'next'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import ApexChart from 'apexcharts'
import { useEffect, useState } from 'react'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

const Test: NextPage = () => {
  const nameList = ["a"];
  const defaultDataList = nameList.map(name => ({
    name: name,
    data: []
  } as { name: string, data: Array<{ x: number, y: number }> }));
  const [dataList, setDataList] = useState(defaultDataList)

  const options = {
    chart: {
      zoom: {
        enabled: false
      },
      animations: {
        easing: "linear",
        dynamicAnimation: {
          speed: 500
        }
      }
    },
    tooltip: {
      x: {
        format: "yyyy/MM/dd HH:mm:ss.fff"
      }
    },
    xaxis: {
      type: "datetime",
      range: 30000
    },
    yaxis: {
      labels: {
        formatter: val => val.toFixed(0)
      },
      title: { text: "Value" }
    }
  } as ApexChart.ApexOptions
  useEffect(() => {
    const addDataRandomly = (data: Array<{ x: number, y: number }>) => {
      // 指定した確率`ADDING_DATA_RATIO`でデータを追加する
      // if (Math.random() < 1 - 0.8) {
      //   return data;
      // }

      return [
        ...data,
        {
          x: Date.now(),
          y: data.length * Math.random() // データの量に応じて最大値が増えるランダムな数
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
    }, 500);

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
            <Chart
              options={options}
              series={dataList}
              type="line"
              width={1000}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default Test
