import type { NextPage } from "next"
import Head from "next/head"
import { DisplayView } from "../views"

const Display: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Sol Tix</title>
        <meta name="description" content="Sol Tix" />
      </Head>
      <DisplayView />
    </div>
  )
}

export default Display


export const getStaticProps = async (context) => {
  const { id } = context.params

  return {
    props: {
      id,
    },
  }
}
