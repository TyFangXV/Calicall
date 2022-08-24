import prisma from "../database";
import * as uuid from "uuid";

export class UserDataHandler{
    email:string;
    id:string;
    profile_pic:string;
    location:string;
    username:string;

    constructor(email:string, id:string, username:string, location:string, profile_pic:string)
    {
        this.email = email;
        this.profile_pic = profile_pic;
        this.id = id;
        this.username = username;
        this.location = location;
    }

    
    
    static getUserData = async(id:string) => {
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
    
    saveUserData = async() => { 
        const userExist = await UserDataHandler.getUserData(this.id)

        if(!userExist)
        {
            const user = await prisma.user.create({
                data: {
                    email: this.email,
                    id: this.id,
                    profile_pic : this.profile_pic || "https://i.pinimg.com/280x280_RS/37/77/3f/37773f14fac74cdeff6c00e3b8d79ec7.jpg",
                    name: this.username,
                    created_at : new Date(),
                    location: this.location,
                }
            })
            return user;            
        }else{
            return userExist;
        }

    }

    generateAuthToken = async(userID:string) => {
        //check if a user has a token
        const token = await prisma.token.findUnique({
            where: {
                id: userID
            }
        });

        if(token)
        {
            //check if the token has expired
            if(token.expiresAt > new Date())  
            {
                return token;
            }else{
                //generate a new token and save it to the database
                const token =  uuid.v5(userID, uuid.v4());
                const refreshToken = uuid.v5(userID, uuid.v4());
                const data = {
                    token: token,
                    refreshToken: refreshToken,
                    expiresAt: new Date(Date.now() + (60 * 60 * 1000)),
                    id : userID
                }

                const authToken = await prisma.token.update({
                    where: {
                        id: userID
                    },
                    data: data
                })
                return authToken;
            }
        }

        if(!token)
        {
            const token =  uuid.v5(userID, uuid.v4());
            const refreshToken = uuid.v5(userID, uuid.v4());
            
            const data = {
                token: token,
                refreshToken: refreshToken,
                expiresAt: new Date(Date.now() + (60 * 60 * 1000)),
                id : userID
            }

            const authToken = await prisma.token.create({
                data
            })

            return authToken;   
        }

    }
}
