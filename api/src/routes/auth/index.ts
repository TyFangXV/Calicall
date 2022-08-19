import { Router } from "express";
import DiscordAuth from "../../utils/auth/DSauth";
import { UserDataHandler } from "../../utils/auth/USauth";
import User from "../../utils/auth/User";
import prisma from "../../utils/database";
import { encrypt } from "../../utils/encryption";

const authRouter = Router();


authRouter.get("/getAuthUrl", async(req, res) => {
  const country = req.query.country;
  res.redirect(`https://discord.com/api/oauth2/authorize?client_id=1005476678287511673&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Fauth%2Fcb&response_type=code&scope=identify%20email&state=${country}`);
})


authRouter.post("/tokenValidation" , async(req, res) => {
  try {
    const {token, userID} = req.body;
    if(token)
    {
      //check if the token exist
      const tk = await prisma.token.findUnique({
        where: {
          id : token.id
        }
      })

      if(tk)
      {
        //check if the token is valid 
        const TimeOut = new Date(tk.expiresAt);
        const now = new Date();
        if(TimeOut.getTime() > now.getTime())
        {
          res.status(200).send(tk);
        }else{
          console.log("Token Updated");
          
          const user = await new User(userID).getUserData(userID);
          //update the token
          const token = await new UserDataHandler(
            user?.email as string,
            user?.id as string,
            user?.name as string,
            user?.location as string
          ).generateAuthToken(userID);

          res.status(200).send(token);
        }

      }
    }

    if(!token)
    {
      res.status(400).send("Token not found");
    }
  } catch (error) {
    res.status(500).send(error)
  }
})

authRouter.get("/cb", async(req, res) => {
 try {
  const discordAuth = new DiscordAuth(
    process.env.DISCORD_AUTH_CLIENT_ID as string,
    process.env.DISCORD_AUTH_CLIENT_SECRET as string,
    process.env.DISCORD_AUTH_REDIRECT_URI as string,
    "email identity",
  )


  const token = await discordAuth.getToken(req.query.code as string);

  if(token)
  {
    const userData = await discordAuth.getUserData(token.access_token as string, req.query.state as string);
    res.status(userData ? 200 : 400).redirect(userData ? `http://localhost:3000?v=${encrypt(JSON.stringify(userData))}` : "/");
  } 

  if(!token)
  {
    res.status(400).send("Token not found");
  }

 } catch (error) {
  console.log(error);
  
  res.status(500).send("Please try again later");
 }
})

export default authRouter;