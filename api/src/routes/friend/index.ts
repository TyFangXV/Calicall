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
            res.status(500).send("Server Error");
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
        let requests:any[] = []; 
        try {
            requests = await prisma.friend.findMany({
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
                include : {
                    receiver : true,
                }
            })   

            //check if the user is the receiver of the request
            if(requests.length > 0)
            {
                for(let i = 0; i < requests.length; i++)
                {
                    if(requests[i].receiverId === userID)
                    {
                        const sender = await prisma.user.findUnique({
                            where : {
                                id : requests[i].senderId
                            }
                        })
                        requests[i].receiver = sender
                    }
                }
            }

            res.status(200).send(requests);
        } catch (error) {
            res.status(400).send(error);
        }
    }else{
        res.status(400).send("Missing fields");
    }
})


router.post("/acceptRequest", async(req,res) => {
    try {
        const {senderID, receiverID, id} = req.body;
        if(senderID && receiverID && id)
        {
            const friendship = await prisma.friend.findUnique({
                where : {
                    id : id
                }
            })
            if(friendship)
            {
                await prisma.friend.update({
                    where : {
                        id : friendship.id
                    },
                    data : {
                        status : "ACCEPTED",
                        accepted : true,
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
                            message : `${senderData?.name && senderData.name} accepted your friend request`,
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

                res.status(200).send(friendship);
            }else{
                res.status(400).send("Friendship not found");
            }
        }else{
            res.status(400).send("Missing fields");
        }
    } catch (error) {
        
    }
})

router.post("/rejectRequest", async(req,res) => {
    try {
        const {senderID, receiverID} = req.body;
        if(senderID && receiverID)
        {
            const friendship = await prisma.friend.findFirst({
                where : {
                    senderId : senderID,
                    receiverId : receiverID
                }
            })
            if(friendship)
            {
                await prisma.friend.delete({
                    where : {
                        id : friendship.id
                    }
                })
                

                const userConnectionID = getUserConnectionID(receiverID);

                if(userConnectionID)
                {
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

                res.status(200).send(friendship);
            }else{
                res.status(400).send("Friendship not found");
            }
        }else{
            res.status(400).send("Missing fields");
        }
    } catch (error) {
        
    }
})
export default router