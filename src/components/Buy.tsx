import { FC, useEffect, useState, useMemo } from "react";
import Button from "./Utils/Button";
import { notify } from "../utils/notifications";
import {
  Keypair,
  Transaction,
  Connection,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { findReference, FindReferenceError } from "@solana/pay";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import base58 from "bs58";

const shopSecretKey = process.env.NEXT_PUBLIC_SHOP_SECRET_KEY;
const shopKeypair = Keypair.fromSecretKey(base58.decode(shopSecretKey));
const shopPublicKey = shopKeypair.publicKey;
console.log("shop publicKey", shopPublicKey.toString());

const STATUS = {
  Initial: "Initial",
  Submitted: "Submitted",
  Paid: "Paid",
  Sending: "Sending",
  Fulfilled: "Fulfilled",
};

export default function Buy({ buyer, price, token, owner, ticketAddress }) {
  const { publicKey, sendTransaction } = useWallet();
  const orderID = useMemo(() => Keypair.generate().publicKey, []);
  const [status, setStatus] = useState(STATUS.Initial); // Tracking transaction status
  const [loading, setLoading] = useState(false); // Loading state of all above

  const connection = new Connection(
    "https://solana-devnet.g.alchemy.com/v2/1wbDr7WOHCshS1G8e8W9oSDtZdM9We4f",
    "confirmed"
  );

  const order = useMemo(
    () => ({
      ticketAddress: ticketAddress,
      buyer: publicKey.toString(),
      orderID: orderID.toString(),
      price: price,
      token: token,
      owner: owner,
    }),
    [buyer, orderID, owner, token, ticketAddress, price]
  );

  const processTransaction = async () => {
    // setLoading(true);
    // console.log('sending this order', order);
    const txResponse = await fetch("../api/createTransaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    });

    const txData = await txResponse.json();
    // console.log("txData", txData);
    const tx = Transaction.from(Buffer.from(txData.transaction, "base64"));
    try {
      const txHash = await sendTransaction(tx, connection);
      console.log(
        `Transaction sent: https://solscan.io/tx/${txHash}?cluster=devnet`
      );
      setStatus(STATUS.Submitted);
    } catch (error) {
      console.error(error);
      if (error.code === 4001) {
        console.log("Transaction rejected by user");
      }
      if (error.code === -32603 || error.code === -32003) {
        console.log(
          "Transaction failed, probably due to one of the wallets not having this token"
        );
      }
      if (error.code === -32000) {
        console.log("Transaction failed");
      }
    } finally {
      // setLoading(false);
    }
  };

  const sendTicket = async () => {
    const txResponse = await fetch("../api/createTicketTransaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    });

    const txData = await txResponse.json();
    // console.log("txData", txData);
    const tx = Transaction.from(Buffer.from(txData.transaction, "base64"));

    try {
      tx.partialSign(shopKeypair);
      console.log("tx", tx);
      const txHash = await sendTransaction(tx, connection);
      console.log(
        `Transaction sent: https://solscan.io/tx/${txHash}?cluster=devnet`
      );
      setStatus(STATUS.Sending);
    } catch (error) {
      console.error(error);
      if (error.code === 4001) {
        console.log("Transaction rejected by user");
      }
      if (error.code === -32603 || error.code === -32003) {
        console.log(
          "Transaction failed, probably due to one of the wallets not having this token"
        );
      }
      if (error.code === -32000) {
        console.log("Transaction failed");
      }
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    // Check if transaction was confirmed
    if (status === STATUS.Submitted) {
      setLoading(true);
      const interval = setInterval(async () => {
        try {
          const result = await findReference(connection, orderID);
          console.log("Finding tx reference", result.confirmationStatus);
          if (
            result.confirmationStatus === "confirmed" ||
            result.confirmationStatus === "finalized"
          ) {
            clearInterval(interval);
            setStatus(STATUS.Paid);
          }
        } catch (e) {
          if (e instanceof FindReferenceError) {
            return null;
          }
          console.error("Unknown error", e);
        }
      }, 1000);
      return () => {
        setLoading(false);
        clearInterval(interval);
        notify({ type: 'success', message: 'Payment Received! Sending Ticket', orderid: orderID.toString() });
      };
    }

    if (status === STATUS.Paid) {
      setLoading(true);
      sendTicket();
    }

    if (status === STATUS.Sending) {
      setLoading(true);
      const interval = setInterval(async () => {
        try {
          const result = await findReference(connection, orderID);
          console.log("Finding tx reference", result.confirmationStatus);
          if (
            result.confirmationStatus === "confirmed" ||
            result.confirmationStatus === "finalized"
          ) {
            clearInterval(interval);
            setStatus(STATUS.Fulfilled);
          }
        } catch (e) {
          if (e instanceof FindReferenceError) {
            return null;
          }
          console.error("Unknown error", e);
        }
      }, 1000);
      return () => {
        setLoading(false);
        clearInterval(interval);
        notify({ type: 'success', message: 'Ticket Sent!', orderid: orderID.toString()});
      };
    }
    if (status === STATUS.Fulfilled) {
      setLoading(false);
    }
  }, [status]);
  return <Button title="Buy" onClick={processTransaction} disabled={loading} />;
}
