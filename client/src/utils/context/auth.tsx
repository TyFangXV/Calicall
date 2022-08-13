import axios from 'axios';
import React, {Context, createContext, useEffect, useState} from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil';
import { UserStateAtom } from '../state';
import { IFriendRequest, IUser } from '../types';

interface Props {
    children: React.ReactNode
}

interface AuthContext {
    user: IUser;
    friends: IFriendRequest[];
}

export const authContext = createContext({} as AuthContext);


const AuthProvider: React.FC<Props> = ({children}) => {
    const [user, setUser] = useState<IUser>({
        id: "",
        name: "",
        email: "",
        signedIn: false,
    });

    const [friends, setFriends] = useState<IFriendRequest[]>([]);

    useEffect(() => {
    if(!user.signedIn)
    {
      (async () => {
        try {
            const cachedUserStorage = await caches.keys();

            if (cachedUserStorage.length > 0) 
            {
                const cachedUser = await caches.open(cachedUserStorage[0]);
                const cachedUserData = await cachedUser.match('/');
                if(cachedUserData)
                {
                    const userData = await cachedUserData.json();
                    setUser({
                        email : userData.user.email,
                        id : userData.user.id,
                        name : userData.user.name,
                        signedIn : true,
                    });

                    const {data} = await axios.post(`/api/friend/me?me=${userData.user.id}`);

                    setFriends([...data]);
                    
                }
                
            }
        } catch (error) {
            return null;
        }
      })(); 
    }
    
    }, [user, friends]);

    return (
        <authContext.Provider value={{
            user,
            friends,
        }}>
            {children}
        </authContext.Provider>
    )
}

export default AuthProvider;