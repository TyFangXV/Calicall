/* eslint-disable @next/next/no-img-element */
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { BsArrowRight } from 'react-icons/bs';
import { FaUserFriends } from 'react-icons/fa';
import { authContext } from '../../../utils/context/auth';
import { IFriendRequest, IUser } from '../../../utils/types';
import styles from './styles.module.css';

const FriendButton: React.FC<IUser> = (data) => {
    const router = useRouter();

  return (
    <div className={styles.FriendContainer} onClick={() => router.push(`/app/me/${data.id}`)}>
      <div style={{display: "flex", alignItems : "center"}}>
        <img
          src={data.profile_pic.startsWith("https://") ? data.profile_pic : `https://cdn.discordapp.com/avatars/${data.id}/${data.profile_pic}`}
          alt="image"
          className={styles.pfp}
        />
        <p className={styles.username}>{data.name}</p>        
      </div>

      <span className={styles.marker}></span>
    </div>  
  );
};

const SideMenuBar: React.FC = () => {
  const { friends } = useContext(authContext);  
  const router = useRouter();

  friends.filter(f => f.status === 'ACCEPTED');
  return (
    <div className={styles.container}>
      <div className={styles.friendBtn} onClick={() => router.push("/app/me")}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
        }}>
          <FaUserFriends className={styles.friendIcon}/>
          <p className={styles.friendTitle}>Friends</p>          
        </div>
        <BsArrowRight className={styles.FriendPointyArrow}/>
      </div>
      <hr className={styles.breaker}/>
      {friends.length !== 0 && (
        <div className={styles.friendDiv}>
          {friends.map((friend: IFriendRequest) => {
            return (
              <div key={friend.id}>
                <FriendButton
                  name={friend.receiver?.name as string}
                  email={friend.receiver?.email as string}
                  id={friend.receiver?.id as string}
                  profile_pic={friend.receiver?.profile_pic as string}
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
