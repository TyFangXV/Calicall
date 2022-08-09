import React, { useContext, useEffect, useRef, useState } from "react";
import styles from './styles.module.css';
import {AiFillBell} from 'react-icons/ai';
import Ripple from "../ripple";
import * as uuid from 'uuid';
import {MdCircleNotifications} from 'react-icons/md'
import {AiFillCloseCircle} from 'react-icons/ai'
import { SocketContext } from "../../utils/context/socketContext";
import { INotificationProps, IuserAlertMessage } from "../../utils/types";

const Notification:React.FC = () => {
    const [openNotification, setOpenNotification] = React.useState(false);
    const [notifications, addNotification] = useState<INotificationProps[]>([]);
    const socket = useContext(SocketContext);
    const notificationRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        socket.socket.on("userSystemAlert", (data) => {
            console.log(data);
            
            if(data.message.type === "NOTIFICATION"){
                const notif:INotificationProps = {
                    id: uuid.v4(),
                    sender: data.message.to,
                    message: data.message.message,
                    messenger: data.message.from,
                    type: data.message.type
                }
                console.log(notif); 
                addNotification([...notifications, notif]);
            }
        });


        window.addEventListener("click", (e) => {
            if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
                setOpenNotification(false);
            }
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket.socket])

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
                            return (
                                <div key={uuid.v4()} className={styles.frq} title={notification.message}>
                                    <MdCircleNotifications className={styles.icon}/>
                                    <span>
                                        {notification.message}
                                    </span>
                                    <div>
                                        <AiFillCloseCircle className={styles.closeBtn} onClick={() => removeNotification(notification.id)}/>
                                    </div>
                            </div>
                            )
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