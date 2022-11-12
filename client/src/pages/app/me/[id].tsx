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
import axios from 'axios';
import { useAlert } from '../../../components/alert';
import { useSetRecoilState } from 'recoil';
import { currentFriend } from '../../../utils/state';
import P2PCallContextProvider from '../../../utils/context/P2PCall';

interface MessageSet {
  author : string;
  messages:IClientMessage[]
}

const Chat: NextPage = () => {
  const router = useRouter();
  const setCurrentFriend = useSetRecoilState(currentFriend);
  const id = router.query.id as string;
  const { friends } = useContext(authContext);
  const [friend, setFriend] = React.useState<IUser>();
  const [messages, setMessages] = React.useState<MessageSet>({
    author: "",
    messages : []
  });
  const [error, setError] = React.useState<string>('');
  const {sendMessage, socket} = useContext(SocketContext);
  const {user, token} = useContext(authContext);



  const alert = useAlert().newAlert;


  useEffect(() => {
    const friend = friends.find((friend) => friend.receiver?.id === id);
    if(friend) 
    {
      console.log(friend.receiver);
      
      setMessages({
        author : friend.receiver?.id as string,
        messages: []
      })
      setFriend(friend.receiver);
      setCurrentFriend(friend.receiver as IUser);
    }else{
      router.push('/app/me');
    }
      (async() => { 
        try {
          const {data:msg} = await axios.post('/api/message/get', {
            me: user.id,
            friend: id,
          }, {
            headers : {
              "Content-Type" : "application/json",
              "Authorization" : "Bearer " + `${token.token}.${user.id}`
          }
          })   


          
          //check if the message is already stored in the state
          if(messages.author !== id)
          {
            setMessages({
              author : id,
              messages : msg
            })
          }else{
            setMessages({...messages, messages : msg})
          }
        } catch (error) {
          alert(
            "Cannot fetch old messages",
            window.location.pathname,
            () => null,
            "ERROR"
          )
          setError("Could not fetch old messages...Please try again later");
        }

      })()      
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user.id])


  useEffect(() => {
    socket.on("DMRecieve", (m:IClientMessage) => {
      setMessages({...messages, messages : [...messages.messages, m]})
    })

    socket.on("DMSend",(m:IClientMessage) => {
      setMessages({...messages, messages : [...messages.messages, m]})
    })

  }, [messages, socket])

  return (
    <P2PCallContextProvider>
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
        {
          error === '' ? (
              <ChatInterface Messages={messages.messages} Friend={friend as IUser}/>
            ) : (
              <div>{error}</div>
            )
        }
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
    </P2PCallContextProvider>
  );
};

export default Chat;
