import axios from "axios";
import {UserDataHandler} from "./USauth";

class DiscordAuth {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    scope: string;

    constructor(clientId:string, clientSecret:string, redirectUri:string, scope:string) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.redirectUri = redirectUri;
        this.scope = scope;
    }

    getToken = async(code:string) => {
        try {

            const param = new URLSearchParams;
            param.append('client_id', this.clientId);
            param.append('client_secret', this.clientSecret);
            param.append('code', code as string);
            param.append('redirect_uri', this.redirectUri);
            param.append('grant_type', 'authorization_code');
    
            //get access token
            const { data } = await axios.post("https://discord.com/api/v10/oauth2/token", param, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
    
            return data;
        } catch (error) {
            console.log(error)
            return null;
        }
    }


    getUserData = async(token:string, state:string) => {
        try {
            //get user dat from discord
            const { data:UserData } = await axios.get("https://discord.com/api/v10/users/@me", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            
            if(UserData.verified)
            {
                const userDataHandler = new UserDataHandler(
                    UserData.email,
                    UserData.id,
                    UserData.username,
                    state,
                    UserData.avatar
                )

                //save user data and return the auth token
                const user = await userDataHandler.saveUserData();
                const token = await userDataHandler.generateAuthToken(user.id);

                if(token)
                {
                    return {
                        user,
                        token
                    }
                }
                
                if(!token)
                {
                    return null;
                }
            }else{
                return null;
            }
        } catch (error) {
            console.log(error);
            
            return null;
        }
    }

    hasJoinedServer = async(access_token:string, userid:string) => {
        try{
         const {data:serverJoinedStatus} = await axios.get(`https://discord.com/api/v10/users/@me/guilds`, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
         })
         return serverJoinedStatus.find((server:any) => server.id === "829472848321839124");

        }catch(e)
        {
            console.log(e);
            
            return null;           
        }
    } 

}

export default DiscordAuth;