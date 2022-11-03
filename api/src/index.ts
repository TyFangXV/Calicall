import Express from 'express'
import cors from 'cors'
import http from 'http'
import * as uuid from 'uuid'
import * as dotenv from 'dotenv'
import { Server } from 'socket.io'
import precheck from './utils/precheck'
import devRouter from './routes/dev'
import authRouter from './routes/login'
import mainRouter from './routes/'
import { connectedUser, IuserAlertMessage, IMessage, ICallUser } from './types'
import sessoion from 'express-session'
import connectRedis from 'connect-redis'
import prisma from './utils/database'
import { redisClient } from './utils/redis'
import {ExpressPeerServer} from 'peer'
import logger from './utils/logger'



dotenv.config();
const app = Express()
const server = http.createServer(app);
const RedisStore = connectRedis(sessoion);


//peer server
const peerServer = ExpressPeerServer(server, {
    proxied: true,
    path: '/peer',
});



//middleware settings
app.use(Express.json())
app.use(cors(
    {
        origin: process.env.NODE_ENV === 'production' ? 'https://www.chat-app.com' : '*',
        credentials: true
    }
))
app.use("/auth", authRouter)
app.use("/dev", devRouter)
app.use("/", mainRouter)

//socket.io
export const socket = new Server(server, {
    transports: ["websocket"],
    cors: {
        origin: "*",
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    }
});




//Io server
// IS - Internal Socket which is basically socket 
const connectedUser: connectedUser[] = [];

export const getUserConnectionID = (userID: string) => {
    return connectedUser.find(user => user.userId === userID)?.connectedID;
}

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
        if (connectedID)socket.to(connectedID).emit("userSystemAlertRecieve", data.message);
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
	IS.on("callUser", (data:ICallUser) => {
        console.log("data");
        
        const recieverID = getUserConnectionID(data.to);
        const senderID = getUserConnectionID(data.me);
        if(recieverID && senderID)
        {
            socket.to(recieverID).emit("callFromFriend", data);
            socket.to(senderID).emit("CallUserSend", {...data, callsend:true});
            
        }else{
            console.log("User not found in online chat")
        }
	});

	IS.on("answerCall", (data) => {
        const recieverID = getUserConnectionID(data.to);
        if(recieverID)
        {
            socket.to(recieverID).emit("callAccepted", data.id);
        }
	});

    IS.on("disconnect", () => {
        console.warn(`${IS.id} has disconnected`);
        socket.emit("userLeft", connectedUser.find(user => user.connectedID === IS.id)?.userId);
        connectedUser.splice(connectedUser.findIndex(user => user.connectedID === IS.id), 1);
    })

})





precheck()
    .then(({ status, message }) => {
        if (status) {
            server.listen(5000, () => console.log("Server started"));
        } else {
            console.error(message);
        }
    }).catch(error => console.log(error));
