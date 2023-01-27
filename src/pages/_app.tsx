import { AppProps } from 'next/app';
import Head from 'next/head';
import { FC } from 'react';
import { ContextProvider } from '../contexts/ContextProvider';
import { AppBar } from '../components/AppBar';
import { ContentContainer } from '../components/ContentContainer';
import { Footer } from '../components/Footer';
import Notifications from '../components/Notification'

require('@solana/wallet-adapter-react-ui/styles.css');
require('../styles/globals.css');

const App: FC<AppProps> = ({ Component, pageProps }) => {
    return (
        <>
          <Head>
            <title>SOL•TIX | transparent ticketing</title>
            <link rel="icon" href="/SOLTIX.png" />
            <meta name="title" content="SolTix.xyz" />
            <meta
              name="description"
              content="a transparent ticketing system built on the Solana blockchain"
            />

            {/* Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content="IkonShop.io" />
            <meta
              property="og:description"
              content="a transparent ticketing system built on the Solana blockchain"
            />
            <meta property="og:image" content="/SOLTIX.png" />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:title" content="SolTix.xyz" />
            <meta
              property="twitter:description"
              content="a transparent ticketing system built on the Solana blockchain"
            />
            <meta property="twitter:image" content="/SOLTIX.png" />
          </Head>

          <ContextProvider>
            <div className="flex flex-col h-screen bg-white">
              <Notifications />
              <AppBar/>
              <ContentContainer>
                <Component {...pageProps} />
              </ContentContainer>
              <Footer/>
            </div>
          </ContextProvider>
        </>
    );
};

export default App;
