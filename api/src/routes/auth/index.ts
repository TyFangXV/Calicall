import { Router } from "express";
import DiscordAuth from "../../utils/auth/DSauth";
import { encrypt } from "../../utils/encryption";

const authRouter = Router();


authRouter.get("/getAuthUrl", async(req, res) => {
  const country = req.query.country;
  res.redirect(`https://discord.com/api/oauth2/authorize?client_id=1005476678287511673&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Fauth%2Fcb&response_type=code&scope=identify%20email&state=${country}`);
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