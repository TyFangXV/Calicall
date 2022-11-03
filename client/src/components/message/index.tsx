/* eslint-disable @next/next/no-img-element */
import React, { useContext, useEffect } from 'react';
import { IClientMessage, IUser } from '../../utils/types';
import styles from './style.module.css';
import * as uuid from 'uuid';
import { authContext } from '../../utils/context/auth';
import Image from 'next/image';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { chatWindowScrolled } from '../../utils/state';

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

const SenderBubble: React.FC<{ Message: IClientMessage; User: IUser }> = ({
  Message,
  User,
}) => {


  return (
    <div className={styles.SBubble}>
      <p className={styles.username}>@Me</p>
        {Message.type === 'TEXT' ? (
         <div className={styles.SenderBubble}>
           <TEXT text={Message.message} />
         </div>
        ) : (
            <GIF url={Message.message}/>
        )}
    </div>
  );
};

const FriendBubble: React.FC<{ Message: IClientMessage; Friend: IUser }> = ({
  Message,
  Friend,
}) => {
  const hasScrolled = useRecoilValue(chatWindowScrolled);

  useEffect(() => {
    if (hasScrolled) 
    {

    }
  },[hasScrolled])
  return (
    <div className={styles.FBubble}>
      <p className={styles.username}>@{Friend.name}</p>
      {Message.type === 'TEXT' ? (
        <div className={styles.FriendBubble}>
           <TEXT text={Message.message} />
        </div>
        ) : (
            <GIF url={Message.message}/>
        )}
    </div>
  );
};

const ChatInterface: React.FC<IProps> = ({ Messages, Friend }) => {
  const { user } = useContext(authContext);
  const [WindowScrolled, setWindowScrolled] = useRecoilState(chatWindowScrolled);
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
      //scroll to bottom of chat
      const chat = document.getElementById('chat');
      if (chat) {
        chat.scrollTop = chat.scrollHeight;
      }
    },
    [Messages]
  );


  return (
    <div className={styles.container} id="chat" ref={containerRef}>
      <div className={styles.messageContainer}>
        {Messages.length > 0 &&
          Messages.map((m, i) => {
            return (
              <div key={uuid.v4()} className={styles.message}>
                {m.from === user.id ? (
                  <div id={m.id}>
                    <SenderBubble Message={m} User={user} />
                  </div>
                ) : (
                  <div id={m.id}>
                    <FriendBubble Message={m} Friend={Friend} />
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default ChatInterface;
