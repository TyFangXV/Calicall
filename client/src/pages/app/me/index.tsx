import { NextPage } from "next";
import Head from "next/head";
import SideMenuBar from "../../../components/sidebar/menubar";


const Me:NextPage = () => {
    return (
        <div>
            <Head>
                <title>DM</title>
            </Head>
            <div>
                <SideMenuBar/>
            </div>
        </div>
    )
}

export default Me;