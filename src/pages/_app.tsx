import Head from 'next/head'
import { AppProps } from 'next/app'
import { SWRConfig } from 'swr'

import { ChakraProvider } from '@chakra-ui/react'
import theme from '../chakraUtils'

import '../styles/global.scss'
import { AuthContextProvider } from '../contexts/AuthContext'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="author" content="Gustavo Soares" />
        <meta
          name="description"
          content="Um site para guardar todas as suas tarefas e otimizar sua rotina"
        />
        <meta name="keywords" content="noteme, tarefas, todo, to-do" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />

        <link
          rel="shortcut icon"
          href="/assets/noteme-icon.ico"
          type="image/x-icon"
        />
        <title>noteMe</title>
      </Head>
      <AuthContextProvider>
        <SWRConfig value={{ provider: () => new Map() }}>
          <ChakraProvider resetCSS theme={theme}>
            <Component {...pageProps} />
          </ChakraProvider>
        </SWRConfig>
      </AuthContextProvider>
    </>
  )
}

export default MyApp
