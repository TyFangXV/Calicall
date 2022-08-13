import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import SideMenuBar from "../../../components/sidebar/menubar";
import { authContext } from "../../../utils/context/auth";
import { IUser } from "../../../utils/types";
import style from '../../../styles/chat.module.css'

const Chat:NextPage = () => {
    const router = useRouter();
    const id = router.query.id as string;
    const {friends} = useContext(authContext);
    const [friend, setFriend] = React.useState<IUser>();

    useEffect(() => {
       if(id)
       {
        const friend = friends.find(friend => friend.receiver?.id === id);
        setFriend(friend?.receiver);        
       }
    }, [friends, id, router])

    return (
        <div>
            <Head>
                <title>{friend?.name}</title>
            </Head>
            <SideMenuBar/>
            <div className={style.container}>

            </div>
        </div>
    )
}

export default Chat;