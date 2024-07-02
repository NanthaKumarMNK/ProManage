import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import styles from "./Dashboard.module.css";
import AddPeople from "../../assets/images/AddPeople.png";
import { DEFAULT_DASHBOARD } from "../../utils/Headings";
import List from "../List/List";
import { format } from 'date-fns';
import Delete from "../Delete/Delete";
import Logout from "../Logout/Logout";
import Email from "../Email/Email";
import {getAllList} from "../../apis/proManage"



export default function Dashboard() {
  const [name]=useState(localStorage.getItem("name"))
  const [date,setDate]=useState(null)
  const [displayBg,setDisplayBg]=useState("")
  const [render,setRender]=useState(true)
  const [selectedFilter, setSelectedFilter] = useState("Today");

//   useEffect(() => {
    
// }, [render]);
const handleRender=()=>{
  setRender(!render)
}
  useEffect(() => {
    TodayDate()
}, []);
  const TodayDate = () => {
    const today = new Date();
    const formattedDate = format(today, 'do MMM, yyyy');
    setDate(formattedDate)
  }
  const handleComponent = (comp) => {
    setDisplayBg(comp)
  };
  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value); 
  };


  return (<>
   {displayBg !==''&& <div className={styles.background}></div>}
   {displayBg ==='Logout'&& <Logout handleComponent={handleComponent}/>}
   {displayBg ==='Delete'&& <Delete handleComponent={handleComponent}/>}
   {displayBg ==='Email'&& <Email handleComponent={handleComponent}/>}
  
 

   <div className={styles.DashboardContainer}>
    
      <Navbar handleComponent={handleComponent}/>
       <div className={styles.Dashboard}>
        <div className={styles.dateAndTime}>
          <div className={styles.date}><p>Welcome!&nbsp;{name}</p><span>{date}</span></div>
          <div className={styles.time}><p>Board<span onClick={()=>handleComponent('Email')}><img src={AddPeople}/>Add People</span></p>
          <select  value={selectedFilter} onChange={handleFilterChange} >
    <option value="Today">Today</option>
    <option value="Week">This Week</option>
    <option value="Month">This Month</option>
  </select>
  </div>
        </div>
        <div className={styles.ProManage}>
          <div className={styles.ProManageList}>
          { DEFAULT_DASHBOARD.map((list,index)=><List selectedFilter={selectedFilter} render={render} handleRender={handleRender} handleComponent={handleComponent} key={index} list={list} index={index}/>)}
        </div>
         
        </div>
       </div>
    </div>
    </>
  );
}

