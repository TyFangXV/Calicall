import { Router } from "express";
import prisma from "../../utils/database";


const router = Router();

router.post("/get", async(req, res) => {
    const { userID, senderID } = req.body;
    if(userID && senderID)
    {
        
        try {
            const messages = await prisma.dMMessage.findMany({
                where: {
                    OR : [
                        {
                            from: userID,
                            to: senderID
                        },
                        {
                            from: senderID,
                            to: userID
                        }
                    ]
                }
            })

            res.status(200).send(messages)
        } catch (error) {
            res.status(500).send("Error has occured")
        }
    }

    if(!userID || !senderID)
    {
        res.status(400).send("param is required");
    }
})


export default router;