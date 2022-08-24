import React, { useContext, useEffect } from "react";
import styles from '../styles.module.css';
import { MdCircleNotifications, MdDone } from "react-icons/md";
import {BsClockFill} from 'react-icons/bs'
import * as uuid from 'uuid';
import axios from "axios";
import { IFriendRequest } from "../../../utils/types";
import { useRouter } from "next/router";
import { authContext } from "../../../utils/context/auth";
import { SocketContext } from "../../../utils/context/socketContext";

interface Invite_Tab {
    friend: IFriendRequest;
    friendRequest: IFriendRequest[];
}

const Invite_Tab:React.FC<Invite_Tab> = ({friend, friendRequest}) => {
    const {user, friends, token} = useContext(authContext);
    const {socket} = useContext(SocketContext);


    const accept_decline = async(receiverID:string, status:boolean, id:string) => {
        try {
            if(friendRequest.length > 0)
            {
                try {
                    switch(status)
                    {
                        case true:
                            await axios.post(`/api/friend/accept`, {
                                friend : receiverID,
                                me : user.id,
                                id : id
                            }, {
                                headers : {
                                    "Content-Type" : "application/json",
                                    "Authorization" : "Bearer " +  `${token.token}.${user.id}`
                                }
                            })
                        case false:
                            await axios.post(`/api/friend/reject`, {
                                friend : receiverID,
                                me : user.id,
                                id : id
                            }, {
                                headers : {
                                    "Content-Type" : "application/json",
                                    "Authorization" : "Bearer " +  `${token.token}.${user.id}`
                                }
                            })    
                    }
                    return null;
                } catch (error) {
                    console.log(error);
                    return null;
                }            
            }else{
                return null;
            }            
        } catch (error) {
            console.log(error);
            return null;   
        }

    }

    return(
        <div key={uuid.v4()} className={styles.frq_card}>
        <p className={styles.friendName}>@{friend.receiver?.name}</p>
              {
                  friend.senderId === user.id ? (
                      <div className={styles.Inputs}>
                          <button className={styles.btn} style={{backgroundColor : "#eed202 "}}>
                              <BsClockFill/>
                          </button>
                      </div>
                  ) : (
                      <div className={styles.Inputs}>
                          <button className={styles.btn} style={{backgroundColor : "green"}} onClick={async() => await accept_decline(friend.receiverId, true, friend.id)}>
                              <MdDone/>
                          </button>
                          <button className={styles.btn} style={{backgroundColor : "red"}} onClick={async() => await accept_decline(friend.receiverId, false, friend.id)}>
                              <MdCircleNotifications/>
                          </button>
                      </div>
                  )
              }
      </div>
    )
}

export default Invite_Tab;