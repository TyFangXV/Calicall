import React from "react";
import { MdCall } from "react-icons/md";
import { IUser } from "../../../utils/types";
import styles from './style.module.css';

const TopBar:React.FC<{User:IUser}> = ({User}) => {
    return (
        <div className={styles.container}>
            <h1 className={styles.username}>@{User.name}</h1>
            <div className={styles.btn}>
                <span title="Call User" className={styles.title}>
                    <MdCall className={styles.callBtn}/>
                </span>
            </div>
        </div>
    )
}

export default TopBar;