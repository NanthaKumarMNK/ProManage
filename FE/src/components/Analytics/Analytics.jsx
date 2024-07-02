import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import styles from "./Analytics.module.css";
import { DEFAULT_LIST } from "../../utils/Headings";
import { DEFAULT_PRIORITY } from "../../utils/Headings";
import Round from "../../assets/images/Ellipse.png"
import Logout from "../Logout/Logout";
import {getAnalytics} from "../../apis/proManage"

export default function Analytics() {

  const [analytics,setAnalytics]=useState(null)
  const [displayBg,setDisplayBg]=useState("")
  const handleComponent = (comp) => {
    setDisplayBg(comp)
  };
  const fetchAnalytics=async()=>{
    const response =await getAnalytics()
    setAnalytics(response)
  }
  useEffect(() => {
    fetchAnalytics()
  }, []);

  return (
    <>
      {displayBg !==''&& <div className={styles.background}></div>}
      {displayBg ==='Logout'&& <Logout handleComponent={handleComponent}/>}
      <div className={styles.AnalyticsContainer}>
        <Navbar handleComponent={handleComponent}/>
        <div className={styles.Analytics}>
          <h1>Analytics</h1>
          <div className={styles.AnalyticsFlex}>
          <div className={styles.AnalyticsCount}>
                {DEFAULT_LIST.map((list,index)=>( <div key={list} className={styles.AnalyticsCountHeading}>
                <div><img src={Round}/>{list}&nbsp;Tasks</div>
                 <span className={styles.count}> {analytics && Object.values(analytics)[index+4]}</span></div>))}
               
                
      </div><div className={styles.AnalyticsCount}>

              {DEFAULT_PRIORITY.map((list,index)=>( <div key={list} className={styles.AnalyticsCountHeading}>
                <div><img src={Round}/>{list}</div> <span className={styles.count}> {analytics && Object.values(analytics)[index]}</span>
                </div>))}
        
     

</div></div>
          
        </div>
      </div>
    </>
  );
}
