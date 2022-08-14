import { useContext, useEffect } from "react";
import AppBar from "../../components/appbar";
import SideBar from "../../components/sidebar";
import { authContext } from "../../utils/context/auth";
import { SocketContext } from "../../utils/context/socketContext";


type Props = {
    Component: React.ComponentType<any>;
    pageProps: any;
}


const Home = ({ Component, pageProps}:Props) => {
    const {user} = useContext(authContext);
    const socket = useContext(SocketContext);

    
    useEffect(() => {
        if(typeof window !== "undefined")
        {
            if(user.signedIn) 
            {
                socket.connectUser(user.id);
            }else{
                window.location.href = "/";        
            }
        }
    })


    let connectionTry = 0;    

    useEffect(() => {
        //If the server got disconnected, try to reconnect every 1 sec for 3 times
        socket.socket.on("disconnect", () => {
           if(connectionTry !== 3) {
              setInterval(() => {
                socket.connectUser(user.id);
                connectionTry++;
              }, 1000);
           }
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    return(
        <div>
            <div>
                <AppBar/>
                <div style={{position : "absolute", left : "0", top : "0"}}>
                  <SideBar/>
                </div>
            </div>
                <div>
                    <Component {...pageProps} /> 
                </div>
        </div>
    )
}

export default Home;