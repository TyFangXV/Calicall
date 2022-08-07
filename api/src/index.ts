import Express from 'express'
import cors from 'cors'
import http from 'http'
import * as uuid from 'uuid'
import * as dotenv from 'dotenv'
import {Server} from 'socket.io'
import precheck from './utils/precheck'
import authRouter from './routes/auth'

interface NotificationProps {
    sender: string
    message: string
    type : string
    messenger: string
    id: string
}

interface connectedUser {
    userId: string
    connectedID: string
}


dotenv.config();
const app = Express()
const server = http.createServer(app);

//middleware settings
app.use(cors())
app.use("/auth", authRouter)

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
socket.on("connection", (IS) => {


    //users fun
    const getUserConnectionID = (userID:string) => {
        return connectedUser.find(user => user.userId === userID)?.connectedID;
    }

    IS.on("initUserConnection", (userID:string) => {
        if(!getUserConnectionID(userID))
        {
            connectedUser.push({userId : userID, connectedID : IS.id});
            console.log(connectedUser);
        }
    });

    IS.on("sendNotification", (data:NotificationProps) => {
        const userConnectionID = getUserConnectionID(data.sender);
        if(userConnectionID)
        {
          //send notification to user with a id from the server
         const x = socket.to(userConnectionID).emit("receiveNotification", {
            ...data,
            id : uuid.v4()
         });

        }else{
            console.log("user not found");
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
