import create, { State } from 'zustand'
import { Connection, PublicKey, LAMPORTS_PER_SOL, Keypair } from '@solana/web3.js'
import { keypairIdentity, Metaplex } from '@metaplex-foundation/js'

interface UserSOLBalanceStore extends State {
  balance: number;
  getUserSOLBalance: (publicKey: PublicKey, connection: Connection) => void
}

const useUserSOLBalanceStore = create<UserSOLBalanceStore>((set, _get) => ({
  balance: 0,

  getUserSOLBalance: async (publicKey, connection) => {
    
    let balance = 0;
    try {
      balance = await connection.getBalance(
        publicKey,
        'confirmed'
      );
      balance = balance / LAMPORTS_PER_SOL;
    } catch (e) {
      console.log(`error getting balance: `, e);
    }
    set((s) => {
      s.balance = balance;
      console.log(`balance updated, `, balance);
    })
    //if balance is 0, alert user to fund their wallet with Devnet SOL in the app bar

  },
}));

export default useUserSOLBalanceStore;