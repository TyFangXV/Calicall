// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const {me:senderID, friend:receiverID, id} = req.body;
    
    if(senderID && receiverID && id)
    {
        try {
            const {data} = await axios.post("http://localhost:5000/friend/acceptRequest", {
                senderID,
                receiverID,
                id
            })

            res.status(200).send(data);
        } catch (error) {   
            console.log("error");     
            res.status(200).send(error);
        }        
    }

    if(!senderID || !receiverID || !id)
    {
        console.log("param");
        
        res.status(200).send("Receiver not found");
    }

}
