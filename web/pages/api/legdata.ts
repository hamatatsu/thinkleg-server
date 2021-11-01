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
  const client = new Client();
  await client.connect();
  const result = await client.query(
    'SELECT * from test ORDER BY id DESC LIMIT 300'
  );
  res.status(200).json(result.rows.reverse());
  client.end();
}
