import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { Keypair, clusterApiUrl, Connection, PublicKey, Transaction, LAMPORTS_PER_SOL, SystemProgram } from "@solana/web3.js";
import { createTransferCheckedInstruction, getAssociatedTokenAddress, createAssociatedTokenAccount, getMint } from "@solana/spl-token";
import BigNumber from "bignumber.js";
import React , { useState, useEffect } from 'react';
import base58 from 'bs58'


const shopSecretKey = process.env.NEXT_PUBLIC_SHOP_SECRET_KEY;
const shopKeypair = Keypair.fromSecretKey(base58.decode(shopSecretKey));

// SPL TOKEN ADDRESS
const usdcAddress = new PublicKey("2iuTzsZKcksDkQ7tXbmiyzz3Cdy8V16W2jZdVdWqjPpU");

// the owner of usdcAddress is the shopKeypair

const createTransaction = async (req, res) => {
  // console.log('intl', req.body.shippingInfo.international)
  try {
    const { buyer, orderID } = req.body;
    console.log("req.body on txn", req.body);
    if (!buyer) {
      res.status(400).json({
        message: "Missing buyer address",
      });
    }

    if (!orderID) {
      res.status(400).json({
        message: "Missing order ID",
      });
    }
    var tokenType = req.body.token
    const id = req.body.id;
    const buyerAddy = req.body.buyer;
    const owner = req.body.owner;
    var itemPrice = 1;
    console.log("TOKEN TYPE IS THIS!!!", tokenType);
    // const { publicKey, signTransaction }= useWallet();

    const sellerAddress = owner;
    console.log("SELLER ADDRESS IS THIS!!!", sellerAddress);
    const sellerPublicKey = new PublicKey(sellerAddress);
    console.log("SELLER PUBLIC KEY IS THIS!!!", sellerPublicKey);
   

    const bigAmount = BigNumber(itemPrice);
    const buyerPublicKey = new PublicKey(buyerAddy);

    const network = WalletAdapterNetwork.Devnet;
    const endpoint = clusterApiUrl(network);
    const block_connection = new Connection(endpoint, "confirmed");
    const connection = new Connection(
      "https://solana-devnet.g.alchemy.com/v2/1wbDr7WOHCshS1G8e8W9oSDtZdM9We4f",
      "confirmed"
    );


    
    const { blockhash } = await block_connection.getLatestBlockhash("finalized");

    const tx = new Transaction({
      recentBlockhash: blockhash,
      feePayer: buyerPublicKey,
    });
    

    
    

      const usdcMint = await getMint(connection, usdcAddress);
      const buyerUsdcAcc = await getAssociatedTokenAddress(usdcAddress, buyerPublicKey);
      const shopUsdcAcc = await getAssociatedTokenAddress(usdcAddress, sellerPublicKey);
      var buyerUsdcAddress = await getAssociatedTokenAddress(usdcAddress, buyerPublicKey);
      var shopUsdcAddress = await getAssociatedTokenAddress(usdcAddress, sellerPublicKey);
      

      const checkAccounts = async() => {
        const buyerUsdcAccount = await connection.getAccountInfo(buyerUsdcAcc);
        if (buyerUsdcAccount === null) {
          console.log("buyer has no usdc account");
          const newAccount = await createAssociatedTokenAccount(connection, shopKeypair, usdcAddress, buyerPublicKey);
          var buyerUsdcAddress = await newAccount.address;
          
  
        }else{
          var buyerUsdcAddress = await getAssociatedTokenAddress(usdcAddress, buyerPublicKey);
          // console.log("buyer has usd account", buyerUsdcAddress.toString());
  
        }
        // Check if the shop has a gore account
        const shopUsdcAccount = await connection.getAccountInfo(shopUsdcAcc);
        if (shopUsdcAccount === null) {
          console.log("shop has no gore account");
          const newAccount = await createAssociatedTokenAccount(connection, shopKeypair, usdcAddress, sellerPublicKey);
          var shopUsdcAddress = await newAccount.address
          
        }
        else{
          var shopUsdcAddress = await getAssociatedTokenAddress(usdcAddress, sellerPublicKey);
        }
        return {buyerUsdcAddress, shopUsdcAddress}
      }
      await checkAccounts();
    
      const transferInstruction = createTransferCheckedInstruction(
        shopUsdcAddress, // This is the address of the token we want to transfer
        usdcAddress,     // This is the address of the token we want to transfer
        buyerUsdcAddress, 
        buyerPublicKey, 
        1, 
      );


      transferInstruction.keys.push({
        pubkey: new PublicKey(orderID),
        isSigner: false, 
        isWritable: false,
      });
      // tx.add(transferInstruction, transferTwo);
      tx.add(transferInstruction);
   
    
    const serializedTransaction = tx.serialize({
      requireAllSignatures: false,
    });

    const base64 = serializedTransaction.toString("base64");

    res.status(200).json({
      transaction: base64,
    });
  } catch (err) {
    console.error("error is",err);

    res.status(500).json({ error: "error creating transaction" });
    return;
  }
};

export default function handler(req, res) {
  if (req.method === "POST") {
    createTransaction(req, res);
  } else {
    
    res.status(405).end();
  }
}