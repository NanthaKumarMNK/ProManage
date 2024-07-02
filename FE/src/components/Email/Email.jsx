import React, { useState } from "react";
import styles from "./Email.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { putUser } from "../../apis/auth";

export default function Email(props) {
  const [response, setResponse] = useState(null);
  const [formData, setFormData] = useState({assignie:''});

  const handleEmail = (event) => {
    setFormData({assignie:event.target.value});
  };

  const fetchPutUser = async () => {
  
      const response = await putUser(formData);
      if (response.errorMessage) {
        toast.info(response.errorMessage);
      } else {
        setResponse(response.message);
      }
   
  };

  return (
    <>
      {!response ? (
        <div className={styles.AddEmailContainer}>
          <p>Add people to the board </p>
          <input
            onChange={handleEmail}
            value={formData.assignie} 
            placeholder="Enter the email"
          />
          <div className={styles.button}>
            <button onClick={() => props.handleComponent("")} className={styles.btn2}>
              Cancel
            </button>
            <button onClick={fetchPutUser} className={styles.btn1}>
              Add Email
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.EmailContainer}>
          <p>{response}</p>
          <button onClick={() => props.handleComponent("")} className={styles.btn1}>
            Okay, got it!
          </button>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}
