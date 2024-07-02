import React, { useState } from "react";
import styles from "./Home.module.css";
import Icon from "../../assets/images/Icon.png"

export default function Home() {

  return (
    <div className={styles.HomeContainer}>
    <div className={styles.img}><img src={Icon}/></div>
    <div> <h1>Welcome aboard my friend</h1>
    <p>just a couple of clicks and we start</p></div>
    </div>
  );
}
