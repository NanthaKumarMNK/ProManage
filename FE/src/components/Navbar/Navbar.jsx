import React, { useState } from "react";
import styles from "./Navbar.module.css";
import { useNavigate,useLocation } from "react-router-dom";
import ProManager from "../../assets/images/Pro_Manager.png";
import Dashboard from "../../assets/images/Board.png";
import Analytics from "../../assets/images/Analytics.png";
import Settings from "../../assets/images/Settings.png";
import Logout from "../../assets/images/Logout.png";


export default function (props) {
  const navigate = useNavigate();
 
  const location = useLocation();
  const navOption = location.pathname.split("/")[1] || "Dashboard";
 
  const handleOptionClick = (option) => {
    navigate(`/${option}`);
  };
  
  return (
    <div className={styles.navbar}>
      <div className={styles.heading}>
        <img src={ProManager}/> 
        <p>Pro&nbsp;Manage</p>
      </div>
      <div className={styles.navOption}>
        <div className={navOption==="Dashboard"? styles.bg : ''} onClick={() => handleOptionClick("Dashboard")}><img src={Dashboard}/><p>Board</p></div>
        <div className={navOption==="Analytics"? styles.bg : ''} onClick={() => handleOptionClick("Analytics")}><img src={Analytics}/><p>Analytics</p></div>
        <div className={navOption==="Settings" ? styles.bg : ''} onClick={() => handleOptionClick("Settings")} ><img src={Settings}/><p>Settings</p></div>
      </div> 
       <div onClick={()=>props.handleComponent('Logout')} className={styles.logout}>
        <img src={Logout}/>
        <p>Logout</p>
       </div>
    </div>
  );
}
