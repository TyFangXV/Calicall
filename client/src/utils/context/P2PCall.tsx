import { createContext, FC, useContext, useEffect, useState } from "react";
import Peer from "peerjs";
import {SocketContext} from './socketContext'
import { authContext } from "./auth";
import { useRecoilValue } from "recoil";
import { currentFriend } from "../state";

interface Props{
    children:React.ReactNode;
}

export interface p2pCallContextProviderTypes {
    hasInitializingCall : boolean;
    isRingingUser:boolean;
    callAccepted:boolean;
    callUser: () => boolean;

}

const placeHolderData:p2pCallContextProviderTypes = {
    hasInitializingCall: false,
    isRingingUser: false,
    callAccepted: false,
    callUser: () => {console.log("deez"); return false},
}

export const P2PCallContext = createContext(placeHolderData);


const P2PCallContextProvider:FC<Props> = ({children}) => {
    const {socket} = useContext(SocketContext);
    const {user} = useContext(authContext);
    const [hasInitializingCall, setIsInitializingCall] = useState<boolean>(false);
    const [isRingingUser, setIsRingingUser] = useState<boolean>(false);
    const [callAccepted, setIsCallAccepted] = useState<boolean>(false);
    const endUserID = useRecoilValue(currentFriend).id;
    
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
        if(endUserID)
        {
            socket.emit("callUser", {
                me : user.id,
                to :endUserID,
                peerID : peer.id
            });
    
            callSession = {
                sendTo: endUserID,
                sendFrom: user.id
            }
            return true;
        }else{
            console.log("Failed to get id");
            
            return false;
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