import type { NextApiRequest, NextApiResponse } from 'next';
import { Client } from 'pg';

type TableName = {
  table_name: string;
};
type Data = number[][];

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
        return s;
      })
    );
    const lengths = stds.map((value) => value[1].length);
    const max_length = lengths.reduce((p, c) => Math.max(p, c));
    const max_index = lengths.findIndex((value) => value === max_length);
    const sum = Array(max_length).fill(0) as number[];
    stds.forEach((value) => {
      const std = value[1];
      std.forEach((value, index) => (sum[index] = sum[index] + value));
    });
    const dates = stds[max_index][0];
    res.status(200).json([dates, sum]);
  } catch (error) {
    res.status(400).send({ message: 'sql failed' });
  }
  await client.end();
}
