import { useState, useEffect } from 'react';
import TicketRender from './TicketRender';
import styles from './styles/VenueRender.module.css';



const VenueRender = ({ id, venue }) => {
    const [venueData, setVenueData] = useState(null);
    const [showTickets, setShowTickets] = useState(false);
    const venueImg = `/${id}.jpg`

    const renderTickets = () => {
        if (showTickets) {
            return (
                <div className={styles.tickets_container}>
                    {venueData?.tickets.map((ticket) => (
                        <TicketRender key={index} ticket={ticket} />
                    ))}
                </div>
            );
        }
    };

    useEffect(() => {
        if (venue) {
            setVenueData(venue);
        }
    }
    , [venue]);

    return (
        <div>
            <div className={styles.venue_containter}>
                <div className={styles.venue_img_container}>
                    <img className={styles.venue_img} src={venueImg} alt={venueData?.name} />
                </div>
            </div>
            {renderTickets()}
        </div>
    );
};

export default VenueRender;