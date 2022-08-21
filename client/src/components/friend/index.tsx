import React, { useContext, useEffect, useState } from "react";
import styles from './styles.module.css';
import axios from "axios";
import { authContext } from "../../utils/context/auth";
import { IFriendRequest } from "../../utils/types";
import { SocketContext } from "../../utils/context/socketContext";
import * as uuid from 'uuid'
import Accept_Tab from "./cards/Accept_tab";
import Invite_Tab from "./cards/invite_tab";

const Friend:React.FC = () => {
    const {socket} = useContext(SocketContext);
    const friendDivRef = React.useRef<HTMLDivElement>(null);
    const friendRef = React.useRef<HTMLInputElement>(null);
    const {user, friends, token} = useContext(authContext);
    const [friendRequest, setFriendRequest] = useState<IFriendRequest[]>([...friends]);

    useEffect(() => {        
        socket.on("userSystemAlert", (data:any) => {
            if(data.message.type === "FRIEND_REQUEST_UI_UPDATE")
            {
                getFriends()
                .then((res:any[]) => {
                    setFriendRequest([...res]);
                    console.log(friendRequest);
                    
                })
                .catch((err) => console.log(err));  
            }
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, socket])
    

    //check if the user's friend is online
    const isOnline = (id:string) => {
        socket.on("isOnline", data => {

        });
    }



    const sendFriendRequest = async() => {
        if(friendRef.current?.value)
        {
            try {
            const {data} =  await axios.post(`/api/friend/invite`, {
                    friend : friendRef.current?.value,
                    me : user.id
            }, {
                headers : {
                    "Content-Type" : "application/json",
                    "Authorization" : "Bearer " + `${token.token}.${user.id}`
                }
            })
                getFriends()
                .then((res:any[]) => {
                    setFriendRequest([...res]);
                    console.log(friendRequest);
                    
                })
                .catch((err) => console.log(err));  
                return null;
            } catch (error) {
                console.log(error);
                return null;
            }            
        }else{
            return null;
        }
    }




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


    const Input:React.FC = () => {
        return (
            <div>
                <input ref={friendRef} className={styles.input} placeholder="Enter User's ID"/>
                <button onClick={async() => await sendFriendRequest()} className={styles.sendBtn}>Send</button>
            </div>
        )
    }



    const FriendList:React.FC = () => {
        return (
            <div className={styles.list}>
            {
                friendRequest.length === 0 ? (
                    <div>
                        <p className={styles.boilerplate}>No friend requests</p>
                    </div>
                ) : (
                    <div>
                        {
                            friendRequest.map((friend, index) => {
                                switch(friend.status)
                                {
                                    case "PENDING":
                                        return <Invite_Tab 
                                            friend={friend}
                                            key={uuid.v4()}
                                            friendRequest={friendRequest}
                                        />

                                    case "ACCEPTED":
                                        return <Accept_Tab
                                         senderId={friend.senderId} 
                                         receiverId={friend.receiverId} 
                                         status={friend.status} 
                                         id={friend.id} 
                                         key={uuid.v4()}
                                         receiver={friend.receiver}
                                         accepted={true}
                                        />
                                }
                            })
                        }
                    </div>
                )
            }
        </div>
        )
    }




    return (
        <div ref={friendDivRef} className={styles.container}>
            <div>
                <Input/>
                <hr className={styles.breaker}/>    
                <div className={styles.friendsLst}>
                    <FriendList/>
                </div>
            </div>
        </div>
    )
}

export default Friend;