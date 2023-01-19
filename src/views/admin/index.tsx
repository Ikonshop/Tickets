import { FC, useState, useEffect } from "react"
import {AllTickets} from "../../components/TicketDetails/AllTickets"
import {SoldTickets}from "../../components/TicketDetails/SoldTickets"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { Metaplex, toPublicKey, keypairIdentity } from "@metaplex-foundation/js"
import { Connection, PublicKey, Keypair  } from "@solana/web3.js"
import Button from "../../components/Utils/Button"
import Table from "../../components/Utils/Table"
import Loading from "components/Utils/Loading"

export const AdminView: FC = ({}) => {
    const distro = process.env.NEXT_PUBLIC_SOLTIX_DISTRO_ADDRESS;
    const [venueWalletAddress, setVenueWalletAddress] = useState<string>('');
    const [eventWalletAddress, setEventWalletAddress] = useState<string>('');
    const [viewAllTickets, setViewAllTickets] = useState<boolean>(false);
    const [viewSoldTickets, setViewSoldTickets] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [mintInfoLoading, setMintInfoLoading] = useState<boolean>(true);

    console.log('endpoint', process.env.NEXT_PUBLIC_SOLANA_ENDPOINT)
    const endpoint = process.env.NEXT_PUBLIC_SOLANA_ENDPOINT;
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
            'wallet' : "0x1234",
            'ticket' : 'G45xtHn7vEXGsKm3VpsHsosdwHmxdDYXF69dScvVr7Vs'
        },
        {
            'wallet' : "0x2132",
            'ticket' : 'G45xtHn7vEXGsKm3VpsHsosdwHmxdDYXF69dScvsjG23'
        },
        {
            'wallet' : "0x2144",
            'ticket' : 'G45xtHn7vEXGsKm3VpsHsosdwHmxdDYXF69dScvKj2s8'
        },
        {
            'wallet' : "0x4432",
            'ticket' : 'G45xtHn7vEXGsKm3VpsHsosdwHmxdDYXF69dScvLUwt4'
        },
    ]

    

    const testSoldTix = [
        {
            'wallet' : "0x2144",
            'ticket' : 'G45xtHn7vEXGsKm3VpsHsosdwHmxdDYXF69dScvKj2s8'
        },
        {
            'wallet' : "0x4432",
            'ticket' : 'G45xtHn7vEXGsKm3VpsHsosdwHmxdDYXF69dScvLUwt4'
        }
    ]

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
                        onClick={(row) => {}} />
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
                        onClick={(row) => {}} />
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
                const walletAddress = testNFTOwner.value.data.parsed.info.owner
                console.log('walletAddress', walletAddress)
                console.log('allAttributes[i]', allAttributes[i])
                //push the ticketAddress : walletAddress as an object to the allMintsAndOwners array
                allMintsAndOwners.push({
                    'wallet': walletAddress,
                    'ticket': allTixMA[i].toString(),
                    'seat': allAttributes[i][2].value
                })
                console.log('pushing', allTixMA[i].toString(), walletAddress )
                if(walletAddress != distro){
                    soldTicketsInfo.push({
                        'wallet': walletAddress,
                        'ticket': allTixMA[i].toString(),
                        'seat': allAttributes[i][2].value
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
                const mintAddress = nfts[i].mintAddress
                console.log('mintAddress', mintAddress)
                allAttributes.push(attributes)
                allTixMA.push(mintAddress)
            }
            console.log('this is allTixMA', allTixMA)
            setAllTixMintAddresses(allTixMA)
            findAllMintList(allTixMA, allAttributes)
        }
      
        async function getMintInfo() {
            await getTickets()
            // await findAllMintList()
        }
        getMintInfo()
        // setLoading(false)
    }, [])

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
                {viewSoldTickets && renderSoldTicketsTable()}
                {viewAllTickets && renderAllTicketsTable()}
            </div>
            )}
        </div>
    )
}
