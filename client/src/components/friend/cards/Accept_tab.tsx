import React from "react";
import styles from '../styles.module.css';
import {HiStatusOnline} from 'react-icons/hi'
import {AiOutlineMessage} from 'react-icons/ai';
import * as uuid from 'uuid';
import { IFriendRequest } from "../../../utils/types";
import { useRouter } from "next/router";

const Accept_Tab:React.FC<IFriendRequest> = (friend) => {
    const router = useRouter();
    return (
        <div key={uuid.v4()} className={styles.frq_card}>
        <p className={styles.friendName}>@{friend.receiver?.name}</p>
            <div className={styles.Inputs}>
            <button className={styles.btn} style={{backgroundColor : "grey"}} onClick={() => router.push(`/app/me/${friend.receiver?.id}`)} disabled={typeof friend.receiver === "undefined"}>
                    <HiStatusOnline/>
                </button>
                <button className={styles.btn} style={{backgroundColor : "grey"}} onClick={() => router.push(`/app/me/${friend.receiver?.id}`)} disabled={typeof friend.receiver === "undefined"}>
                    <AiOutlineMessage/>
                </button>
            </div>
    </div>
    )
}

export default Accept_Tab;