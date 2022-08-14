import React, { useContext, useEffect, useRef } from 'react';
import { useRecoilState } from 'recoil';
import { authContext } from '../../../utils/context/auth';
import { LocalInputMessageAtom } from '../../../utils/state';
import { IMessage } from '../../../utils/types';
import Giphy from '../giphy';
import style from './style.module.css';

interface IProps {
  name: string;
  friendId: string;
  onEnter: (m: IMessage) => void;
}

const Input: React.FC<IProps> = ({ name, friendId, onEnter }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = React.useState('');
  const [type, setType] = React.useState<'TEXT' | 'GIF'>('TEXT');
  const { user } = useContext(authContext);
  const message = {
    message: value, 
    type,
    to: friendId,
    from: user?.id as string,
  };
  

  return (
    <div className={style.container}>
      <Giphy
        onBtnPress={() => setType('GIF')}
        onclick={(url) => {
          setValue(url);
 
        }}
      />

      <input
        type="text"
        ref={inputRef}
        value={value}
        className={style.input}
        placeholder={`Message @${name}`}
        onChange={(e) => {
            setValue(e.target.value);
            setType('TEXT');
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') 
          {
            onEnter(message);
            setValue('');
          }
        }}
      />
    </div>
  );
};

export default Input;
