import React, { useEffect } from 'react';
import { IUser } from '../../../../utils/types';
import styles from '../style.module.css';

interface Props {
  User: IUser;
  local: boolean;
}

const CallPrompt: React.FC<Props> = ({ User, local }) => {
  const [userAudioStream, setUserAudioStream] = React.useState<MediaStream>();

  const [friendAudioStream, setFriendAudioStream] =
    React.useState<MediaStream>();
  const [friendVideoStream, setFriendVideoStream] =
    React.useState<MediaStream>();

  const userVideo = React.useRef<HTMLVideoElement>(null);
  const friendVideo = React.useRef<HTMLVideoElement>(null);

  return (
    <div>
      {local ? (
        <div>
          <video
            ref={userVideo}
            autoPlay
            playsInline
            className={styles.userVideo}
            style={{
                border: userAudioStream ? '1px solid green' : '1px solid red',
            }}
          ></video>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default CallPrompt;
