import React from "react";
import styles from './styles.module.css';
import {BsPersonCircle} from 'react-icons/bs';
import Circle from "./circle";
import { useRouter } from "next/router";

const SideBar:React.FC = () => {
  const router = useRouter();

  const handleClick = () => {
    //check if user i at /app/me
    if(router.pathname !== "/app/me" && router.pathname !== "/app/me/[id]")
    {
      router.push("/app/me");
    }
  }

  return(
    <div className={styles.container}>
        <div className={styles.friend}>
          <Circle title="Friends" onclick={() => handleClick()} showMarker={false}>
            <BsPersonCircle className={styles.friendIcon}/>
          </Circle>
        </div>
        <span className={styles.breaker}></span>
    </div>
  )
}

export default SideBar;