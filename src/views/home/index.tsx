// Next, React
import { FC, useEffect, useState } from "react"
import Link from "next/link"
import { TestTickets } from "components/TestTickets/TestTickets"
// Wallet
import { useWallet, useConnection } from "@solana/wallet-adapter-react"

// Components
import { RequestAirdrop } from "../../components/RequestAirdrop"
import pkg from "../../../package.json"

// Store
import useUserSOLBalanceStore from "../../stores/useUserSOLBalanceStore"

export const HomeView: FC = ({}) => {
  const wallet = useWallet()
  const { connection } = useConnection()

  const balance = useUserSOLBalanceStore((s) => s.balance)
  const { getUserSOLBalance } = useUserSOLBalanceStore()

  useEffect(() => {
    if (wallet.publicKey) {
      console.log(wallet.publicKey.toBase58())
      getUserSOLBalance(wallet.publicKey, connection)
    }
  }, [wallet.publicKey, connection, getUserSOLBalance])

  return (
    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
          {/* <img
            className="inline-block w-80 h-40 mr-2"
            src="/logoGrBg.svg"
            alt="logo"
          /> */}
        <h1 className="text-center text-5xl md:pl-12 font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195]">
          Buy and Sell tickets with transparency
        </h1>
        <div className="text-2xl md:pl-6 font-bold text-black text-center">
          Events use NFTickets to send upgrades (like free merch) directly to their ticket. <br />
          Buyers can see Ticket sales history and if value is marked up.
        </div>
        <div >
          <TestTickets />
        </div>
        
      </div>
    </div>
  )
}
