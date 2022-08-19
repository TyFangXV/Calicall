import { Express, Request, Response, NextFunction } from 'express';
import prisma from '../database';


const tokenValidator = async(token:string) => {
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
            return true;
        }
    }
}


const authMiddleware = async(req: Request, res: Response, next: NextFunction) => {
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
            if(isValid)
            {
                next();
            }else{
                return res.status(401).send({
                    error: "Invalid token"
                })
            }         
        } catch (error) {
            return res.status(500).send(error);
        }

    }
}

export default authMiddleware;