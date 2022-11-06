import { Server, Socket } from "socket.io";
import * as uuid from 'uuid'
import prisma from '../utils/database'
import { redisClient } from '../utils/redis'
import { connectedUser, IuserAlertMessage, IMessage, ICallUser } from '../types'
import { DefaultEventsMap } from "socket.io/dist/typed-events";


const MainSocket = async (socket: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, getUserConnectionID: (userID: string) => string | undefined, connectedUser: connectedUser[],) => {
    socket.on("connection", (IS) => {
        IS.on("initUserConnection", (userID: string) => {
            if (!getUserConnectionID(userID)) {
                connectedUser.push({
                    userId: userID,
                    connectedID: IS.id
                })
                console.log(connectedUser);

            }
        });

        IS.on("userSystemAlert", (data: { userID: string, message: IuserAlertMessage }) => {
            const connectedID = getUserConnectionID(data.userID);
            if (connectedID) socket.to(connectedID).emit("userSystemAlertRecieve", data.message);
        })

        IS.on("DM", async (data: IMessage) => {
            const connectedID = getUserConnectionID(data.to);
            const senderID = getUserConnectionID(data.from);
            const message = {
                ...data,
                id: uuid.v4(),
                created_at: new Date()
            }

            const msg = await prisma.dMMessage.create({
                data: {
                    ...message,
                }
            })


            if (connectedID && senderID) {
                //create the message in the database and send it to the reciever
                if (msg) {
                    socket.to(connectedID).emit("DMRecieve", message);
                    socket.to(senderID).emit("DMSend", message);
                    socket.to(connectedID).emit("userSystemAlertRecieve", {
                        userID: data.to,
                        message: {
                            from: senderID,
                            to: data.to,
                            message: {
                                UserID: data.from,
                                MessageID: message.id,
                            },
                            type: "UNSEEN_MESSAGE_DM",
                        }
                    })
                }

                if (!msg) {
                    console.warn("message not sent");
                }
            } else {
                socket.to(senderID as string).emit("DMSend", message);
            }
        })

        //call user
        IS.on("callUser", (data: ICallUser) => {
            const recieverID = getUserConnectionID(data.to);
            const senderID = getUserConnectionID(data.me);
            if (recieverID && senderID) {
                socket.to(recieverID).emit("callFromFriend", data);
                socket.to(senderID).emit("CallUserSend", { ...data, callsend: true });

            } else {
                console.log("User not found in online chat")
            }
        });

        IS.on("answerCall", (data: any) => {
            const recieverID = getUserConnectionID(data.to);
            if (recieverID) {
                socket.to(recieverID).emit("callAccepted", data.id);
            }
        });

        IS.on("disconnect", () => {
            console.warn(`${IS.id} has disconnected`);
            socket.emit("userLeft", connectedUser.find(user => user.connectedID === IS.id)?.userId);
            connectedUser.splice(connectedUser.findIndex(user => user.connectedID === IS.id), 1);
        })

    })
}


export default MainSocket