import { useState, useEffect } from 'react';
import styles from '../Venue/styles/TicketRender.module.css';


const TicketRender = ({ index, ticket }) => {
    const [ticketData, setTicketData] = useState(null);
    console.log('ticket: ', ticket)
    const ticketImg = ticket.image
    const venue = ticket.attributes[0].value
    const seat_number = ticket.attributes[1].value
    const event= ticket.attributes[2].value
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
                Seat # {seat_number}
            </div>
        </div>
    );
}

export default TicketRender;