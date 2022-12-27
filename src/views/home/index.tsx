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
        <h1 className="text-center text-5xl md:pl-12 font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195]">
          <img
            className="inline-block w-80 h-80 mr-2"
            src="/logoGrBg.svg"
            alt="logo"
          />
          <span className="text-sm font-normal align-top text-slate-700">
            v{pkg.version}
          </span>
        </h1>
        <h1 className="text-center text-5xl md:pl-12 font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195]">
          Buy and Sell tickets with transparency
        </h1>
        <TestTickets />
        <div className="max-w-md mx-auto mockup-code bg-primary p-6 my-2">
          <h4 className="text-center text-slate-300 my-2">
            <p>How it works</p>
          </h4>
          <pre data-prefix=">">
            <code className="truncate">NFTix are Minted and Transferred</code>
          </pre>
          <pre data-prefix=">">
            <code className="truncate">Distro Acc Holds all NFTix</code>
          </pre>
          <pre data-prefix=">">
            <code className="truncate">User Purchases NFTix from Distro</code>
          </pre>
        </div>
        <div className="text-center">
          Events use NFTickets to create a unique experience
          to ticket holders by attaching upgrades directly to their ticket <br />
          This allows events to provide merchandise, food drinks, and more.
        </div>
      </div>
    </div>
  )
}
