import React, { useEffect } from 'react';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import { motion } from "framer-motion"
import * as uuid from 'uuid';
import { UserAlertAtom } from '../../utils/state';
import styles from './style.module.css';
import { type } from 'os';

interface IProps {
  children: React.ReactNode;
  AlertMessage: IuserAlertMessage;
}

interface IuserAlertMessage {
  type : "INFO" | "WARNING" | "ERROR"
  id: string;
  message: string;
  onclick?: () => void;
}

type Type = {
  type: "INFO" | "WARNING" | "ERROR"
}

export const useAlert = () => {
  const [userAlert, setUserAlert] = useRecoilState(UserAlertAtom);

  const newAlert = (message: string, onClick?: () => void, type?:"INFO" | "WARNING" | "ERROR") => {
    setUserAlert({
      id: uuid.v4(),
      message,
      type : type ? type : "INFO",
      onclick: onClick,
    });
  };

  return {userAlert, newAlert};
};

const AlertContainer: React.FC<IProps> = ({ children, AlertMessage }) => {
  const [userAlert, _] = useRecoilState(UserAlertAtom);
  const reset = useResetRecoilState(UserAlertAtom);
    useEffect(() => {
        if (AlertMessage && userAlert.message !== '') 
        {
            setTimeout(() => {
                reset();
            }, 3000);    
        }
    })

  return (
    <div>
        {
          userAlert.message !== '' && (
            <motion.div
                animate={{ y: 100 }}
                transition={{ ease: "easeOut", duration:1 }}
                className={styles.popupNotif}
            >
              <audio src={`/sound/${AlertMessage.type.toLocaleLowerCase()}.mp3`} autoPlay/>
              <div className={styles.alert}>
                <p>{userAlert.message}</p>
              </div>
            </motion.div>
          )
        }
      <div>{children}</div>
    </div>
  );
};

export default AlertContainer;
