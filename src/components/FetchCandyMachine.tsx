import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { PublicKey } from "@solana/web3.js"
import { Metaplex, toPublicKey } from "@metaplex-foundation/js"
import { FC, useEffect, useState } from "react"
import styles from "../styles/custom.module.css"

export const FetchCandyMachine: FC = () => {
  const [candyMachineAddress, setCandyMachineAddress] = useState("AYojeY24i4SXE82jZWZHsMsUD29mHg2zzBZWuETCdqti")
  const [candyMachineData, setCandyMachineData] = useState(null)
  const [ticketsInPocket, setTicketsInPocket] = useState(null)
  const [pageItems, setPageItems] = useState(null)
  const [page, setPage] = useState(1)

  const { connection } = useConnection()
  const wallet = useWallet()
  const metaplex = Metaplex.make(connection)

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
      for (let i = 0; i < nfts.length; i++) {
        let fetchResult = await fetch(nfts[i].uri)
        let json = await fetchResult.json()
        nftData.push(json)
        
      }
  
      // set state
      setTicketsInPocket(nftData)
      console.log('nftData', nftData)
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
      {/* <input
        type="text"
        className="form-control block mb-2 w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center"
        placeholder="Enter Candy Machine v2 Address"
        onChange={(e) => setCandyMachineAddress(e.target.value)}
      />
      <button
        className="px-8 m-2 btn animate-pulse bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ..."
        onClick={fetchCandyMachine}
      >
        Fetch
      </button> */}

      {candyMachineData && (
        <div className="flex flex-col items-center justify-center p-5">
          <ul>Event: Farza and the boyz @ Space Stadium</ul>
          <ul>Candy Machine Address: {candyMachineData.address.toString()}</ul>
        </div>
      )}

      {ticketsInPocket?.length > 1000 ? (
        <div>
          <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195]">
          Tickets in your pocket
          </h1>
          <div className={styles.gridNFT}>
            {ticketsInPocket.map((nft, index) => (
              <div key={index}>
                <ul>{nft.name}</ul>
                <img src={nft.image} />
              </div>
            ))}
          </div>
          <button
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
          </button>
        </div>
      ) : (

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
    </div>
  )
}
