import prisma from "../database"
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
}

export default User;