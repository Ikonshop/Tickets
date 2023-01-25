import { useEffect, useState } from "react"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { Metaplex, walletAdapterIdentity, toPublicKey } from "@metaplex-foundation/js"
import styles from "./styles/TicketDetails.module.css"


const TicketDetails = (req) => {
    const { connection } = useConnection()
    const { publicKey, sendTransaction } = useWallet()
    const [token, setToken] = useState(null)
    console.log('incoming data', req)
    const { perks, address, name, description, image, symbol, venue, event, seat, price, accessories, date, time } = req
    const formattedDate = new Date(date)
    const dateAndTime = `${formattedDate.toLocaleDateString()} | Time: ${time}`
    const [hat, setHat] = useState(null)
    const [popcorn, setPopcorn] = useState(null)

    useEffect(() => {
        if(perks.length > 0) {

            console.log('perks available', perks)
            for(let i=0; i<perks.length; i++) {
                if(perks[i].json.attributes[0].value === "FREE HAT") {
                    setHat(perks[i].json.image)
                }
                if(perks[i].json.attributes[0].value === "FREE POPCORN") {
                    console.log('popcorn', perks[i].json.image)
                    setPopcorn(perks[i].json.image)
                }
            }
        }
    }, [perks])

    return (
        <div className={styles.ticket_detail_container}>
            <h1>Ticket Details</h1>
            <div className={styles.ticket_detail_left}>
                {/* create a view box with the the background-image. the drink, food, hat, and shirt will be displayed on top of the img within the viewbox */}
                <div className={styles.ticket_image_container}>
                    <img className={styles.ticket_image} src={image} alt={image} />
                    {hat && <img className={styles.hat} src={hat} alt={hat} />}
                    {popcorn && <img className={styles.popcorn} src={popcorn} alt={popcorn} />}
                </div>
                
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
                
            </div>
        </div>
    )
}

export default TicketDetails;