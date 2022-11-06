import React, { useContext, useEffect, useState } from "react";
import { MdCall } from "react-icons/md";
import {IUser } from "../../../utils/types";
import styles from './style.module.css';
import { P2PCallContext } from "../../../utils/context/P2PCall";

const TopBar:React.FC<{User:IUser}> = ({User}) => {
    const {callUser} = useContext(P2PCallContext);

    return (
        <div>
            <div className={styles.container}>
                <h1 className={styles.username}>@{User.name}</h1>
                <div className={styles.btn}>
                    <span title="Call User" className={styles.title}>
                        <MdCall className={styles.callBtn} onClick={() => callUser()} />
                    </span>
                </div>
            </div>
        </div>
    )
}

export default TopBar;