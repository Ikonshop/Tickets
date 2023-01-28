// render a container that will display a connect to wallet button for when the user is not connected to their wallet


import React from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import Button from './Button'
import { FC } from 'react'


const ConnectWallet: FC = () => {
    const { connected } = useWallet()

    if (connected) return null

    return (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <h1 className="text-2xl font-bold">oops! no wallet found</h1>
            <p className="text-gray-500">connect your wallet to buy or see tickets.</p>

            {/* or download the phantom wallet here! */}
            <p className="text-gray-500">or download the phantom wallet here:</p>
            <a
                className="text-blue-500"
                href="https://phantom.app/"
                target="_blank"
                rel="noreferrer"
            >
                https://phantom.app/
            </a>

            <WalletMultiButton 
                className="px-8 m-2 btn animate-pulse bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500"
            />
        </div>
    )
}


export default ConnectWallet
