import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SocketContextProvider } from '../utils/context/socketContext'
import { RecoilRoot } from 'recoil'
import AppViewHandler from './app/handler'
import { useRouter } from 'next/router'

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isHome =
  router.pathname === '/app' || router.pathname.includes('/app/');
  return (
      <RecoilRoot>
      <SocketContextProvider>
        {isHome ? (
            <AppViewHandler Component={Component} pageProps={pageProps} />
          ) : (
            <Component {...pageProps} />
          )
        }
      </SocketContextProvider>
    </RecoilRoot>
  )
}
export default MyApp
