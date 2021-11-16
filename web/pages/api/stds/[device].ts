import type { NextApiRequest, NextApiResponse } from 'next';
import { Client } from 'pg';
import { std } from '../../../lib/std';

type Data = {
  id: number;
  date: number;
  leg: number;
};

const windowSize = 3000;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { device } = req.query;
  if (!device || Array.isArray(device)) {
    res.send(400);
    return;
  }
  const client = new Client();
  await client.connect();
  try {
    const result = await client.query(`SELECT * from ${device} ORDER BY date`);
    const date = result.rows.map((value: Data) =>
      new Date(value.date).getTime()
    );
    const leg = result.rows.map((value: Data) => value.leg);
    const stds = leg.map((value, index): number => {
      if (index < 1) return 0;
      if (index < windowSize) return std(leg.slice(0, index + 1));
      return std(leg.slice(index - windowSize, index + 1));
    });
    const array = [date, stds];
    res.status(200).json(array);
  } catch (error) {
    console.error(error);
    res.send(400);
  }
  await client.end();
}
