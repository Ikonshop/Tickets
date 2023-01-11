import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { PublicKey } from "@solana/web3.js"
import { Metaplex, toPublicKey } from "@metaplex-foundation/js"
import { FC, useEffect, useState } from "react"
import TicketDetails from "../components/TicketDetails/TicketDetails"
import Button from "../components/Utils/Button"
import styles from "../styles/custom.module.css"

export const FetchCandyMachine: FC = () => {
  const [loading, setLoading] = useState(true)
  const [candyMachineAddress, setCandyMachineAddress] = useState("AYojeY24i4SXE82jZWZHsMsUD29mHg2zzBZWuETCdqti")
  const [candyMachineData, setCandyMachineData] = useState(null)
  const [ticketsInPocket, setTicketsInPocket] = useState(null)
  const [perksInPocket, setPerksInPocket] = useState(null)
  const [pageItems, setPageItems] = useState(null)
  const [page, setPage] = useState(1)

  const [selectedTicket, setSelectedTicket] = useState(null)
  const [showTicketDetails, setShowTicketDetails] = useState(false)

  const { connection } = useConnection()
  const wallet = useWallet()
  const metaplex = Metaplex.make(connection)

  const renderTicketDetails = (nft) => {
    console.log('address', nft.address)
    console.log('nft', ...nft.json.attributes)
    const {name, description, image, symbol, attributes} = nft.json
    console.log('attributes', attributes)
    //VESPADT
    const venue = attributes[0].value
    const event = attributes[1].value
    const seat = attributes[2].value
    const price =  attributes[3].value
    const accessories = attributes[4].value
    const date = attributes[5].value
    const time = attributes[6].value

    return(
      <>
        <Button title="close" onClick={() => setShowTicketDetails(false)} />
        <TicketDetails 
          perks={perksInPocket}
          address={nft.address} 
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

    // <TicketDetails address={address}/>

  const fetchCandyMachine = async () => {
    // Set page to 1 - we wanna be at the first page whenever we fetch a new Candy Machine
    setPage(1)

    // fetch candymachine data
    try {
     const nfts = await metaplex
      .nfts()
      .findAllByOwner({ owner: wallet.publicKey})
      console.log('fetched nfts',nfts)
    
      // fetch off chain metadata for each NFT
      let nftData = []
      let perkData = []
      for (let i = 0; i < nfts.length; i++) {
        let fetchResult = await fetch(nfts[i].uri)
        let json = await fetchResult.json()
        //filter for only tickets with the symbol STX
        if (json.symbol === 'STX') {
          console.log('nft json', json)
          // push the json and the nfts[i].address to the nftData array
          nftData.push({json, address: nfts[i].address.toString()})
        }
        if(json.symbol === 'STP') {
          console.log('perk json', json)
          perkData.push({json, address: nfts[i].address.toString()})
        }
        
      }
  
      // set state
      setTicketsInPocket(nftData)
      setPerksInPocket(perkData)
      console.log('nftData', nftData)
      setLoading(false)
    } catch (e) {
      // alert("Please submit a valid CMv2 address.")
      console.log("Please submit a valid CMv2 address.")
    }
  }

  const getPage = async (page, perPage) => {
    console.log("Fetching page", ticketsInPocket)
    const pageItems = ticketsInPocket.slice(
      (page - 1) * perPage,
      page * perPage
    )

    // fetch metadata of NFTs for page
    let nftData = []
    for (let i = 0; i < pageItems.length; i++) {
      
      let fetchResult = await fetch(pageItems[i].uri)
      let json = await fetchResult.json()
      nftData.push(json)
      
    }

    // set state
    setPageItems(nftData)
  }

  const prev = async () => {
    if (page - 1 < 1) {
      setPage(1)
    } else {
      setPage(page - 1)
    }
  }

  const next = async () => {
    if (page + 1 > ticketsInPocket.length) {
      setPage(ticketsInPocket.length)
    } else {
      setPage(page + 1)
    }
  }

  // fetch placeholder candy machine on load
  useEffect(() => {
    fetchCandyMachine()
  }, [])
  
  // fetch metadata for NFTs when page or candy machine changes
  useEffect(() => {
    if (!ticketsInPocket) {
      return
    }
    getPage(page, 9)
  }, [ticketsInPocket, page])

  return (
    <div>
      {loading && <div>Loading...</div>}
      {ticketsInPocket?.length > 0 && !showTicketDetails && (
        <div className={styles.pocketContainer}>
          <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195]">
          What's in your pocket?
          </h1>
          <div className={styles.splitContainer}>
            <div className={styles.gridContainer}>
              <h4>Tickets</h4>
              <div className={styles.gridNFT}>
              
                {ticketsInPocket.map((nft, index) => (
                  <div key={index}>
                    
                    <img src={nft.json.image} />
                    <Button title="View" onClick={() => {setSelectedTicket(nft), setShowTicketDetails(true)}} />
                  </div>
                ))}
                
              </div>
            </div>
            <div className={styles.perkContainer}>

              <h4>Perks</h4>
              <div className={styles.perkGrid}>
                {perksInPocket?.map((perk, index) => (
                  <div className={styles.perkCard} key={index}>
                    <ul>{perk.json.attributes[0].value}</ul>
                    <img className={styles.perkImg} src={perk.json.image} />
                  </div>
                ))}
              </div>

            </div>
          </div>
          {/* <button
            className="px-8 m-2 btn animate-pulse bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ..."
            onClick={prev}
          >
            Prev
          </button>
          <button
            className="px-8 m-2 btn animate-pulse bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ..."
            onClick={next}
          >
            Next
          </button> */}
        </div>
      )}
      {ticketsInPocket?.length < 1 && (

        <div className="flex flex-col items-center justify-center p-5">
          <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195]">
          No Tickets in your pocket yet!
        </h1>
        {/* display a container that will show two images in a row */}
        <div className="flex flex-row itemx-center justify-center">

          <img className="inline-block w-80 h-80 m-10" src="/pocketWireA.png" />
          <img className="inline-block w-80 h-80 m-10" src="/pocketWireB.png" />

        </div>
        </div>
      )}
      {showTicketDetails && renderTicketDetails(selectedTicket)}
    </div>
  )
}
