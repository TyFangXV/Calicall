import React, { useContext, useEffect, useState } from "react";
import Ripple from "../ripple";
import {FaUserFriends} from 'react-icons/fa';
import styles from './styles.module.css';
import axios from "axios";
import { authContext } from "../../utils/context/auth";
import * as uuid from 'uuid';
import { IFriendRequest } from "../../utils/types";
import { MdCancel, MdCircleNotifications, MdDone } from "react-icons/md";
import { SocketContext } from "../../utils/context/socketContext";

const Friend:React.FC = () => {
    const [openFriend, setOpenFriend] = React.useState(false);
    const [friendRequest, setFriendRequest] = useState<IFriendRequest[]>([]);
    const {socket} = useContext(SocketContext);
    const friendDivRef = React.useRef<HTMLDivElement>(null);
    const friendRef = React.useRef<HTMLInputElement>(null);
    const user = useContext(authContext);

    useEffect(() => {
        window.addEventListener("click", (e) => {
            if (friendDivRef.current && !friendDivRef.current.contains(e.target as Node)) {
                setOpenFriend(false);
            }
        })

        getFriends()
        .then((res:any[]) => {
            setFriendRequest([...res]);
            console.log(friendRequest);
            
        })
        .catch((err) => console.log(err));  
            
    }, [])



    const sendFriendRequest = async() => {
        if(friendRef.current?.value)
        {
            try {
            const {data} =  await axios.post(`/api/friendIV`, {
                    friend : friendRef.current?.value,
                    me : user.id
            }, {
                headers : {
                    "Content-Type" : "application/json" 
                }
            })
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
            const {data} = await axios.get(`/api/friendVI?me=${user.id}`);
            
            return data;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    return (
        <div ref={friendDivRef}>
            <Ripple>
                <FaUserFriends className={styles.friendIcon} onClick={() => setOpenFriend(!openFriend)}/>
            </Ripple>
            <div className={styles.body} style={{display : openFriend ? "flex" : "none"}}>
                <div className={styles.notifBody}>
                    <span className={styles.sendFrqSec}>
                        <p className={styles.subtitleName}>Send a Friend request</p>
                        <div>
                            <input ref={friendRef} className={styles.input} placeholder="Enter User's ID"/>
                            <button onClick={async() => await sendFriendRequest()} className={styles.sendBtn}>Send</button>
                        </div>
                    </span>
                    <span className={styles.breaker}></span>
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
                                                        <div className={styles.Inputs}>
                                                            <button className={styles.btn} style={{backgroundColor : "green"}}>
                                                                <MdDone/>
                                                            </button>
                                                            <button className={styles.btn} style={{backgroundColor : "red"}}>
                                                                <MdCircleNotifications/>
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
                </div>
            </div>
        </div>
    )
}

export default Friend;