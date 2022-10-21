import { createContext, FC, useContext, useEffect, useState } from "react";
import Peer from "peerjs";
import {SocketContext} from './socketContext'
import { authContext } from "./auth";

interface Props{
    children:React.ReactNode;
    localUserElement:HTMLVideoElement;
    endUserID:string;
    endUserElement:HTMLVideoElement;
}

export interface p2pCallContextProviderTypes {
    isInitializingCall : boolean;

}

export const P2PCallContext = createContext({});


const P2PCallContextProvider:FC<Props> = ({children, localUserElement, endUserID ,endUserElement}) => {
    const {socket} = useContext(SocketContext);
    const {user} = useContext(authContext);
    const [isInitializingCall, setIsInitializingCall] = useState<boolean>(true);
    const [isRingingUser, setIsRingingUser] = useState<boolean>(false);
    const [callAccepted, setIsCallAccepted] = useState<Boolean>(false);

    const peer = new Peer();

    useEffect(() => {
        socket.emit("callUser", {
            me : user.id,
            to :endUserID 
        })
    }, [socket])

    return(
        <P2PCallContext.Provider value={{
            isInitializingCall,
            isRingingUser,
            callAccepted
        }}>
            {children}
        </P2PCallContext.Provider>
    )
}