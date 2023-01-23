import { FC, useState, useEffect } from "react"
import {AllTickets} from "../../components/TicketDetails/AllTickets"
import {SoldTickets}from "../../components/TicketDetails/SoldTickets"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { Metaplex, toPublicKey, keypairIdentity } from "@metaplex-foundation/js"
import { Connection, PublicKey, Keypair  } from "@solana/web3.js"
import Button from "../../components/Utils/Button"
import Table from "../../components/Utils/Table"
import TicketDetails from "components/TicketDetails/TicketDetails"
import Loading from "components/Utils/Loading"
import getNftInfo from "hooks/getNftInfo"

export const AdminView: FC = ({}) => {
    const distro = process.env.NEXT_PUBLIC_SOLTIX_DISTRO_ADDRESS;
    const [venueWalletAddress, setVenueWalletAddress] = useState<string>('');
    const [eventWalletAddress, setEventWalletAddress] = useState<string>('');
    const [viewAllTickets, setViewAllTickets] = useState<boolean>(false);
    const [viewSoldTickets, setViewSoldTickets] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [showTicketDetails, setShowTicketDetails] = useState<boolean>(false);
    const [mintInfoLoading, setMintInfoLoading] = useState<boolean>(true);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [ticketDetails, setTicketDetails] = useState(null);
    const [ticketAttributes, setTicketAttributes] = useState(null)
    const [ticketAddress, setTicketAddress] = useState(null)

    const endpoint = "https://solana-devnet.g.alchemy.com/v2/Yn1LR558RcFTubSO2xTjcCTIEHeQIl8R";
    const connection = new Connection("https://api.devnet.solana.com", "confirmed");
    // const connection = new Connection(
    //     endpoint,
    //     "confirmed"
    // );
    const metaplex = Metaplex.make(connection);
    const keypair = Keypair.generate();
    metaplex.use(keypairIdentity(keypair));
    const [allTickets, setAllTickets] = useState(null)
    const [allTixMintAddresses, setAllTixMintAddresses] = useState([])
    const [allTixMintInfo, setAllTixMintInfo] = useState([])
    const [soldTickets, setSoldTickets] = useState([])

    const candyMachineAddress = new PublicKey("ALt15eVoizTmDbU8itXQvEj9R6oPEVjzXMS6Rdr3eB9t");

    
    const testAllTix = [
        {
            'wallet' : "DF5KvNBJS5o6TMWmwbrjHmdnhBXVkQQNDwAJAcsuRxdJ",
            'ticket' : "EZUkA86kJSdqVUw2WCvvfFoLcmwCn5mZknMEdht4xu6h",
            'seat' : "401",
        },
        {
            'wallet' : "DF5KvNBJS5o6TMWmwbrjHmdnhBXVkQQNDwAJAcsuRxdJ",
            'ticket' : "G45xtHn7vEXGsKm3VpsHsosdwHmxdDYXF69dScvVr7Vs",
            'seat' : "201",
        },
        {
            'wallet' : "AiVac6FHAAcw9x3PmpSZopc5BVQaCDjZCL1TMwtGqgrf",
            'ticket' : "62nWhr6vX1mUvATLjhh2N6T6jJLEgMorjswu5yR2mZqZ",
            'seat' : "A169",
        },
        
    ]

    

    const testSoldTix = [
        {
            'wallet' : "DF5KvNBJS5o6TMWmwbrjHmdnhBXVkQQNDwAJAcsuRxdJ",
            'ticket' : "G45xtHn7vEXGsKm3VpsHsosdwHmxdDYXF69dScvVr7Vs",
            'seat' : "201",
        },
        {
            'wallet' : "AiVac6FHAAcw9x3PmpSZopc5BVQaCDjZCL1TMwtGqgrf",
            'ticket' : "62nWhr6vX1mUvATLjhh2N6T6jJLEgMorjswu5yR2mZqZ",
            'seat' : "A169",
        }
    ]

    const renderTicketDetails = (
        owner: any,
        ticketAddress: any,
        ticketDetails: any,
        ticketAttributes: any
    ) => {
        const perksInPocket = [];
        const address = ticketAddress
        const name = ticketDetails.name
        const description = ticketDetails.description
        const image = ticketDetails.image
        const symbol = ticketDetails.symbol

        //VESPADT
        const venue = ticketAttributes[0].value
        const event = ticketAttributes[1].value
        const seat = ticketAttributes[2].value
        const price =  ticketAttributes[3].value
        const accessories = ticketAttributes[4].value
        const date = ticketAttributes[5].value
        const time = ticketAttributes[6].value
    
        return(
          <>
            <Button title="close" onClick={() => setShowTicketDetails(false)} />
            <TicketDetails 
              perks={perksInPocket}
              address={address} 
              name={name}
              description={description}
              image={image}
              symbol={symbol}
              venue={venue}
              event={event}
              seat={seat}
              price={price}
              accessories={accessories}
              date={date}
              time={time}
            />
          </>
        )
    }


    const renderAllTicketsTable = () => {
        var allTix = []
        var allWallets = []
        // for (const obj of testAllTix){
        for (const obj of allTixMintInfo){
            for (const [key, value] of Object.entries(obj)) {
                allTix.push(key)
                allWallets.push(value)
            }
        }
        // if(allTickets){
            // if(testAllTix){
            if(allTixMintInfo){
                console.log('all tickets', allTixMintInfo)
            return (
                <div className="flex flex-col">
                    {/* <Table headers={["Ticket Mint Address", "Ticket Owner"]} rows={allTickets} onClick={(row) => {}} /> */}
                    <Table 
                        headers={["Owner Wallet", "Ticket Address", "Seat Number"]} 
                        rows={
                            allTixMintInfo.map((tix) => {
                                return Object.values(tix)
                            })
                        }
                        onClick={(row) => {
                            console.log('row', row)
                            const owner = row[0]
                            const ticketAddress = row[1]
                            const ticketDetails = allTickets[row[0]]
                            const ticketAttributes = row[2]
                            renderTicketDetails(owner, ticketAddress, ticketDetails, ticketAttributes)
                        }}
                        />
                </div>
            )   
        }
    }

    const renderSoldTicketsTable = () => {
        var soldTix = []
        var soldWallets = []
        
        //map the testSoldTix key to sold Tickets and the Object to soldWallets
        for (const obj of soldTickets) {
    for (const [key, value] of Object.entries(obj)) {
        soldTix.push(value)
        soldWallets.push(key)
    }}  
        // if(soldTickets){
            if(soldTickets){
                console.log('sold tickets', soldTickets)
            return (
                <div className="flex flex-col">
                    {/* <Table headers={["Ticket Mint Address", "Ticket Owner"]} rows={soldTickets} onClick={(row) => {}} /> */}
                    <Table 
                        headers={["Owner Wallet", "Ticket Address", "Seat Number"]} 
                        rows={
                            soldTickets.map((tix) => {
                                return Object.values(tix)
                            })
                        } 
                        onClick={(row) => {
                            console.log('row', row)
                            setLoading(true)
                            //set the ticket address from the row (2nd column)
                            setSelectedTicket(row[0]) 
                            setShowTicketDetails(true)
                        }} />
                </div>
            )
        }
    }

    useEffect(() => {
        const findAllMintList = async (allTixMA: string | any[], allAttributes: string | any[]) => {
            var allMintsAndOwners = [];
            var soldTicketsInfo = [];
            console.log('fetching mint list from allTixMintAddresses', allTixMA)
            for(let i = 0; i < allTixMA.length; i++){
                console.log('allTixMA[i]', allTixMA[i].toString())
                const largetsTokenAccount = await connection.getTokenLargestAccounts(allTixMA[i])
                const testNFTOwner = await connection.getParsedAccountInfo(
                    largetsTokenAccount.value[0].address
                )
                
                console.log('testNFTOwner', testNFTOwner.value.data)
                // @ts-ignore
                const walletAddress = testNFTOwner.value.data.parsed.info.owner
                console.log('walletAddress', walletAddress)
                console.log('allAttributes[i]', allAttributes[i])
                //push the ticketAddress : walletAddress as an object to the allMintsAndOwners array
                allMintsAndOwners.push({
                    'wallet': walletAddress,
                    'ticket': allTixMA[i].toString(),
                    'seat': allAttributes[i][2].value,
                    'allAttributes': [allAttributes[i]
                })
                console.log('pushing', allTixMA[i].toString(), walletAddress )
                if(walletAddress != distro){
                    soldTicketsInfo.push({
                        'wallet': walletAddress,
                        'ticket': allTixMA[i].toString(),
                        'seat': allAttributes[i][2].value,
                        'allAttributes': [allAttributes[i]],
                    })
                    console.log('pushing sold ticket', walletAddress + allTixMA[i].toString() + allAttributes[i])
                }
            }
            console.log('allMintsAndOwners', allMintsAndOwners)
            setAllTixMintInfo(allMintsAndOwners)
            setSoldTickets(soldTicketsInfo)
            setMintInfoLoading(false)
        }

        const getTickets = async () => {
            var allTixMA = []
            var allAttributes = []
            console.log('fetching tix')
            const nfts = await metaplex
                .candyMachinesV2()
                .findMintedNfts({
                    candyMachine: candyMachineAddress
                })

            console.log('nfts', nfts)
            setAllTickets(nfts)
            setLoading(false)
            for(let i = 0; i < nfts.length; i++){
                console.log('nft', nfts[i])
                const attributesFetch = await fetch(nfts[i].uri)
                const json = await attributesFetch.json()
                console.log('json', json)
                const attributes = json.attributes
                // @ts-ignore
                const mintAddress = nfts[i].mintAddress
                console.log('mintAddress', mintAddress)
                allAttributes.push(attributes)
                allTixMA.push(mintAddress)
            }
            console.log('this is allTixMA', allTixMA)
            setAllTixMintAddresses(allTixMA)
            findAllMintList(allTixMA, allAttributes)
        }
      
        getTickets()
        // setLoading(false)
    }, [])
    useEffect(() => {
        const getTicketDetails = async () => {
       
            console.log('selectedTicket', selectedTicket)
            const nft = await getNftInfo(selectedTicket)
            console.log('nft', nft)
            const json = await nft.json

            console.log('json', json)
            setTicketDetails(json)
            setTicketAddress(selectedTicket)

            const attributes = await json.attributes
            console.log('attributes', attributes)
           
            setTicketAttributes(attributes)
            setLoading(false)
        }
        if(selectedTicket){
            getTicketDetails()
        }
        
    }, [selectedTicket])


    // If the user's wallet address = venueWalletAddress, then they have the ability to airdrop Free Popcorn and Free Drinks to anyone on the list of users who have purchased tickets to the event.
    // If the user's wallet address = eventWalletAddress, then they have the ability to airdrop Free Merch and VIP Passes to anyone on the list of users who have purchased tickets to the event.

    //Both accounts need to be able to see who has purchased tickets to the event
    //Show a chart for the number of tickets sold and when they were sold

    //Use event logs on the candy machine to get the list of users who have purchased tickets to the event and the activity of the candy machine
    return (
        <div className="md:hero mx-auto p-4">
            {loading ? (
                <Loading />
                ):(
                    <div className="md:hero-content flex flex-col">
                {/* CONTENT GOES HERE */}
                {!viewSoldTickets && (
                    <Button
                        title="View Sold Tickets"
                        onClick={() => {
                            setViewSoldTickets(true)
                            setViewAllTickets(false)
                        }}
                    />
                )}
                {!viewAllTickets && (
                    <Button
                        title="View All Tickets"
                        onClick={() => {
                            setViewAllTickets(true)
                            setViewSoldTickets(false)
                        }}
                    />
                )}
                {viewSoldTickets && !showTicketDetails && renderSoldTicketsTable()}
                {viewAllTickets && !showTicketDetails && renderAllTicketsTable()}
                {showTicketDetails && ticketAttributes != null && !loading && renderTicketDetails(ticketAddress, ticketDetails, ticketAttributes)}
            </div>
            )}
        </div>
    )
}
