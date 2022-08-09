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

                        socket.to(userConnectionID).emit("userSystemAlert", {
                            receiverID, 
                            message : {
                                from : senderID,
                                to : receiverID,
                                message : `You have a new friend request from ${senderData?.name && senderData.name}`,
                                type : "NOTIFICATION",
                             }
                        })

                        socket.to(userConnectionID).emit("userSystemAlert", {
                            receiverID, 
                            message : {
                                from : senderID,
                                to : receiverID,
                                message : `UPDATE_UI`,
                                type : "FRIEND_REQUEST_UI_UPDATE",
                             }
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

router.post("/getRequest", async(req,res) => {
    const {userID} = req.body;

    if(userID)
    {
        try {
            const requests = await prisma.friend.findMany({
                where : {
                    OR : [
                        {
                            receiverId : userID,
                        },
                        {
                            senderId : userID,
                        }
                    ]
                },
                select : {
                    receiver : true,
                }
            })
            res.status(200).send(requests);
        } catch (error) {
            res.status(400).send(error);
        }
    }else{
        res.status(400).send("Missing fields");
    }
})

export default router