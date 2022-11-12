/* eslint-disable @next/next/no-img-element */
import React, { useContext, useEffect } from 'react';
import { IClientMessage, IUser } from '../../utils/types';
import styles from './style.module.css';
import * as uuid from 'uuid';
import { authContext } from '../../utils/context/auth';


interface IProps {
  Messages: IClientMessage[];
  Friend: IUser;
}

const GIF:React.FC<{url:string}> = ({url}) => {
    return (
        <div>
            <div className={styles.GifOverlay}></div>
            <iframe className={styles.Gif} src={url} allowFullScreen/>
        </div>
    )
}

const TEXT:React.FC<{text:string}> = ({text}) => {
  useEffect(() => {},[])
    return (
        <div>
            {
                text.includes('https://') ? (
                    <div>
                        <a href={text}>{text}</a>
                    </div>
                ) : (
                    <div>
                        <p className={styles.text}>{text}</p>
                    </div>
                )
            }
        </div>
    )
}



const MessageBuble:React.FC<{Message:IClientMessage, User:IUser, isLocalUser:boolean}> = ({Message, User, isLocalUser}) => {
  return (
    <div className={isLocalUser ? styles.Sbubble : styles.FBubble}>
      <p className={styles.username}>@{User.name}</p>
      {Message.type === 'TEXT' ? (
        <div className={isLocalUser ? styles.SenderBubble : styles.FriendBubble}>
           <TEXT text={Message.message} />
        </div>
        ) : (
            <GIF url={Message.message}/>
        )}
    </div>
  );
}

const ChatInterface: React.FC<IProps> = ({ Messages, Friend }) => {
  const { user } = useContext(authContext);
  const containerRef = React.useRef<HTMLDivElement>(null);



  return (
    <div className={styles.container} id="chat" ref={containerRef}>
        {Messages.length > 0 &&
          Messages.map((m, i) => {
            return (
              <div key={uuid.v4()} className={styles.message}>
                <MessageBuble Message={m} User={user.id === m.from ? user : Friend} isLocalUser={user.id === m.from}/>
              </div>
            );
          })}
    </div>
  );
};

export default ChatInterface;
