/* eslint-disable react-hooks/exhaustive-deps */
import React, {Context, useState, useEffect, useRef, createContext, useContext, SetStateAction, Dispatch} from 'react'
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
    setStream: Dispatch<SetStateAction<MediaStream | undefined>>;
    answerCall : () => void;
    leaveCall : () => void;
    callUser : (userId:string, friendID:string) => void;
    connectUser : (userId:string) => void;
    sendMessage : (message:IMessage) => void;
    sendNotification : (notification:NotificationProps) => void;
    setVideoStatus: Dispatch<SetStateAction<boolean>>;
    setAudioStatus: Dispatch<SetStateAction<boolean>>;
    stopBothVideoAndAudio : (stream:MediaStream) => void;
    stopVideoOnly : (stream:MediaStream) => void;
    stopAudioOnly : (stream:MediaStream) => void;
    videoStatus:boolean;
    audioStatus:boolean;
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

    //User video settings
    const [videoStatus, setVideoStatus] = useState(false);
    const [audioStatus, setAudioStatus] = useState(true);

    const UserVideo = useRef<HTMLVideoElement>(null);
    const localUserVideo = useRef<HTMLVideoElement>(null);
    const connectionRef = useRef<any>();






    const stopBothVideoAndAudio =  (stream:MediaStream) => {
        stream.getTracks().forEach(function(track) {
            if (track.readyState == 'live') {
                track.stop();
            }
        });
    }

    // stop only camera
    const stopVideoOnly = (stream:MediaStream) => {
        stream.getTracks().forEach((track) => {
            if (track.readyState == 'live' && track.kind === 'video') {
                track.stop();
            }
        });
    }

    // stop only mic
    const stopAudioOnly = (stream:MediaStream) => {
        stream.getTracks().forEach((track) => {
            if (track.readyState == 'live' && track.kind === 'audio') {
                track.stop();
            }
        });
    }

    const sendMessage = (message:IMessage) => {
        socket.emit("DM", message);
    }

    const answerCall = () => {

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
                UserVideo,
                stream,
                localUserVideo,
                socket,
                videoStatus,
                audioStatus,
                answerCall,
                setLocalUser,
                connectUser,
                leaveCall,
                callUser,
                sendNotification,
                setAudioStatus,
                setVideoStatus,
                sendMessage,
                setStream,
                stopAudioOnly,
                stopVideoOnly,
                stopBothVideoAndAudio
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