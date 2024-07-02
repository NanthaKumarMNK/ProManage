import React, { useState } from "react";
import styles from "../Login/Login.module.css";
import Home from "../Home/Home";
import { registerUser } from "../../apis/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router";
import Email from "../../assets/images/Email.png";
import Eye from "../../assets/images/Eye.png";
import Lock from "../../assets/images/Lock.png";
import Name from "../../assets/images/Name.png";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    email: "",
    cPassword: "",
  });
  
  const [wrongResponse, setWrongResponse] = useState({});

  const [toggleVisibility, setToggleVisibility] = useState({
    password: false,
    cPassword: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = (field) => {
    setToggleVisibility((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
   
    let errors = {};
   
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        errors[key] = "Field can't be empty";
      }
    });
    

    
    if (Object.keys(errors).length > 0) {

      setWrongResponse(errors);
      
      return;
    } 
   
   
      const response = await registerUser(formData);

      if (response.errorMessage) {
        toast.error(response.errorMessage);
      } else if (response.message) {
        toast.success(response.message);
        navigate("/");
      } else {
        setWrongResponse(response); 
      }
    
  };

  return (
    <div className={styles.LoginContainer}>
      <Home />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className={styles.Login}>
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <img className={styles.img} src={Name} alt="Name" />
            <input
              name="name"
              type="text"
              value={formData.name}
              placeholder="Name"
              onChange={handleInputChange}
            />
          </div>
          {wrongResponse?.name && <span>{wrongResponse?.name}</span>}
          <div>
            <img className={styles.img} src={Email} alt="Email" />
            <input
              name="email"
              type="email"
              value={formData.email}
              placeholder="Email"
              onChange={handleInputChange}
            />
          </div>
          {wrongResponse?.email && <span>{wrongResponse?.email}</span>}
          <div>
            <img className={styles.img} src={Lock} alt="Password" />
            <input
              name="password"
              type={toggleVisibility.password ? "text" : "password"}
              value={formData.password}
              placeholder="Password"
              onChange={handleInputChange}
            />
            <img
              onClick={() => togglePasswordVisibility("password")}
              className={styles.Eye}
              src={Eye}
              alt="Toggle Password Visibility"
            />
          </div>
          {wrongResponse?.password && <span>{wrongResponse?.password}</span>}
          <div>
            <img className={styles.img} src={Lock} alt="Confirm Password" />
            <input
              name="cPassword"
              type={toggleVisibility.cPassword ? "text" : "password"}
              value={formData.cPassword}
              placeholder="Confirm Password"
              onChange={handleInputChange}
            />
            <img
              onClick={() => togglePasswordVisibility("cPassword")}
              className={styles.Eye}
              src={Eye}
              alt="Toggle Confirm Password Visibility"
            />
          </div>
          {wrongResponse?.cPassword && (
            <span>{wrongResponse?.cPassword}</span>
          )}
          <button type="submit" className={styles.Btn}>
            Register
          </button>
        </form>

        <p>Have an account ?</p>
        <button className={styles.Btn1} onClick={() => navigate("/")}>
          Log in
        </button>
      </div>
    </div>
  );
}

