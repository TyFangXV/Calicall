import React, { useContext, useEffect, useState } from "react";
import { MdCall } from "react-icons/md";
import { useRecoilState, useResetRecoilState } from "recoil";
import { authContext } from "../../../utils/context/auth";
import { SocketContext } from "../../../utils/context/socketContext";
import { DMcallLogger } from "../../../utils/state";
import { ICallUser, IUser } from "../../../utils/types";
import CallPrompt from "./call";
import styles from './style.module.css';

const TopBar:React.FC<{User:IUser}> = ({User}) => {
    const {callUser} = useContext(SocketContext);
    const [viewModel, setViewModel] = useState(false);
    const [dmCallLogger, setDMcallLogger] = useRecoilState(DMcallLogger);
    const resetDmCallLooger = useResetRecoilState(DMcallLogger)
    const {user, friends} = useContext(authContext)
    

    const handleClick = () => {
        setViewModel(true)
        callUser(user.id, User.id)
        setDMcallLogger({
            isLocalUserCalling : true,
            isCalling : false,
            user : friends.find(f => f.receiver?.id === User.id)?.receiver as IUser
        })
        setTimeout(() => {
            setViewModel(false)
            resetDmCallLooger()
        } , 30000)
    }
    return (
        <div>
            <div className={styles.container}>
                <h1 className={styles.username}>@{User.name}</h1>
                <div className={styles.btn}>
                    <span title="Call User" className={styles.title}>
                        <MdCall className={styles.callBtn} onClick={ () => !dmCallLogger.isCalling && handleClick() } />
                    </span>
                </div>
            </div>
            <div className={styles.callPopup} style={{display : dmCallLogger.isCalling || dmCallLogger.isLocalUserCalling ? "flex" : viewModel ? "flex" : "none"}}>
                {
                    dmCallLogger.isLocalUserCalling ? (
                        <CallPrompt User={User} local={true}/>
                    ) : (
                        <CallPrompt User={friends.find(f => f.receiver?.id === User.id)?.receiver as IUser} local={false}/>
                    )
                }
            </div>
        </div>
    )
}

export default TopBar;