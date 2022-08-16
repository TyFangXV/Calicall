import React, { useEffect } from 'react';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import * as uuid from 'uuid';
import { UserAlertAtom } from '../../utils/state';
import styles from './style.module.css';

interface IProps {
  children: React.ReactNode;
  AlertMessage: IuserAlertMessage;
}

interface IuserAlertMessage {
  id: string;
  message: string;
  onclick?: () => void;
}

export const useAlert = () => {
  const [userAlert, setUserAlert] = useRecoilState(UserAlertAtom);

  const newAlert = (message: string, onClick?: () => void) => {
    setUserAlert({
      id: uuid.v4(),
      message,
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
      <div className={styles.popupNotif}>
        <p>{userAlert.message}</p>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default AlertContainer;
