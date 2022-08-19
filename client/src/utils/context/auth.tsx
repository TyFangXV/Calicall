import axios from 'axios';
import React, {Context, createContext, useEffect, useState} from 'react'
import { IFriendRequest, IUser } from '../types';

interface Props {
    children: React.ReactNode
}

type Token = {
    token: string;
    expiresIn: Date;
    refreshToken : string;
}

interface AuthContext {
    user: IUser;
    friends: IFriendRequest[];
    token: Token
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
    const [token, setToken] = useState<Token>({
        token: "",
        expiresIn: new Date(),
        refreshToken: "",
    })


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

                    axios.post("/api/auth", {
                        token : userData.token,
                        userID : userData.user.id
                    })
                    .then(res => {
                        setToken(res.data)
                    })


                    const {data:Friends} = await axios.post(`/api/friend/me?me=${userData.user.id}`, {}, {
                        headers: {
                            "Authorization": "Bearer " + userData.token.token
                        }
                    });

                    setFriends([...Friends]);

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
            token
        }}>
            {children}
        </authContext.Provider>
    )
}

export default AuthProvider;