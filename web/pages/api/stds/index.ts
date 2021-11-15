import type { NextApiRequest, NextApiResponse } from 'next';
import { Client } from 'pg';

type TableName = {
  table_name: string;
};
type Data = number[][];

const windowSize = 3000;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = new Client();
  await client.connect();
  try {
    const result = await client.query(
      "SELECT table_name FROM information_schema.tables WHERE table_type='BASE TABLE'AND table_schema='public'"
    );
    const devices = result.rows.map((value: TableName) => value.table_name);
    const stds = await Promise.all(
      devices.map(async (value: string) => {
        const s = (await (
          await fetch(`http://localhost:3000/api/stds/${value}`)
        ).json()) as Data;
        console.log(s);
        return s;
      })
    );
    res.status(200).json(stds);
  } catch (error) {
    console.error(error);
    res.send(400);
  }
  await client.end();
}
