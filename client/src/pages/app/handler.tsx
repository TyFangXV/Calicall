
import { useContext } from "react";
import AppBar from "../../components/appbar";
import { authContext } from "../../utils/context/auth";
import { SocketContext } from "../../utils/context/socketContext";


type Props = {
    Component: React.ComponentType<any>;
    pageProps: any;
}


const Home = ({ Component, pageProps}:Props) => {
    const user = useContext(authContext);
    const socket = useContext(SocketContext);

    if(user.signedIn) 
    {
        socket.connectUser(user.id);
    }else{
        window.location.href = "/";        
    }

    return(
        <div>
            <div>
                <AppBar/>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                
            </div>
                <div>
                    <Component {...pageProps} /> 
                </div>
        </div>
    )
}

export default Home;