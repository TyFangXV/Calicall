/* eslint-disable react-hooks/exhaustive-deps */
import React, {Context, useState, useEffect, useRef, createContext, useContext} from 'react'
import {io, Socket} from 'socket.io-client'
import Peer, { SimplePeer } from 'simple-peer'
import { RecoilRoot, useRecoilValue } from 'recoil'
import AuthProvider, { authContext } from './auth'
import { ICallUser, IMessage, IuserAlertMessage } from '../types'

interface Props {
    children: React.ReactNode
}

interface NotificationProps {
    sender: string
    message: string
    messenger: string
}

type ContextType = {
    stream: MediaStream | undefined;
    localUser:String;
    callAccepted: boolean;
    callEnded: boolean;
    call: any;
    UserVideo: React.RefObject<HTMLVideoElement>;
    localUserVideo: React.RefObject<HTMLVideoElement>;
    socket : Socket;
    setLocalUser : (name:string) => void;
    answerCall : () => void;
    leaveCall : () => void;
    callUser : (userId:string, friendID:string) => void;
    connectUser : (userId:string) => void;
    startCamera : (camera:boolean, audio:boolean) => void;
    sendMessage : (message:IMessage) => void;
    sendNotification : (notification:NotificationProps) => void;
    listenUserSystemAlert : (onRecieve:(data:IuserAlertMessage) => void) => void;
} 

type CallProps = {
    [key:string]:any
}


const socket = io("http://localhost:5000", {
    transports: ["websocket"],
});

const SocketContext = createContext({} as ContextType);

const SocketContextProvider:React.FC<Props> = ({children}) => {
    const [stream, setStream] = useState<MediaStream>();
    const [localUser, setLocalUser] = useState<string>("");
    const [callAccepted, setCallAccepted] = useState<boolean>(false);
    const [callEnded, setCallEnded] = useState<boolean>(false);
    const [call, setCall] = useState<ICallUser>();

    const UserVideo = useRef<HTMLVideoElement>(null);
    const localUserVideo = useRef<HTMLVideoElement>(null);
    const connectionRef = useRef<any>();

    const startCamera = (camera:boolean, audio:boolean) => {
        navigator.mediaDevices.getUserMedia({video: camera, audio: audio})
        .then(stream => {
            setStream(stream)
            if(localUserVideo.current)
            {
                localUserVideo.current.srcObject = stream
            } 
        })
        .catch(err => {
            if(err.name == "TypeError")
            {
                return null;
            }else{
                console.log(err)
            }
        })
    }

    useEffect(() => {
        socket.on("CallUser", (data:ICallUser) => {
            setCall(data)
            console.log("call recivieds");
            
        })
    }, [])

    const listenUserSystemAlert = (onRecieve:(data:IuserAlertMessage) => void) => {
        socket.on("userSystemAlertRecieve", (data) => {
            onRecieve(data)
        } )
    }

    const sendMessage = (message:IMessage) => {
        socket.emit("DM", message);
    }

    const answerCall = () => {
        setCallAccepted(true);

        const peer =  new Peer({
            initiator: false,
            stream: stream,
            trickle: false,

        })

        peer.on("signal", (data:ICallUser) => {
            socket.emit("answerCall", data)   
        })

        peer.on("stream", (stream:MediaStream) => {
            if(UserVideo.current)
            {
                UserVideo.current.srcObject = stream
            }
        })

        if(call?.signal)
        {
            peer.signal(call.signal);
        }else{
            console.log("No call")
        }

        connectionRef.current = peer;
    };

    const callUser = (userId:string, friendID:string) => {

        const data:ICallUser = {
            to : friendID,
            me : userId,
            signal : "XXS"
        }

        socket.emit("callUser", data) 
    };

    const leaveCall = () => {

    };

    const sendNotification = ({messenger, sender, message}:NotificationProps) => {
        socket.emit("sendNotification", {
            messenger,
            sender,
            message
        })
        console.log("sendNotification");
        
    }

    const connectUser = (userId:string) => {
        socket.emit("initUserConnection", userId);
    }

    return(
            <SocketContext.Provider value={{
                localUser,
                call,
                callAccepted,
                callEnded,
                startCamera,
                UserVideo,
                stream,
                localUserVideo,
                answerCall,
                setLocalUser,
                connectUser,
                leaveCall,
                callUser,
                sendNotification,
                socket,
                listenUserSystemAlert,
                sendMessage
            }}>
                <RecoilRoot>
                    <AuthProvider>
                        {children}
                    </AuthProvider>
                </RecoilRoot>
            </SocketContext.Provider>
    )
}

export {SocketContext, SocketContextProvider}