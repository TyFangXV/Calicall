import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SocketContextProvider } from '../utils/context/socketContext'
import { RecoilRoot, useRecoilState } from 'recoil'
import AppViewHandler from './app/handler'
import { useRouter } from 'next/router'
import StateUpdaterProvider from '../utils/context/stateUpdater'

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isHome =
  router.pathname === '/app' || router.pathname.includes('/app/');
  return (
      <RecoilRoot>
      <SocketContextProvider>
        <StateUpdaterProvider>
          {isHome ? (
              <AppViewHandler Component={Component} pageProps={pageProps} />
            ) : (
              <Component {...pageProps} />
            )
          }          
        </StateUpdaterProvider>
      </SocketContextProvider>
    </RecoilRoot>
  )
}
export default MyApp
