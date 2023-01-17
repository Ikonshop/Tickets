import { FC, useState, useEffect } from "react"
import {AllTickets} from "../../components/TicketDetails/AllTickets"
import {SoldTickets}from "../../components/TicketDetails/SoldTickets"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { Metaplex, toPublicKey } from "@metaplex-foundation/js"
import { Connection, PublicKey  } from "@solana/web3.js"
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
    const connection = new Connection("https://api.devnet.solana.com");
    const metaplex = Metaplex.make(connection);
    const [allTickets, setAllTickets] = useState(null)
    const [allTixMintAddresses, setAllTixMintAddresses] = useState([])
    const [allTixMintInfo, setAllTixMintInfo] = useState([])
    const [soldTickets, setSoldTickets] = useState([])

    const candyMachineAddress = new PublicKey("ALt15eVoizTmDbU8itXQvEj9R6oPEVjzXMS6Rdr3eB9t");

    const renderAllTicketsTable = () => {
        if(allTickets){

            return (
                <div className="flex flex-col">
                    <Table headers={["Ticket Mint Address", "Ticket Owner"]} rows={allTickets} onClick={(row) => {}} />
                </div>
            )
        }
    }

    const renderSoldTicketsTable = () => {
        if(soldTickets){
            return (
                <div className="flex flex-col">
                    <Table headers={["Ticket Mint Address", "Ticket Owner"]} rows={soldTickets} onClick={(row) => {}} />
                </div>
            )
        }
    }

    useEffect(() => {
        const findAllMintList = async () => {
            var allMintsAndOwners = [];
            var soldTicketsInfo = [];
            console.log('fetching mint list')
            for(let i = 0; i < allTixMintAddresses.length; i++){
                const largetsTokenAccount = await connection.getTokenLargestAccounts(allTixMintAddresses[i])
                const testNFTOwner = await connection.getParsedAccountInfo(
                    largetsTokenAccount.value[0].address
                )
                console.log('testNFTOwner', testNFTOwner.value.data)
                const walletAddress = testNFTOwner.value.data.parsed.info.owner
                console.log('walletAddress', walletAddress)
                //push the ticketAddress : walletAddress as an object to the allMintsAndOwners array
                allMintsAndOwners.push({[allTixMintAddresses[i]]: walletAddress})
                if(walletAddress != distro){
                    soldTicketsInfo.push({[allTixMintAddresses[i]]: walletAddress})
                }
            }
            console.log('allMintsAndOwners', allMintsAndOwners)
            setAllTixMintInfo(allMintsAndOwners)
            setSoldTickets(soldTicketsInfo)
            setMintInfoLoading(false)
        }

        const getTickets = async () => {
            var allTixMA = []
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
                const mintAddress = nfts[i].mintAddress
                console.log('mintAddress', mintAddress)
                allTixMA.push(mintAddress)
            }
            setAllTixMintAddresses(allTixMA)
            findAllMintList()
        }
      

        getTickets()
        findAllMintList()

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
                
                {!viewSoldTickets ? 
                (
                    <Button
                        title="View Sold Tickets"
                        onClick={() => {
                            setViewSoldTickets(true)
                            setViewAllTickets(false)
                        }}
                    />
                ) : renderSoldTicketsTable()}
                {!viewAllTickets ? 
                (
                    <Button
                        title="View All Tickets"
                        onClick={() => {
                            setViewAllTickets(true)
                            setViewSoldTickets(false)
                        }}
                    />
                ) : renderAllTicketsTable()}
            </div>
            )}
        </div>
    )
}
