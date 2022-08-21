// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const {me:senderID, friend:receiverID} = req.body;

    
    if(senderID && receiverID)
    {
        try {
            const {data} = await axios.post("http://localhost:5000/friend/rejectRequest", {
                senderID,
                receiverID
            },{
                headers: {
                    authorization : req.headers.authorization as string
                }
            })

            res.status(200).send(data);
        } catch (error) {   
            res.status(400).send(error);
        }        
    }

    if(!senderID || !receiverID)
    {
        res.status(400).send("Receiver not found");
    }

}
