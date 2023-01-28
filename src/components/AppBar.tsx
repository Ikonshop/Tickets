// @ts-nocheck
import { FC, useEffect, useState } from "react";
import Link from "next/link";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useAutoConnect } from "../contexts/AutoConnectProvider";
import { RequestAirdrop } from "./RequestAirdrop";
import NetworkSwitcher from "./NetworkSwitcher";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { keypairIdentity, Metaplex } from "@metaplex-foundation/js";
import { Connection, PublicKey, Keypair } from "@solana/web3.js";
import useUserSOLBalanceStore from "../stores/useUserSOLBalanceStore";

export const AppBar: FC = (props) => {
  const [admin, setAdmin] = useState(false);
  const [ticketCount, setTicketCount] = useState(0);
  const [perkCount, setPerkCount] = useState(0);

  const endpoint =
    "https://solana-devnet.g.alchemy.com/v2/Yn1LR558RcFTubSO2xTjcCTIEHeQIl8R";

  const { autoConnect, setAutoConnect } = useAutoConnect();
  const wallet = useWallet();
  const connection = new Connection(endpoint, "confirmed");

  const balance = useUserSOLBalanceStore((s) => s.balance);

  const { getUserSOLBalance } = useUserSOLBalanceStore();

  const TIX_ADDRESS = "7boC1U9w1uRSshcTb7ojHWe2XH86BLVQzK5Lru8DAoqe";
  const TIX_PERKS_ADDRESS = "5dzonQLJSoRDP8cDY6QmQnQZYC7fSzEyRWCkf8FY5p67";

  const getUserTicketsCount = async (publicKey: PublicKey) => {
    const metaplex = new Metaplex(connection);
    const keypair = Keypair.generate();
    metaplex.use(keypairIdentity(keypair));

    //get balance of tokens in TIX_ADDRESS
    try {
      // find any NFTs owned by the user with the Token address of TIX_ADDRESS
      let tix = [];
      let perks = [];
      const allNfts = await metaplex
        .nfts()
        .findAllByOwner({ owner: publicKey });

      for (let i = 0; i < allNfts.length; i++) {
        console.log("checking :", allNfts[i].collection.key.toString());

        if (allNfts[i].collection.key.toString() === TIX_ADDRESS) {
          console.log("tix:", allNfts[i].collection.key.toString());

          tix.push(allNfts[i].collection.key.toString());
        }
        if (allNfts[i].collection.key.toString() === TIX_PERKS_ADDRESS) {
          console.log("perks:", allNfts[i].collection.key.toString());
          perks.push(allNfts[i].collection.key.toString());
        }
      }

      setTicketCount(tix.length);
      setPerkCount(perks.length);
      console.log("total tix:", tix);
      console.log("total perks:", perks);
    } catch (e) {
      console.log(`error getting balance: `, e);
    }
  };

  useEffect(() => {
    if (wallet.publicKey) {
      console.log(wallet.publicKey.toBase58());
      getUserSOLBalance(wallet.publicKey, connection);
      getUserTicketsCount(wallet.publicKey);
    }
  }, [wallet.publicKey]);

  useEffect(() => {
    //if the page url is '/admin' then set admin to true
    if (window.location.pathname === "/admin") {
      setAdmin(true);
    }
  }, []);

  return (
    <div>
      {/* NavBar / Header */}
      <div className="navbar flex flex-row md:mb-2 text-neutral-content">
        <div className="navbar-start">
          <label htmlFor="my-drawer" className="btn btn-square btn-ghost">
            <svg
              className="inline-block w-6 h-6 stroke-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </label>

          <div>
            <img
              onClick={() => (window.location.href = "/")}
              style={{
                width: "100px",
                height: "100px",
                marginTop: "10px",
              }}
              src="/logoWhBg.svg"
              alt="logo"
            />
          </div>
        </div>

        {/* Wallet & Settings */}
        <div className="navbar-end">
          {/* Nav Links */}

          <Link href="/">
            <a className="btn btn-ghost btn-sm rounded-btn">Home</a>
          </Link>
          {admin ? (
            <Link href="/admin">
              <a className="btn btn-ghost btn-sm rounded-btn">Admin</a>
            </Link>
          ) : (
            <>
              <Link href="/events">
                <a className="btn btn-ghost btn-sm rounded-btn">Events</a>
              </Link>
              <Link href="/pocket">
                <a className="btn btn-ghost btn-sm rounded-btn">My Pocket</a>
              </Link>
            </>
          )}

          {/* TEST FUNDS DROPDWON */}
          <div className="dropdown dropdown-end">
            <div tabIndex={0} className="btn btn-square test_funds btn-ghost">
              Test Funds
              <svg
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l9 7l9-7M5"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="p-2 shadow menu dropdown-content bg-base-100 rounded-box sm:w-52"
            >
              <li>
                <div className="form-control">
                  <label className="cursor-pointer label">
                    {wallet && (
                      <>
                        <p>SOL Balance: {(balance || 0).toLocaleString()}</p>
                        <p># of NFTix: {(ticketCount || 0).toLocaleString()}</p>
                        <p># of Perks: {(perkCount || 0).toLocaleString()}</p>
                      </>
                    )}
                  </label>

                  <RequestAirdrop />
                </div>
              </li>
            </ul>
          </div>
          <WalletMultiButton className="btn btn-ghost mr-4" />
          <div className="dropdown dropdown-end">
            <div tabIndex={0} className="btn btn-square btn-ghost text-right">
              <svg
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="p-2 shadow menu dropdown-content bg-base-100 rounded-box sm:w-52"
            >
              <li>
                <div className="form-control">
                  <label className="cursor-pointer label">
                    <a>Autoconnect</a>
                    <input
                      type="checkbox"
                      checked={autoConnect}
                      onChange={(e) => setAutoConnect(e.target.checked)}
                      className="toggle"
                    />
                  </label>
                  <label className="cursor-pointer label">
                    <a>Admin Mode</a>
                    <input
                      type="checkbox"
                      checked={admin}
                      onChange={(e) => setAdmin(e.target.checked)}
                      className="toggle"
                    />
                  </label>
                  <NetworkSwitcher />
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {props.children}
    </div>
  );
};
