import {Request, Response, NextFunction } from 'express';
import prisma from '../database';
import {redisClient} from '../redis'


const tokenValidator = async(token:string) => {
    const cachedToken = await  redisClient.get("token");
    if(cachedToken)
    {
        const token = JSON.parse(cachedToken);
        //check if the token is expired
        const now = new Date().getTime();
        const tokenExpired = new Date(token.expiresAt).getTime();
        if(now >= tokenExpired)
        {  
               return false;
        }else{
                return true;
        }        
    }

    if(!cachedToken)
    {
        //check if the token is valid in the database
        const tk = await prisma.token.findUnique({
            where: {
                token: token
            }
        })
    
        if(!tk)
        {
            return false;
        }
    
        if(tk)
        {
            //check if the token is expired
            const now = new Date().getTime();
            const tokenExpired = new Date(tk.expiresAt).getTime();
            if(now >= tokenExpired)
            {  
                return false;
            }else{
                redisClient.set("token", JSON.stringify(tk));
                return true;
            }
        }
    }
}


const authMiddleware = async(req: Request, res: Response, next: NextFunction) => {
    //find the path of the request
    const path = req.path;
    if(path === "/auth/getAuthUrl")
    {
        next();
    }

    if(path === "/auth/cb")
    {
        next();
    }

    if(path !== "/auth/cb" || "/auth/tokenValidation" )
    {
        const token = req.headers.authorization
        if(!token) 
        {

            
            return res.status(401).send({
                error: "Missing authorization token"
            })
        }
    
        if(token)
        {
            try {
                const isValid = await tokenValidator(token.split(" ")[1]);
                console.log(isValid);
                
                if(isValid)
                {  
                    next();
                }else{
                    return res.status(401).send({
                        error: "Invalid token"
                    })
                }         
            } catch (error) {
                console.log(error);
                return res.status(500).send(error);
            }
    
        }
    }
    
}

export default authMiddleware;