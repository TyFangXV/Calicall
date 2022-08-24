import React, { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../../../../utils/context/socketContext';
import { IUser } from '../../../../utils/types';
import styles from '../style.module.css';
import {BsCamera, BsFillCameraVideoFill, BsFillCameraVideoOffFill} from 'react-icons/bs';
import {FaMicrophoneSlash, FaMicrophoneAlt} from 'react-icons/fa';

interface Props {
  User: IUser;
  local: boolean;
}

export const ControlButtons: React.FC = () =>   {
  const [video, setVideo] = useState(false);
  const [audio, setAudio] = useState(true);
  const {startCamera} = useContext(SocketContext)

 const handleClick = (closeAudio:boolean, closeVideo:boolean) => {
   if(closeVideo)
   {
     startCamera(!video, audio);
     setVideo(!video)
   }
   if(closeAudio)
   {
     startCamera(video, audio);
     setAudio(!audio)
   }
 }

  return (
    <div className={styles.controlBtn}>
      <button className={styles.ctrl_btn} onClick={() => handleClick(false, true)}>
         {
            video ? <BsFillCameraVideoFill/> : <BsFillCameraVideoOffFill/>
         }
      </button>
      <button className={styles.ctrl_btn} onClick={() => handleClick(true, false)}>
        {
              audio ? <FaMicrophoneAlt/> : <FaMicrophoneSlash/>
        }
      </button>
    </div>
  )
}

const CallPrompt: React.FC<Props> = ({ User, local }) => {
  const {localUserVideo, stream} = useContext(SocketContext)



  return (
    <div>
      {local ? (
        <div>
          <div>
            <video
              ref={localUserVideo}
              autoPlay
              muted
              playsInline
              className={styles.userVideo}
              style={{
                border : stream?.getAudioTracks() ? "2px solid green" : "none",
              }}
            ></video>
          </div>          
            <ControlButtons/>
        </div>

      ) : (
        <div>

        </div>
      )}
    </div>
  );
};

export default CallPrompt;
