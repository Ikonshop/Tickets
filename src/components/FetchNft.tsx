import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { Metaplex, walletAdapterIdentity, toPublicKey } from "@metaplex-foundation/js"
import { FC, useEffect, useState } from "react"
import VenueRender from "./Venue/VenueRender"
import styles from "../styles/custom.module.css"

export const FetchNft: FC = () => {
  const [nftData, setNftData] = useState(null)
  const [spaceStadiumVenue, setSpaceStadiumVenue] = useState(null)
  const { connection } = useConnection()
  const wallet = useWallet()
  const metaplex = Metaplex.make(connection).use(walletAdapterIdentity(wallet))

  const fetchNfts = async () => {
    if (!wallet.connected) {
      return
    }
    
    //Wallet address to fetch NFTs from
    const fetchWallet = 'AKMpGNrueQR97mwKy8CMUK1tTF2peVmPPAnzR8D9JjcE'

    const nfts = await metaplex
      .nfts()
      .findAllByOwner({ owner: toPublicKey(fetchWallet)})
      .run()
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

  }

  useEffect(() => {
    fetchNfts()
  }, [])

  return (
    <div>
      {/* Map the Available NFT's in the Ticket Wallet  */}
      
      {spaceStadiumVenue && (
        <div >
          {/* TODO: */}
          <VenueRender id="spaceStadium" event="Farza and the boyz" title="Space Stadium" venue={spaceStadiumVenue} />
          
        </div>
      )}
    </div>
  )
}