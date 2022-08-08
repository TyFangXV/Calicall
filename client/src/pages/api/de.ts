// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { decrypt } from '../../utils/encryption';



export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {v} = req.query; 
  if(v)
  {
    const d = decrypt(v as string);
    res.status(200).setHeader('Content-Type', 'text/html').send(d);
  }
  res.end();
}
