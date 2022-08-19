// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next'
import { decrypt } from '../../utils/encryption';



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const {token, userID} = req.body;

    if(token && userID)
    {
        //validate a token
        const {data} = await axios.post("http://localhost:5000/auth/tokenValidation", {
            token,
            userID
        })
        if(data)
        {
            res.status(200).send(data);
        }

        if(!data)
        {
            res.status(400).send("Token not found");
        }
    }

    if(!token)
    {
        res.status(400).send("Token not found");
    }   
}
