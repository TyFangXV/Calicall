import React, { useEffect, useRef } from 'react';
import { Grid } from '@giphy/react-components';
import { GifResult, GiphyFetch } from '@giphy/js-fetch-api';
import { AiOutlineGif } from 'react-icons/ai';
import style from './style.module.css';
const gf = new GiphyFetch(process.env.NEXT_PUBLIC_GIPHY_API_KEY as string);



const GIF:React.FC<{searchQuery:string; onClick:(url:string) => void}> = ({searchQuery, onClick}) => {
    return(
        <Grid
        width={350}
        hideAttribution={true}
        columns={2}
        fetchGifs={() =>  gf.search(searchQuery)}
        onGifClick={(gif, e) => {
            e.preventDefault();
            onClick(gif.embed_url);
        }}
        /> 
    )
}

interface Props {
    onclick : (url:string) => void;
    onBtnPress : () => void;
}

const Giphy: React.FC<Props> = ({onclick, onBtnPress}) => {
  const [showGif, setShowGif] = React.useState(false);
  const divRef = useRef<HTMLDivElement>(null);
  const giphyRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = React.useState('Funny');
  const [isTyping , setIsTyping] = React.useState(false);

  useEffect(() => {
    if (divRef.current) {
      window.addEventListener('click', (e) => {
        if (divRef.current && !divRef.current.contains(e.target as Node)) {
          setShowGif(false);
        }
      });
    }
  }, [])

  useEffect(() => {
    setTimeout(() => {
        setIsTyping(false);
    }, 500);
  }, [searchQuery])

  const handleTyping = (value:string) => {
    setSearchQuery(value);
    setIsTyping(true);
  }

  return (
    <div ref={divRef}>
      <div
        style={{ display: showGif ? 'flex' : 'none' }}
        className={style.container}
      >
        <input className={style.input} placeholder="Search for Gif" onChange={e => handleTyping(e.currentTarget.value)} value={searchQuery}/>
        <div className={style.inlineContainer} ref={giphyRef}>
            {
                isTyping ? <p>Loading</p> : <GIF searchQuery={searchQuery} onClick={(url) => onclick(url)}/>
            }           
        </div>
        <p className={style.subtitle}>Powered by Giphy</p>
      </div>
      <button onClick={() => {setShowGif(!showGif); onBtnPress()}} className={style.btn}>
        <AiOutlineGif />
      </button>
    </div>
  );
};

export default Giphy;
