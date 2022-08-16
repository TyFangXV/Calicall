import Express from 'express'
import cors from 'cors'
import http from 'http'
import * as uuid from 'uuid'
import * as dotenv from 'dotenv'
import {Server} from 'socket.io'
import precheck from './utils/precheck'
import authRouter from './routes/auth'
import friendRouter from './routes/friend'
import messageRoute from './routes/messages'
import devRouter from './routes/dev'
import {connectedUser, NotificationProps, IuserAlertMessage, IMessage} from './types'
import { instrument } from '@socket.io/admin-ui'
import prisma from './utils/database'



dotenv.config();
const app = Express()
const server = http.createServer(app);

//middleware settings
app.use(Express.json())
app.use(cors())
app.use("/dev", devRouter)
app.use("/auth", authRouter)
app.use("/friend", friendRouter)
app.use("/message", messageRoute)
//socket.io
export const socket = new Server(server, {
    transports: ["websocket"],
    cors : {
        origin: "*",
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    }
});


app.get('/', (req, res) => res.send('Hello World!'));


//Io server
// IS - Internal Socket which is basically socket 
const connectedUser:connectedUser[] = [];

export const getUserConnectionID = (userID:string) => {
    return connectedUser.find(user => user.userId === userID)?.connectedID;
}

socket.on("connection", (IS) => {
    IS.on("initUserConnection", (userID:string) => {          
        if(!getUserConnectionID(userID))
        {
            connectedUser.push({
                userId: userID,
                connectedID: IS.id
            })
            console.log(connectedUser);
            
        }
    });

    IS.on("userSystemAlert", (data:{userID:string, message:IuserAlertMessage}) => {
        console.log(data);
        const connectedID = getUserConnectionID(data.userID);
        if(connectedID)
        {
            console.log("Notif send");
            
            socket.to(connectedID).emit("userSystemAlertRecieve", data.message);
        }else{
            console.log("user not connected");
        }
    })

    IS.on("DM", async(data:IMessage) => {
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


        if(connectedID && senderID)
        {
            //create the message in the database and send it to the reciever
            if(msg)
            {
                socket.to(connectedID).emit("DMRecieve", message);
                socket.to(senderID).emit("DMSend", message);
                socket.to(connectedID).emit("userSystemAlertRecieve", {
                    userID: data.to,
                    message : {
                        from : senderID,
                        to : data.to,
                        message : {
                            ChannelID : data.to,
                            MessageID : message.id,
                        },
                        type : "UNSEEN_MESSAGE_DM",
                     }
                })
            }

            if(!msg)
            {
                console.log("message not sent");
            }
        }else{
            socket.to(senderID as string).emit("DMSend", message);
        }
    })

    IS.on("disconnect", () => {
        console.log(`${IS.id} has disconnected`);
        connectedUser.splice(connectedUser.findIndex(user => user.connectedID === IS.id), 1);
        
    })

})



  
precheck()
    .then(({status, message}) => {
        if(status) {
            server.listen(5000, () => console.log(`Server is running on port 5000`));
        } else {
            console.log(message);
        }
    }).catch(error => console.log(error));
