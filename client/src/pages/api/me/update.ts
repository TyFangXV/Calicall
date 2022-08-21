// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next'



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const {token, userID, refreshToken} = req.body;

    if(token && userID && refreshToken)
    {
        //validate a token
        const {data} = await axios.post("http://localhost:5000/auth/updateToken", {
            token,
            userID,
            refreshToken
        })
        if(data)
        {
            res.status(200).send(data);
        }
    }

    if(!token || !userID || !refreshToken)
    {
        res.status(400).send("Token not found");
    }   
}
