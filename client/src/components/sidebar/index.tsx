import React, { useContext, useEffect, useState } from "react";
import styles from './styles.module.css';
import {BsPersonCircle} from 'react-icons/bs';
import Circle from "./circle";
import { useRouter } from "next/router";
import { SocketContext } from "../../utils/context/socketContext";
import { useRecoilState, useResetRecoilState } from "recoil";
import { DMcallLogger, UnSeemMessage } from "../../utils/state";
import { useAlert } from "../alert";
import { authContext } from "../../utils/context/auth";
import { ICallUser, IUser } from "../../utils/types";

const SideBar:React.FC = () => {
  const router = useRouter();
  const {socket} = useContext(SocketContext);
  const [Notif, setNotif] = useRecoilState(UnSeemMessage);
  const {friends} = useContext(authContext)
  const [dmCallLogger, setDMcallLogger] = useRecoilState(DMcallLogger);
  const resetDmCallerLog = useResetRecoilState(DMcallLogger);
  const {newAlert} = useAlert();

  const handleClick = () => {
    //check if user in at /app/me
    if(router.pathname !== "/app/me" && router.pathname !== "/app/me/[id]")
    {
      router.push("/app/me");
    }
  }



  useEffect(() => {
    socket.on("userSystemAlertRecieve", (data:any) => {    
      if(data.message.type === "UNSEEN_MESSAGE_DM")
      {
        console.log(data.message.message);
        
        newAlert(
        `New message from @${friends.find(f => f.receiver?.id === data.message.message.UserID)?.receiver?.name}`, 
        () => router.push(`/app/me/${data.message.message.UserID}`),
        "INFO"
        );
      }
    })

    socket.on("callFromFriend", (data:ICallUser) => {
      if(!dmCallLogger.isCalling)
      {
        setDMcallLogger({
          user : friends.find(f => data.me === f.senderId)?.receiver as IUser,
          isCalling : true,
          isLocalUserCalling : false
        })

        newAlert(`Call from ${friends.find(f => data.me === f.senderId)?.receiver?.name}`, () =>  router.push(`/app/me/${data.me}`) , "RINGTONE")
        console.log(dmCallLogger);
        
        setTimeout(() => {
          resetDmCallerLog()
        }, 30000)        
      }
  })

  }, [newAlert, socket])

  return(
    <div className={styles.container}>
        <div className={styles.friend}>
          <Circle title="Friends" onclick={() => handleClick()} showMarker={false}>
            <BsPersonCircle className={styles.friendIcon}/>
            <span className={styles.marker} style={{display : Notif.length !== 0 ? "flex" : "none"}}>{Notif.length}</span>
          </Circle>
        </div>
        <span className={styles.breaker}></span>
    </div>
  )
}

export default SideBar;