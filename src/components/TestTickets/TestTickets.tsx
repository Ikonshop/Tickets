import { FC, useEffect, useState } from "react"
import styles from "../TestTickets/styles/TestTickets.module.css"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { Metaplex, walletAdapterIdentity, toPublicKey } from "@metaplex-foundation/js"
import { PublicKey } from "@solana/web3.js"

export const TestTickets: FC = () => {
    const [testTickets, setTestTickets] = useState(null)
    const { connection } = useConnection()
    const wallet = useWallet()
    const metaplex = Metaplex.make(connection).use(walletAdapterIdentity(wallet))

    const fetchNfts = async () => {
        if (!wallet.connected) {
          return
        }
        console.log('fetching nfts')
        //Wallet address to fetch NFTs from
        const fetchWallet = 'AKMpGNrueQR97mwKy8CMUK1tTF2peVmPPAnzR8D9JjcE'
    
        const nfts = await metaplex
          .nfts()
          .findAllByOwner({ owner: toPublicKey(fetchWallet)})
          .run()
        //find all the owners of the mint address EYsRQKYUrGStgHPpf41cnx4qa5UiHyf5FHtrEJhtVS7F
    
        
        console.log('fetched nfts',nfts)
        
        // fetch off chain metadata for each NFT
        let nftData = []
        for (let i = 0; i < nfts.length; i++) {
          let fetchResult = await fetch(nfts[i].uri)
          let json = await fetchResult.json()
          nftData.push(json)
          
        }
        // set testTickets state to the first 3 objects in nftData
        setTestTickets(nftData.slice(0,3))
        console.log('testTickets', testTickets)
    }

    useEffect(() => {
        fetchNfts()
    }, [])
    

    return (
        // Map out the testTickets in  a row of 3 with each object in the array as it's own card
        <div className={styles.testTickets}>
            {/* {testTickets && testTickets.map((ticket, index) => (
                <div className={styles.testTicket} key={index}>
                    <img src={ticket.image} alt={ticket.name} />
                    <div className={styles.testTicketInfo}>
                        <h3>{ticket.name}</h3>
                        <p>{ticket.description}</p>
                    </div>
                </div>
            ))} */}
        </div>
    )
}