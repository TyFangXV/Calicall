import { createContext, FC, useContext, useEffect, useState } from "react";
import Peer from "peerjs";
import {SocketContext} from './socketContext'
import { authContext } from "./auth";

interface Props{
    children:React.ReactNode;
    endUserID:string;
}

export interface p2pCallContextProviderTypes {
    hasInitializingCall : boolean;
    isRingingUser:boolean;
    callAccepted:boolean;
    calluser: () => void;

}

export const P2PCallContext = createContext({});


const P2PCallContextProvider:FC<Props> = ({children,  endUserID}) => {
    const {socket} = useContext(SocketContext);
    const {user} = useContext(authContext);
    const [hasInitializingCall, setIsInitializingCall] = useState<boolean>(false);
    const [isRingingUser, setIsRingingUser] = useState<boolean>(false);
    const [callAccepted, setIsCallAccepted] = useState<Boolean>(false);

    interface callSession {
        sendTo:String;
        sendFrom:string;
    }

    var callSession:callSession = {
        sendTo : "",
        sendFrom : ""
    };

    const peer = new Peer();

    const callUser = () => {
        socket.emit("callUser", {
            me : user.id,
            to :endUserID,
            peerID : peer.id
        });

        callSession = {
            sendTo: endUserID,
            sendFrom: user.id
        }
    }

    useEffect(() => {

        socket.on("CallUserSend", data => {
           if(callSession.sendTo === data.to && callSession.sendFrom === data.me)
           {
             setIsInitializingCall(true);
             setIsRingingUser(true);
           }
        })
    }, [callSession.sendFrom, callSession.sendTo, socket])

    return(
        <P2PCallContext.Provider value={{
            hasInitializingCall,
            isRingingUser,
            callAccepted,
            callUser
        }}>
            {children}
        </P2PCallContext.Provider>
    )
}

export default P2PCallContextProvider;