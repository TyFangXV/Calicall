import Express from 'express'
import cors from 'cors'
import http from 'http'
import * as dotenv from 'dotenv'
import { Server } from 'socket.io'
import precheck from './utils/precheck'
import devRouter from './routes/dev'
import authRouter from './routes/login'
import mainRouter from './routes/'
import { connectedUser, IuserAlertMessage, IMessage, ICallUser } from './types'
import sessoion from 'express-session'
import connectRedis from 'connect-redis'
import {ExpressPeerServer} from 'peer'
import MainSocket from './socket'



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

MainSocket(socket, getUserConnectionID, connectedUser);



precheck()
    .then(({ status, message }) => {
        if (status) {
            server.listen(5000, () => console.log("Server started"));
        } else {
            console.error(message);
        }
    }).catch(error => console.log(error));
