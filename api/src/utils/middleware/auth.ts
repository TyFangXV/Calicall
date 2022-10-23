import {Request, Response, NextFunction } from 'express';
import prisma from '../database';
import logger from '../logger';
import {redisClient} from '../redis'

const tokenValidator = async(token:string, id:string) => {
    const cachedToken = await  redisClient.get(id);

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
        console.log(token);
        
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
                redisClient.set(tk.id , JSON.stringify(tk), {
                    EX: tk.expiresAt.getTime(),
                    NX: true
                });
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
                const giveToken = token.split(" ")[1]
                const isValid = await tokenValidator(giveToken.split(".")[0], giveToken.split(".")[1])

                
                if(isValid)
                {  
                    next();
                }else{
                    return res.status(401).send({
                        error: "Invalid token"
                    })
                }         
            } catch (error:any) {
                console.error(error);
                return res.status(500).send(error);
            }
    
        }
    }
    
}

export default authMiddleware;