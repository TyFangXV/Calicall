import { Router } from "express";
import prisma from "../../utils/database";

const router = Router();

router.post("/invite", async(req,res) => {
    const {senderID, receiverID} = req.body;
    
    if(senderID && receiverID)
    {
        try {
            //validate receiverID
            const receiver = await prisma.user.findUnique({
                where : {
                    id : receiverID
                }
            });

            if(receiver)
            {
               const friendship = await prisma.friend.findFirst(
                {
                    where : {
                        senderId : senderID,
                        receiverId : receiverID
                    }
                }
               )

               if(!friendship)
               {


                   res.status(200).send(newFriendship);
               }
            }

            if(!receiver)
            {
                res.status(400).send("Receiver not found");
            }
        } catch (error) {
            
        }

    }

    if(!senderID || !receiverID)
    {
        res.status(400).send("Missing fields");
    }
})

export default router