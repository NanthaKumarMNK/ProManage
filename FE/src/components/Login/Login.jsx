import React, { useState } from "react";
import styles from "./Login.module.css";
import Home from "../Home/Home";
import { useNavigate } from "react-router";
import { loginUser } from "../../apis/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Email from "../../assets/images/Email.png"
import Eye from "../../assets/images/Eye.png"
import Lock from "../../assets/images/Lock.png"


export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    email: "",
  });
  const [ wrongResponse,setWrongResponse]=useState({})
  const [toggleVisibility,setToggleVisibility]=useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  console.log(setWrongResponse)
  const handleSubmit = async (e) => {
    e.preventDefault();
    let errors = {}; 
  
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        errors[key] = "Field can't be empty"; 
      }
    });
    setWrongResponse(errors);

    const response = await loginUser(formData);
    if (response.errorMessage) {
      toast.error(response.errorMessage);
      return
    } else if (response?.userId) {
      localStorage.setItem("token", response?.token);
      localStorage.setItem("userId", response?.userId);
      localStorage.setItem("userEmail", response?.userEmail);
      localStorage.setItem("name", response?.name);
      toast.success("User Successfylly LoggedIn");
      navigate("/dashboard");
    }else{
      setWrongResponse(response);
    } 
  };

  return (
    <div className={styles.LoginContainer}>
      <Home/>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className={styles.Login}>
      <h1>Login</h1>
      <form  onSubmit={handleSubmit}>
        <div><img className={styles.img} src={Email}/><input
          name="email"
          type="email"
          value={formData.email}
          placeholder="Email"
          onChange={handleInputChange}
        /></div>
    {wrongResponse?.email ? <span>{wrongResponse?.email}</span>:''}
        <div>

        <img className={styles.img} src={Lock}/>
      <input
          name="password"
          type={toggleVisibility?"text":"password"}
          value={formData.password}
          placeholder="Password"
          onChange={handleInputChange}
        />
        <img onClick={()=>setToggleVisibility(!toggleVisibility)} className={styles.Eye} src={Eye}/>
        </div>
        {wrongResponse?.password ? <span>{wrongResponse?.password}</span>:''}

    <button type="submit" className={styles.Btn}>
    Log in
    </button>
  </form>
     <p>Have no account yet?</p>
  <button className={styles.Btn1} onClick={()=>navigate('/register')}>Register</button>
  </div>
      
    </div>
  );
}