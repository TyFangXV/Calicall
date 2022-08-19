// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const {me:userID, friend:senderID} = req.body;

    if(senderID && userID)
    {
        try {
            const {data} = await axios.post("http://localhost:5000/message/get", {
                userID,
                senderID
            }, {
                headers: {
                    authorization : req.headers.authorization as string
                }
            })

            res.status(200).send(data);
        } catch (error) {   
            res.status(400).send(error);
        }        
    }

    if(!senderID || !userID)
    {
        res.status(400).send("Param not found");
    }

}
