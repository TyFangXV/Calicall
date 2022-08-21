import React from "react";
import { MdCall } from "react-icons/md";
import { IUser } from "../../../utils/types";
import CallPrompt from "./call";
import styles from './style.module.css';

const TopBar:React.FC<{User:IUser}> = ({User}) => {
    return (
        <div>
            <div className={styles.container}>
                <h1 className={styles.username}>@{User.name}</h1>
                <div className={styles.btn}>
                    <span title="Call User" className={styles.title}>
                        <MdCall className={styles.callBtn}/>
                    </span>
                </div>
            </div>
            <div className={styles.callPopup}>
                <CallPrompt User={User} local={true}/>
            </div>
        </div>
    )
}

export default TopBar;