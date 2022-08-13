import React, { useEffect, useRef } from "react";
import styles from './styles.module.css';

type Props = {
    children: React.ReactNode;
    title: string;
    onclick: () => void;
    showMarker: boolean;
}

const Circle:React.FC<Props> = ({children, title, onclick, showMarker}) => {
    const markRef = useRef<HTMLSpanElement>(null);
    const titleRef = useRef<HTMLSpanElement>(null);
    

    const onMouseEnter = () => {
        if(markRef.current && titleRef.current)
        {
            titleRef.current.style.display = "block";
            markRef.current.style.height = "20px";
        }else{
            console.log("markRef is null");
        }
    }

    const onMouseLeave = () => {
        if(markRef.current && titleRef.current)
        {
            titleRef.current.style.display = "none";
            markRef.current.style.height = "10px";
        }else{
            console.log("markRef is null");
        }
    }

    return (
        <div className={styles.container}>
            <span className={styles.mark} ref={markRef} style={{display : showMarker ? "flex" : "none"}}></span>
            <span className={styles.title} ref={titleRef}>
                <p>{title}</p>
            </span>
            <button className={styles.btn} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={() => onclick()}>
                {children}
            </button>            
        </div>
    )
}

export default Circle;