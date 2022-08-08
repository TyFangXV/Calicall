import React, { useContext, useEffect } from "react";
import Ripple from "../ripple";
import {FaUserFriends} from 'react-icons/fa';
import styles from './styles.module.css';
import axios from "axios";
import { authContext } from "../../utils/context/auth";
import { Button } from "@mui/material";

const Friend:React.FC = () => {
    const [openFriend, setOpenFriend] = React.useState(false);
    const friendDivRef = React.useRef<HTMLDivElement>(null);
    const friendRef = React.useRef<HTMLInputElement>(null);
    const user = useContext(authContext);

    useEffect(() => {
        window.addEventListener("click", (e) => {
            if (friendDivRef.current && !friendDivRef.current.contains(e.target as Node)) {
                setOpenFriend(false);
            }
        })
    }, [])

    const sendFriendRequest = async() => {
        try {
           const {data} =  await axios.post(`/api/friendIV`, {
                friend : friendRef.current?.value,
                me : user.id
           }, {
            headers : {
                "Content-Type" : "application/json" 
            }
           })

            console.log(data);
            return null;
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
                </div>
            </div>
        </div>
    )
}

export default Friend;