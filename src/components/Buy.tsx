import { FC, useEffect, useState, useMemo } from "react"
import Button from "./Utils/Button"
import { Keypair, Transaction, Connection } from "@solana/web3.js";
import { findReference, FindReferenceError } from "@solana/pay";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
//create a Buy Button that
// const processTransaction = async () => {
    // setLoading(true);
    // console.log('sending this order', order);
//     const txResponse = await fetch("../api/createTransaction", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(order),
//     });

//     const txData = await txResponse.json();
//     // console.log("txData", txData);
//     const tx = Transaction.from(Buffer.from(txData.transaction, "base64"));
//     // console.log("Tx data is", tx);
//     // console.log("here is the order man", order);
//     // Attempt to send the transaction to the network
//     try {
//       // await sendTransaction and catch any error it returns

//       const txHash = await sendTransaction(tx, connection);
//       // Wait for the transaction to be confirmed

//       console.log(
//         `Transaction sent: https://solscan.io/tx/${txHash}?cluster=mainnet`
//       );
//       setStatus(STATUS.Submitted);
//     } catch (error) {
//       console.error(error);
//       if (error.code === 4001) {
//         <Red message="Transaction rejected by user" />;
//       }
//       if (error.code === -32603 || error.code === -32003) {
//         <Red message="Transaction failed, probably due to one of the wallets not having this token" />;
//       }
//       if (error.code === -32000) {
//         <Red message="Transaction failed" />;
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

// const order = useMemo(
//     () => ({
//       id: id,
//       buyer: publicKey.toString(),
//       orderID: orderID.toString(),
//       // if product is a tip jar set the price to tip amount and set the token type to the tip jar token type
//       product: product,
//       price: tipJar ? tipAmount : price,
//       token: tipJar ? tipTokenType : token,
//       price: price,
//       owner: owner,
//       token: token,
//       symbol: symbol,
//       email: email,
//       twitter: twitter,
//       discord: discord,
//       shippingInfo: shippingInfo,
//       purchaseDate: currentDateTimeISO,
//       note: note,
//     }),
//     [
//       publicKey,
//       orderID,
//       owner,
//       token,
//       id,
//       symbol,
//       product,
//       email,
//       shippingInfo,
//       twitter,
//       discord,
//       note,
//       tipJar,
//       tipTokenType,
//       tipAmount,
//       price,
//     ]
//   );

const STATUS = {
    Initial: "Initial",
    Submitted: "Submitted",
    Paid: "Paid",
    Sending: "Sending",
    Fulfilled: "Fulfilled"
  };


export default function Buy({ 
    buyer,
    price,
    token,
    owner,
    ticketAddress,
 }) {
    const { publicKey, sendTransaction } = useWallet();
    const orderID = useMemo(() => Keypair.generate().publicKey, []);
    const [status, setStatus] = useState(STATUS.Initial); // Tracking transaction status
    const [loading, setLoading] = useState(false); // Loading state of all above


    const connection = new Connection(
        "https://solana-devnet.g.alchemy.com/v2/1wbDr7WOHCshS1G8e8W9oSDtZdM9We4f",
        "confirmed"
      );

    const order = useMemo(() => ({
        ticketAddress: ticketAddress,
        buyer: publicKey.toString(),
        orderID: orderID.toString(),
        price: price,
        token: token,
        owner: owner,
        
    }), [
        buyer,
        orderID,
        owner,
        token,
        ticketAddress,
        price,
    ])


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
                console.log("Transaction rejected by user")
            }
            if (error.code === -32603 || error.code === -32003) {
                console.log("Transaction failed, probably due to one of the wallets not having this token")
            }
            if (error.code === -32000) {
                console.log("Transaction failed")
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
            const txHash = await sendTransaction(tx, connection);
            console.log(
                `Transaction sent: https://solscan.io/tx/${txHash}?cluster=devnet`
            );
            setStatus(STATUS.Sending);
        } catch (error) {
            console.error(error);
            if (error.code === 4001) {
                console.log("Transaction rejected by user")
            }
            if (error.code === -32603 || error.code === -32003) {
                console.log("Transaction failed, probably due to one of the wallets not having this token")
            }
            if (error.code === -32000) {
                console.log("Transaction failed")
            }
        } finally {
            // setLoading(false);
        }
    }

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
            alert('Payment Recieved! Sending Ticket...')
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
              alert('Ticket Sent!')
            };
          }
      }, [status]);
    return (
        <Button title="Buy" onClick={processTransaction} disabled={loading} />
    )
}