import React, { useContext, useEffect, useState } from "react";
import { MdCall } from "react-icons/md";
import { authContext } from "../../../utils/context/auth";
import {IUser } from "../../../utils/types";
import styles from './style.module.css';

const TopBar:React.FC<{User:IUser}> = ({User}) => {
    const {user} = useContext(authContext);
    const [isCalling, setIsCalling] = useState(false);

    return (
        <div>
            <div className={styles.container}>
                <h1 className={styles.username}>@{User.name}</h1>
                <div className={styles.btn}>
                    <span title="Call User" className={styles.title}>
                        <MdCall className={styles.callBtn} onClick={() => {if(!isCalling) setIsCalling(true)}} />
                    </span>
                </div>
            </div>
            {
                isCalling && (
                   <div className={styles.CallPrompt}>
                     <iframe src={`/call?r=${User.id}&s=${user.id}`} width={"100vw"}/>
                  </div>
                )
            }
        </div>
    )
}

export default TopBar;