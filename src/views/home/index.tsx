// Next, React
import { FC, useEffect, useState } from "react";
import Link from "next/link";
import styles from "../../styles/custom.module.css";
import { TestTickets } from "components/TestTickets/TestTickets";
// Wallet
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

// Components
import { RequestAirdrop } from "../../components/RequestAirdrop";
import pkg from "../../../package.json";

// Store
import useUserSOLBalanceStore from "../../stores/useUserSOLBalanceStore";

export const HomeView: FC = ({}) => {
  const wallet = useWallet();
  const { connection } = useConnection();

  const balance = useUserSOLBalanceStore((s) => s.balance);
  const { getUserSOLBalance } = useUserSOLBalanceStore();

  useEffect(() => {
    if (wallet.publicKey) {
      console.log(wallet.publicKey.toBase58());
      getUserSOLBalance(wallet.publicKey, connection);
    }
  }, [wallet.publicKey, connection, getUserSOLBalance]);

  return (
    <div className={styles.hero}>
      <div className={styles.hero_group}>
        <div className={styles.hero_text}>
          {/* <img
              className="inline-block w-80 h-40 mr-2"
              src="/logoGrBg.svg"
              alt="logo"
            /> */}
          <h1>Buy and Sell tickets with transparency on Solana</h1>
          <p>
            {/* Events use NFTickets to send upgrades (like free merch) directly to their ticket. <br />
            Buyers can see Ticket sales history and if value is marked up. */}
            <div className={styles.column_container}>
              <div className={styles.left_column}>
              <ul>
                <li><span className={styles.span_green} >✔</span> Ticket Transparency </li>
                <li><span className={styles.span_green} >✔</span> Ticket Perks </li>
              </ul>
              </div>
              <div className={styles.right_column}>
                <ul>
                  <li><span className={styles.span_green} >✔</span> New Event Experience </li>
                  <li><span className={styles.span_red} >✘</span> Hidden Fees </li>
                </ul>
              </div>
            </div>
          </p>

          {!wallet.connected && (
              <div className={styles.hero_button}>
                <h3>Connect & Try!</h3>
                <WalletMultiButton className={styles.connect_button}/>
              </div>
          )}
        </div>
        <div className={styles.hero_video}>
          <video
            autoPlay
            loop
            muted
            playsInline
            src="/LandingVideo.mp4"
          />
        </div>
        <div id={"hero_mobile_video"} className={styles.hero_mobile_video}>
          {/* close button to hide hero_mobile_video */}
          
            <button
              className={styles.close_button}
              onClick={() => {
                document.getElementById("hero_mobile_video").style.display =
                  "none";
              }}
            >
              X
            </button>
          
          <video
            autoPlay
            loop
            muted
            playsInline
            src="/LandingVideo.mp4"
          />
        </div>
        
        <div data-tf-sidetab="yIG54kJf" data-tf-opacity="100" data-tf-iframe-props="title=Sol Tix Venue Form" data-tf-transitive-search-params data-tf-button-color="#BB10EF" data-tf-button-text="Event or Venue? Click." style={{all:"unset"}}></div><script src="//embed.typeform.com/next/embed.js"></script>        </div>
        {wallet.connected ? 
        (
          <div>
            <TestTickets />
          </div>
        ) : (
          null
        )}
    </div>
  );
};
