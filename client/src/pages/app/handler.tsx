import { useContext, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import AlertContainer, { useAlert } from '../../components/alert';
import Alert from '../../components/alert';
import DMCallWidget from '../../components/DMCall';
import SideBar from '../../components/sidebar';
import { authContext } from '../../utils/context/auth';
import P2PCallContextProvider from '../../utils/context/P2PCall';
import { SocketContext } from '../../utils/context/socketContext';
import StateUpdaterProvider from '../../utils/context/stateUpdater';
import { currentFriend } from '../../utils/state';

type Props = {
  Component: React.ComponentType<any>;
  pageProps: any;
};

const Home = ({ Component, pageProps }: Props) => {
  const { user } = useContext(authContext);
  const socket = useContext(SocketContext);
  const CurrentFriend = useRecoilValue(currentFriend);
  const { userAlert } = useAlert();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (user.signedIn) {
        socket.connectUser(user.id);
      } else {
        window.location.href = '/';
      }
    }
  });

  let connectionTry = 0;

  useEffect(() => {
    //If the server got disconnected, try to reconnect every 1 sec for 3 times
    socket.socket.on('disconnect', () => {
      if (connectionTry !== 3) {
        setInterval(() => {
          socket.connectUser(user.id);
          connectionTry++;
        }, 1000);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StateUpdaterProvider>
      <AlertContainer AlertMessage={userAlert}>
            <DMCallWidget />
            <div style={{ position: 'absolute', left: '0', top: '0' }}>
              <SideBar />
            </div>
            <Component {...pageProps} />
      </AlertContainer>
    </StateUpdaterProvider>
  );
};

export default Home;
