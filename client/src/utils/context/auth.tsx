import React, {Context, createContext, useEffect} from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil';
import { UserStateAtom } from '../state';
import { IUser } from '../types';

interface Props {
    children: React.ReactNode
}

export const authContext = createContext({} as IUser);


const AuthProvider: React.FC<Props> = ({children}) => {
    const [user, setUser] = useRecoilState(UserStateAtom);

    useEffect(() => {
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
                }
                
            }
        } catch (error) {
            return null;
        }
      })();      
    }, [setUser])

    return (
        <authContext.Provider value={user}>
            {children}
        </authContext.Provider>
    )
}

export default AuthProvider;