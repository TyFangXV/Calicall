import React, { useContext, useEffect, useState } from "react";
import Ripple from "../ripple";
import {FaUserFriends} from 'react-icons/fa';
import styles from './styles.module.css';
import axios from "axios";
import { authContext } from "../../utils/context/auth";
import * as uuid from 'uuid';
import { IFriendRequest, IuserAlertMessage } from "../../utils/types";
import { MdCancel, MdCircleNotifications, MdDone } from "react-icons/md";
import {AiOutlineMessage} from 'react-icons/ai';
import {BsClockFill} from 'react-icons/bs'
import { SocketContext } from "../../utils/context/socketContext";
import { useRouter } from "next/router";

const Friend:React.FC = () => {
    const [openFriend, setOpenFriend] = React.useState(false);
    const {socket} = useContext(SocketContext);
    const friendDivRef = React.useRef<HTMLDivElement>(null);
    const friendRef = React.useRef<HTMLInputElement>(null);
    const {user, friends, token} = useContext(authContext);
    const [friendRequest, setFriendRequest] = useState<IFriendRequest[]>([...friends]);
    const router = useRouter();

    useEffect(() => {
        window.addEventListener("click", (e) => {
            if (friendDivRef.current && !friendDivRef.current.contains(e.target as Node)) {
                setOpenFriend(false);
            }
        })
        
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
                    "Authorization" : "Bearer " + token.token
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


    const accept_decline = async(receiverID:string, status:boolean, id:string) => {
        try {
            if(friendRequest.length > 0)
            {
                try {
                    switch(status)
                    {
                        case true:
                            await axios.post(`/api/friend/accept`, {
                                friend : receiverID,
                                me : user.id,
                                id : id
                            }, {
                                headers : {
                                    "Content-Type" : "application/json",
                                    "Authorization" : "Bearer " + token.token
                                }
                            })
                        case false:
                            await axios.post(`/api/friend/reject`, {
                                friend : receiverID,
                                me : user.id,
                                id : id
                            }, {
                                headers : {
                                    "Content-Type" : "application/json",
                                    "Authorization" : "Bearer " + token.token
                                }
                            })    
                    }
                    return null;
                } catch (error) {
                    console.log(error);
                    return null;
                }            
            }else{
                return null;
            }            
        } catch (error) {
            console.log(error);
            return null;   
        }

    }

    const getFriends = async() => {
        try {
            const {data} = await axios.get(`/api/friend/me?me=${user.id}`, {
                headers : {
                    "Content-Type" : "application/json",
                    "Authorization" : "Bearer " + token.token
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

    const Breaker:React.FC = () => {
        return (
            <div>
                <hr className={styles.breaker}/>
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
                                        return (
                                        <div key={uuid.v4()} className={styles.frq_card}>
                                          <p className={styles.friendName}>@{friend.receiver?.name}</p>
                                                {
                                                    friend.senderId === user.id ? (
                                                        <div className={styles.Inputs}>
                                                            <button className={styles.btn} style={{backgroundColor : "#eed202 "}}>
                                                                <BsClockFill/>
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className={styles.Inputs}>
                                                            <button className={styles.btn} style={{backgroundColor : "green"}} onClick={async() => await accept_decline(friend.receiverId, true, friend.id)}>
                                                                <MdDone/>
                                                            </button>
                                                            <button className={styles.btn} style={{backgroundColor : "red"}} onClick={async() => await accept_decline(friend.receiverId, false, friend.id)}>
                                                                <MdCircleNotifications/>
                                                            </button>
                                                        </div>
                                                    )
                                                }
                                        </div>
                                    )

                                    case "ACCEPTED":
                                        return(
                                        <div key={uuid.v4()} className={styles.frq_card}>
                                            <p className={styles.friendName}>@{friend.receiver?.name}</p>
                                                <div className={styles.Inputs}>
                                                    <button className={styles.btn} style={{backgroundColor : "grey"}} onClick={() => router.push(`/app/me/${friend.receiver?.id}`)}>
                                                        <AiOutlineMessage/>
                                                    </button>
                                                </div>
                                        </div>
                                        )
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
                <Breaker/>
            </div>
            <div>
                <FriendList/>
            </div>
        </div>
    )
}

export default Friend;