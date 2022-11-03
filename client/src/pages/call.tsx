import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState, useContext, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { authContext } from '../utils/context/auth';
import { FriendList } from '../utils/state';
import { CallPromptType, IFriendRequest, IUser } from '../utils/types';
import loadingIcon from '../asset/loading.svg';
import Image from 'next/image';
import styles from '../styles/call.module.css';
import P2PCallContextProvider, { P2PCallContext } from '../utils/context/P2PCall';


const Loading_prompt: React.FC = () => {
  const router = useRouter();
  const [friend, setFriend] = useState<IFriendRequest>();
  const [message, setMessage] = useState('Loading');
  const friends = useRecoilValue(FriendList);
  const { user } = useContext(authContext);

  useEffect(() => {
    const reciever_id = router.query.r;
    const caller_id = router.query.s;
    setTimeout(() => {
      if (!reciever_id && !caller_id) {
        setMessage('Check if the param exist');
        setTimeout(() => window.close(), 1000);
      }
      if (caller_id !== user.id) {
        setMessage(`Failed to load`);
        setTimeout(() => window.close(), 1000);
      }

      const friend = friends.find(
        (f) => f.receiver?.id === reciever_id
      )?.receiver;

      if (!friend) setMessage('Check if the friend exist');
    }, 2000);
  }, [friends, router, user]);

  return (
    <div className={styles.loadingPrompt}>
      <Image src={loadingIcon} alt="Loading" />
      <p>{message}</p>
    </div>
  );
};

const Call_prompt: React.FC<CallPromptType> = ({EndUser,localUser}) => {
  const {callUser} = useContext(P2PCallContext);

  useEffect(() => {
    console.log(callUser());
  }, [callUser])
  return (
      <div>

      </div>
  );
};

const DMCallPage: NextPage = () => {
  const friends = useRecoilValue(FriendList);
  const { loaded, user } = useContext(authContext);
  const [friend, setFriend] = useState<IUser>();
  const [promptLoading, setPromptloading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    setTimeout(() => {
      setPromptloading(false);
      const reciever_id = router.query.r;
      const friend = friends.find((f) => f.receiver?.id === reciever_id)?.receiver;
      setFriend(friend as IUser);
    }, 2000);
  }, [friends, router.query.r]);

  if (!loaded) {
    return (
      <div>
        <h1>Initializing</h1>
      </div>
    );
  } else {
    return (
      <>
        {promptLoading ? (
          <Loading_prompt />
        ) : (
            <div>
                <Call_prompt localUser={user} EndUser={friend as IUser}/>
            </div>
        )}
      </>
    );
  }
};

export default DMCallPage;
