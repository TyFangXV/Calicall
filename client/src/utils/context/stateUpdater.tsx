import React, { createContext, useEffect, useContext } from "react";
import { useRecoilState } from "recoil";
import { FriendList } from "../state";
import { SocketContext } from "./socketContext";
import axios from "axios";
import { authContext } from "./auth";

interface Props{
    children : React.ReactNode
}

//Update the user data state when a change is made, while the user is online 
export const stateUpdaterContext = createContext({});

const StateUpdaterProvider:React.FC<Props> = ({children}) => {
    const [friendRequest, setFriendRequest] = useRecoilState(FriendList);
    const {socket} = useContext(SocketContext);
    const {user, token} = useContext(authContext);
    
    
    useEffect(() => {        
        socket.on("userSystemAlert", (data:any) => {
            if(data.message.type === "FRIEND_REQUEST_UI_UPDATE")
            {
                getFriends()
                .then((res:any[]) => {
                    setFriendRequest([...res]);
                })
                .catch((err) => console.log(err));  
            }
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, socket])
    
    const getFriends = async() => {
        try {
            const {data} = await axios.get(`/api/friend/me?me=${user.id}`, {
                headers : {
                    "Content-Type" : "application/json",
                    "Authorization" : "Bearer " + `${token.token}.${user.id}`
                }
            });
            
            return data;
        } catch (error) {
            console.log(error);
            return null;
        }
    }


    return(
        <div>
            {children}
        </div>
    )
}

export default StateUpdaterProvider;