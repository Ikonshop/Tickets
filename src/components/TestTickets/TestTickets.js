import { FC, useEffect, useState } from "react"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { Metaplex, walletAdapterIdentity, toPublicKey } from "@metaplex-foundation/js"
import { PublicKey } from "@solana/web3.js"
import Buy from "components/Buy"
import styles from "../Venue/styles/TicketRender.module.css";
import {
    IoLocationOutline,
    IoArrowForwardOutline,
    IoArrowBackOutline,
  } from "react-icons/io5";


export const TestTickets= () => {
    const [testTickets, setTestTickets] = useState(null)
    const [loading, setLoading] = useState(true)
    const { connection } = useConnection()
    const wallet = useWallet()
    const metaplex = Metaplex.make(connection).use(walletAdapterIdentity(wallet))
    const fetchWallet = 'DF5KvNBJS5o6TMWmwbrjHmdnhBXVkQQNDwAJAcsuRxdJ'


    useEffect(() => {
        async function fetchNFTs() {
            setLoading(true)
            if (!wallet.connected) {
              return
            }
            //Wallet address to fetch NFTs from
        
            const nfts = await metaplex
              .nfts()
              .findAllByOwner({ owner: toPublicKey(fetchWallet)})
            //find all the owners of the mint address EYsRQKYUrGStgHPpf41cnx4qa5UiHyf5FHtrEJhtVS7F
            
                
            //get the ticket mint address
            

            // fetch off chain metadata for each NFT
            let nftData = []
            for (let i = 0; i < nfts.length; i++) {
              let fetchResult = await fetch(nfts[i].uri)
              let json = await fetchResult.json()
                if(json.name == "SOLTIX"){
                    console.log('json', json)
                    console.log('address of nft is ', nfts[i].mintAddress.toString())
                    nftData.push(
                        {
                            mintaddress: nfts[i].mintAddress.toString(),
                            image: json.image,
                            attributes: json.attributes,
                        }
                    )
                }
            }   
            // set testTickets state to the first 3 objects in nftData
            setTestTickets(nftData.slice(0,6))
            // console.log('testTickets', nftData)
            setLoading(false)
            console.log('testTickets', testTickets)
        }
        fetchNFTs()
    }, [wallet])
    

    return (
    <>
        {!loading && testTickets && testTickets.map((ticket, index) => (

        <div className={styles.single_ticket}>
            {/* <div className={styles.venue_name}>
                    Venue: {venue}
                </div> */}
            
                <div className={styles.ticket_img_container}>
                    <img
                    className={styles.ticket_img}
                    src={ticket.image}
                    alt={ticket.name}
                    />
                </div>
                {/* <div className={styles.event_name}>
                        {event}
                    </div> */}
                <div className={styles.seat_number}>
                    <div>
                    <p> Seat:</p> <p>#{ticket.attributes[2].value}</p>
                    </div>
                    <div>
                    <p>Price:</p> <p>{ticket.attributes[3].value} SOL</p>
                    </div>
                </div>
                <Buy
                    ticketAddress={ticket.mintaddress}
                    buyer={wallet.publicKey?.toString()}
                    token="SOL"
                    price={ticket.attributes[3].value}
                    owner={fetchWallet}
                />            
  
          
        </div>
        ))}
    </>
    )
}