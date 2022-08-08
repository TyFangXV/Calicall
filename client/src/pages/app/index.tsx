import { NextPage } from "next";
import Head from "next/head";
import { useContext, useEffect, useRef } from "react";
import { useRecoilValue } from "recoil";
import AppBar from "../../components/appbar";
import { SocketContext } from "../../utils/context/socketContext";
import { UserStateAtom } from "../../utils/state";

const Home:NextPage = () => {
    const user = useRecoilValue(UserStateAtom);
    const socket = useContext(SocketContext);

    if(user.signedIn) 
    {
        socket.connectUser(user.id);
     
    }

    return(
        <div>
            <Head>
                <title>Chat</title>
            </Head>
            <div>
                <AppBar/>
            </div>
        </div>
    )
}

export default Home;