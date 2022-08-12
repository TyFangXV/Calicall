/* eslint-disable react-hooks/exhaustive-deps */
import React, {Context, useState, useEffect, useRef, createContext} from 'react'
import {io, Socket} from 'socket.io-client'
import Peer, { SimplePeer } from 'simple-peer'
import { RecoilRoot, useRecoilValue } from 'recoil'
import { UserStateAtom } from '../state'
import AuthProvider from './auth'
import { IuserAlertMessage } from '../types'

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
    setLocalUser : (name:string) => void;
    answerCall : () => void;
    leaveCall : () => void;
    callUser : (userId:string) => void;
    connectUser : (userId:string) => void;
    startCamera : () => void;
    sendNotification : (notification:NotificationProps) => void;
    socket : Socket;
    listenUserSystemAlert : (onRecieve:(data:IuserAlertMessage) => void) => void;
} 

type CallProps = {
    [key:string]:any
}


const socket = io("http://localhost:5000");

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
    

    useEffect(() => {
        socket.on("callUser", ({from, localUser:CallerName, signal}) => {
            setCall({
                isRecivingCall: true,
                CallerName,
                from,
                signal
            })
        })
    }, [])

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

    const answerCall = () => {
        setCallAccepted(true);

        const peer = new Peer({
            initiator: false,
            stream: stream,
            trickle: false
        })

        peer.on("signal", data => {
            socket.emit("acceptCall", {
                signal : data,
                to : call?.from
            })
        })

        peer.on('stream', currentStream => {
            if(UserVideo.current)
            {
                UserVideo.current.srcObject = currentStream
            } 
        })

        peer.signal(call?.signal);

        connectionRef.current = peer;
    };

    const callUser = (userId:string) => {
        const peer = new Peer({
            initiator: true,
            stream: stream,
            trickle: false
        })

        peer.on("signal", data => {
            socket.emit("callUser", {
                userToCall: userId,
                signal: data,
                from: localUser,
            })
        })

        peer.on('stream', currentStream => {
            if(UserVideo.current)
            {
                UserVideo.current.srcObject = currentStream
            } 
        })

        socket.on("acceptCall", (signal) => {
            setCallAccepted(true);
            peer.signal(signal);
        })


        connectionRef.current = peer;
    };

    const leaveCall = () => {
        setCallEnded(true);

        connectionRef.current.destroy();

        window.location.reload();
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
                listenUserSystemAlert
            }}>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </SocketContext.Provider>            
    )

}

export {SocketContext, SocketContextProvider}