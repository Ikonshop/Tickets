import { useState, useEffect } from 'react';
import TicketRender from './TicketRender';
import Button from 'components/Utils/Button';
import styles from './styles/VenueRender.module.css';



const VenueRender = ({ id, event, title, venue }) => {
    const [venueData, setVenueData] = useState(null);
    const [showTickets, setShowTickets] = useState(false);
    const venueImg = `/${id}.jpg`

    const renderTickets = () => {
        if (showTickets) {
            return (
                <div>
                    <div className={styles.button_container}>
                            <Button
                                title='Close'
                                onClick={() => setShowTickets(!showTickets)}
                            />
                    </div>
                    
                    <div className={styles.ticket_viewer}>
                        {venueData?.map((ticket, index) => (
                            <TicketRender key={index} ticket={ticket} />
                        ))}
                    </div>
                </div>
            );
        }
    };

    useEffect(() => {
        if (venue) {
            console.log('venue: ', venue)
            setVenueData(venue);
        }
    }
    , [venue]);

    return (
        <div className={styles.venue_containter}>
            
            <div 
                // className={styles.venue_img_container}
                onClick={() => setShowTickets(!showTickets)}
                style={{cursor:"pointer", display: showTickets ? 'none' : 'block'}}
            >
                <div className={styles.venue_name}>
                    Event: {event}
                </div>
                <div className={styles.venue_name}>
                    Venue: {title}
                </div>
                <img  className={styles.venue_img} src={venueImg} alt={venueData?.name} />
            </div>
            {renderTickets()}
        </div>
    );
};

export default VenueRender;