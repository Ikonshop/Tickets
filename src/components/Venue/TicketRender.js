import { useState, useEffect } from 'react';
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { Metaplex, walletAdapterIdentity, toPublicKey } from "@metaplex-foundation/js"
import styles from '../Venue/styles/TicketRender.module.css';
import Button from 'components/Utils/Button';
import Buy from 'components/Buy';


const TicketRender = ({ index, ticket }) => {
    const [loading, setLoading] = useState(true)
    const { connection } = useConnection()
    const wallet = useWallet()
    const metaplex = Metaplex.make(connection).use(walletAdapterIdentity(wallet))
    const fetchWallet = 'AKMpGNrueQR97mwKy8CMUK1tTF2peVmPPAnzR8D9JjcE'
    const [ticketData, setTicketData] = useState(null);
    console.log('ticket: ', ticket)
    const ticketImg = ticket.image
    const venue = ticket.attributes[0].value
    const seat_number = ticket.attributes[2].value
    const event= ticket.attributes[1].value
    const price = ticket.attributes[3].value
    const accessories = ticket.attributes[4].value
    const date = ticket.attributes[5].value
    const time = ticket.attributes[6].value
    useEffect(() => {
        if (ticket) {
            setTicketData(ticket);
            console.log('ticketData: ', ticket)
        }
    }
    , [ticket]);

    return (
        <div className={styles.single_ticket}>
            <div className={styles.venue_name}>
                Venue: {venue}
            </div>
            <div className={styles.ticket_img_container}>
                <img className={styles.ticket_img} src={ticketImg} alt={ticketData?.name} />
            </div>
            <div className={styles.event_name}>
                {event}
            </div>
            <div className={styles.seat_number}>
                Seat # {seat_number}<br />
                Price: {price} SOL
            </div>
            <Buy
                ticketAddress={ticket.mintaddress}
                buyer={wallet.publicKey?.toString()}
                token="SOL"
                price={ticket.attributes[3].value}
                owner={fetchWallet}
            />
        </div>
    );
}

export default TicketRender;