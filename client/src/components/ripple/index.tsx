import React from "react";
import styles from './styles.module.css';
interface Props {
    children: React.ReactNode;
    className?: string;
}

const Ripple:React.FC<Props> = ({children, className}) => {
    return (
        <div className={styles.container}>
            <div className={styles.ripple}></div>
            <span className={styles.child}>
                {children}
            </span>
        </div>
    )
}

export default Ripple;