import { FC, useEffect, useState } from "react"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { Metaplex, walletAdapterIdentity, toPublicKey } from "@metaplex-foundation/js"
import styles from "./styles/TicketDetails.module.css"


const TicketDetails = (req) => {
    const { connection } = useConnection()
    const { publicKey, sendTransaction } = useWallet()
    const [token, setToken] = useState(null)
    console.log('incoming data', req)
    const { address, name, description, image, symbol, venue, event, seat, price, accessories, date, time } = req
    const formattedDate = new Date(date)
    const dateAndTime = `${formattedDate.toLocaleDateString()} | Time: ${time}`

    return (
        <div className={styles.ticket_detail_container}>
            <h1>Ticket Details</h1>
            <div className={styles.ticket_detail_left}>
                <img src={image} alt={name} />
            </div>
            <div className={styles.ticket_detail_right}>
                <a
                    href={`https://explorer.solana.com/address/${address}?cluster=devnet`}
                    target="_blank"
                    rel="noreferrer"
                >
                    View on chain
                </a>
                <h1>{event}</h1>
                <p> @ </p>
                <h1>Venue: {venue}</h1>
                <p>Date: {dateAndTime}</p>
  
                
                <p>Seat: {seat}</p>
                <p>Price: {price} SOL</p>
                <p>Accessories: {accessories}</p>
                
            </div>
        </div>
    )
}

export default TicketDetails;