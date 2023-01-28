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

import {
  IoArrowBackOutline,
  IoBarChartOutline,
  IoDocumentOutline,
  IoFileTrayFullOutline,
  IoInformationCircleOutline,
  IoLinkOutline,
} from "react-icons/io5";

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

  const [showElement, setShowElement] = useState(true);
  useEffect(() => {
    setTimeout(function () {
      setShowElement(false);
    }, 10000);
  }, []);

  return (
    <div className={styles.hero}>
      <div className={styles.hero_group}>
        {showElement ? (
          <div className={styles.no_nft_popup}>
            <div>
              <img src="/info.gif" />
              <h5>Hello Anon</h5>
            </div>
            <p>
              Need Devnet SOL? Click the <span>gear icon</span> in the toolbar.
            </p>
          </div>
        ) : (
          <div></div>
        )}
        <div className={styles.hero_text}>
          <img className={styles.bg_overlay} src="/bg_overlay.png" />
          <h1>A Transparent Ticketing Platform.</h1>
          <p>Buy and Sell tickets with transparency on the Blockchain.</p>

          <p>
            <div className={styles.column_container}>
              <div className={styles.left_column}>
                <ul>
                  <li>
                    <span className={styles.span_green}>✔</span> Ticket
                    Transparency{" "}
                  </li>
                  <li>
                    <span className={styles.span_green}>✔</span> Ticket Perks{" "}
                  </li>
                </ul>
              </div>
              <div className={styles.right_column}>
                <ul>
                  <li>
                    <span className={styles.span_green}>✔</span> New Event
                    Experience{" "}
                  </li>
                  <li>
                    <span className={styles.span_red}>✘</span> Hidden Fees{" "}
                  </li>
                </ul>
              </div>
            </div>
          </p>

          {!wallet.connected && (
            <>
              {/* <h3
                style={{
                  color: "rgb(128, 0, 255)",
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                }}
              >
                Connect & Try!
              </h3> */}
              <div className={styles.hero_button}>
                <WalletMultiButton className={styles.connect_button} />
              </div>
            </>
          )}
          {wallet.connected && (
            <Link href="/events">
              <div className={styles.hero_button}>
                <button className={styles.discover_button}>
                  Discover Events
                </button>
              </div>
            </Link>
          )}
        </div>
        <div className={styles.hero_row2}>
          <img src="/hero_bg.png" />
        </div>

        {/* <div className={styles.hero_video}>
          <video
            autoPlay
            loop
            muted
            playsInline
            src="/LandingVideo.mp4"
          />
        </div>
        <div id={"hero_mobile_video"} className={styles.hero_mobile_video}>
         
          
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
        </div> */}
      </div>
      <div
        data-tf-sidetab="yIG54kJf"
        data-tf-opacity="100"
        data-tf-iframe-props="title=Sol Tix Venue Form"
        data-tf-transitive-search-params
        data-tf-button-color="#BB10EF"
        data-tf-button-text="Add an Event/Venue."
        style={{ all: "unset" }}
      ></div>
      <script src="//embed.typeform.com/next/embed.js"></script>{" "}
      {/* {wallet.connected ? (
        <div>
          <TestTickets />
        </div>
      ) : null} */}
    </div>
  );
};
