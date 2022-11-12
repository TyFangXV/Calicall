import React, { useContext, useEffect, useState } from "react";
import styles from './styles.module.css';
import {BsPersonCircle} from 'react-icons/bs';
import Circle from "./circle";
import { useRouter } from "next/router";
import { SocketContext } from "../../utils/context/socketContext";
import { useRecoilState, useResetRecoilState } from "recoil";
import { useAlert } from "../alert";
import { DMcallLogger, UnSeemMessage } from "../../utils/state";
import { authContext } from "../../utils/context/auth";
import { ICallUser, IUser } from "../../utils/types";

const SideBar:React.FC = () => {
  const router = useRouter();
  const {socket} = useContext(SocketContext);
  const [Notif, setNotif] = useRecoilState(UnSeemMessage);
  const {newAlert} = useAlert();

  const handleClick = () => {
    //check if user in at /app/me
    if(router.pathname !== "/app/me" && router.pathname !== "/app/me/[id]")
    {
      router.push("/app/me");
    }
  }



  useEffect(() => {


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