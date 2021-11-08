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
  const { device, limit } = req.query;
  if (!limit) {
    res.send(400);
    return;
  }
  const client = new Client();
  await client.connect();
  try {
    const result = await client.query(
      `SELECT * from ${device} ORDER BY date DESC LIMIT ${limit}`
    );
    const array = result.rows.map((value) => [value.date, value.leg]);
    res.status(200).json(array);
  } catch (error) {
    console.error(error);
    res.send(400);
  }
  client.end();
}
