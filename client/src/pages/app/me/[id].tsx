import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react';
import SideMenuBar from '../../../components/sidebar/menubar';
import { authContext } from '../../../utils/context/auth';
import { IMessage, IUser } from '../../../utils/types';
import style from '../../../styles/chat.module.css';
import Input from '../../../components/chat/input';
import { SocketContext } from '../../../utils/context/socketContext';

const Chat: NextPage = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const { friends } = useContext(authContext);
  const [friend, setFriend] = React.useState<IUser>();
  const {sendMessage, socket} = useContext(SocketContext);

  useEffect(() => {
    if (id) {
      const friend = friends.find((friend) => friend.receiver?.id === id);
      setFriend(friend?.receiver);
    }

    socket.on("DMRecieve", (m:IMessage) => {
      console.log(m);
      
    })

  }, [friends, id, router]);



  return (
    <div className={style.container}>
      <Head>
        <title>{friend?.name}</title>
      </Head>
      <div>
        <SideMenuBar />
      </div>
      <div>
        <div className={style.input}>
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
