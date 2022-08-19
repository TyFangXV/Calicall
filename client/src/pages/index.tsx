/* eslint-disable @next/next/no-img-element */
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useContext, useState } from 'react'
import styles from '../styles/Home.module.css'
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { authContext } from '../utils/context/auth'

const Home: NextPage = () => {
  const router = useRouter();
  const [countryCode, setCountryCode] = useState<string>("");
  const {v} = router.query
  const {user} = useContext(authContext);

  useEffect(() => {
        //country location
        axios.get(`https://ipapi.co/json`)
          .then(res => setCountryCode(res.data.country_code))

          //check for the encrypted user data and decrypt it
          if(v)
          {
              axios.post(`/api/de?v=${v}`, {
                  headers: {
                      "Content-Type": "text/plain",
                  }
              }).then(res => {
                  const {data} = res;
                  caches.open("D")
                  .then(cache => {
                      cache.put("/", new Response(JSON.stringify(data)));
                      router.push("/app");
                  }).catch(err => {
                      console.log(err);
                  })
              })
              .catch(err => console.log(err));
          }
  }, [])

  return (
    <div className={styles.container}>
      <Head>
        <title>Calicall</title>
      </Head>
      <nav className={styles.nav}>
        <h1 className={styles.logo}>CaliCall</h1>
        <button className={styles.joinBtn} onClick={() => router.push( user.signedIn ? "/app/" : `http://localhost:5000/auth/getAuthUrl?country=${countryCode}`)}>{user.signedIn ? "Open app" : "Join"}</button>
      </nav>
      <div className={styles.center}>
        <span className={styles.layout_clip}>
          <img alt='Ch' src='/assets/call.svg' className={styles.bs_chat} />
          <h1 style={{marginLeft : "5%", fontStyle : "italic"}}>Always be connected with your friends</h1>
        </span>
        <span className={styles.layout_clip}>
          <h1 style={{ fontStyle : "italic"}}>Have the best experiance</h1>
          <img alt='Ch' src='/assets/wb.svg' className={styles.bs_chat}/>
        </span>
        <span className={styles.layout_clip}>
          <img alt='Ch' src='/assets/in.svg' className={styles.bs_chat} />
          <h1 style={{marginLeft : "5%", fontStyle : "italic"}}>Invite your friend to the call</h1>
        </span>
      </div>
    </div>
  )
}

export default Home
