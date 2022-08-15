import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react';
import SideMenuBar from '../../../components/sidebar/menubar';
import { authContext } from '../../../utils/context/auth';
import { IClientMessage, IMessage, IUser } from '../../../utils/types';
import style from '../../../styles/chat.module.css';
import Input from '../../../components/chat/input';
import { SocketContext } from '../../../utils/context/socketContext';
import TopBar from '../../../components/sidebar/topbar';
import ChatInterface from '../../../components/message';

const Chat: NextPage = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const { friends } = useContext(authContext);
  const [friend, setFriend] = React.useState<IUser>();
  const [messages, setMessages] = React.useState<IClientMessage[]>([]);
  const {sendMessage, socket} = useContext(SocketContext);

  useEffect(() => {
    if (id) {
      const friend = friends.find((friend) => friend.receiver?.id === id);
      setFriend(friend?.receiver);
    }
  }, [friends, id, router]);


  useEffect(() => {
    socket.on("DMRecieve", (m:IClientMessage) => {
      setMessages([...messages, m]);
    })

    socket.on("DMSend",(m:IClientMessage) => {
      setMessages([...messages, m]);
    })

  }, [messages, socket])

  return (
    <div className={style.container}>
      <Head>
        <title>{friend?.name}</title>
      </Head>
      <div>
        <SideMenuBar />
      </div>
      <div className={style.screen}>
        <div>
          {
            friend && <TopBar User={friend}/>
          }

        </div>
        <ChatInterface Messages={messages} Friend={friend as IUser}/>
        <div>
          <Input
            name={friend?.name as string}
            friendId={friend?.id as string}
            onEnter={(m) => {
                 sendMessage(m);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;
