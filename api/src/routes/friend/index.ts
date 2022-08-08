import { Router } from "express";
import { getUserConnectionID, socket } from "../../index";
import User from "../../utils/auth/User";
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
                     const newFriendship = await prisma.friend.create({
                            data : {
                                senderId : senderID,
                                receiverId : receiverID,
                                status : "PENDING",
                                accepted : false,
                            }
                     })
                     
                    const userConnectionID = getUserConnectionID(receiverID);

                    if(userConnectionID)
                    {
                        const senderData = await new User(senderID).getUserData(senderID);

                        socket.to(userConnectionID).emit("receiveNotification", {
                            sender : senderID,
                            receiver : receiverID,
                            message : `You have a new friend request from ${senderData?.name && senderData.name}`,
                            type : "FRIEND_REQUEST",
                         })
                    }
                     

                   res.status(200).send(newFriendship);
               }else{
                console.log(getUserConnectionID(receiverID));
                res.status(200).send(friendship);
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