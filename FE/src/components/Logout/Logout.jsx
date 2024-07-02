import React from 'react'
import styles from "../Delete/Delete.module.css";
import { useNavigate } from "react-router-dom";

export default function Logout(props) {
    const navigate=useNavigate()
    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
      };
  return (
    <div className={styles.deleteContainer}>
    <p>Are you sure you want to Logout?</p>
      <button onClick={handleLogout} className={styles.btn1}>Yes, Logout</button>
      <button onClick={()=>props.handleComponent('')} className={styles.btn2}>Cancel</button>
    </div>
  )
}
