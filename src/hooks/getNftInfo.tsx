import { FC, useState, useEffect } from "react"
import { Metaplex, toPublicKey, keypairIdentity } from "@metaplex-foundation/js"
import { Connection, PublicKey, Keypair  } from "@solana/web3.js"


export default async function getNftInfo (mintAddress: string){
    const connection = new Connection("https://api.devnet.solana.com");
    const metaplex = Metaplex.make(connection);
    const keypair = Keypair.generate();
    metaplex.use(keypairIdentity(keypair));
    let returnedNft = null
    let nft = await metaplex
        .nfts()
        .findByMint({mintAddress: toPublicKey(mintAddress)})

                
        console.log('nft', nft)
        returnedNft = nft

    return returnedNft
}

