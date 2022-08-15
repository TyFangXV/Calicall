/* eslint-disable react-hooks/exhaustive-deps */
import React, {Context, useState, useEffect, useRef, createContext} from 'react'
import {io, Socket} from 'socket.io-client'
import Peer, { SimplePeer } from 'simple-peer'
import { RecoilRoot, useRecoilValue } from 'recoil'
import { UserStateAtom } from '../state'
import AuthProvider from './auth'
import { IMessage, IuserAlertMessage } from '../types'

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
    callUser : (userId:string) => void;
    connectUser : (userId:string) => void;
    startCamera : () => void;
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
    const [call, setCall] = useState<CallProps>();

    //recoil 
    const {signedIn:UserSignInStatus, id} = useRecoilValue(UserStateAtom);
    const UserVideo = useRef<HTMLVideoElement>(null);
    const localUserVideo = useRef<HTMLVideoElement>(null);
    const connectionRef = useRef<any>();

    const startCamera = () => {
        navigator.mediaDevices.getUserMedia({video: true, audio: true})
        .then(stream => {
            setStream(stream)
            if(localUserVideo.current)
            {
                localUserVideo.current.srcObject = stream
            } 
        })
    }

    const listenUserSystemAlert = (onRecieve:(data:IuserAlertMessage) => void) => {
        socket.on("userSystemAlertRecieve", (data) => {
            onRecieve(data)
        } )
    }

    const sendMessage = (message:IMessage) => {
        socket.emit("DM", message);
    }

    const answerCall = () => {
    };

    const callUser = (userId:string) => {

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
                UserVideo,
                stream,
                localUserVideo,
                answerCall,
                setLocalUser,
                startCamera,
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