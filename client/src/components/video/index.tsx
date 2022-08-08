import React, { useContext } from "react";
import { SocketContext } from "../../utils/context/socketContext";


const Video:React.FC = () => {
    const {callAccepted, localUser, localUserVideo, callEnded, stream, call } = useContext(SocketContext);

    return (
        <div>
            <h1>Viewing {localUser} screen</h1>
            {
                stream ? (
                    <video autoPlay muted playsInline ref={localUserVideo} />
                ) : (
                    <h1>No stream</h1>
                )
            }
        </div>
    )
}

export default Video;