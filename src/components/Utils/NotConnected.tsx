// render a container that will display a connect to wallet button for when the user is not connected to their wallet

import React from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Button from "./Button";
import { FC } from "react";

const ConnectWallet: FC = () => {
  const { connected } = useWallet();

  if (connected) return null;

  return (
    <div className="text-gray-500 no_wallet">
      <h1 className="text-2xl font-bold">Oops! no wallet found</h1>
      <img src="/no_wallet.gif" className="cat" />
      <p className="text-gray-500">
        Connect your wallet to buy or see tickets.
      </p>

      {/* or download the phantom wallet here! */}
      <p className="text-gray-500">or download the phantom wallet here:</p>
      <a
        className="text-blue-500"
        href="https://phantom.app/"
        target="_blank"
        rel="noreferrer"
      >
        https://phantom.app/
      </a>

      <WalletMultiButton className="connect_button" />
    </div>
  );
};

export default ConnectWallet;
