import React, { createContext, useEffect, useContext } from 'react';
import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil';
import { DMcallLogger, FriendList, userCalled } from '../state';
import { SocketContext } from './socketContext';
import axios from 'axios';
import { authContext } from './auth';
import { useAlert } from '../../components/alert';
import { ICallUser, IUser } from '../types';
import { useRouter } from 'next/router';

interface Props {
  children: React.ReactNode;
}

//Update the user data state when a change is made, while the user is online
export const stateUpdaterContext = createContext({});

const StateUpdaterProvider: React.FC<Props> = ({ children }) => {
  const [friendRequest, setFriendRequest] = useRecoilState(FriendList);
  const setIsUserCalled = useSetRecoilState(userCalled);
  const resetDmCallerLog = useResetRecoilState(DMcallLogger);
  const [dmCallLogger, setDMcallLogger] = useRecoilState(DMcallLogger);

  const { newAlert } = useAlert();
  const router = useRouter();

  const { socket } = useContext(SocketContext);
  const { user, token } = useContext(authContext);
  const { friends } = useContext(authContext);

  useEffect(() => {
    socket.on('userSystemAlert', (data: any) => {
      if (data.message.type === 'FRIEND_REQUEST_UI_UPDATE') {
        getFriends()
          .then((res: any[]) => {
            setFriendRequest([...res]);
          })
          .catch((err) => console.log(err));
      }
    });

    socket.on('callFromFriend', (data: any) => {
      setIsUserCalled(true);
    });

    socket.on('userSystemAlertRecieve', (data: any) => {
      if (data.message.type === 'UNSEEN_MESSAGE_DM') {
        newAlert(
          `New message from @${
            friends.find((f) => f.receiver?.id === data.message.message.UserID)
              ?.receiver?.name
          }`,
          window.location.pathname,
          () => router.push(`/app/me/${data.message.message.UserID}`),
          'INFO'
        );
      }
    });

    socket.on('callFromFriend', (data: ICallUser) => {
      if (!dmCallLogger.isCalling) {
        setDMcallLogger({
          user: friends.find(
            (f) => data.me === f.senderId || data.me === f.receiverId
          )?.receiver as IUser,
          isCalling: true,
          isLocalUserCalling: false,
          callAccepted: false,
        });

        newAlert(
          `Call from ${friends.find((f) => data.me === f.senderId || data.me === f.receiverId)?.receiver?.name}`,
          `/app/me/${data.me}`,
          () => router.push(`/app/me/${data.me}`),
          'RINGTONE'
        );

        setTimeout(() => {
          resetDmCallerLog();
        }, 15000);
      }
    });
  }, [user, socket]);

  const getFriends = async () => {
    try {
      const { data } = await axios.get(`/api/friend/me?me=${user.id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + `${token.token}.${user.id}`,
        },
      });

      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  return <div>{children}</div>;
};

export default StateUpdaterProvider;
