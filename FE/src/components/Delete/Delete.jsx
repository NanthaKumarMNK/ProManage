import React from "react";
import styles from "./Delete.module.css";
import { useParams, useNavigate } from "react-router-dom";
import { deleteList } from "../../apis/proManage";
import Dashboard from "../Dashboard/Dashboard";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Delete(props) {
  const navigate = useNavigate();
  const { listId } = useParams();

  const deleteUserList = async () => {
    const response = await deleteList(listId);
    if (response) {
      toast.success("List deleted")
      navigate("/dashboard");
    } else {
      toast.error("List not deleted");
      navigate("/dashboard");
    }
  };

  return (<>
    <ToastContainer position="top-right" autoClose={3000} />
    <div className={styles.background}></div>
    <div className={styles.deleteContainer}>
    <p>Are you sure you want to Delete?</p>
      <button onClick={deleteUserList} className={styles.btn1}>Yes, Delete</button>
      <button onClick={()=>navigate('/dashboard')}  className={styles.btn2}>Cancel</button>
    </div>
    <Dashboard/></>
  );
}
