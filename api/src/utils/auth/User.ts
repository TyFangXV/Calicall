import prisma from "../database"
import * as uuid from 'uuid'

class User{
    user_id:string;

    constructor(user_id:string)
    {
        this.user_id = user_id;
    }

    public getUserData = async(id:string) => {
        const user = await prisma.user.findUnique({
            where: {
                id: id
            }
        });

        if(user)
        {
            return user;
        }

        if(!user)
        {
            return null;
        }
    }

    public updateUsersToken = async(refreshToken:string, token:string) => {
        try {
            const registeredToken = await prisma.token.findUnique({
                where: {
                    id: this.user_id
                }
            });

            if(registeredToken)
            {
                //check if the refresh token is valid
                if(registeredToken.refreshToken === refreshToken && token === registeredToken.token)
                {
                    //update the token
                    const updatedToken = await prisma.token.update({
                        where: {
                            id: this.user_id
                        },
                        data: {
                            token: uuid.v4(),
                            refreshToken: uuid.v4(),
                            expiresAt: new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 7))
                        }
                    })
                    return updatedToken;
                }else{
                    return "Invalid token";
                }
            }else{
                return "Token not found";
            }
        } catch (error) {
            return error;
        }
    }
}

export default User;