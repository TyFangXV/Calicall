import React, { useContext, useEffect, useState } from "react";
import { MdCall } from "react-icons/md";
import { authContext } from "../../../utils/context/auth";
import {IUser } from "../../../utils/types";
import styles from './style.module.css';

const TopBar:React.FC<{User:IUser}> = ({User}) => {
    const callWindow = window;
    const {user} = useContext(authContext)
    /*
setViewModel(true)
        callUser(user.id, User.id)
        setDMcallLogger({
            isLocalUserCalling : true,
            callAccepted : false,
            isCalling : false,
            user : friends.find(f => f.receiver?.id === User.id)?.receiver as IUser
        })
        setTimeout(() => {
            if(!dmCallLogger.callAccepted)
            {
                setViewModel(false)
                resetDmCallLooger()
            }
        } , 15000)
    */
    const handleClick = () => {
        const prompt = callWindow.open(`/call?r=${User.id}&s=${user.id}`, "call", `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=0,height=0,left=-1000,top=-1000,`);
    }

    return (
        <div>
            <div className={styles.container}>
                <h1 className={styles.username}>@{User.name}</h1>
                <div className={styles.btn}>
                    <span title="Call User" className={styles.title}>
                        <MdCall className={styles.callBtn} onClick={ () =>  handleClick() } />
                    </span>
                </div>
            </div>
        </div>
    )
}

export default TopBar;