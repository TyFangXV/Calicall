import { createContext, FC, useContext, useEffect, useState } from "react";
import Peer from "peerjs";
import {SocketContext} from './socketContext'
import { authContext } from "./auth";
import { useRecoilState, useRecoilValue } from "recoil";
import { callSessionAtom, currentFriend, userCalled as isUserBeingCalled } from "../state";
import { ICallUser } from "../types";

interface Props{
    children:React.ReactNode;
}

export interface p2pCallContextProviderTypes {
    hasInitializingCall : boolean;
    isRingingUser:boolean;
    callAccepted:boolean;
    callUser: () => boolean;
    userCalled:boolean;

}

const placeHolderData:p2pCallContextProviderTypes = {
    hasInitializingCall: false,
    isRingingUser: false,
    callAccepted: false,
    userCalled: false,
    callUser: () => {console.log("deez"); return false},
}

export const P2PCallContext = createContext(placeHolderData);


const P2PCallContextProvider:FC<Props> = ({children}) => {
    const {socket} = useContext(SocketContext);
    const {user} = useContext(authContext);
    const [hasInitializingCall, setIsInitializingCall] = useState<boolean>(false);
    const [isRingingUser, setIsRingingUser] = useState<boolean>(false);
    const userCalled = useRecoilValue(isUserBeingCalled);
    const [callAccepted, setIsCallAccepted] = useState<boolean>(false);
    const endUserID = useRecoilValue(currentFriend).id;
    const [callSession, setCallSession] = useRecoilState(callSessionAtom);


    const callUser = () => {
        if(endUserID)
        {
            socket.emit("callUser", {
                me : user.id,
                to :endUserID,
                //peerID : peer.id
            });
    
             setCallSession({
                sendTo: endUserID,
                sendFrom: user.id
            })
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
                console.log(callSession);
                
             setIsInitializingCall(true);
             setIsRingingUser(true);
           }
        })
    }, [callSession.sendFrom, callSession.sendTo, user.id])

    return(
        <P2PCallContext.Provider value={{
            hasInitializingCall,
            isRingingUser,
            callAccepted,
            userCalled,
            callUser
        }}>
            {children}
        </P2PCallContext.Provider>
    )
}

export default P2PCallContextProvider;