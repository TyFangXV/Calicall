import React from "react";
import styles from './styles.module.css';
import {AiFillBell} from 'react-icons/ai';
import Notification from "../notification";
import Friend from "../friend";

const AppBar:React.FC = () => {
    return (
        <div className={styles.container}>
            <div></div>
            <div className={styles.section2}>
                <Friend/>
                <Notification/>
            </div>
        </div>
    )
}

export default AppBar;