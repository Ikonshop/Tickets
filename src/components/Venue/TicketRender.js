import { useState, useEffect } from 'react';


const TicketRender = ({ index, ticket }) => {
    const [ticketData, setTicketData] = useState(null);

    useEffect(() => {
        if (ticket) {
            setTicketData(ticket);
            console.log('ticketData: ', ticketData)
        }
    }
    , [ticket]);

    return (
        <div>

        </div>
    );
}

export default TicketRender;