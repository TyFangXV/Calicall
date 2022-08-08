import React, { useContext, useEffect, useRef, useState } from "react";
import styles from './styles.module.css';
import {AiFillBell} from 'react-icons/ai';
import Ripple from "../ripple";
import * as uuid from 'uuid';
import {BsFillPersonFill} from 'react-icons/bs'
import {AiFillCloseCircle} from 'react-icons/ai'
import { SocketContext } from "../../utils/context/socketContext";
import { INotificationProps } from "../../utils/types";

const Notification:React.FC = () => {
    const [openNotification, setOpenNotification] = React.useState(false);
    const [notifications, addNotification] = useState<INotificationProps[]>([]);
    const socket = useContext(SocketContext);
    const notificationRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        socket.socket.on("receiveNotification", (data) => {
            addNotification([...notifications, data]);
        });

        window.addEventListener("click", (e) => {
            if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
                setOpenNotification(false);
            }
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket])

    const removeNotification = (id:string) => {
        const newNotifications = notifications.filter(notification => notification.id !== id);
        addNotification(newNotifications);
    }

    return (
        <div className={styles.container} ref={notificationRef}>
           <Ripple>
                <AiFillBell className={styles.bellIcon} onClick={() => setOpenNotification(!openNotification)}/>
           </Ripple>
           <div className={styles.notificationCard} style={{display : openNotification ? "flex" : "none"}}>
            {
                notifications.length > 0 ? (
                        notifications.map((notification, index) => {
                            switch(notification.type) 
                            {
                                case "FRIEND_REQUEST":
                                    return (
                                        <div key={uuid.v4()} className={styles.frq} title={notification.message}>
                                            <BsFillPersonFill/>
                                            <span>
                                                {notification.message}
                                            </span>
                                            <div>
                                                <AiFillCloseCircle className={styles.closeBtn} onClick={() => removeNotification(notification.id)}/>
                                            </div>
                                        </div>
                                    )
                                default:
                                    return (
                                        <div key={uuid.v4()} className={styles.notification}>
                                            <div className={styles.notificationText}>
                                                {notification.message}
                                            </div>
                                        </div>
                                    )
                            }
                        })
                ) : (
                    <div className={styles.boilerplate}>
                        <p>No notifications</p> 
                    </div>
                )
            }
           </div>
        </div>
    )
}

export default Notification;