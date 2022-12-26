import type { NextPage } from "next"
import Head from "next/head"
import { CandyMachineView } from "../views"

const CandyMachine: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>SolTix</title>
        <meta name="description" content="SOL Tix" />
      </Head>
      <CandyMachineView />
    </div>
  )
}

export default CandyMachine
