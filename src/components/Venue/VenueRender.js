import { useState, useEffect } from 'react';
import TicketRender from './TicketRender';
import Button from 'components/Utils/Button';
import styles from './styles/VenueRender.module.css';
import { useWallet } from '@solana/wallet-adapter-react';
import ConnectWallet from 'components/Utils/NotConnected';



const VenueRender = ({ id, event, title, venue }) => {
    const [venueData, setVenueData] = useState(null);
    const [showTickets, setShowTickets] = useState(false);
    const wallet = useWallet();
    const venueImg = `/${id}.jpg`

    const renderTickets = () => {
        if (showTickets) {
            return (
                <div>
                    {!wallet.publicKey && <ConnectWallet />}
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
        <div style={{color: "black", cursor:"pointer", display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridGap: '1rem', alignItems: 'center', justifyContent: 'center'}}>
            
            <div 
                style={{display: showTickets ? 'none' : 'grid'}}
                onClick={() => setShowTickets(!showTickets)}
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