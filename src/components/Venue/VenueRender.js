import { useState, useEffect } from "react";
import TicketRender from "./TicketRender";
import Button from "components/Utils/Button";
import styles from "./styles/VenueRender.module.css";
import { useWallet } from "@solana/wallet-adapter-react";
import ConnectWallet from "components/Utils/NotConnected";
import {
  IoLocationOutline,
  IoArrowForwardOutline,
  IoArrowBackOutline,
} from "react-icons/io5";
import { TestTickets } from "components/TestTickets/TestTickets";

const VenueRender = ({ id, event, title, venue }) => {
  const [venueData, setVenueData] = useState(null);
  const [showTickets, setShowTickets] = useState(false);
  const wallet = useWallet();
  const venueImg = `/${id}.jpg`;

  const renderTickets = () => {
    if (showTickets) {
      console.log('venueData: ', venueData)
      return (
        <div>
          {!wallet.publicKey && <ConnectWallet />}
          <div className={styles.button_container}>
            <IoArrowBackOutline />
            <Button title="Back" onClick={() => setShowTickets(!showTickets)} />
          </div>

          <div className={styles.no_wallet}>
            <div className={styles.ticket_viewer}>
              <TestTickets />
            </div>
          </div>
        </div>
      );
    }
  };

  useEffect(() => {
    if (venue) {
      console.log("venue: ", venue);
      setVenueData(venue);
    }
  }, [venue]);

  return (
    <div
      style={{
        color: "black",
        cursor: "pointer",
        display: "flex",
        flexWrap: "wrap",
        gap: "30px",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "30px",
      }}
    >
      <div
        style={{ display: showTickets ? "none" : "flex" }}
        onClick={() => setShowTickets(!showTickets)}
      >
        <div className={styles.venue_card}>
          <div className={styles.venue_img}>
            <img src={venueImg} alt={venueData?.name} />
          </div>
          <div className={styles.card_details}>
            <div>
              <div className={styles.event_name}>{event}</div>
              <div className={styles.venue_name}>
                <IoLocationOutline
                  style={{
                    color: "#2f2f2f",
                  }}
                />
                <span>{title}</span>
              </div>
            </div>
            <div>
              <IoArrowForwardOutline />
            </div>
          </div>
        </div>
      </div>
      {renderTickets()}
    </div>
  );
};

export default VenueRender;
