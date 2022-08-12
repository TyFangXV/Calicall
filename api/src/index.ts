import Express from 'express'
import cors from 'cors'
import http from 'http'
import * as uuid from 'uuid'
import * as dotenv from 'dotenv'
import {Server} from 'socket.io'
import precheck from './utils/precheck'
import authRouter from './routes/auth'
import friendRouter from './routes/friend'
import {connectedUser, NotificationProps, IuserAlertMessage} from './types'



dotenv.config();
const app = Express()
const server = http.createServer(app);

//middleware settings
app.use(require('express-status-monitor')())
app.use(Express.json())
app.use(cors())
app.use("/auth", authRouter)
app.use("/friend", friendRouter)
//socket.io
export const socket = new Server(server, {
    cors : {
        origin: '*',
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


    //users fun
    const getUserConnectionID = (userID:string) => {
        return connectedUser.find(user => user.userId === userID)?.connectedID;
    }

    IS.on("initUserConnection", (userID:string) => {   
        console.log("userID");
                  
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
