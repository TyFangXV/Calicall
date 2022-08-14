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
        const connectedID = getUserConnectionID(data.userID);
        if(connectedID)
        {
            socket.to(connectedID).emit("userSystemAlertRecieve", data.message);
        }else{
            console.log("user not connected");
        }
    })

    IS.on("DM", (data:IMessage) => {
        const connectedID = getUserConnectionID(data.to);
        console.log(data);
        
        if(connectedID)
        {
            socket.to(connectedID).emit("DMRecieve", data);
        }else{
            console.log("user not connected");
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
