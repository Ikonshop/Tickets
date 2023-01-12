// Next, React
import { FC, useEffect, useState } from "react";
import Link from "next/link";
import styles from "../../styles/custom.module.css";
import { TestTickets } from "components/TestTickets/TestTickets";
// Wallet
import { useWallet, useConnection } from "@solana/wallet-adapter-react";

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
        {/* <img
            className="inline-block w-80 h-40 mr-2"
            src="/logoGrBg.svg"
            alt="logo"
          /> */}
        <h1>Buy and Sell tickets with transparency on the Blockchain.</h1>
        <p>
          {/* Events use NFTickets to send upgrades (like free merch) directly to their ticket. <br />
          Buyers can see Ticket sales history and if value is marked up. */}
          Get a unique experience holding your NFT tickets by attaching upgrades
          directly to your ticket.
        </p>
        <div><TestTickets /></div>
        <div data-tf-popover="yIG54kJf" data-tf-opacity="100" data-tf-iframe-props="title=Sol Tix Venue Form" data-tf-transitive-search-params data-tf-button-color="#5CD6C8" data-tf-tooltip="Hey 👋  Want to use SolTix for your next event?" style={{all:"unset"}}></div><script src="//embed.typeform.com/next/embed.js"></script>      </div>
    </div>
  );
};
