import React, { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../../../../utils/context/socketContext';
import { IUser } from '../../../../utils/types';
import styles from '../style.module.css';
import {
  BsCamera,
  BsFillCameraVideoFill,
  BsFillCameraVideoOffFill,
} from 'react-icons/bs';
import { BiPhoneCall } from 'react-icons/bi';
import { MdCall, MdCallEnd } from 'react-icons/md';
import { FaMicrophoneSlash, FaMicrophoneAlt } from 'react-icons/fa';
import Image from 'next/image';
import { useRecoilValue } from 'recoil';
import { DMcallLogger } from '../../../../utils/state';

interface Props {
  User: IUser;
  local: boolean;
}

export const ControlButtons: React.FC<{ local: boolean }> = ({ local }) => {
  const [video, setVideo] = useState(false);
  const [audio, setAudio] = useState(true);
  const {
    setVideoStatus,
    setAudioStatus,
    setStream,
    localUserVideo,
    socket,
    videoStatus,
    audioStatus,
  } = useContext(SocketContext);
  const dmCallLogger = useRecoilValue(DMcallLogger);

  const answerCall = () => {
    socket.emit("answerCall", {
      to : ""
    });
  }

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: videoStatus, audio: audioStatus })
      .then((stream) => {
        setStream(stream);
        if (localUserVideo.current) {
          localUserVideo.current.srcObject = stream;
        }
      })
      .catch((err) => {
        if (err.name == 'TypeError') {
          console.log('CCn');
          return null;
        } else {
          console.log(err);
        }
      });
  }, [videoStatus, audioStatus]);

  return (
    <div className={styles.controlBtn}>
      {local ? (
        <div>
          <button
            className={styles.ctrl_btn}
            onClick={() => {
              setVideoStatus(!videoStatus);
            }}
          >
            {video ? <BsFillCameraVideoFill /> : <BsFillCameraVideoOffFill />}
          </button>
          <button
            className={styles.ctrl_btn}
            onClick={() => setAudioStatus(!audioStatus)}
          >
            {audio ? <FaMicrophoneAlt /> : <FaMicrophoneSlash />}
          </button>
          <button className={styles.ctrl_btn}>
            <MdCallEnd />
          </button>
        </div>
      ) : (
        <div>
          <button
            className={styles.ctrl_btn}
            onClick={() => {
              setVideoStatus(!videoStatus);
            }}
          >
            {video ? <BsFillCameraVideoFill /> : <BsFillCameraVideoOffFill />}
          </button>
          <button
            className={styles.ctrl_btn}
            onClick={() => setAudioStatus(!audioStatus)}
          >
            {audio ? <FaMicrophoneAlt /> : <FaMicrophoneSlash />}
          </button>
          <button className={styles.ctrl_btn}>
            {
              dmCallLogger.callAccepted ? (
                <MdCallEnd />
              ) : (
                <div>
                  <MdCall/>
                </div>
              )
            }
          </button>
        </div>
      )}
    </div>
  );
};

const CallPrompt: React.FC<Props> = ({ User, local }) => {
  const { localUserVideo, stream, videoStatus } = useContext(SocketContext);

  return (
    <div>
      {local ? (
        <div>
          <div>
            {videoStatus ? (
              <video
                ref={localUserVideo}
                autoPlay
                muted
                playsInline
                className={styles.userVideo}
                style={{
                  border: stream?.getAudioTracks() ? '2px solid green' : 'none',
                }}
              />
            ) : (
              <Image
                width={'145px'}
                height={'150px'}
                alt="Image"
                src={
                  User.profile_pic.startsWith('https://')
                    ? User.profile_pic
                    : `https://cdn.discordapp.com/avatars/${User.id}/${User.profile_pic}`
                }
                className={styles.userVideo}
                style={{
                  border: stream?.getAudioTracks() ? '2px solid green' : 'none',
                }}
              />
            )}
          </div>
          <ControlButtons local={true} />
        </div>
      ) : (
        <div>
          <div>
            {videoStatus ? (
              <video
                ref={localUserVideo}
                autoPlay
                muted
                playsInline
                className={styles.userVideo}
                style={{
                  border: stream?.getAudioTracks() ? '2px solid green' : 'none',
                }}
              />
            ) : (
              <Image
                width={'145px'}
                height={'150px'}
                alt="Image"
                src={
                  User.profile_pic.startsWith('https://')
                    ? User.profile_pic
                    : `https://cdn.discordapp.com/avatars/${User.id}/${User.profile_pic}`
                }
                className={styles.userVideo}
                style={{
                  border: stream?.getAudioTracks() ? '2px solid green' : 'none',
                }}
              />
            )}
          </div>
          <ControlButtons local={false}/>
        </div>
      )}
    </div>
  );
};

export default CallPrompt;
