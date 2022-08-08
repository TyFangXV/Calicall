import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SocketContextProvider } from '../utils/context/socketContext'
import { RecoilRoot } from 'recoil'
import { ThemeProvider } from '@mui/material'
import { theme } from '../utils/theme'

function MyApp({ Component, pageProps }: AppProps) {
  return (
      <RecoilRoot>
      <SocketContextProvider>
        <ThemeProvider theme={theme}>
          <Component {...pageProps} />
        </ThemeProvider>
      </SocketContextProvider>
    </RecoilRoot>
  )
}
export default MyApp
