/* eslint-disable @next/next/no-img-element */
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { authContext } from '../../../utils/context/auth';
import { IFriendRequest, IUser } from '../../../utils/types';
import styles from './styles.module.css';

const FriendButton: React.FC<IUser> = (data) => {
    const router = useRouter();

  return (
    <div className={styles.FriendContainer} onClick={() => router.push(`/app/me/${data.id}`)}>
      <img
        src={'https://xsgames.co/randomusers/avatar.php?g=pixel'}
        alt="image"
        className={styles.pfp}
      />
      <p className={styles.username}>{data.name}</p>
      <span className={styles.marker}></span>
    </div>  
  );
};

const SideMenuBar: React.FC = () => {
  const { friends } = useContext(authContext);
  console.log(friends);
  
  return (
    <div className={styles.container}>
      {friends.length !== 0 && (
        <div className={styles.friendDiv}>
          {friends.map((friend: IFriendRequest) => {
            return (
              <div key={friend.id}>
                <FriendButton
                  name={friend.receiver?.name as string}
                  email={friend.receiver?.email as string}
                  id={friend.receiver?.id as string}
                  signedIn={true}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SideMenuBar;
