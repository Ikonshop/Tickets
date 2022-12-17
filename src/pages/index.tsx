import type { NextPage } from "next";
import Head from "next/head";
import { HomeView } from "../views";

const Home: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>SolTix</title>
        <meta
          name="description"
          content="Sol Tix"
        />
      </Head>
      <HomeView />
    </div>
  );
};

export default Home;
