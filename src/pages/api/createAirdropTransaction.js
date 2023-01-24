import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {  Keypair, clusterApiUrl, Connection, PublicKey, Transaction } from "@solana/web3.js";
import { createTransferCheckedInstruction, getAssociatedTokenAddress, createAssociatedTokenAccount, getMint } from "@solana/spl-token";
import BigNumber from "bignumber.js";
import base58 from 'bs58'


const shopSecretKey = process.env.NEXT_PUBLIC_SHOP_SECRET_KEY;
const shopKeypair = Keypair.fromSecretKey(base58.decode(shopSecretKey));
const shopPublicKey = shopKeypair.publicKey;
console.log('shop publicKey', shopPublicKey.toString())



// the owner of usdcAddress is the shopKeypair

const createAirdropTransaction = async (req, res) => {
  // console.log('intl', req.body.shippingInfo.international)
  try {
    const { perkAddress, walletAddress, orderID } = req.body;
    //TIcket Address
    //Distro Address / Keypair
    //Perk Address

    // SPL TOKEN ADDRESS
    const usdcAddress = new PublicKey(perkAddress); //perk address

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
    const buyerAddy = walletAddress;
    const owner = shopPublicKey.toString();
    var itemPrice = 1;

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
        }

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
      // the signer of the transaction is the shopKeypair
      const transferInstruction = createTransferCheckedInstruction(
        shopUsdcAddress, 
        usdcAddress,   
        buyerUsdcAddress, 
        shopPublicKey, 
        1, // This is the amount of tokens we want to transfer
        usdcMint.decimals, 
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
    createAirdropTransaction(req, res);
  } else {
    
    res.status(405).end();
  }
}