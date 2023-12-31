import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { Metaplex, walletAdapterIdentity, toPublicKey } from "@metaplex-foundation/js"
import { FC, useEffect, useState } from "react"
import { Connection } from "@solana/web3.js"
import ConnectWallet from "./Utils/NotConnected"
import VenueRender from "./Venue/VenueRender"
import Loading from "./Utils/Loading"
import styles from "../styles/custom.module.css"

export const FetchNft: FC = () => {
  const [nftData, setNftData] = useState(null)
  const [spaceStadiumVenue, setSpaceStadiumVenue] = useState(null)
  const [loading, setLoading] = useState(true)
  const { connection } = useConnection()
  const endpoint = 'https://solana-devnet.g.alchemy.com/v2/Yn1LR558RcFTubSO2xTjcCTIEHeQIl8R'
  const wallet = useWallet()  
  //use devnet connection for metaplex so user wallet does not need to be connected to devnet
  const metaplex = Metaplex.make(new Connection(endpoint))

  const fetchNfts = async () => {
    
    
    //Wallet address to fetch NFTs from
    const fetchWallet = 'DF5KvNBJS5o6TMWmwbrjHmdnhBXVkQQNDwAJAcsuRxdJ'

    const nfts = await metaplex
      .nfts()
      .findAllByOwner({ owner: toPublicKey(fetchWallet)})
    //find all the owners of the mint address EYsRQKYUrGStgHPpf41cnx4qa5UiHyf5FHtrEJhtVS7F

    
    console.log('fetched nfts',nfts)
    
    // fetch off chain metadata for each NFT
    let nftData = []
    for (let i = 0; i < nfts.length; i++) {
      let fetchResult = await fetch(nfts[i].uri)
      let json = await fetchResult.json()
      nftData.push(json)
      
    }

    // set state
    setNftData(nftData)
    console.log('nftData', nftData)
    //sort the nftData by the atrribute trat_type : "venue" 
    const spaceStadiumVenue = nftData.filter((nft) => nft.attributes[0].value === "Space Stadium")
    // sort the nftData by the atrribute trat_type : "seat"
    const spaceStadiumVenueSortedBySeats = spaceStadiumVenue.sort((a, b) => a.attributes[1].value - b.attributes[1].value)
    console.log('spaceStadiumVenue', spaceStadiumVenue)
    setSpaceStadiumVenue(spaceStadiumVenueSortedBySeats)
    setLoading(false)
  }

  useEffect(() => {
    fetchNfts()
  }, [])

  return (
    <div>
      {/* Map the Available NFT's in the Ticket Wallet  */}
      {loading && <Loading />}
      {!loading && spaceStadiumVenue && (
        <div className="flex flex-col items-center justify-center">
          <VenueRender id="spaceStadium" event="Farza and the boyz" title="Space Stadium" venue={spaceStadiumVenue} />
          <div className="flex flex-row itemx-center justify-center">

          </div>
        </div>
      )}
    </div>
  )
}