import { NextPage } from "next";
import Head from "next/head";
import Friend from "../../../components/friend";
import SideMenuBar from "../../../components/sidebar/menubar";


const Me:NextPage = () => {
    return (
        <div>
            <Head>
                <title>DM</title>
            </Head>
            <div style={{
                display: 'flex',
                flexDirection : "row"
            }}>
                <div>
                    <SideMenuBar />
                </div>
                <div>
                    <Friend />
                </div>
            </div>
        </div>
    )
}

export default Me;