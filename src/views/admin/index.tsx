import { FC, useState, useEffect } from "react"

export const AdminView: FC = ({}) => {
    const [venueWalletAddress, setVenueWalletAddress] = useState<string>('');
    const [eventWalletAddress, setEventWalletAddress] = useState<string>('');

    // If the user's wallet address = venueWalletAddress, then they have the ability to airdrop Free Popcorn and Free Drinks to anyone on the list of users who have purchased tickets to the event.
    // If the user's wallet address = eventWalletAddress, then they have the ability to airdrop Free Merch and VIP Passes to anyone on the list of users who have purchased tickets to the event.

    //Both accounts need to be able to see who has purchased tickets to the event
    //Show a chart for the number of tickets sold and when they were sold

    //Use event logs on the candy machine to get the list of users who have purchased tickets to the event and the activity of the candy machine
    return (
        <div className="md:hero mx-auto p-4">
            <div className="md:hero-content flex flex-col">
                {/* CONTENT GOES HERE */}
            </div>
        </div>
    )
}
