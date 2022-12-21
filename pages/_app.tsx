import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import { ContextWrapper, useStateContext } from '../context/states'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import Content from '../components/Content'
import Head from 'next/head'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ContextWrapper>
      <Head>
        <title>TODO</title>
        <meta name="description" content="Simple todo app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Content>
        <Component {...pageProps} />
      </Content>
      <BottomNav />
    </ContextWrapper>
  )
}
