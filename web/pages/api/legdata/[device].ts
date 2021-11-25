import type { NextApiRequest, NextApiResponse } from 'next';
import { Client } from 'pg';

type Data = {
  id: number;
  date: number;
  leg: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { device } = req.query;
  if (!device || Array.isArray(device)) {
    res.status(400).send({ message: 'no device' });
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
    const array = [date, leg];
    res.status(200).json(array);
  } catch (error) {
    res.status(400).send({ message: 'sql failed' });
  }
  await client.end();
}
