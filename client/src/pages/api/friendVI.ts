// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const {me:userID} = req.query;

    
    if(userID)
    {
        try {
            const {data} = await axios.post("http://localhost:5000/friend/getRequest", {
                userID
            })

            res.status(200).send(data);
        } catch (error) {   
            res.status(400).send(error);
        }        
    }

    if(!userID)
    {
        res.status(400).send("ID not found");
    }

}
