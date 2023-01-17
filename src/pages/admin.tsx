import type { NextPage } from "next"
import Head from "next/head"

import { AdminView } from "../views/admin"

const Admin: NextPage = (props) => {
       //Displays all Tickets From the Event
    

    return (
        <div>
        <Head>
            <title>Sol Tix</title>
            <meta name="description" content="Sol Tix" />
        </Head>
            <AdminView />
        </div>
    )
}

export default Admin